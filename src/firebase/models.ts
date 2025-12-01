// Firebase document interfaces
export interface Project {
  id: string;
  title: string;
  description: string;
  techStack: string[];
  imageUrl: string;
  githubUrl: string;
  demoUrl: string;
  featured: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Skill {
  id: string;
  name: string;
  category: 'flutter' | 'programming' | 'tools' | 'soft';
  icon: string;
  proficiency: number; // 1-5
  featured: boolean;
}

export interface Message {
  id: string;
  name: string;
  email: string;
  message: string;
  read: boolean;
  createdAt: Date;
}

export interface Profile {
  id: string;
  name: string;
  title: string;
  bio: string;
  profileImage: string;
  email: string;
  location: string;
  university: string;
  department: string;
  hometown: string;
  resumeUrl: string;
  socialLinks: {
    github: string;
    linkedin: string;
    email: string;
  };
  education: Education[];
  goals: string[];
  experience: string[];
}

export interface Education {
  institution: string;
  degree: string;
  field: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description: string;
}

// Form data interfaces
export interface ContactFormData {
  name: string;
  email: string;
  message: string;
}

export interface ProjectFormData {
  title: string;
  description: string;
  techStack: string[];
  imageUrl: string;
  githubUrl: string;
  demoUrl: string;
  featured: boolean;
}

export interface SkillFormData {
  name: string;
  category: 'flutter' | 'programming' | 'tools' | 'soft';
  icon: string;
  proficiency: number;
  featured: boolean;
}

export interface ProfileFormData {
  name: string;
  title: string;
  bio: string;
  profileImage: string;
  email: string;
  location: string;
  university: string;
  department: string;
  hometown: string;
  resumeUrl: string;
  socialLinks: {
    github: string;
    linkedin: string;
    email: string;
  };
}

// Auth interfaces
export interface User {
  uid: string;
  email: string | null;
  displayName: string | null;
}

export interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
}

// Collection names
export const COLLECTIONS = {
  PROJECTS: 'projects',
  SKILLS: 'skills',
  MESSAGES: 'messages',
  PROFILE: 'profile'
} as const;