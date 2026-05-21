import { useState, useCallback } from 'react';
import { Menu, X, Download, Loader2, AlertCircle } from 'lucide-react';
import {
  fetchAndDownloadResume,
  type ResumeDownloadState,
} from '../utils/resumeApi';
import { RESUME_DATA } from '../data/resume';

const NAV_LINKS = [
  { label: 'Experience', href: '#experience' },
  { label: 'Projects', href: '#projects' },
  { label: 'Skills', href: '#skills' },
  { label: 'Contact', href: '#contact' },
];

// ── Download CV Button ─────────────────────────────────────────────────────────
// Shared between desktop nav and mobile overlay so state lives in Navbar.

interface DownloadCVButtonProps {
  downloadState: ResumeDownloadState;
  errorMessage: string | null;
  onDownload: () => void;
  /** Slightly larger padding for the mobile overlay variant */
  variant?: 'desktop' | 'mobile';
}

function DownloadCVButton({
  downloadState,
  errorMessage,
  onDownload,
  variant = 'desktop',
}: DownloadCVButtonProps) {
  const isLoading = downloadState === 'loading';
  const isError = downloadState === 'error';

  const sizeClasses =
    variant === 'mobile'
      ? 'px-8 py-3 text-[14px]'
      : 'px-6 py-2 text-[12px]';

  const baseClasses = `
    relative inline-flex items-center justify-center gap-2
    bg-primary text-on-primary rounded
    font-label-caps font-bold uppercase tracking-wider
    transition-all duration-200
    hover:opacity-80 active:scale-95
    disabled:cursor-not-allowed disabled:opacity-60
    focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background
    ${sizeClasses}
  `;

  return (
    <div className="flex flex-col items-center gap-1">
      <button
        id="download-cv-btn"
        aria-label={
          isLoading
            ? 'Downloading CV, please wait…'
            : isError
            ? 'Retry CV download'
            : 'Download CV'
        }
        aria-busy={isLoading}
        disabled={isLoading}
        className={baseClasses}
        onClick={onDownload}
      >
        {/* Icon slot — swaps between Download, spinner, and error indicator */}
        <span className="flex-shrink-0 transition-transform duration-200">
          {isLoading ? (
            <Loader2
              size={14}
              className="animate-spin"
              aria-hidden="true"
            />
          ) : isError ? (
            <AlertCircle size={14} className="text-on-primary" aria-hidden="true" />
          ) : (
            <Download size={14} aria-hidden="true" />
          )}
        </span>

        {/* Label */}
        {isLoading ? 'Fetching…' : isError ? 'Retry' : 'Download CV'}
      </button>

      {/* Error tooltip — only rendered when there is an active error */}
      {isError && errorMessage && (
        <p
          role="alert"
          className="text-error text-[11px] font-code-md text-center max-w-[180px] leading-tight"
        >
          {errorMessage}
        </p>
      )}
    </div>
  );
}

// ── Navbar ─────────────────────────────────────────────────────────────────────

export function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [downloadState, setDownloadState] = useState<ResumeDownloadState>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  /** Shared handler wired to both desktop and mobile Download CV buttons. */
  const handleDownload = useCallback(async () => {
    if (downloadState === 'loading') return;

    setDownloadState('loading');
    setErrorMessage(null);

    const result = await fetchAndDownloadResume(
      `${RESUME_DATA.name.replace(/\s+/g, '_')}_Resume.pdf`
    );

    if (result.success) {
      setDownloadState('idle');
    } else {
      setDownloadState('error');
      setErrorMessage(result.error ?? 'Download failed. Please try again.');
    }
  }, [downloadState]);

  const closeMobileMenu = useCallback(() => setIsMobileMenuOpen(false), []);
  const toggleMobileMenu = useCallback(
    () => setIsMobileMenuOpen((prev) => !prev),
    []
  );

  return (
    <nav
      className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-md border-b border-outline-variant"
      aria-label="Primary navigation"
    >
      <div className="flex justify-between items-center max-w-container-max mx-auto px-gutter h-20">
        {/* Logo */}
        <div className="font-code-md text-[14px] font-bold text-primary z-50">
          MSM_PORTFOLIO
        </div>

        {/* ── Desktop Menu ── */}
        <div className="hidden md:flex items-center gap-stack-lg">
          {NAV_LINKS.map(({ label, href }) => (
            <a
              key={href}
              className="nav-link text-on-surface-variant text-[16px] hover:text-primary transition-colors duration-200"
              href={href}
            >
              {label}
            </a>
          ))}
        </div>

        {/* Desktop Download CV */}
        <div className="hidden md:block">
          <DownloadCVButton
            downloadState={downloadState}
            errorMessage={errorMessage}
            onDownload={handleDownload}
            variant="desktop"
          />
        </div>

        {/* ── Mobile Hamburger Toggle ── */}
        <button
          id="mobile-menu-toggle"
          className="md:hidden text-on-surface z-50 p-2 rounded-md
                     hover:bg-surface-container-high transition-colors duration-200
                     focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          aria-label={isMobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
          aria-expanded={isMobileMenuOpen}
          aria-controls="mobile-menu"
          onClick={toggleMobileMenu}
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* ── Mobile Full-Screen Overlay ──
          Uses translate-based animation instead of visibility/opacity-only
          to guarantee the overlay is truly off-screen when closed,
          avoiding tap-through issues on small viewports (< 375px). */}
      <div
        id="mobile-menu"
        role="dialog"
        aria-modal="true"
        aria-label="Navigation menu"
        className={`
          md:hidden
          fixed inset-0 top-0 left-0
          w-full
          min-h-[100dvh]
          bg-background/95 backdrop-blur-xl
          flex flex-col items-center justify-center gap-8
          transition-all duration-300 ease-in-out
          z-40
          ${
            isMobileMenuOpen
              ? 'opacity-100 translate-y-0 pointer-events-auto'
              : 'opacity-0 -translate-y-4 pointer-events-none'
          }
        `}
      >
        {/* Nav links */}
        <ul className="flex flex-col items-center gap-6 list-none p-0 m-0 w-full px-6">
          {NAV_LINKS.map(({ label, href }) => (
            <li key={href} className="w-full text-center">
              <a
                className="block text-on-surface text-2xl font-bold hover:text-primary transition-colors duration-200 py-2"
                href={href}
                onClick={closeMobileMenu}
              >
                {label}
              </a>
            </li>
          ))}
        </ul>

        {/* Mobile Download CV */}
        <div className="mt-2">
          <DownloadCVButton
            downloadState={downloadState}
            errorMessage={errorMessage}
            onDownload={handleDownload}
            variant="mobile"
          />
        </div>
      </div>
    </nav>
  );
}
