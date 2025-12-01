// Email validation
export const validateEmail = (email: string): string => {
  if (!email) {
    return 'Email is required';
  }
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return 'Please enter a valid email address';
  }
  
  return '';
};

// Required field validation
export const validateRequired = (value: string, fieldName: string): string => {
  if (!value.trim()) {
    return `${fieldName} is required`;
  }
  return '';
};

// Minimum length validation
export const validateMinLength = (value: string, minLength: number, fieldName: string): string => {
  if (value.length < minLength) {
    return `${fieldName} must be at least ${minLength} characters`;
  }
  return '';
};

// URL validation
export const validateUrl = (url: string, fieldName: string): string => {
  if (!url) {
    return `${fieldName} is required`;
  }
  
  try {
    new URL(url);
    return '';
  } catch {
    return `Please enter a valid URL for ${fieldName}`;
  }
};

// Contact form validation
export interface ContactFormErrors {
  name: string;
  email: string;
  message: string;
}

export const validateContactForm = (formData: {
  name: string;
  email: string;
  message: string;
}): ContactFormErrors => {
  const errors: ContactFormErrors = {
    name: '',
    email: '',
    message: ''
  };

  // Name validation
  errors.name = validateRequired(formData.name, 'Name');
  if (!errors.name) {
    errors.name = validateMinLength(formData.name, 2, 'Name');
  }

  // Email validation
  errors.email = validateRequired(formData.email, 'Email');
  if (!errors.email) {
    errors.email = validateEmail(formData.email);
  }

  // Message validation
  errors.message = validateRequired(formData.message, 'Message');
  if (!errors.message) {
    errors.message = validateMinLength(formData.message, 10, 'Message');
  }

  return errors;
};

// Project form validation
export interface ProjectFormErrors {
  title: string;
  description: string;
  imageUrl: string;
  githubUrl: string;
  demoUrl: string;
  techStack: string;
}

export const validateProjectForm = (formData: {
  title: string;
  description: string;
  imageUrl: string;
  githubUrl: string;
  demoUrl: string;
  techStack: string[];
}): ProjectFormErrors => {
  const errors: ProjectFormErrors = {
    title: '',
    description: '',
    imageUrl: '',
    githubUrl: '',
    demoUrl: '',
    techStack: ''
  };

  // Title validation
  errors.title = validateRequired(formData.title, 'Title');
  if (!errors.title) {
    errors.title = validateMinLength(formData.title, 3, 'Title');
  }

  // Description validation
  errors.description = validateRequired(formData.description, 'Description');
  if (!errors.description) {
    errors.description = validateMinLength(formData.description, 10, 'Description');
  }

  // Image URL validation
  errors.imageUrl = validateUrl(formData.imageUrl, 'Image URL');

  // GitHub URL validation
  errors.githubUrl = validateUrl(formData.githubUrl, 'GitHub URL');

  // Demo URL validation (optional)
  if (formData.demoUrl) {
    errors.demoUrl = validateUrl(formData.demoUrl, 'Demo URL');
  }

  // Tech stack validation
  if (!formData.techStack.length) {
    errors.techStack = 'At least one technology is required';
  }

  return errors;
};

// Skill form validation
export interface SkillFormErrors {
  name: string;
  category: string;
  icon: string;
  proficiency: string;
}

export const validateSkillForm = (formData: {
  name: string;
  category: string;
  icon: string;
  proficiency: number;
}): SkillFormErrors => {
  const errors: SkillFormErrors = {
    name: '',
    category: '',
    icon: '',
    proficiency: ''
  };

  // Name validation
  errors.name = validateRequired(formData.name, 'Skill name');
  if (!errors.name) {
    errors.name = validateMinLength(formData.name, 2, 'Skill name');
  }

  // Category validation
  errors.category = validateRequired(formData.category, 'Category');

  // Icon validation (can be empty for now, we'll use default icons)
  if (!formData.icon.trim()) {
    errors.icon = 'Icon is required';
  }

  // Proficiency validation
  if (formData.proficiency < 1 || formData.proficiency > 5) {
    errors.proficiency = 'Proficiency must be between 1 and 5';
  }

  return errors;
};

// Profile form validation
export interface ProfileFormErrors {
  name: string;
  title: string;
  bio: string;
  email: string;
  location: string;
  university: string;
}

export const validateProfileForm = (formData: {
  name: string;
  title: string;
  bio: string;
  email: string;
  location: string;
  university: string;
}): ProfileFormErrors => {
  const errors: ProfileFormErrors = {
    name: '',
    title: '',
    bio: '',
    email: '',
    location: '',
    university: ''
  };

  // Name validation
  errors.name = validateRequired(formData.name, 'Name');
  if (!errors.name) {
    errors.name = validateMinLength(formData.name, 2, 'Name');
  }

  // Title validation
  errors.title = validateRequired(formData.title, 'Title');
  if (!errors.title) {
    errors.title = validateMinLength(formData.title, 5, 'Title');
  }

  // Bio validation
  errors.bio = validateRequired(formData.bio, 'Bio');
  if (!errors.bio) {
    errors.bio = validateMinLength(formData.bio, 50, 'Bio');
  }

  // Email validation
  errors.email = validateRequired(formData.email, 'Email');
  if (!errors.email) {
    errors.email = validateEmail(formData.email);
  }

  // Location validation
  errors.location = validateRequired(formData.location, 'Location');

  // University validation
  errors.university = validateRequired(formData.university, 'University');

  return errors;
};

// Login form validation
export interface LoginFormErrors {
  email: string;
  password: string;
}

export const validateLoginForm = (formData: {
  email: string;
  password: string;
}): LoginFormErrors => {
  const errors: LoginFormErrors = {
    email: '',
    password: ''
  };

  // Email validation
  errors.email = validateRequired(formData.email, 'Email');
  if (!errors.email) {
    errors.email = validateEmail(formData.email);
  }

  // Password validation
  errors.password = validateRequired(formData.password, 'Password');
  if (!errors.password) {
    errors.password = validateMinLength(formData.password, 6, 'Password');
  }

  return errors;
};

// Helper function to check if form has errors
export const hasErrors = (errors: Record<string, string>): boolean => {
  return Object.values(errors).some(error => error !== '');
};

// Sanitize input
export const sanitizeInput = (input: string): string => {
  return input.trim().replace(/</g, '&lt;').replace(/>/g, '&gt;');
};

// Validate proficiency level
export const validateProficiency = (proficiency: number): boolean => {
  return proficiency >= 1 && proficiency <= 5;
};

// Validate category
export const validateCategory = (category: string): boolean => {
  const validCategories = ['flutter', 'programming', 'tools', 'soft'];
  return validCategories.includes(category);
};