import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useProfile } from '../../hooks/useFirestore';
import LoadingSkeleton from '../../components/LoadingSkeleton';
import { fadeUp, staggerContainer } from '../../utils/animations';
import { validateProfileForm, hasErrors, type ProfileFormErrors } from '../../utils/validators';
import type { ProfileFormData } from '../../firebase/models';

const ProfileSettings: React.FC = () => {
  const { profile, loading, updateProfile } = useProfile();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  const [formData, setFormData] = useState<ProfileFormData>({
    name: '',
    title: '',
    bio: '',
    profileImage: '',
    email: '',
    location: '',
    university: '',
    department: '',
    hometown: '',
    resumeUrl: '',
    socialLinks: {
      github: '',
      linkedin: '',
      email: ''
    }
  });

  const [errors, setErrors] = useState<ProfileFormErrors & { submit?: string }>({
    name: '',
    title: '',
    bio: '',
    email: '',
    location: '',
    university: ''
  });

  // Initialize form with profile data when loaded
  useEffect(() => {
    if (profile) {
      setFormData({
        name: profile.name || '',
        title: profile.title || '',
        bio: profile.bio || '',
        profileImage: profile.profileImage || '',
        email: profile.email || '',
        location: profile.location || '',
        university: profile.university || '',
        department: profile.department || '',
        hometown: profile.hometown || '',
        resumeUrl: profile.resumeUrl || '',
        socialLinks: {
          github: profile.socialLinks?.github || '',
          linkedin: profile.socialLinks?.linkedin || '',
          email: profile.socialLinks?.email || ''
        }
      });
    }
  }, [profile]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    if (name.startsWith('social.')) {
      const socialField = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        socialLinks: {
          ...prev.socialLinks,
          [socialField]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }

    // Clear error when user starts typing
    if (errors[name as keyof typeof errors]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSocialLinkChange = (field: keyof typeof formData.socialLinks, value: string) => {
    setFormData(prev => ({
      ...prev,
      socialLinks: {
        ...prev.socialLinks,
        [field]: value
      }
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const validationErrors = validateProfileForm(formData);
    setErrors(validationErrors);
    
    // Convert ProfileFormErrors to Record<string, string> for hasErrors function
    const errorRecord: Record<string, string> = {
      name: validationErrors.name,
      title: validationErrors.title,
      bio: validationErrors.bio,
      email: validationErrors.email,
      location: validationErrors.location,
      university: validationErrors.university
    };
    
    if (!hasErrors(errorRecord)) {
      setIsSubmitting(true);
      try {
        if (profile?.id) {
          await updateProfile(profile.id, formData);
          setIsSaved(true);
          setTimeout(() => setIsSaved(false), 3000);
        }
      } catch (error) {
        console.error('Error updating profile:', error);
        setErrors(prev => ({
          ...prev,
          submit: 'Failed to update profile. Please try again.'
        }));
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  if (loading && !profile) {
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="max-w-4xl mx-auto">
          <LoadingSkeleton type="card" count={3} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-heading font-bold text-text-dark">
                Profile Settings
              </h1>
              <p className="text-text-light">
                Update your personal information and social links
              </p>
            </div>
            {isSaved && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-green-100 text-green-800 px-4 py-2 rounded-2xl font-medium"
              >
                ✅ Profile updated successfully!
              </motion.div>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-6">
        <motion.form
          variants={staggerContainer}
          initial="initial"
          animate="animate"
          onSubmit={handleSubmit}
          className="space-y-8"
        >
          {/* Personal Information */}
          <motion.div variants={fadeUp}>
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
              <h2 className="text-2xl font-heading font-bold mb-6 text-text-dark">
                Personal Information
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Full Name Input */}
                <div className="flex flex-col space-y-2">
                  <label className="text-sm font-medium text-text-dark">
                    Full Name <span className="text-primary">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Muhammad Ahmar Saleem"
                    required={true}
                    className={`px-4 py-3 border rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-300 ${
                      errors.name ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors.name && (
                    <p className="text-red-500 text-sm">{errors.name}</p>
                  )}
                </div>

                {/* Professional Title Input */}
                <div className="flex flex-col space-y-2">
                  <label className="text-sm font-medium text-text-dark">
                    Professional Title <span className="text-primary">*</span>
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    placeholder="Flutter Developer | Software Engineering Student"
                    required={true}
                    className={`px-4 py-3 border rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-300 ${
                      errors.title ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors.title && (
                    <p className="text-red-500 text-sm">{errors.title}</p>
                  )}
                </div>

                {/* Email Input */}
                <div className="flex flex-col space-y-2">
                  <label className="text-sm font-medium text-text-dark">
                    Email Address <span className="text-primary">*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="ahmar@example.com"
                    required={true}
                    className={`px-4 py-3 border rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-300 ${
                      errors.email ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors.email && (
                    <p className="text-red-500 text-sm">{errors.email}</p>
                  )}
                </div>

                {/* Profile Image URL Input */}
                <div className="flex flex-col space-y-2">
                  <label className="text-sm font-medium text-text-dark">
                    Profile Image URL
                  </label>
                  <input
                    type="url"
                    name="profileImage"
                    value={formData.profileImage}
                    onChange={handleInputChange}
                    placeholder="https://example.com/profile.jpg"
                    className="px-4 py-3 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-300"
                  />
                </div>

                {/* Location Input */}
                <div className="flex flex-col space-y-2">
                  <label className="text-sm font-medium text-text-dark">
                    Location <span className="text-primary">*</span>
                  </label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    placeholder="Okara, Punjab, Pakistan"
                    required={true}
                    className={`px-4 py-3 border rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-300 ${
                      errors.location ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors.location && (
                    <p className="text-red-500 text-sm">{errors.location}</p>
                  )}
                </div>

                {/* Hometown Input */}
                <div className="flex flex-col space-y-2">
                  <label className="text-sm font-medium text-text-dark">
                    Hometown
                  </label>
                  <input
                    type="text"
                    name="hometown"
                    value={formData.hometown}
                    onChange={handleInputChange}
                    placeholder="Okara, Punjab, Pakistan"
                    className="px-4 py-3 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-300"
                  />
                </div>
              </div>
            </div>
          </motion.div>

          {/* Education Information */}
          <motion.div variants={fadeUp}>
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
              <h2 className="text-2xl font-heading font-bold mb-6 text-text-dark">
                Education Information
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* University Input */}
                <div className="flex flex-col space-y-2">
                  <label className="text-sm font-medium text-text-dark">
                    University <span className="text-primary">*</span>
                  </label>
                  <input
                    type="text"
                    name="university"
                    value={formData.university}
                    onChange={handleInputChange}
                    placeholder="University of Engineering & Technology (UET), Lahore"
                    required={true}
                    className={`px-4 py-3 border rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-300 ${
                      errors.university ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors.university && (
                    <p className="text-red-500 text-sm">{errors.university}</p>
                  )}
                </div>

                {/* Department Input */}
                <div className="flex flex-col space-y-2">
                  <label className="text-sm font-medium text-text-dark">
                    Department
                  </label>
                  <input
                    type="text"
                    name="department"
                    value={formData.department}
                    onChange={handleInputChange}
                    placeholder="Software Engineering"
                    className="px-4 py-3 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-300"
                  />
                </div>

                {/* Resume URL Input */}
                <div className="flex flex-col space-y-2 md:col-span-2">
                  <label className="text-sm font-medium text-text-dark">
                    Resume URL
                  </label>
                  <input
                    type="url"
                    name="resumeUrl"
                    value={formData.resumeUrl}
                    onChange={handleInputChange}
                    placeholder="https://example.com/resume.pdf"
                    className="px-4 py-3 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-300"
                  />
                </div>
              </div>
            </div>
          </motion.div>

          {/* Biography */}
          <motion.div variants={fadeUp}>
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
              <h2 className="text-2xl font-heading font-bold mb-6 text-text-dark">
                Biography
              </h2>
              
              <div className="flex flex-col space-y-2">
                <label className="text-sm font-medium text-text-dark">
                  About Me <span className="text-primary">*</span>
                </label>
                <textarea
                  name="bio"
                  value={formData.bio}
                  onChange={handleInputChange}
                  placeholder="Write a detailed bio about yourself, your journey, and your aspirations..."
                  required={true}
                  rows={8}
                  className={`px-4 py-3 border rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-300 resize-none ${
                    errors.bio ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.bio && (
                  <p className="text-red-500 text-sm">{errors.bio}</p>
                )}
              </div>
            </div>
          </motion.div>

          {/* Social Links */}
          <motion.div variants={fadeUp}>
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
              <h2 className="text-2xl font-heading font-bold mb-6 text-text-dark">
                Social Links
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* GitHub URL Input */}
                <div className="flex flex-col space-y-2">
                  <label className="text-sm font-medium text-text-dark">
                    GitHub URL
                  </label>
                  <input
                    type="url"
                    value={formData.socialLinks.github}
                    onChange={(e) => handleSocialLinkChange('github', e.target.value)}
                    placeholder="https://github.com/username"
                    className="px-4 py-3 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-300"
                  />
                </div>

                {/* LinkedIn URL Input */}
                <div className="flex flex-col space-y-2">
                  <label className="text-sm font-medium text-text-dark">
                    LinkedIn URL
                  </label>
                  <input
                    type="url"
                    value={formData.socialLinks.linkedin}
                    onChange={(e) => handleSocialLinkChange('linkedin', e.target.value)}
                    placeholder="https://linkedin.com/in/username"
                    className="px-4 py-3 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-300"
                  />
                </div>

                {/* Email Link Input */}
                <div className="flex flex-col space-y-2 md:col-span-2">
                  <label className="text-sm font-medium text-text-dark">
                    Email Link
                  </label>
                  <input
                    type="url"
                    value={formData.socialLinks.email}
                    onChange={(e) => handleSocialLinkChange('email', e.target.value)}
                    placeholder="mailto:ahmar@example.com"
                    className="px-4 py-3 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-300"
                  />
                </div>
              </div>
            </div>
          </motion.div>

          {/* Error Display */}
          {errors.submit && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 bg-red-50 border border-red-200 rounded-2xl text-red-600 text-sm"
            >
              {errors.submit}
            </motion.div>
          )}

          {/* Profile Preview */}
          <motion.div variants={fadeUp}>
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
              <h2 className="text-2xl font-heading font-bold mb-6 text-text-dark">
                Profile Preview
              </h2>
              
              <div className="bg-gray-50 rounded-2xl p-6">
                <div className="flex items-start space-x-6">
                  <img
                    src={formData.profileImage || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=200&h=200&q=80"}
                    alt="Profile Preview"
                    className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-lg"
                  />
                  <div className="flex-1">
                    <h3 className="text-2xl font-heading font-bold text-text-dark mb-2">
                      {formData.name || 'Your Name'}
                    </h3>
                    <p className="text-primary text-lg mb-3">
                      {formData.title || 'Your Title'}
                    </p>
                    <p className="text-text-light text-sm mb-4 line-clamp-3">
                      {formData.bio || 'Your bio will appear here...'}
                    </p>
                    <div className="flex flex-wrap gap-4 text-sm text-text-light">
                      <span>📍 {formData.location || 'Your location'}</span>
                      <span>🎓 {formData.university || 'Your university'}</span>
                      <span>🏠 {formData.hometown || 'Your hometown'}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Action Buttons */}
          <motion.div variants={fadeUp} className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="px-6 py-3 border-2 border-primary text-primary rounded-2xl font-medium transition-all duration-300 hover:bg-primary hover:text-white focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-50"
            >
              Reset Changes
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-8 py-3 bg-primary text-white rounded-2xl font-medium transition-all duration-300 hover:shadow-lg hover:scale-105 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <div className="flex items-center">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  Updating Profile...
                </div>
              ) : (
                'Save Changes'
              )}
            </button>
          </motion.div>
        </motion.form>
      </div>
    </div>
  );
};

export default ProfileSettings;