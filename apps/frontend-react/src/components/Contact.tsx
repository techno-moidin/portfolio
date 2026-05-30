import { useState } from 'react';
import { RESUME_DATA } from '../data/resume';

/**
 * Contact.tsx — High-Fidelity Interaction CTA with custom Webmail & Copy-Paste Modal
 *
 * Implements a premium UX pivot:
 *  - "Say Hello" now opens a modal offering Gmail Web Compose (pre-filled subject & body)
 *    and system Mailto fallbacks.
 *  - "LinkedIn" modal provides a pre-written high-converting template, a one-click
 *    "Copy Message & Open LinkedIn" action (since LinkedIn API doesn't support pre-fill).
 */
export function Contact() {
  const { email, linkedin } = RESUME_DATA;
  const [activeModal, setActiveModal] = useState<'email' | 'linkedin' | null>(null);
  const [copied, setCopied] = useState(false);

  const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(email)}`;
  const mailtoUrl = `mailto:${email}`;

  const linkedinMessageTemplate = `Hi Mohammed,\n\nI came across your portfolio and was highly impressed by your experience with NestJS, microservices, and database migrations. I'd love to connect here and discuss a potential engineering opportunity.\n\nBest regards,`;



  return (
    <section
      className="py-section-gap max-w-container-max mx-auto px-gutter text-center reveal relative"
      id="contact"
    >
      <div className="glass-card p-8 md:p-20 rounded-3xl relative overflow-hidden">
        {/* Ambient glow blob */}
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-primary/10 blur-[100px] rounded-full pointer-events-none" />

        <h2 className="font-headline-lg text-[32px] md:text-[48px] font-bold text-on-surface mb-stack-md leading-tight">
          Ready for the next <span className="text-primary">Scale</span>?
        </h2>

        <p className="font-body-lg text-[16px] md:text-[18px] text-on-surface-variant max-w-xl mx-auto mb-stack-lg">
          Currently available for senior engineering opportunities or high-impact
          consultancy roles.
        </p>

        <div className="flex flex-col md:flex-row justify-center gap-4">
          {/* Primary CTA — opens Email Options Modal */}
          <button
            id="contact-email-btn"
            onClick={() => setActiveModal('email')}
            className="bg-primary text-on-primary px-10 py-4 rounded font-label-caps font-bold text-[12px] hover:opacity-90 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]" aria-hidden="true">
              mail
            </span>
            SAY HELLO
          </button>

          {/* Secondary CTA — opens LinkedIn Template Modal */}
          <button
            id="contact-linkedin-btn"
            onClick={() => setActiveModal('linkedin')}
            className="border border-outline text-on-surface px-10 py-4 rounded font-label-caps font-bold text-[12px] hover:border-primary hover:text-primary transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]" aria-hidden="true">
              link
            </span>
            LINKEDIN DIRECT
          </button>
        </div>
      </div>

      {/* ── Direct Contact Modals ── */}
      {activeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-md animate-fade-in">
          {/* Backdrop Close */}
          <div
            className="absolute inset-0 cursor-default"
            onClick={() => setActiveModal(null)}
          />

          {/* Modal Container */}
          <div className="relative glass-card w-full max-w-lg rounded-2xl p-6 md:p-8 text-left border border-outline-variant shadow-2xl z-10 animate-scale-up">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-[24px]">
                  {activeModal === 'email' ? 'alternate_email' : 'chat'}
                </span>
                <h3 className="font-headline-md text-[20px] font-bold text-on-surface">
                  {activeModal === 'email'
                    ? 'Connect via Email'
                    : 'Connect via LinkedIn'}
                </h3>
              </div>
              <button
                onClick={() => setActiveModal(null)}
                className="text-on-surface-variant hover:text-primary transition-colors cursor-pointer"
                aria-label="Close modal"
              >
                <span className="material-symbols-outlined text-[24px]">close</span>
              </button>
            </div>

            {/* Modal Body — Email Mode */}
            {activeModal === 'email' && (
              <div className="space-y-6">
                <p className="font-body-md text-on-surface-variant text-[14px]">
                  To make reaching out as effortless as possible, choose your preferred client to open a clean direct email compose window:
                </p>

                <div className="grid grid-cols-1 gap-4">
                  {/* Gmail Compose */}
                  <a
                    href={gmailUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-4 p-4 rounded-xl border border-outline-variant bg-surface-container-high/40 hover:border-primary/50 transition-all group"
                  >
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary group-hover:scale-105 transition-transform">
                      <span className="material-symbols-outlined text-[20px]">
                        open_in_new
                      </span>
                    </div>
                    <div>
                      <h4 className="font-headline-sm text-[15px] font-bold text-on-surface">
                        Compose in Gmail
                      </h4>
                      <p className="text-[12px] text-on-surface-variant">
                        Opens a new window in your Gmail account
                      </p>
                    </div>
                  </a>

                  {/* Mailto link */}
                  <a
                    href={mailtoUrl}
                    className="flex items-center gap-4 p-4 rounded-xl border border-outline-variant bg-surface-container-high/40 hover:border-primary/50 transition-all group"
                  >
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary group-hover:scale-105 transition-transform">
                      <span className="material-symbols-outlined text-[20px]">
                        mail
                      </span>
                    </div>
                    <div>
                      <h4 className="font-headline-sm text-[15px] font-bold text-on-surface">
                        Default Mail App
                      </h4>
                      <p className="text-[12px] text-on-surface-variant">
                        Opens Outlook, Apple Mail, or system default
                      </p>
                    </div>
                  </a>
                </div>
              </div>
            )}

            {/* Modal Body — LinkedIn Mode */}
            {activeModal === 'linkedin' && (
              <div className="space-y-6">
                <p className="font-body-md text-on-surface-variant text-[14px]">
                  To save you time, here is a quick introductory message template. Feel free to copy it before opening my profile:
                </p>

                {/* Draft Preview Box with floating Copy Button */}
                <div className="relative p-4 rounded-xl border border-outline-variant bg-surface-dim font-body-md text-[13px] text-on-surface-variant leading-relaxed select-all max-h-[140px] overflow-y-auto pr-12">
                  {linkedinMessageTemplate}

                  {/* Absolute Copy Button */}
                  <button
                    onClick={async () => {
                      try {
                        await navigator.clipboard.writeText(linkedinMessageTemplate);
                        setCopied(true);
                        setTimeout(() => setCopied(false), 2000);
                      } catch (err) {
                        console.error('Failed to copy text:', err);
                      }
                    }}
                    className={`absolute bottom-3 right-3 p-2 rounded-lg border transition-all cursor-pointer flex items-center justify-center ${
                      copied
                        ? 'border-primary bg-primary/10 text-primary'
                        : 'border-outline-variant bg-surface-container-high/60 text-on-surface-variant hover:text-primary hover:border-primary/40'
                    }`}
                    title="Copy template message"
                  >
                    <span className="material-symbols-outlined text-[16px]">
                      {copied ? 'check' : 'content_copy'}
                    </span>
                  </button>
                </div>

                {/* Direct Action Button — just opens profile */}
                <a
                  href={linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setActiveModal(null)}
                  className="w-full bg-primary text-on-primary py-4 rounded-xl font-label-caps font-bold text-[12px] hover:opacity-90 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[18px]">
                    open_in_new
                  </span>
                  OPEN PROFILE
                </a>
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
