import fallbackResumeUrl from '../assets/resume/shaheer_cv_full.pdf';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

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
    const response = await fetch(`${API_URL}/api/portfolio/resume`, {
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

    const cvSource = response.headers.get('X-CV-Source') || 'backend';
    console.info(`%c[Resume API] CV successfully downloaded from source: ${cvSource}`, 'color: #4edea3; font-weight: bold;');

    const blob = await response.blob();
    const url = URL.createObjectURL(blob);

    triggerDownload(url, filename);

    // Release the object URL after the download has been initiated
    setTimeout(() => URL.revokeObjectURL(url), 10_000);

    return { success: true };
  } catch (err) {
    const errorMsg = err instanceof Error ? err.message : 'Unknown error';
    console.info(`%c[Resume API] Backend fetch failed (${errorMsg}). Activating frontend fallback. CV successfully downloaded from source: frontend-fallback`, 'color: #fbbf24; font-weight: bold;');

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
