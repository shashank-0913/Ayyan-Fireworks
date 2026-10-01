import { Html5Qrcode } from 'html5-qrcode';

/**
 * Cleanly terminates all active media stream tracks across video elements in the DOM.
 * This guarantees hardware camera sensors (USB, mobile rear/front lenses) are released
 * and never left in a 'busy' or locked state during route transitions or unmounts.
 */
export function stopAllCameraMediaTracks(): void {
  try {
    // 1. Iterate over all video elements in the DOM
    const videoElements = document.querySelectorAll('video');
    videoElements.forEach((video) => {
      try {
        if (video.srcObject && 'getTracks' in (video.srcObject as MediaStream)) {
          const stream = video.srcObject as MediaStream;
          stream.getTracks().forEach((track) => {
            try {
              track.stop();
            } catch (e) {
              // Ignore track stop errors
            }
          });
          video.srcObject = null;
        }
      } catch (e) {
        // Ignore stream access errors
      }

      try {
        video.pause();
        video.removeAttribute('src');
        video.load();
      } catch (e) {
        // Ignore video reset errors
      }
    });

    // 2. Also check if window has cached any navigator media stream handles
    if (typeof window !== 'undefined' && (window as any).__ACTIVE_CAMERA_STREAM__) {
      try {
        const globalStream = (window as any).__ACTIVE_CAMERA_STREAM__ as MediaStream;
        globalStream.getTracks().forEach((track) => track.stop());
        (window as any).__ACTIVE_CAMERA_STREAM__ = null;
      } catch (e) {}
    }
  } catch (err) {
    console.warn('Notice: Error during camera media track termination:', err);
  }
}

/**
 * Cleans up and clears an active Html5Qrcode instance while terminating hardware tracks.
 */
export async function cleanupScannerInstance(scanner: Html5Qrcode | null): Promise<void> {
  if (scanner) {
    try {
      if (scanner.isScanning) {
        await scanner.stop();
      }
    } catch (e) {
      // Ignore stop errors on unmounted / already stopped scanner
    }
    try {
      scanner.clear();
    } catch (e) {}
  }
  stopAllCameraMediaTracks();
}

/**
 * Extracts and cleans a scanned QR payload or manual input string.
 * Handles raw UUIDs, URL parameters, JSON objects, and surrounding whitespace/quotes.
 */
export function extractCleanQrPayload(raw: string | null | undefined): string {
  if (!raw) return '';
  let str = String(raw).trim();

  // Remove surrounding quotes if present
  if ((str.startsWith('"') && str.endsWith('"')) || (str.startsWith("'") && str.endsWith("'"))) {
    str = str.slice(1, -1).trim();
  }

  // Handle JSON encoded QR codes (e.g. {"id":"...", "ticket_code":"..."})
  if (str.startsWith('{') && str.endsWith('}')) {
    try {
      const parsed = JSON.parse(str);
      const extracted =
        parsed.id ||
        parsed.booking_id ||
        parsed.ticket_code ||
        parsed.booking_code ||
        parsed.qr_token ||
        parsed.code ||
        parsed.token;
      if (extracted) {
        return String(extracted).trim();
      }
    } catch (e) {
      // Not valid JSON, continue with string processing
    }
  }

  // Handle URLs (e.g. https://domain.com/verify?id=UUID or https://domain.com/gate/UUID)
  if (str.includes('http://') || str.includes('https://') || str.includes('?') || str.includes('&')) {
    try {
      // Build URL safely with fallback base
      const url = new URL(str, typeof window !== 'undefined' ? window.location.origin : 'https://ayyan.local');
      const param =
        url.searchParams.get('id') ||
        url.searchParams.get('ticket_code') ||
        url.searchParams.get('booking_code') ||
        url.searchParams.get('code') ||
        url.searchParams.get('token') ||
        url.searchParams.get('qr');
      if (param) {
        return param.trim();
      }

      // Check pathname segments
      const segments = url.pathname.split('/').filter(Boolean);
      if (segments.length > 0) {
        const last = segments[segments.length - 1];
        if (last && last.length >= 6) {
          return last.trim();
        }
      }
    } catch (e) {
      // Not a standard URL, continue
    }
  }

  return str.trim();
}

/**
 * Translates camera error into user-friendly diagnostic guidance.
 */
export function getCameraErrorMessage(err: any): string {
  if (!err) return 'Camera is currently unavailable.';
  const msg = typeof err === 'string' ? err : err.message || err.name || '';
  const lower = msg.toLowerCase();

  if (err.name === 'NotAllowedError' || lower.includes('permission') || lower.includes('denied')) {
    return 'Camera permission denied. Please allow camera permissions in your browser or site settings.';
  }
  if (err.name === 'NotReadableError' || lower.includes('busy') || lower.includes('in use') || lower.includes('could not start')) {
    return 'Camera sensor is busy or held by another application/tab. Click "Restart Camera" to force release.';
  }
  if (err.name === 'NotFoundError' || lower.includes('no camera') || lower.includes('devices not found')) {
    return 'No camera hardware detected on this device.';
  }
  return msg || 'Camera permission denied or camera device busy.';
}
