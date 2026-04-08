import { ImageResponse } from 'next/og';
import { type NextRequest } from 'next/server';
import { results, type RiderType } from '@/lib/results';

export const runtime = 'edge';

const VALID_TYPES = new Set<string>(['basic', 'comfort', 'send', 'tricycle']);

export async function GET(request: NextRequest) {
  const type = request.nextUrl.searchParams.get('type') || 'basic';

  if (!VALID_TYPES.has(type)) {
    return new Response('Invalid type', { status: 400 });
  }

  const result = results[type as RiderType];

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          backgroundColor: '#2A9C64',
          fontFamily: 'system-ui, sans-serif',
          padding: '60px',
        }}
      >
        {/* Left side — text */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            flex: 1,
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div
              style={{
                fontSize: 20,
                color: 'rgba(255,255,255,0.7)',
                marginBottom: 12,
              }}
            >
              Your move:
            </div>
            <div
              style={{
                fontSize: 56,
                fontWeight: 800,
                color: '#1a1a1a',
                lineHeight: 1.1,
              }}
            >
              {result.move}.
            </div>
            <div
              style={{
                fontSize: 56,
                fontWeight: 800,
                color: 'white',
                lineHeight: 1.1,
              }}
            >
              {result.category}
            </div>
            <div
              style={{
                fontSize: 24,
                fontWeight: 700,
                color: '#1a1a1a',
                marginTop: 24,
              }}
            >
              {result.tagline}
            </div>
          </div>

          {/* Footer */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12,
            }}
          >
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: 18,
                backgroundColor: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 800,
                fontSize: 18,
                color: '#2A9C64',
              }}
            >
              B
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span
                style={{
                  fontSize: 16,
                  color: 'rgba(255,255,255,0.6)',
                }}
              >
                Move your way
              </span>
              <span
                style={{
                  fontSize: 16,
                  color: 'rgba(255,255,255,0.85)',
                  fontWeight: 700,
                }}
              >
                {result.category.replace('Bolt ', '')}
              </span>
            </div>
          </div>
        </div>

        {/* Right side — vehicle emoji placeholder (actual image requires absolute URL) */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 400,
          }}
        >
          <div
            style={{
              fontSize: 160,
              filter: 'drop-shadow(0 8px 24px rgba(0,0,0,0.15))',
            }}
          >
            {type === 'basic' && '\u{1F697}'}
            {type === 'comfort' && '\u{1F698}'}
            {type === 'send' && '\u{1F4E6}'}
            {type === 'tricycle' && '\u{1F6FA}'}
          </div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
