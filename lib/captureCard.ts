import type { RiderResult } from './results';

/**
 * Generate a shareable rider card image using Canvas API.
 * Draws the card programmatically — no html2canvas dependency.
 * Returns a PNG blob ready for sharing.
 */
export async function captureRiderCard(
  _elementId: string = 'rider-card',
  result?: RiderResult
): Promise<Blob | null> {
  if (!result) return null;

  const W = 720; // 2x of ~360px card width
  const H = 960;
  const canvas = document.createElement('canvas');
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext('2d');
  if (!ctx) return null;

  const GREEN = '#2A9C64';
  const DARK = '#0C2C1C';

  // Background
  ctx.fillStyle = GREEN;
  roundRect(ctx, 0, 0, W, H, 40);
  ctx.fill();

  // Border
  ctx.strokeStyle = 'rgba(255,255,255,0.2)';
  ctx.lineWidth = 4;
  roundRect(ctx, 2, 2, W - 4, H - 4, 38);
  ctx.stroke();

  // "Your move:" label
  ctx.fillStyle = 'rgba(255,255,255,0.85)';
  ctx.font = '500 26px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  ctx.fillText('Your move:', 48, 80);

  // Move name (black)
  ctx.fillStyle = '#000000';
  ctx.font = '800 52px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  ctx.fillText(`${result.move}.`, 48, 140);

  // Category name (white)
  ctx.fillStyle = '#FFFFFF';
  ctx.font = '800 52px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  ctx.fillText(result.category, 48, 198);

  // Vehicle image
  try {
    const img = await loadImage(result.asset);
    const imgW = 300;
    const imgH = 230;
    const imgX = (W - imgW) / 2;
    const imgY = 230;

    // Drop shadow
    ctx.shadowColor = 'rgba(0,0,0,0.18)';
    ctx.shadowBlur = 24;
    ctx.shadowOffsetY = 12;
    ctx.drawImage(img, imgX, imgY, imgW, imgH);
    ctx.shadowColor = 'transparent';
    ctx.shadowBlur = 0;
    ctx.shadowOffsetY = 0;
  } catch {
    // If image fails, just skip it
  }

  // Tagline (black)
  ctx.fillStyle = '#000000';
  ctx.font = '700 36px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  ctx.fillText(result.tagline, 48, 530);

  // Divider line
  ctx.strokeStyle = 'rgba(255,255,255,0.2)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(48, 570);
  ctx.lineTo(W - 48, 570);
  ctx.stroke();

  // Bolt logo text
  ctx.fillStyle = '#FFFFFF';
  ctx.font = '800 40px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  ctx.fillText('B', 48, 620);
  // Dot in the "o"
  ctx.beginPath();
  ctx.arc(80, 610, 6, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillText('lt', 90, 620);

  // "Move your way" + category
  ctx.fillStyle = 'rgba(255,255,255,0.7)';
  ctx.font = '400 20px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  const mywText = 'Move your way';
  const mywWidth = ctx.measureText(mywText).width;
  ctx.fillText(mywText, W - 48 - mywWidth - 100, 618);

  ctx.fillStyle = 'rgba(255,255,255,0.5)';
  ctx.beginPath();
  ctx.arc(W - 48 - 90, 613, 3, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = 'rgba(255,255,255,0.9)';
  ctx.font = '700 20px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  const catShort = result.category.replace('Bolt ', '');
  const catWidth = ctx.measureText(catShort).width;
  ctx.fillText(catShort, W - 48 - catWidth, 618);

  // Dark footer strip
  const footerY = 660;
  const footerH = 60;
  ctx.fillStyle = DARK;
  // Bottom rounded corners only
  ctx.beginPath();
  ctx.moveTo(0, footerY);
  ctx.lineTo(W, footerY);
  ctx.lineTo(W, H - 40);
  ctx.arcTo(W, H, W - 40, H, 40);
  ctx.lineTo(40, H);
  ctx.arcTo(0, H, 0, H - 40, 40);
  ctx.lineTo(0, footerY);
  ctx.closePath();
  ctx.fill();

  // Divider on top of footer
  ctx.strokeStyle = 'rgba(255,255,255,0.1)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(0, footerY);
  ctx.lineTo(W, footerY);
  ctx.stroke();

  // Footer text: "Tag @bolt_ghana to win exciting prizes"
  ctx.fillStyle = 'rgba(255,255,255,0.9)';
  ctx.font = '400 20px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  const tagText = 'Tag ';
  const handleText = '@bolt_ghana';
  const prizeText = ' to win exciting prizes \u{1F381}';
  const fullText = tagText + handleText + prizeText;
  const fullWidth = ctx.measureText(fullText).width;
  const startX = (W - fullWidth) / 2;
  const footerTextY = footerY + 38;

  ctx.fillText(tagText, startX, footerTextY);
  const tagW = ctx.measureText(tagText).width;

  ctx.fillStyle = GREEN;
  ctx.font = '700 20px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  ctx.fillText(handleText, startX + tagW, footerTextY);
  const handleW = ctx.measureText(handleText).width;

  ctx.fillStyle = 'rgba(255,255,255,0.9)';
  ctx.font = '400 20px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  ctx.fillText(prizeText, startX + tagW + handleW, footerTextY);

  return new Promise((resolve) => {
    canvas.toBlob((blob) => resolve(blob), 'image/png', 1);
  });
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number
) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.arcTo(x + w, y, x + w, y + r, r);
  ctx.lineTo(x + w, y + h - r);
  ctx.arcTo(x + w, y + h, x + w - r, y + h, r);
  ctx.lineTo(x + r, y + h);
  ctx.arcTo(x, y + h, x, y + h - r, r);
  ctx.lineTo(x, y + r);
  ctx.arcTo(x, y, x + r, y, r);
  ctx.closePath();
}
