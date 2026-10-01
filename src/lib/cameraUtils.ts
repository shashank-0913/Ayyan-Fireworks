import { Html5Qrcode, Html5QrcodeCameraScanConfig } from 'html5-qrcode';

/**
 * Cleanly terminates all active media stream tracks across video elements in the DOM.
 * This guarantees hardware camera sensors (USB, mobile rear/front lenses) are released
 * and never left in a 'busy' or locked state during route transitions, retries, or unmounts.
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
        globalStream.getTracks().forEach((track) => {
          try {
            track.stop();
          } catch (e) {}
        });
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
 * Extracts and sanitizes a scanned QR payload or manual input string.
 * Strips leading/trailing whitespace, quotes, JSON wrapping (e.g. {"id":"..."}, {"bookingId":"..."}),
 * and extracts the raw clean ID / ticket code.
 */
export function extractCleanQrPayload(raw: string | null | undefined): string {
  if (!raw) return '';
  let str = String(raw).trim();

  // 1. Strip outer quotes (single, double, backticks, escaped quotes) repeatedly if nested
  while (
    (str.startsWith('"') && str.endsWith('"')) ||
    (str.startsWith("'") && str.endsWith("'")) ||
    (str.startsWith('`') && str.endsWith('`')) ||
    (str.startsWith('\\"') && str.endsWith('\\"'))
  ) {
    if (str.startsWith('\\"') && str.endsWith('\\"')) {
      str = str.slice(2, -2).trim();
    } else {
      str = str.slice(1, -1).trim();
    }
  }

  // 2. Handle JSON encoded QR codes (e.g. {"id":"...", "bookingId":"...", "ticket_code":"..."})
  if ((str.startsWith('{') && str.endsWith('}')) || (str.startsWith('{\\"') && str.endsWith('\\"}'))) {
    try {
      const parsed = str.startsWith('{\\"') ? JSON.parse(JSON.parse(str)) : JSON.parse(str);
      if (parsed && typeof parsed === 'object') {
        const extracted =
          parsed.id ||
          parsed.bookingId ||
          parsed.booking_id ||
          parsed.ticket_code ||
          parsed.ticketCode ||
          parsed.booking_code ||
          parsed.bookingCode ||
          parsed.qr_token ||
          parsed.qrToken ||
          parsed.code ||
          parsed.token;
        if (extracted) {
          return String(extracted).trim();
        }
      }
    } catch (e) {
      // Not valid JSON directly, check regex extraction below
    }
  }

  // 3. Check for JSON object pattern within the payload
  try {
    const jsonMatch = str.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]);
      if (parsed && typeof parsed === 'object') {
        const extracted =
          parsed.id ||
          parsed.bookingId ||
          parsed.booking_id ||
          parsed.ticket_code ||
          parsed.ticketCode ||
          parsed.booking_code ||
          parsed.bookingCode ||
          parsed.qr_token ||
          parsed.qrToken ||
          parsed.code ||
          parsed.token;
        if (extracted) {
          return String(extracted).trim();
        }
      }
    }
  } catch (e) {}

  // 4. Handle URLs (e.g. https://domain.com/verify?id=UUID or https://domain.com/gate/UUID)
  if (str.includes('http://') || str.includes('https://') || str.includes('?') || str.includes('&')) {
    try {
      const url = new URL(str, typeof window !== 'undefined' ? window.location.origin : 'https://ayyanfireworks.com');
      const param =
        url.searchParams.get('id') ||
        url.searchParams.get('bookingId') ||
        url.searchParams.get('booking_id') ||
        url.searchParams.get('ticket_code') ||
        url.searchParams.get('booking_code') ||
        url.searchParams.get('code') ||
        url.searchParams.get('token') ||
        url.searchParams.get('qr');
      if (param) {
        return param.trim();
      }

      // Check URL path segments
      const segments = url.pathname.split('/').filter(Boolean);
      if (segments.length > 0) {
        const last = segments[segments.length - 1];
        if (last && last.length >= 6) {
          return last.trim();
        }
      }
    } catch (e) {}
  }

  return str.trim();
}

/**
 * Flexible fallback strategy for starting the camera scanner:
 * 1. Stops all previous media tracks using stream.getTracks().forEach(t => t.stop()) to prevent hardware lock errors.
 * 2. Pre-flight requests camera access using navigator.mediaDevices.getUserMedia({ video: { facingMode: { ideal: "environment" } } }).
 * 3. Initializes with { facingMode: "environment" } rather than hardcoding camera index 0.
 * 4. If environment fails, falls back gracefully to the first available video device from Html5Qrcode.getCameras().
 */
export async function startScannerWithFallback(
  html5QrCode: Html5Qrcode,
  config: Html5QrcodeCameraScanConfig,
  preferredCameraId?: string,
  onScanSuccess?: (decodedText: string) => void,
  onScanFailure?: (errorMessage: string) => void
): Promise<{ startedWith: string }> {
  // Step 1: Ensure all previous media tracks are stopped
  stopAllCameraMediaTracks();

  // Step 2: Request camera access using navigator.mediaDevices.getUserMedia with ideal environment facingMode
  if (typeof navigator !== 'undefined' && navigator.mediaDevices?.getUserMedia) {
    try {
      const preflightStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: { ideal: "environment" } }
      });
      // Release pre-flight stream immediately so camera is unlocked for Html5Qrcode
      preflightStream.getTracks().forEach((track) => {
        try {
          track.stop();
        } catch (e) {}
      });
    } catch (permErr) {
      console.warn("Pre-flight getUserMedia notice (proceeding to Html5Qrcode):", permErr);
    }
  }

  // Ensure tracks stopped after preflight
  stopAllCameraMediaTracks();

  const successCallback = (decodedText: string) => {
    if (onScanSuccess) {
      onScanSuccess(decodedText);
    }
  };

  const failureCallback = (errorMessage: string) => {
    if (onScanFailure) {
      onScanFailure(errorMessage);
    }
  };

  // Step 3: If a specific camera device was selected in UI, try that first
  if (preferredCameraId) {
    try {
      await html5QrCode.start(
        preferredCameraId,
        config,
        successCallback,
        failureCallback
      );
      return { startedWith: `deviceId: ${preferredCameraId}` };
    } catch (selectedErr) {
      console.warn(`Could not start with selected device ${preferredCameraId}, falling back to facingMode: environment:`, selectedErr);
      stopAllCameraMediaTracks();
    }
  }

  // Step 4: Primary Strategy — { facingMode: "environment" }
  try {
    await html5QrCode.start(
      { facingMode: "environment" },
      config,
      successCallback,
      failureCallback
    );
    return { startedWith: "facingMode: environment" };
  } catch (envErr) {
    console.warn("Html5Qrcode facingMode: 'environment' start failed, attempting device enumeration fallback:", envErr);
    stopAllCameraMediaTracks();
  }

  // Step 5: Graceful Fallback — query Html5Qrcode.getCameras()
  try {
    const devices = await Html5Qrcode.getCameras();
    if (devices && devices.length > 0) {
      // Find back/rear lens or default to first available camera
      const backDevice = devices.find((d) => {
        const label = (d.label || '').toLowerCase();
        return label.includes('back') || label.includes('rear') || label.includes('environment');
      });

      const fallbackDeviceId = backDevice ? backDevice.id : devices[0].id;

      try {
        await html5QrCode.start(
          fallbackDeviceId,
          config,
          successCallback,
          failureCallback
        );
        return { startedWith: `fallback device: ${fallbackDeviceId}` };
      } catch (devErr) {
        console.warn(`Fallback camera ${fallbackDeviceId} failed, trying first available device:`, devErr);
        stopAllCameraMediaTracks();

        if (devices.length > 1 && fallbackDeviceId !== devices[0].id) {
          await html5QrCode.start(
            devices[0].id,
            config,
            successCallback,
            failureCallback
          );
          return { startedWith: `first device: ${devices[0].id}` };
        }
        throw devErr;
      }
    }
  } catch (camListErr) {
    console.warn("Html5Qrcode.getCameras() fallback failed:", camListErr);
    stopAllCameraMediaTracks();
  }

  // Step 6: Final fallback attempt: facingMode: "user"
  try {
    await html5QrCode.start(
      { facingMode: "user" },
      config,
      successCallback,
      failureCallback
    );
    return { startedWith: "facingMode: user" };
  } catch (userCamErr) {
    stopAllCameraMediaTracks();
    throw userCamErr;
  }
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
