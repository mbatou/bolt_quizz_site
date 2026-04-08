import { readFileSync, existsSync } from 'fs';
import { resolve } from 'path';
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  console.error('Missing env vars. Need NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.');
  process.exit(1);
}

const TSV_PATH = resolve(process.cwd(), 'scripts/bolt-promo-codes.tsv');

if (!existsSync(TSV_PATH)) {
  console.error(`File not found: ${TSV_PATH}`);
  console.error('Place the Bolt promo codes TSV at scripts/bolt-promo-codes.tsv');
  process.exit(1);
}

const CATEGORY_MAP: Record<string, 'basic' | 'comfort' | 'send' | 'tricycle'> = {
  'Bolt Basic': 'basic',
  'Bolt Comfort': 'comfort',
  'Bolt Send': 'send',
  'Bolt Tricycle': 'tricycle',
};

interface SeedRow {
  code: string;
  category: 'basic' | 'comfort' | 'send' | 'tricycle';
}

function parseTSV(contents: string): SeedRow[] {
  const lines = contents.split(/\r?\n/).filter((ln) => ln.trim().length > 0);
  if (lines.length < 2) {
    throw new Error('TSV is empty or only has a header');
  }

  const header = lines[0].split('\t').map((h) => h.trim());
  const categoryForColumn = header.map((h) => {
    const slug = CATEGORY_MAP[h];
    if (!slug) throw new Error(`Unknown column header: "${h}"`);
    return slug;
  });

  const rows: SeedRow[] = [];
  const seen = new Set<string>();

  for (let i = 1; i < lines.length; i++) {
    const cells = lines[i].split('\t').map((c) => c.trim());
    if (cells.length !== header.length) {
      console.warn(`Line ${i + 1}: expected ${header.length} columns, got ${cells.length}. Skipping.`);
      continue;
    }
    cells.forEach((code, idx) => {
      if (!code) return;
      if (seen.has(code)) {
        console.warn(`Duplicate code detected: ${code}`);
        return;
      }
      seen.add(code);
      rows.push({ code, category: categoryForColumn[idx] });
    });
  }

  return rows;
}

async function main() {
  const raw = readFileSync(TSV_PATH, 'utf-8');
  const rows = parseTSV(raw);

  const byCategory = rows.reduce<Record<string, number>>((acc, r) => {
    acc[r.category] = (acc[r.category] || 0) + 1;
    return acc;
  }, {});

  console.log(`Parsed ${rows.length} codes from TSV:`);
  Object.entries(byCategory).forEach(([cat, n]) => console.log(`  ${cat}: ${n}`));

  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

  const CHUNK_SIZE = 500;
  let inserted = 0;
  let skipped = 0;

  for (let i = 0; i < rows.length; i += CHUNK_SIZE) {
    const chunk = rows.slice(i, i + CHUNK_SIZE);
    const { data, error } = await supabase
      .from('promo_codes')
      .upsert(chunk, { onConflict: 'code', ignoreDuplicates: true })
      .select('code');

    if (error) {
      console.error(`Chunk ${i / CHUNK_SIZE + 1} failed:`, error.message);
      process.exit(1);
    }

    const chunkInserted = data?.length ?? 0;
    inserted += chunkInserted;
    skipped += chunk.length - chunkInserted;
    console.log(`  Chunk ${i / CHUNK_SIZE + 1}: ${chunkInserted} inserted, ${chunk.length - chunkInserted} skipped`);
  }

  console.log(`\nDone. Inserted: ${inserted}, Skipped: ${skipped}`);

  const { data: inventory } = await supabase.from('promo_codes_inventory').select('*');
  console.log('\nCurrent inventory:');
  console.table(inventory);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
