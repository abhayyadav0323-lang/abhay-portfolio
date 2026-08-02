import { useEffect, useMemo, useState } from 'react';
import emailjs from '@emailjs/browser';
import { contactDetails } from '../data';

const initialFormData = {
  name: '',
  email: '',
  subject: '',
  message: '',
};

const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

const Contact = () => {
  const [formData, setFormData] = useState(initialFormData);
  const [errors, setErrors] = useState({});
  const [isSending, setIsSending] = useState(false);
  const [status, setStatus] = useState(null);

  const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID?.trim();
  const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID?.trim();
  const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY?.trim();

  console.log('Service ID:', serviceId);
  console.log('Template ID:', templateId);
  console.log('Public Key:', publicKey);

  useEffect(() => {
    if (publicKey) {
      emailjs.init(publicKey);
    }
  }, [publicKey]);

  const validateField = (name, value) => {
    switch (name) {
      case 'name':
        return value.trim().length >= 2 ? '' : 'Please enter your full name.';
      case 'email':
        return validateEmail(value) ? '' : 'Please enter a valid email address.';
      case 'subject':
        return value.trim().length >= 3 ? '' : 'Please enter a subject.';
      case 'message':
        return value.trim().length >= 10 ? '' : 'Please enter at least 10 characters.';
      default:
        return '';
    }
  };

  const validateForm = (values) => {
    const nextErrors = {};
    Object.entries(values).forEach(([key, value]) => {
      const message = validateField(key, value);
      if (message) {
        nextErrors[key] = message;
      }
    });
    return nextErrors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: validateField(name, value) }));
    if (status) {
      setStatus(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const nextErrors = validateForm(formData);
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      setStatus({ type: 'error', message: 'Please correct the highlighted fields and try again.' });
      return;
    }

    const missingConfig = [
      !serviceId && 'VITE_EMAILJS_SERVICE_ID',
      !templateId && 'VITE_EMAILJS_TEMPLATE_ID',
      !publicKey && 'VITE_EMAILJS_PUBLIC_KEY',
    ].filter(Boolean);

    if (missingConfig.length > 0) {
      setStatus({
        type: 'error',
        message: `EmailJS is not configured. Missing: ${missingConfig.join(', ')}. Add them to your .env file and restart the Vite dev server.`,
      });
      return;
    }

    setIsSending(true);
    setStatus(null);

    try {
      await emailjs.send(
        serviceId,
        templateId,
        {
          from_name: formData.name,
          from_email: formData.email,
          subject: formData.subject,
          message: formData.message,
          reply_to: formData.email,
        },
        publicKey
      );
      setFormData(initialFormData);
      setErrors({});
      setStatus({ type: 'success', message: 'Thanks! Your message has been sent successfully.' });
    } catch (error) {
      console.error('EmailJS error:', error);
      const detail = error?.text || error?.message || 'Unknown EmailJS error';
      setStatus({
        type: 'error',
        message: `EmailJS could not send the message: ${detail}`,
      });
    } finally {
      setIsSending(false);
    }
  };

  const inputClassName = useMemo(() => 'form-input', []);

  const getContactHref = (item) => {
    if (item.label === 'Email') {
      return `mailto:${item.value}`;
    }
    if (item.label === 'Phone') {
      return `tel:${item.value.replace(/\s+/g, '')}`;
    }
    if (item.label === 'LinkedIn' || item.label === 'GitHub') {
      return `https://${item.value}`;
    }
    return '#';
  };

  return (
    <div className="contact-layout reveal">
      <div className="contact-card glass-card">
        <div className="contact-info">
          {contactDetails.map((item) => (
            <div key={item.label} className="contact-item">
              <span className="gradient-text">{item.icon}</span>
              <div>
                <h3>{item.label}</h3>
                <a href={getContactHref(item)} target={item.label === 'Email' || item.label === 'Phone' ? '_self' : '_blank'} rel="noreferrer">
                  {item.value}
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>

      <form className="contact-card glass-card form-grid" onSubmit={handleSubmit} noValidate>
        <div>
          <input
            className={inputClassName}
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Your Name"
            aria-invalid={Boolean(errors.name)}
          />
          {errors.name && <p className="form-error">{errors.name}</p>}
        </div>

        <div>
          <input
            className={inputClassName}
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Your Email"
            aria-invalid={Boolean(errors.email)}
          />
          {errors.email && <p className="form-error">{errors.email}</p>}
        </div>

        <div>
          <input
            className={inputClassName}
            type="text"
            name="subject"
            value={formData.subject}
            onChange={handleChange}
            placeholder="Subject"
            aria-invalid={Boolean(errors.subject)}
          />
          {errors.subject && <p className="form-error">{errors.subject}</p>}
        </div>

        <div>
          <textarea
            className={inputClassName}
            name="message"
            value={formData.message}
            onChange={handleChange}
            placeholder="Write your message..."
            aria-invalid={Boolean(errors.message)}
          />
          {errors.message && <p className="form-error">{errors.message}</p>}
        </div>

        <button className="btn btn-primary" type="submit" disabled={isSending}>
          {isSending ? 'Sending...' : 'Send Message'}
        </button>

        {status && (
          <p className={status.type === 'success' ? 'form-success' : 'form-error'} role="status" aria-live="polite">
            {status.message}
          </p>
        )}
      </form>
    </div>
  );
};

export default Contact;
