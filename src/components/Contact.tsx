import { useState, type FormEvent } from 'react';
import { useInView } from '../hooks/useInView';
import {
  Mail,
  Phone,
  MapPin,
  Send,
  MessageSquare,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Eye,
} from 'lucide-react';
import { GithubIcon, LinkedinIcon } from './Icons';
import { siteConfig, getEmail, getMailtoLink } from '../data/site';

interface FormData {
  name: string;
  email: string;
  subject: string;
  message: string;
  _gotcha: string; // Honeypot field for spam prevention
}

interface FormErrors {
  name?: string;
  email?: string;
  subject?: string;
  message?: string;
}

export default function Contact() {
  const { ref, isInView } = useInView();
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    subject: '',
    message: '',
    _gotcha: '',
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  // Click-to-reveal state for anti-scraping
  const [emailRevealed, setEmailRevealed] = useState(false);
  const [phoneRevealed, setPhoneRevealed] = useState(false);

  const validate = (): boolean => {
    const newErrors: FormErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    if (!formData.subject.trim()) newErrors.subject = 'Subject is required';
    if (!formData.message.trim()) newErrors.message = 'Message is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    // Honeypot check: If bot filled the hidden field, silently simulate success
    if (formData._gotcha) {
      setStatus('success');
      setFormData({ name: '', email: '', subject: '', message: '', _gotcha: '' });
      return;
    }

    setStatus('loading');
    setErrorMessage('');

    const endpoint = siteConfig.formEndpoint || import.meta.env.VITE_FORM_ENDPOINT;

    if (endpoint) {
      try {
        const response = await fetch(endpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
          body: JSON.stringify({
            name: formData.name,
            email: formData.email,
            subject: formData.subject,
            message: formData.message,
          }),
        });

        if (response.ok) {
          setStatus('success');
          setFormData({ name: '', email: '', subject: '', message: '', _gotcha: '' });
          setTimeout(() => setStatus('idle'), 6000);
        } else {
          const data = await response.json().catch(() => null);
          throw new Error(data?.error || 'Submission failed. Please try again or use direct email.');
        }
      } catch (err: unknown) {
        setStatus('error');
        setErrorMessage(
          err instanceof Error
            ? err.message
            : 'Unable to deliver message right now. You can send directly via your email client.'
        );
      }
    } else {
      // Fallback if no form endpoint is set in environment: open mailto and notify user
      try {
        const mailto = getMailtoLink(
          `[Portfolio Contact] ${formData.subject}`,
          `From: ${formData.name} (${formData.email})\n\n${formData.message}`
        );
        window.location.href = mailto;
        setStatus('success');
        setFormData({ name: '', email: '', subject: '', message: '', _gotcha: '' });
        setTimeout(() => setStatus('idle'), 6000);
      } catch {
        setStatus('error');
        setErrorMessage('Failed to trigger email client. Please email directly.');
      }
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const fullEmail = getEmail();
  const maskedEmail = `${siteConfig.email.user.slice(0, 5)}•••••@${siteConfig.email.domain}`;
  const maskedPhone = '+91 99525 •••••';

  return (
    <section id="contact" className="section">
      <div className="container">
        <div className={`section-header animate-in ${isInView ? 'visible' : ''}`} ref={ref}>
          <span className="section-label">
            <MessageSquare size={14} /> Get in Touch
          </span>
          <h2 className="section-title">Contact Me</h2>
          <p className="section-subtitle">
            Interested in working together or discussing AI and cloud projects? Let's connect.
          </p>
        </div>

        <div className="contact-grid">
          {/* Info */}
          <div
            className={`contact-info animate-in ${isInView ? 'visible' : ''}`}
            style={{ transitionDelay: '100ms' }}
          >
            <h3>{siteConfig.name}</h3>
            <p className="contact-subtitle">
              {siteConfig.openToOpportunitiesText}
            </p>

            <div className="contact-detail">
              <div className="contact-detail-icon">
                <MapPin size={18} />
              </div>
              <div className="contact-detail-text">
                {siteConfig.location}
              </div>
            </div>

            {/* Obfuscated Phone */}
            <div className="contact-detail">
              <div className="contact-detail-icon">
                <Phone size={18} />
              </div>
              <div className="contact-detail-text">
                {phoneRevealed ? (
                  <a href={`tel:${siteConfig.phone.href}`}>{siteConfig.phone.display}</a>
                ) : (
                  <div className="obfuscated-field">
                    <span>{maskedPhone}</span>
                    <button
                      type="button"
                      className="reveal-btn"
                      onClick={() => setPhoneRevealed(true)}
                      aria-label="Reveal phone number"
                    >
                      <Eye size={12} /> Reveal
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Obfuscated Email */}
            <div className="contact-detail">
              <div className="contact-detail-icon">
                <Mail size={18} />
              </div>
              <div className="contact-detail-text">
                {emailRevealed ? (
                  <a href={`mailto:${fullEmail}`}>{fullEmail}</a>
                ) : (
                  <div className="obfuscated-field">
                    <span>{maskedEmail}</span>
                    <button
                      type="button"
                      className="reveal-btn"
                      onClick={() => setEmailRevealed(true)}
                      aria-label="Reveal email address"
                    >
                      <Eye size={12} /> Reveal
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div className="contact-links">
              <a
                href={getMailtoLink('Portfolio Inquiry')}
                className="contact-link-btn"
                aria-label="Send Email"
              >
                <Mail size={16} /> Direct Email
              </a>
              <a
                href={siteConfig.social.github}
                target="_blank"
                rel="noopener noreferrer"
                className="contact-link-btn"
                aria-label="GitHub Profile"
              >
                <GithubIcon size={16} /> GitHub
              </a>
              <a
                href={siteConfig.social.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="contact-link-btn"
                aria-label="LinkedIn Profile"
              >
                <LinkedinIcon size={16} /> LinkedIn
              </a>
            </div>
          </div>

          {/* Form */}
          <form
            className={`contact-form animate-in ${isInView ? 'visible' : ''}`}
            style={{ transitionDelay: '200ms' }}
            onSubmit={handleSubmit}
            noValidate
          >
            {/* Honeypot field (hidden from legitimate users) */}
            <div style={{ display: 'none' }} aria-hidden="true">
              <label htmlFor="website-honeypot">Do not fill this</label>
              <input
                id="website-honeypot"
                type="text"
                name="_gotcha"
                tabIndex={-1}
                autoComplete="off"
                value={formData._gotcha}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label htmlFor="contact-name">Name</label>
              <input
                id="contact-name"
                type="text"
                name="name"
                placeholder="Your name"
                value={formData.name}
                onChange={handleChange}
                disabled={status === 'loading'}
                className={errors.name ? 'error' : ''}
                aria-describedby={errors.name ? 'name-error' : undefined}
                required
              />
              {errors.name && (
                <span id="name-error" className="form-error">{errors.name}</span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="contact-email">Email</label>
              <input
                id="contact-email"
                type="email"
                name="email"
                placeholder="your@email.com"
                value={formData.email}
                onChange={handleChange}
                disabled={status === 'loading'}
                className={errors.email ? 'error' : ''}
                aria-describedby={errors.email ? 'email-error' : undefined}
                required
              />
              {errors.email && (
                <span id="email-error" className="form-error">{errors.email}</span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="contact-subject">Subject</label>
              <input
                id="contact-subject"
                type="text"
                name="subject"
                placeholder="What is this about?"
                value={formData.subject}
                onChange={handleChange}
                disabled={status === 'loading'}
                className={errors.subject ? 'error' : ''}
                aria-describedby={errors.subject ? 'subject-error' : undefined}
                required
              />
              {errors.subject && (
                <span id="subject-error" className="form-error">{errors.subject}</span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="contact-message">Message</label>
              <textarea
                id="contact-message"
                name="message"
                placeholder="Your message..."
                value={formData.message}
                onChange={handleChange}
                disabled={status === 'loading'}
                className={errors.message ? 'error' : ''}
                aria-describedby={errors.message ? 'message-error' : undefined}
                rows={4}
                required
              />
              {errors.message && (
                <span id="message-error" className="form-error">{errors.message}</span>
              )}
            </div>

            {status === 'success' && (
              <div className="form-status success" role="alert">
                <CheckCircle2 size={18} />
                <span>Thank you! Your message has been received. I will respond promptly.</span>
              </div>
            )}

            {status === 'error' && (
              <div className="form-status error-status" role="alert">
                <AlertCircle size={18} />
                <div style={{ flex: 1 }}>
                  <p>{errorMessage || 'Submission could not be completed.'}</p>
                  <a
                    href={getMailtoLink(
                      formData.subject || 'Portfolio Inquiry',
                      `From: ${formData.name}\n\n${formData.message}`
                    )}
                    className="error-fallback-link"
                  >
                    Open in email client (mailto) &rarr;
                  </a>
                </div>
              </div>
            )}

            <button
              type="submit"
              className="btn btn-primary"
              style={{ width: '100%', justifyContent: 'center' }}
              disabled={status === 'loading'}
            >
              {status === 'loading' ? (
                <>
                  <Loader2 size={18} className="spin-icon" /> Sending Message...
                </>
              ) : (
                <>
                  <Send size={18} /> Send Message
                </>
              )}
            </button>

            <div className="form-fallback-note">
              <span>Prefer regular email? </span>
              <a href={getMailtoLink('Portfolio Contact')}>
                Send a direct email via mailto
              </a>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
