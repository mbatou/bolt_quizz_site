/**
 * Capture the rider card DOM element as a PNG blob.
 * Renders at 3x scale for crisp Instagram Stories (min 1080px wide).
 */
export async function captureRiderCard(elementId: string = 'rider-card'): Promise<Blob | null> {
  const element = document.getElementById(elementId);
  if (!element) {
    console.error(`Element #${elementId} not found`);
    return null;
  }

  try {
    const html2canvas = (await import('html2canvas')).default;
    const canvas = await html2canvas(element, {
      scale: 3,
      backgroundColor: '#2A9C64',
      useCORS: true,
      logging: false,
    });

    return new Promise((resolve) => {
      canvas.toBlob((blob) => resolve(blob), 'image/png', 1);
    });
  } catch (err) {
    console.error('Failed to capture rider card:', err);
    return null;
  }
}
