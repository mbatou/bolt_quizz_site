/**
 * Share an image directly to Instagram Stories.
 * Uses Web Share API on mobile (lets user pick Instagram -> Stories).
 * Falls back to download + manual upload on desktop.
 */
export async function shareToInstagramStories(imageBlob: Blob, fallbackMessage?: string): Promise<void> {
  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
  const isAndroid = /Android/.test(navigator.userAgent);

  if (!isIOS && !isAndroid) {
    downloadBlob(imageBlob, 'bolt-rider-card.png');
    if (fallbackMessage) alert(fallbackMessage);
    return;
  }

  // Mobile: use Web Share API with file attachment
  // On mobile Chrome/Safari, this lets users pick Instagram -> Stories
  const file = new File([imageBlob], 'bolt-rider-card.png', { type: 'image/png' });

  if (navigator.canShare && navigator.canShare({ files: [file] })) {
    try {
      await navigator.share({
        files: [file],
        title: 'My Bolt rider type',
      });
      return;
    } catch (err) {
      if ((err as Error).name === 'AbortError') return;
    }
  }

  // Fallback: try Instagram URL scheme
  const reader = new FileReader();
  reader.onload = () => {
    if (isIOS) {
      window.location.href = 'instagram-stories://share?source_application=bolt-ghana-quiz';
    } else if (isAndroid) {
      window.location.href = 'intent://story-camera#Intent;package=com.instagram.android;scheme=https;end';
    }
    // After a short delay, download as fallback
    setTimeout(() => {
      downloadBlob(imageBlob, 'bolt-rider-card.png');
    }, 1500);
  };
  reader.readAsDataURL(imageBlob);
}

function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
