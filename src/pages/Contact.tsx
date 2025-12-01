import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useProfile, useMessages } from '../hooks/useFirestore';
import LoadingSkeleton from '../components/LoadingSkeleton';
import { fadeUp, slideInLeft, slideInRight } from '../utils/animations';
import { validateContactForm, hasErrors, type ContactFormErrors } from '../utils/validators';

// Reusable Button Component
interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
  className?: string;
}

const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  onClick,
  type = 'button',
  disabled = false,
  className = ''
}) => {
  const baseClasses = 'rounded-2xl font-medium transition-all duration-300 focus:outline-none focus:ring-2';
  
  const variantClasses = {
    primary: 'bg-primary text-white hover:shadow-lg hover:scale-105 focus:ring-primary focus:ring-opacity-50',
    secondary: 'bg-secondary text-text-dark hover:shadow-lg hover:scale-105 focus:ring-secondary focus:ring-opacity-50',
    outline: 'border-2 border-primary text-primary bg-transparent hover:bg-primary hover:text-white focus:ring-primary focus:ring-opacity-50'
  };

  const sizeClasses = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg'
  };

  const classes = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className} ${
    disabled ? 'opacity-50 cursor-not-allowed' : ''
  }`;

  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={classes}
      whileHover={!disabled ? { scale: 1.05 } : {}}
      whileTap={!disabled ? { scale: 0.95 } : {}}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
    >
      {children}
    </motion.button>
  );
};

// Reusable Input Component
interface InputProps {
  label: string;
  type?: 'text' | 'email' | 'password' | 'number' | 'url';
  name: string; // Added name prop
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  required?: boolean;
  error?: string;
  className?: string;
}

const Input: React.FC<InputProps> = ({
  label,
  type = 'text',
  name,
  value,
  onChange,
  placeholder,
  required = false,
  error,
  className = ''
}) => {
  return (
    <div className={`flex flex-col space-y-2 ${className}`}>
      <label className="text-sm font-medium text-text-dark">
        {label} {required && <span className="text-primary">*</span>}
      </label>
      <input
        type={type}
        name={name} // Added name attribute
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        className={`
          w-full px-4 py-3 
          border border-gray-300 
          rounded-2xl 
          focus:outline-none 
          focus:ring-2 
          focus:ring-primary 
          focus:border-transparent 
          transition-all 
          duration-300
          bg-white
          text-text-dark
          placeholder-gray-400
          ${error ? 'border-red-500 focus:ring-red-500' : ''}
        `}
      />
      {error && (
        <p className="text-red-500 text-sm">{error}</p>
      )}
    </div>
  );
};

// Reusable Textarea Component
interface TextareaProps {
  label: string;
  name: string; // Added name prop
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  placeholder?: string;
  required?: boolean;
  rows?: number;
  error?: string;
  className?: string;
}

const Textarea: React.FC<TextareaProps> = ({
  label,
  name,
  value,
  onChange,
  placeholder,
  required = false,
  rows = 4,
  error,
  className = ''
}) => {
  return (
    <div className={`flex flex-col space-y-2 ${className}`}>
      <label className="text-sm font-medium text-text-dark">
        {label} {required && <span className="text-primary">*</span>}
      </label>
      <textarea
        name={name} // Added name attribute
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        rows={rows}
        className={`
          w-full px-4 py-3 
          border border-gray-300 
          rounded-2xl 
          focus:outline-none 
          focus:ring-2 
          focus:ring-primary 
          focus:border-transparent 
          transition-all 
          duration-300 
          resize-none
          bg-white
          text-text-dark
          placeholder-gray-400
          ${error ? 'border-red-500 focus:ring-red-500' : ''}
        `}
      />
      {error && (
        <p className="text-red-500 text-sm">{error}</p>
      )}
    </div>
  );
};

// Reusable Card Component
interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  glass?: boolean;
}

const Card: React.FC<CardProps> = ({ 
  children, 
  className = '', 
  hover = false,
  glass = false 
}) => {
  const baseClasses = 'rounded-2xl shadow-lg';
  
  const styleClasses = glass 
    ? 'bg-white bg-opacity-10 backdrop-blur-xs border border-white border-opacity-20'
    : 'bg-white border border-gray-100';
  
  const hoverClasses = hover ? 'transition-transform duration-300 hover:-translate-y-2 hover:shadow-xl' : '';

  const classes = `${baseClasses} ${styleClasses} ${hoverClasses} ${className}`;

  return (
    <motion.div
      className={classes}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
    >
      {children}
    </motion.div>
  );
};

// Social links component
const SocialLinks: React.FC<{ 
  socialLinks: Array<{ 
    name: string; 
    url: string; 
    icon: React.ReactNode; 
  }> 
}> = ({ socialLinks }) => (
  <div className="grid grid-cols-3 gap-4">
    {socialLinks.map((social) => (
      <motion.a
        key={social.name}
        href={social.url}
        target="_blank"
        rel="noopener noreferrer"
        variants={fadeUp}
        whileHover={{ scale: 1.05 }}
        className="flex flex-col items-center p-4 bg-secondary rounded-2xl text-center hover:bg-primary hover:text-white transition-all duration-300 group"
      >
        <div className="text-2xl mb-2 group-hover:scale-110 transition-transform">
          {social.icon}
        </div>
        <span className="font-medium text-sm">{social.name}</span>
      </motion.a>
    ))}
  </div>
);

const Contact: React.FC = () => {
  const { profile, loading: profileLoading } = useProfile();
  const { addMessage } = useMessages();
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  
  const [errors, setErrors] = useState<ContactFormErrors & { submit?: string }>({
    name: '',
    email: '',
    message: '',
    submit: ''
  });
  
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Safe profile data extraction
  const profileEmail = profile?.email || 'ahmar@example.com';
  const profileLocation = profile?.location || 'Okara, Punjab, Pakistan';
  const profileUniversity = profile?.university || 'University of Engineering & Technology (UET), Lahore';
  const profileDepartment = profile?.department || 'Software Engineering';

  const socialLinks = [
    {
      name: 'GitHub',
      url: profile?.socialLinks?.github || 'https://github.com',
      icon: (
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
        </svg>
      )
    },
    {
      name: 'LinkedIn',
      url: profile?.socialLinks?.linkedin || 'https://linkedin.com',
      icon: (
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
        </svg>
      )
    },
    {
      name: 'Email',
      url: profile?.socialLinks?.email || `mailto:${profileEmail}`,
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      )
    }
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name as keyof typeof errors]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const validationErrors = validateContactForm(formData);
    setErrors(validationErrors);
    
    // Convert ContactFormErrors to Record<string, string> for hasErrors function
    const errorRecord: Record<string, string> = {
      name: validationErrors.name,
      email: validationErrors.email,
      message: validationErrors.message
    };
    
    if (!hasErrors(errorRecord)) {
      setIsSubmitting(true);
      try {
        await addMessage(formData);
        setIsSubmitted(true);
        setFormData({ name: '', email: '', message: '' });
        setErrors({ name: '', email: '', message: '', submit: '' });
      } catch (error) {
        console.error('Error sending message:', error);
        setErrors(prev => ({
          ...prev,
          submit: 'Failed to send message. Please try again.'
        }));
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  if (profileLoading) {
    return (
      <div className="min-h-screen section-padding">
        <div className="container-custom">
          <LoadingSkeleton type="card" count={2} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen section-padding">
      <div className="container-custom">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-5xl font-heading font-bold mb-6 text-text-dark">
            Get In <span className="text-gradient">Touch</span>
          </h1>
          <p className="text-xl text-text-light max-w-3xl mx-auto">
            I&apos;m always excited to hear about new opportunities and projects. 
            Whether you have a question or want to discuss a project, feel free to reach out!
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <motion.div
            variants={slideInLeft}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            <Card className="p-8" hover>
              <h2 className="text-3xl font-heading font-bold mb-6 text-text-dark">
                Send Me a Message
              </h2>

              {isSubmitted ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-8"
                >
                  <div className="text-6xl mb-4">🎉</div>
                  <h3 className="text-2xl font-heading font-bold mb-4 text-text-dark">
                    Message Sent Successfully!
                  </h3>
                  <p className="text-text-light mb-6">
                    Thank you for reaching out. I&apos;ll get back to you as soon as possible.
                  </p>
                  <Button
                    variant="primary"
                    onClick={() => setIsSubmitted(false)}
                  >
                    Send Another Message
                  </Button>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <Input
                    label="Your Name"
                    type="text"
                    name="name" // Added name prop
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Enter your full name"
                    required={true}
                    error={errors.name}
                  />

                  <Input
                    label="Email Address"
                    type="email"
                    name="email" // Added name prop
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="Enter your email address"
                    required={true}
                    error={errors.email}
                  />

                  <Textarea
                    label="Your Message"
                    name="message" // Added name prop
                    value={formData.message}
                    onChange={handleInputChange}
                    placeholder="Tell me about your project or question..."
                    required={true}
                    rows={6}
                    error={errors.message}
                  />

                  {errors.submit && (
                    <div className="p-4 bg-red-50 border border-red-200 rounded-2xl text-red-600 text-sm">
                      {errors.submit}
                    </div>
                  )}

                  <Button
                    type="submit"
                    variant="primary"
                    size="lg"
                    disabled={isSubmitting}
                    className="w-full"
                  >
                    {isSubmitting ? (
                      <div className="flex items-center justify-center">
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                        Sending...
                      </div>
                    ) : (
                      'Send Message'
                    )}
                  </Button>
                </form>
              )}
            </Card>
          </motion.div>

          {/* Contact Information */}
          <motion.div
            variants={slideInRight}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            className="space-y-8"
          >
            {/* Contact Details Card */}
            <Card className="p-8" hover>
              <h3 className="text-2xl font-heading font-bold mb-6 text-text-dark">
                Contact Information
              </h3>
              
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-primary bg-opacity-10 rounded-2xl flex items-center justify-center text-primary">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-heading font-semibold text-text-dark mb-1">Location</h4>
                    <p className="text-text-light">{profileLocation}</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-primary bg-opacity-10 rounded-2xl flex items-center justify-center text-primary">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-heading font-semibold text-text-dark mb-1">Email</h4>
                    <a 
                      href={`mailto:${profileEmail}`}
                      className="text-text-light hover:text-primary transition-colors"
                    >
                      {profileEmail}
                    </a>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-primary bg-opacity-10 rounded-2xl flex items-center justify-center text-primary">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-heading font-semibold text-text-dark mb-1">Education</h4>
                    <p className="text-text-light">{profileUniversity}</p>
                    <p className="text-text-light text-sm">{profileDepartment}</p>
                  </div>
                </div>
              </div>
            </Card>

            {/* Social Links Card */}
            <Card className="p-8" hover>
              <h3 className="text-2xl font-heading font-bold mb-6 text-text-dark">
                Let&apos;s Connect
              </h3>
              
              <p className="text-text-light mb-6">
                Follow me on social media to stay updated with my latest projects and learning journey.
              </p>

              <SocialLinks socialLinks={socialLinks} />
            </Card>

            {/* Call to Action Card */}
            <Card className="p-8 bg-gradient-to-br from-primary to-accent text-white text-center" hover>
              <h3 className="text-2xl font-heading font-bold mb-4">
                Let&apos;s Build Something Amazing Together
              </h3>
              <p className="text-secondary mb-6">
                Ready to start your next project? I&apos;m here to help bring your ideas to life with modern mobile solutions.
              </p>
              <a href={`mailto:${profileEmail}`}>
                <Button variant="secondary" size="lg">
                  Start a Conversation
                </Button>
              </a>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Contact;