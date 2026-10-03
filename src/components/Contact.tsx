import { useState, type FormEvent } from 'react';
import { useInView } from '../hooks/useInView';
import {
  Mail,
  Phone,
  MapPin,
  Send,
  MessageSquare,
} from 'lucide-react';
import { GithubIcon, LinkedinIcon } from './Icons';

interface FormData {
  name: string;
  email: string;
  subject: string;
  message: string;
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
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const validate = (): boolean => {
    const newErrors: FormErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }
    if (!formData.subject.trim()) newErrors.subject = 'Subject is required';
    if (!formData.message.trim()) newErrors.message = 'Message is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const mailtoLink = `mailto:sathyanandns0342@gmail.com?subject=${encodeURIComponent(
      formData.subject
    )}&body=${encodeURIComponent(
      `From: ${formData.name} (${formData.email})\n\n${formData.message}`
    )}`;
    window.open(mailtoLink);
    setStatus('success');
    setFormData({ name: '', email: '', subject: '', message: '' });
    setTimeout(() => setStatus('idle'), 5000);
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

  return (
    <section id="contact" className="section">
      <div className="container">
        <div className={`section-header animate-in ${isInView ? 'visible' : ''}`} ref={ref}>
          <span className="section-label">
            <MessageSquare size={14} /> Get in Touch
          </span>
          <h2 className="section-title">Contact Me</h2>
          <p className="section-subtitle">
            Interested in working together? Let's connect.
          </p>
        </div>

        <div className="contact-grid">
          {/* Info */}
          <div className={`contact-info animate-in ${isInView ? 'visible' : ''}`} style={{ transitionDelay: '100ms' }}>
            <h3>Sathyanand N S</h3>
            <p className="contact-subtitle">
              Machine Learning &amp; Cloud Computing Engineer based in
              Coimbatore, Tamil Nadu. Open to opportunities and collaborations.
            </p>

            <div className="contact-detail">
              <div className="contact-detail-icon">
                <MapPin size={18} />
              </div>
              <div className="contact-detail-text">
                Coimbatore, Tamil Nadu, India
              </div>
            </div>

            <div className="contact-detail">
              <div className="contact-detail-icon">
                <Phone size={18} />
              </div>
              <div className="contact-detail-text">
                <a href="tel:+919952526732">+91 99525 26732</a>
              </div>
            </div>

            <div className="contact-detail">
              <div className="contact-detail-icon">
                <Mail size={18} />
              </div>
              <div className="contact-detail-text">
                <a href="mailto:sathyanandns0342@gmail.com">
                  sathyanandns0342@gmail.com
                </a>
              </div>
            </div>

            <div className="contact-links">
              <a
                href="mailto:sathyanandns0342@gmail.com"
                className="contact-link-btn"
                aria-label="Email"
              >
                <Mail size={16} /> Email
              </a>
              <a href="tel:+919952526732" className="contact-link-btn" aria-label="Phone">
                <Phone size={16} /> Call
              </a>
              <a
                href="https://github.com/Sathyanandns"
                target="_blank"
                rel="noopener noreferrer"
                className="contact-link-btn"
                aria-label="GitHub"
              >
                <GithubIcon size={16} /> GitHub
              </a>
              <a
                href="https://www.linkedin.com/in/sathyanand-n-s-0759a4254"
                target="_blank"
                rel="noopener noreferrer"
                className="contact-link-btn"
                aria-label="LinkedIn"
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
            <div className="form-group">
              <label htmlFor="contact-name">Name</label>
              <input
                id="contact-name"
                type="text"
                name="name"
                placeholder="Your name"
                value={formData.name}
                onChange={handleChange}
                className={errors.name ? 'error' : ''}
                aria-describedby={errors.name ? 'name-error' : undefined}
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
                className={errors.email ? 'error' : ''}
                aria-describedby={errors.email ? 'email-error' : undefined}
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
                className={errors.subject ? 'error' : ''}
                aria-describedby={errors.subject ? 'subject-error' : undefined}
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
                className={errors.message ? 'error' : ''}
                aria-describedby={errors.message ? 'message-error' : undefined}
              />
              {errors.message && (
                <span id="message-error" className="form-error">{errors.message}</span>
              )}
            </div>

            {status === 'success' && (
              <div className="form-status success">
                ✓ Your email client has been opened with the message. Thank you!
              </div>
            )}

            {status === 'error' && (
              <div className="form-status error-status">
                Something went wrong. Please try again or email directly.
              </div>
            )}

            <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
              <Send size={18} /> Send Message
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
