import React, { useState, useEffect, useRef } from 'react';
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
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

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
      
      // Set image preview if profileImage is a Base64 string
      if (profile.profileImage && profile.profileImage.startsWith('data:image')) {
        setImagePreview(profile.profileImage);
      }
    }
  }, [profile]);

  // Function to convert image to Base64
  const convertImageToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onloadstart = () => {
        setIsUploading(true);
        setUploadProgress(10);
      };
      
      reader.onprogress = (event) => {
        if (event.lengthComputable) {
          const progress = (event.loaded / event.total) * 100;
          setUploadProgress(progress);
        }
      };
      
      reader.onload = () => {
        const base64String = reader.result as string;
        setUploadProgress(100);
        setTimeout(() => {
          setIsUploading(false);
          setUploadProgress(0);
        }, 500);
        resolve(base64String);
      };
      
      reader.onerror = (error) => {
        setIsUploading(false);
        setUploadProgress(0);
        reject(error);
      };
      
      reader.readAsDataURL(file);
    });
  };

  // Handle image upload
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    const validImageTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!validImageTypes.includes(file.type)) {
      alert('Please upload a valid image file (JPEG, PNG, GIF, or WebP)');
      return;
    }

    // Validate file size (max 2MB)
    const maxSize = 2 * 1024 * 1024; // 2MB in bytes
    if (file.size > maxSize) {
      alert('Image size should be less than 2MB');
      return;
    }

    try {
      const base64Image = await convertImageToBase64(file);
      
      // Update form data with Base64 image
      setFormData(prev => ({
        ...prev,
        profileImage: base64Image
      }));
      
      // Set preview
      setImagePreview(base64Image);
      
    } catch (error) {
      console.error('Error converting image to Base64:', error);
      alert('Failed to upload image. Please try again.');
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  // Handle remove image
  const handleRemoveImage = () => {
    setFormData(prev => ({
      ...prev,
      profileImage: ''
    }));
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Handle input change
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
          {/* Profile Image Upload Section */}
          <motion.div variants={fadeUp}>
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
              <h2 className="text-2xl font-heading font-bold mb-6 text-text-dark">
                Profile Image
              </h2>
              
              <div className="flex flex-col items-center space-y-6">
                {/* Image Preview */}
                <div className="relative">
                  <div className="w-48 h-48 rounded-full border-4 border-white shadow-lg overflow-hidden bg-gray-100">
                    {imagePreview ? (
                      <img
                        src={imagePreview}
                        alt="Profile Preview"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                      </div>
                    )}
                  </div>
                  
                  {/* Remove button */}
                  {imagePreview && (
                    <button
                      type="button"
                      onClick={handleRemoveImage}
                      className="absolute -top-2 -right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  )}
                </div>

                {/* Upload Controls */}
                <div className="w-full max-w-md space-y-4">
                  {/* Hidden file input */}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    id="profile-image-upload"
                  />
                  
                  {/* Upload button */}
                  <label
                    htmlFor="profile-image-upload"
                    className="block w-full px-4 py-3 bg-primary text-white rounded-2xl font-medium text-center cursor-pointer hover:bg-opacity-90 transition-colors"
                  >
                    {isUploading ? 'Uploading...' : 'Upload New Profile Image'}
                  </label>
                  
                  {/* Upload progress */}
                  {isUploading && (
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-green-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${uploadProgress}%` }}
                      />
                    </div>
                  )}
                  
                  {/* Instructions */}
                  <div className="text-center text-sm text-text-light space-y-1">
                    <p>• Click above to upload a new profile image</p>
                    <p>• Supported formats: JPEG, PNG, GIF, WebP</p>
                    <p>• Max file size: 2MB</p>
                    <p>• Image will be converted to Base64 and stored in database</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

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

                {/* Profile Image URL Input (Fallback) */}
                <div className="flex flex-col space-y-2">
                  <label className="text-sm font-medium text-text-dark">
                    Profile Image URL (Alternative)
                  </label>
                  <input
                    type="url"
                    name="profileImage"
                    value={formData.profileImage}
                    onChange={handleInputChange}
                    placeholder="https://example.com/profile.jpg"
                    className="px-4 py-3 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-300"
                  />
                  <p className="text-xs text-text-light">
                    Use this if you prefer URL instead of upload
                  </p>
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
                    src={imagePreview || formData.profileImage || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=200&h=200&q=80"}
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
              disabled={isSubmitting || isUploading}
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