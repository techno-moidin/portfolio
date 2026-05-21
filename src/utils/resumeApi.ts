import fallbackResumeUrl from '../assets/resume/Black and White Elegant Digital Marketing Resume (3).pdf';

/**
 * resumeApi.ts
 *
 * Async fetch utility for the portfolio resume endpoint.
 * Designed to wire directly into NestJS backend at /api/portfolio/resume.
 *
 * Fallback Strategy:
 * If the fetch fails (network error, server crash, or non-OK response),
 * it gracefully degrades to downloading the static PDF bundled with the frontend:
 * src/assets/resume/Black and White Elegant Digital Marketing Resume (3).pdf
 */

export type ResumeDownloadState = 'idle' | 'loading' | 'error';

export interface ResumeDownloadResult {
  success: boolean;
  error?: string;
}

/**
 * Helper to trigger a programmatic browser download of a given URL.
 */
function triggerDownload(url: string, filename: string) {
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
}

/**
 * Fetches the resume PDF from the API endpoint and triggers a browser download.
 * Falls back gracefully to the bundled static PDF asset if the API is down or unavailable.
 */
export async function fetchAndDownloadResume(
  filename = 'Mohammed_Shaheer_Moidin_Resume.pdf'
): Promise<ResumeDownloadResult> {
  try {
    const response = await fetch('/api/portfolio/resume', {
      method: 'GET',
      headers: {
        Accept: 'application/pdf',
      },
    });

    if (!response.ok) {
      throw new Error(`Server returned ${response.status}`);
    }

    const contentType = response.headers.get('content-type') ?? '';
    if (!contentType.includes('application/pdf')) {
      throw new Error('Unexpected response format from server.');
    }

    const blob = await response.blob();
    const url = URL.createObjectURL(blob);

    triggerDownload(url, filename);

    // Release the object URL after the download has been initiated
    setTimeout(() => URL.revokeObjectURL(url), 10_000);

    return { success: true };
  } catch (err) {
    console.warn(
      'API resume download failed. Activating local static fallback:',
      err
    );

    try {
      // Trigger download using the static PDF imported URL
      triggerDownload(fallbackResumeUrl, filename);
      return { success: true };
    } catch (fallbackErr) {
      const message =
        fallbackErr instanceof Error
          ? fallbackErr.message
          : 'An unexpected error occurred during fallback download.';
      return { success: false, error: message };
    }
  }
}
