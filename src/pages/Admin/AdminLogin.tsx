import React, { useState, useEffect, useCallback, memo } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../../hooks/useAuth';
import { useNavigate, useLocation } from 'react-router-dom';
import { validateLoginForm, hasErrors, type LoginFormErrors } from '../../utils/validators';
import { fadeUp, scale } from '../../utils/animations';

// Custom Input Component - MOVED OUTSIDE
const InputField: React.FC<{
  name: string;
  label: string;
  type: 'text' | 'email' | 'password';
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder: string;
  required: boolean;
  error?: string;
}> = memo(({ name, label, type, value, onChange, placeholder, required, error }) => {
  return (
    <div className="flex flex-col space-y-2">
      <label className="text-sm font-medium text-text-dark">
        {label} {required && <span className="text-primary">*</span>}
      </label>
      <input
        name={name}
        type={type}
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
});

InputField.displayName = 'InputField';

// Custom Button Component - MOVED OUTSIDE
const Button: React.FC<{
  type?: 'button' | 'submit' | 'reset';
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  onClick?: () => void;
  disabled?: boolean;
  children: React.ReactNode;
  className?: string;
}> = memo(({ 
  type = 'button', 
  variant = 'primary', 
  size = 'md', 
  onClick, 
  disabled = false, 
  children, 
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
});

Button.displayName = 'Button';

// Custom Card Component - MOVED OUTSIDE
const Card: React.FC<{
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
}> = memo(({ 
  children, 
  className = '', 
  hover = false 
}) => {
  const baseClasses = 'rounded-2xl shadow-lg bg-white border border-gray-100';
  const hoverClasses = hover ? 'transition-transform duration-300 hover:-translate-y-2 hover:shadow-xl' : '';

  const classes = `${baseClasses} ${hoverClasses} ${className}`;

  return (
    <motion.div
      className={classes}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {children}
    </motion.div>
  );
});

Card.displayName = 'Card';

const AdminLogin: React.FC = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState<LoginFormErrors & { submit?: string }>({
    email: '',
    password: '',
    submit: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { login, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  const from = (location.state as { from?: { pathname: string } })?.from?.pathname || '/admin/dashboard';

  useEffect(() => {
    if (user) {
      navigate(from, { replace: true });
    }
  }, [user, navigate, from]);

  // Use useCallback to memoize the handler
  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    setErrors(prev => ({
      ...prev,
      [name]: ''
    }));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const validationErrors = validateLoginForm(formData);
    setErrors(prev => ({
      ...validationErrors,
      submit: prev.submit
    }));
    
    // Convert LoginFormErrors to Record<string, string> for hasErrors function
    const errorRecord: Record<string, string> = {
      email: validationErrors.email,
      password: validationErrors.password
    };
    
    if (!hasErrors(errorRecord)) {
      setIsSubmitting(true);
      setErrors(prev => ({ ...prev, submit: '' }));
      
      try {
        await login(formData.email, formData.password);
        navigate(from, { replace: true });
      } catch (error: unknown) {
        console.error('Login error:', error);
        const errorMessage = error instanceof Error ? error.message : 'Failed to login. Please check your credentials.';
        setErrors(prev => ({
          ...prev,
          submit: errorMessage
        }));
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md"
      >
        <Card className="p-8" hover>
          {/* Header */}
          <motion.div
            variants={fadeUp}
            initial="initial"
            animate="animate"
            className="text-center mb-8"
          >
            <div className="w-16 h-16 bg-primary bg-opacity-10 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h1 className="text-3xl font-heading font-bold text-text-dark mb-2">
              Admin Login
            </h1>
            <p className="text-text-light">
              Access your portfolio dashboard
            </p>
          </motion.div>

          {/* Login Form */}
          <motion.form
            variants={scale}
            initial="initial"
            animate="animate"
            onSubmit={handleSubmit}
            className="space-y-6"
          >
            <InputField
              name="email"
              label="Email Address"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="Enter your admin email"
              required={true}
              error={errors.email}
            />

            <InputField
              name="password"
              label="Password"
              type="password"
              value={formData.password}
              onChange={handleInputChange}
              placeholder="Enter your password"
              required={true}
              error={errors.password}
            />

            {errors.submit && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 bg-red-50 border border-red-200 rounded-2xl text-red-600 text-sm"
              >
                {errors.submit}
              </motion.div>
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
                  Signing In...
                </div>
              ) : (
                'Sign In to Dashboard'
              )}
            </Button>
          </motion.form>

          {/* Back to Site Link */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="text-center mt-6"
          >
            <a
              href="/"
              className="text-primary hover:text-accent transition-colors font-medium"
            >
              ← Back to Main Site
            </a>
          </motion.div>
        </Card>
      </motion.div>
    </div>
  );
};

export default AdminLogin;