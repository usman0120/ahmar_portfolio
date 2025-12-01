/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../../hooks/useAuth';
import { staggerContainer } from '../../utils/animations';

const Settings: React.FC = () => {
  const { user, logout, resetPassword } = useAuth();
  const [activeTab, setActiveTab] = useState<'account' | 'security' | 'preferences'>('account');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Account Settings
  const [accountData, setAccountData] = useState({
    displayName: '',
    email: user?.email || '',
    photoURL: ''
  });

  // Security Settings
  const [securityData, setSecurityData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  // Preferences
  const [preferences, setPreferences] = useState({
    emailNotifications: true,
    projectNotifications: true,
    messageNotifications: true,
    darkMode: false
  });

  // Custom Input Component
  const InputField: React.FC<{
    label: string;
    type: 'text' | 'email' | 'password' | 'url';
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    placeholder?: string;
    required?: boolean;
    disabled?: boolean;
    error?: string;
    className?: string;
  }> = ({ label, type, value, onChange, placeholder, required = false, disabled = false, error, className = '' }) => {
    return (
      <div className={`flex flex-col space-y-2 ${className}`}>
        <label className="text-sm font-medium text-text-dark">
          {label} {required && <span className="text-primary">*</span>}
        </label>
        <input
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          disabled={disabled}
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
            disabled:bg-gray-100
            disabled:cursor-not-allowed
            ${error ? 'border-red-500 focus:ring-red-500' : ''}
          `}
        />
        {error && (
          <p className="text-red-500 text-sm">{error}</p>
        )}
      </div>
    );
  };

  // Custom Button Component
  const Button: React.FC<{
    type?: 'button' | 'submit' | 'reset';
    variant?: 'primary' | 'secondary' | 'outline' | 'danger';
    size?: 'sm' | 'md' | 'lg';
    onClick?: () => void;
    disabled?: boolean;
    children: React.ReactNode;
    className?: string;
  }> = ({ 
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
      outline: 'border-2 border-primary text-primary bg-transparent hover:bg-primary hover:text-white focus:ring-primary focus:ring-opacity-50',
      danger: 'bg-red-500 text-white hover:shadow-lg hover:scale-105 focus:ring-red-500 focus:ring-opacity-50'
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

  // Custom Card Component
  const Card: React.FC<{
    children: React.ReactNode;
    className?: string;
    hover?: boolean;
  }> = ({ 
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
  };

  // Custom Checkbox Component
  const Checkbox: React.FC<{
    label: string;
    checked: boolean;
    onChange: (checked: boolean) => void;
    description?: string;
  }> = ({ label, checked, onChange, description }) => {
    return (
      <div className="flex items-start space-x-3">
        <div className="flex items-center h-5">
          <input
            type="checkbox"
            checked={checked}
            onChange={(e) => onChange(e.target.checked)}
            className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary focus:ring-2"
          />
        </div>
        <div className="flex-1">
          <label className="text-sm font-medium text-text-dark">
            {label}
          </label>
          {description && (
            <p className="text-sm text-text-light mt-1">
              {description}
            </p>
          )}
        </div>
      </div>
    );
  };

  // Handle account update
  const handleAccountUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      // In a real app, you would update the user profile here
      // For now, simulate a successful update
      await new Promise(resolve => setTimeout(resolve, 1000));
      setSuccessMessage('Account information updated successfully!');
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      setErrorMessage('Failed to update account information. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle password reset
  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (securityData.newPassword !== securityData.confirmPassword) {
      setErrorMessage('New passwords do not match.');
      return;
    }

    if (securityData.newPassword.length < 6) {
      setErrorMessage('Password must be at least 6 characters long.');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      await resetPassword(user?.email || '');
      setSuccessMessage('Password reset email sent! Check your inbox for instructions.');
      
      // Clear form
      setSecurityData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });

      // Clear success message after 5 seconds
      setTimeout(() => setSuccessMessage(''), 5000);
    } catch (error) {
      setErrorMessage('Failed to reset password. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle preferences update
  const handlePreferencesUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      // Save preferences to localStorage
      localStorage.setItem('admin_preferences', JSON.stringify(preferences));
      
      // Apply dark mode if enabled
      if (preferences.darkMode) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }

      setSuccessMessage('Preferences updated successfully!');
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      setErrorMessage('Failed to update preferences. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Load preferences from localStorage on mount
  useEffect(() => {
    const savedPreferences = localStorage.getItem('admin_preferences');
    if (savedPreferences) {
      try {
        setPreferences(JSON.parse(savedPreferences));
        
        // Apply dark mode if saved
        if (JSON.parse(savedPreferences).darkMode) {
          document.documentElement.classList.add('dark');
        }
      } catch (error) {
        console.error('Error loading preferences:', error);
      }
    }
  }, []);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-heading font-bold text-text-dark">
                Admin Settings
              </h1>
              <p className="text-text-light">
                Manage your account, security, and preferences
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1">
            <Card className="p-6">
              <nav className="space-y-2">
                <button
                  onClick={() => setActiveTab('account')}
                  className={`w-full text-left px-4 py-3 rounded-xl transition-colors ${
                    activeTab === 'account'
                      ? 'bg-primary text-white'
                      : 'text-text-dark hover:bg-gray-100'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    <span>Account</span>
                  </div>
                </button>

                <button
                  onClick={() => setActiveTab('security')}
                  className={`w-full text-left px-4 py-3 rounded-xl transition-colors ${
                    activeTab === 'security'
                      ? 'bg-primary text-white'
                      : 'text-text-dark hover:bg-gray-100'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                    <span>Security</span>
                  </div>
                </button>

                <button
                  onClick={() => setActiveTab('preferences')}
                  className={`w-full text-left px-4 py-3 rounded-xl transition-colors ${
                    activeTab === 'preferences'
                      ? 'bg-primary text-white'
                      : 'text-text-dark hover:bg-gray-100'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span>Preferences</span>
                  </div>
                </button>
              </nav>

              {/* Current User Info */}
              <div className="mt-8 pt-8 border-t border-gray-200">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-primary bg-opacity-10 rounded-xl flex items-center justify-center">
                    <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-semibold text-text-dark">Admin</h4>
                    <p className="text-sm text-text-light truncate">{user?.email}</p>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Success/Error Messages */}
            {successMessage && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6 p-4 bg-green-50 border border-green-200 rounded-2xl text-green-600 text-sm"
              >
                {successMessage}
              </motion.div>
            )}

            {errorMessage && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6 p-4 bg-red-50 border border-red-200 rounded-2xl text-red-600 text-sm"
              >
                {errorMessage}
              </motion.div>
            )}

            {/* Account Settings */}
            {activeTab === 'account' && (
              <motion.div
                variants={staggerContainer}
                initial="initial"
                animate="animate"
              >
                <Card className="p-8">
                  <h2 className="text-2xl font-heading font-bold mb-6 text-text-dark">
                    Account Settings
                  </h2>
                  
                  <form onSubmit={handleAccountUpdate} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <InputField
                        label="Display Name"
                        type="text"
                        value={accountData.displayName}
                        onChange={(e) => setAccountData({...accountData, displayName: e.target.value})}
                        placeholder="Enter your display name"
                      />

                      <InputField
                        label="Email Address"
                        type="email"
                        value={accountData.email}
                        onChange={(e) => setAccountData({...accountData, email: e.target.value})}
                        placeholder="Enter your email"
                        required
                        disabled
                      />

                      <InputField
                        label="Profile Photo URL"
                        type="url"
                        value={accountData.photoURL}
                        onChange={(e) => setAccountData({...accountData, photoURL: e.target.value})}
                        placeholder="https://example.com/photo.jpg"
                        className="md:col-span-2"
                      />
                    </div>

                    <div className="flex justify-end pt-4">
                      <Button
                        type="submit"
                        variant="primary"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? (
                          <div className="flex items-center">
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                            Updating...
                          </div>
                        ) : (
                          'Update Account'
                        )}
                      </Button>
                    </div>
                  </form>
                </Card>
              </motion.div>
            )}

            {/* Security Settings */}
            {activeTab === 'security' && (
              <motion.div
                variants={staggerContainer}
                initial="initial"
                animate="animate"
              >
                <Card className="p-8">
                  <h2 className="text-2xl font-heading font-bold mb-6 text-text-dark">
                    Security Settings
                  </h2>
                  
                  <form onSubmit={handlePasswordReset} className="space-y-6">
                    <div className="space-y-4">
                      <InputField
                        label="Current Password"
                        type="password"
                        value={securityData.currentPassword}
                        onChange={(e) => setSecurityData({...securityData, currentPassword: e.target.value})}
                        placeholder="Enter current password"
                      />

                      <InputField
                        label="New Password"
                        type="password"
                        value={securityData.newPassword}
                        onChange={(e) => setSecurityData({...securityData, newPassword: e.target.value})}
                        placeholder="Enter new password"
                        required
                      />

                      <InputField
                        label="Confirm New Password"
                        type="password"
                        value={securityData.confirmPassword}
                        onChange={(e) => setSecurityData({...securityData, confirmPassword: e.target.value})}
                        placeholder="Confirm new password"
                        required
                      />
                    </div>

                    <div className="flex justify-between items-center pt-4">
                      <div>
                        <p className="text-sm text-text-light">
                          Password must be at least 6 characters long
                        </p>
                      </div>
                      <Button
                        type="submit"
                        variant="primary"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? (
                          <div className="flex items-center">
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                            Updating...
                          </div>
                        ) : (
                          'Change Password'
                        )}
                      </Button>
                    </div>
                  </form>

                  {/* Password Reset Section */}
                  <div className="mt-8 pt-8 border-t border-gray-200">
                    <h3 className="text-lg font-heading font-semibold mb-4 text-text-dark">
                      Reset Password via Email
                    </h3>
                    <p className="text-text-light mb-4">
                      Can't remember your password? We'll send you a reset link to your email.
                    </p>
                    <Button
                      variant="outline"
                      onClick={() => resetPassword(user?.email || '')}
                    >
                      Send Password Reset Email
                    </Button>
                  </div>

                  {/* Logout Section */}
                  <div className="mt-8 pt-8 border-t border-gray-200">
                    <h3 className="text-lg font-heading font-semibold mb-4 text-text-dark">
                      Session Management
                    </h3>
                    <p className="text-text-light mb-4">
                      Log out from your current session. You'll need to log in again to access the admin dashboard.
                    </p>
                    <Button
                      variant="danger"
                      onClick={logout}
                    >
                      Log Out
                    </Button>
                  </div>
                </Card>
              </motion.div>
            )}

            {/* Preferences */}
            {activeTab === 'preferences' && (
              <motion.div
                variants={staggerContainer}
                initial="initial"
                animate="animate"
              >
                <Card className="p-8">
                  <h2 className="text-2xl font-heading font-bold mb-6 text-text-dark">
                    Preferences
                  </h2>
                  
                  <form onSubmit={handlePreferencesUpdate} className="space-y-8">
                    {/* Notification Settings */}
                    <div>
                      <h3 className="text-lg font-heading font-semibold mb-4 text-text-dark">
                        Notifications
                      </h3>
                      <div className="space-y-4">
                        <Checkbox
                          label="Email Notifications"
                          checked={preferences.emailNotifications}
                          onChange={(checked) => setPreferences({...preferences, emailNotifications: checked})}
                          description="Receive email notifications for important updates"
                        />

                        <Checkbox
                          label="Project Updates"
                          checked={preferences.projectNotifications}
                          onChange={(checked) => setPreferences({...preferences, projectNotifications: checked})}
                          description="Get notified when projects are added or updated"
                        />

                        <Checkbox
                          label="New Messages"
                          checked={preferences.messageNotifications}
                          onChange={(checked) => setPreferences({...preferences, messageNotifications: checked})}
                          description="Receive notifications for new contact form messages"
                        />
                      </div>
                    </div>

                    {/* Display Settings */}
                    <div>
                      <h3 className="text-lg font-heading font-semibold mb-4 text-text-dark">
                        Display
                      </h3>
                      <div className="space-y-4">
                        <Checkbox
                          label="Dark Mode"
                          checked={preferences.darkMode}
                          onChange={(checked) => setPreferences({...preferences, darkMode: checked})}
                          description="Switch to dark theme for better night viewing"
                        />
                      </div>
                    </div>

                    <div className="flex justify-end pt-4">
                      <Button
                        type="submit"
                        variant="primary"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? (
                          <div className="flex items-center">
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                            Saving...
                          </div>
                        ) : (
                          'Save Preferences'
                        )}
                      </Button>
                    </div>
                  </form>
                </Card>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;