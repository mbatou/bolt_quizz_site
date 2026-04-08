/**
 * Capture the rider card DOM element as a PNG blob.
 * Renders at 2x scale for sharing.
 *
 * Handles Next.js <Image> components by waiting for all images
 * to load and allowing cross-origin image loading.
 */
export async function captureRiderCard(elementId: string = 'rider-card'): Promise<Blob | null> {
  const element = document.getElementById(elementId);
  if (!element) {
    console.error(`Element #${elementId} not found`);
    return null;
  }

  try {
    // Wait for all images inside the card to finish loading
    const images = element.querySelectorAll('img');
    await Promise.all(
      Array.from(images).map(
        (img) =>
          new Promise<void>((resolve) => {
            if (img.complete) {
              resolve();
            } else {
              img.onload = () => resolve();
              img.onerror = () => resolve(); // Don't block on broken images
            }
          })
      )
    );

    const html2canvas = (await import('html2canvas')).default;
    const canvas = await html2canvas(element, {
      scale: 2,
      backgroundColor: '#2A9C64',
      useCORS: true,
      allowTaint: true,
      logging: false,
      // Proxy images through the same origin to avoid CORS issues
      foreignObjectRendering: false,
    });

    return new Promise((resolve) => {
      canvas.toBlob((blob) => resolve(blob), 'image/png', 1);
    });
  } catch (err) {
    console.error('Failed to capture rider card:', err);
    // Fallback: try without images by cloning and removing them
    try {
      const clone = element.cloneNode(true) as HTMLElement;
      clone.querySelectorAll('img').forEach((img) => {
        const placeholder = document.createElement('div');
        placeholder.style.width = img.width + 'px';
        placeholder.style.height = img.height + 'px';
        img.replaceWith(placeholder);
      });
      document.body.appendChild(clone);
      clone.style.position = 'fixed';
      clone.style.left = '-9999px';

      const html2canvas = (await import('html2canvas')).default;
      const canvas = await html2canvas(clone, {
        scale: 2,
        backgroundColor: '#2A9C64',
        logging: false,
      });
      document.body.removeChild(clone);

      return new Promise((resolve) => {
        canvas.toBlob((blob) => resolve(blob), 'image/png', 1);
      });
    } catch (fallbackErr) {
      console.error('Fallback capture also failed:', fallbackErr);
      return null;
    }
  }
}
