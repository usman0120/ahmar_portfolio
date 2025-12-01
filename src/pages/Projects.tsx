import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useProjects } from '../hooks/useFirestore';
import LoadingSkeleton from '../components/LoadingSkeleton';
import { staggerContainer, scale } from '../utils/animations';

// Define Project interface
interface Project {
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

// Custom Button Component - MOVED OUTSIDE
const CustomButton: React.FC<{
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  onClick?: () => void;
  href?: string;
  className?: string;
}> = ({ children, variant = 'primary', size = 'md', onClick, href, className = '' }) => {
  const baseClasses = 'rounded-2xl font-medium transition-all duration-300 focus:outline-none focus:ring-2';
  
  const variantClasses = {
    primary: 'bg-primary text-white hover:shadow-lg hover:scale-105 focus:ring-primary focus:ring-opacity-50',
    secondary: 'bg-secondary text-text-dark hover:shadow-lg hover:scale-105 focus:ring-secondary focus:ring-opacity-50',
    outline: 'border-2 border-white text-white bg-transparent hover:bg-white hover:text-primary focus:ring-white focus:ring-opacity-50'
  };

  const sizeClasses = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg'
  };

  const classes = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`;

  const buttonContent = (
    <motion.button
      className={classes}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
      onClick={onClick}
    >
      {children}
    </motion.button>
  );

  if (href) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer">
        {buttonContent}
      </a>
    );
  }

  return buttonContent;
};

// Custom Card Component - MOVED OUTSIDE
const CustomCard: React.FC<{
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  onClick?: () => void;
}> = ({ children, className = '', hover = false, onClick }) => {
  const baseClasses = 'rounded-2xl shadow-lg bg-white border border-gray-100';
  const hoverClasses = hover ? 'transition-transform duration-300 hover:-translate-y-2 hover:shadow-xl' : '';

  const classes = `${baseClasses} ${hoverClasses} ${className}`;

  return (
    <motion.div
      className={classes}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      onClick={onClick}
    >
      {children}
    </motion.div>
  );
};

// Project Card Component - MOVED OUTSIDE
const ProjectCard: React.FC<{ 
  project: Project; 
  index: number;
  onFilterChange: (filter: string) => void;
}> = ({ project, index, onFilterChange }) => {
  return (
    <motion.div
      variants={scale}
      transition={{ delay: index * 0.1 }}
      className="h-full"
    >
      <CustomCard className="h-full flex flex-col overflow-hidden group" hover>
        {/* Project Image */}
        <div className="relative overflow-hidden">
          <motion.img
            src={project.imageUrl}
            alt={project.title}
            className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-110"
            whileHover={{ scale: 1.05 }}
          />
          {project.featured && (
            <div className="absolute top-4 right-4">
              <span className="bg-primary text-white px-3 py-1 rounded-full text-sm font-medium">
                Featured
              </span>
            </div>
          )}
        </div>

        {/* Project Content */}
        <div className="p-6 flex-1 flex flex-col">
          <h3 className="text-xl font-heading font-bold mb-3 text-text-dark group-hover:text-primary transition-colors">
            {project.title}
          </h3>
          
          <p className="text-text-light mb-4 flex-1 leading-relaxed">
            {project.description}
          </p>

          {/* Tech Stack */}
          <div className="mb-4">
            <div className="flex flex-wrap gap-2">
              {project.techStack.map((tech: string, techIndex: number) => (
                <span
                  key={techIndex}
                  className="px-3 py-1 bg-secondary text-text-dark rounded-full text-sm font-medium cursor-pointer hover:bg-primary hover:text-white transition-colors"
                  onClick={() => onFilterChange(tech)}
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>

          {/* Project Links */}
          <div className="flex space-x-3 mt-auto">
            <CustomButton
              variant="outline"
              size="sm"
              className="flex-1"
              href={project.githubUrl}
            >
              GitHub
            </CustomButton>
            <CustomButton
              variant="primary"
              size="sm"
              className="flex-1"
              href={project.demoUrl}
            >
              Live Demo
            </CustomButton>
          </div>
        </div>
      </CustomCard>
    </motion.div>
  );
};

const Projects: React.FC = () => {
  const { projects, loading } = useProjects();
  const [filter, setFilter] = useState('all');

  // Default projects if none in database
  const defaultProjects: Project[] = [
    {
      id: '1',
      title: 'E-Commerce Mobile App',
      description: 'A fully functional e-commerce mobile application built with Flutter and Firebase. Features include user authentication, product catalog, shopping cart, and order management.',
      techStack: ['Flutter', 'Dart', 'Firebase', 'GetX', 'REST API'],
      imageUrl: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&h=400&q=80',
      githubUrl: 'https://github.com/ahmar/ecommerce-app',
      demoUrl: 'https://example.com/demo',
      featured: true,
      createdAt: new Date('2024-01-15'),
      updatedAt: new Date('2024-01-15')
    },
    {
      id: '2',
      title: 'Weather Forecast App',
      description: 'A beautiful weather application that displays current weather and forecasts using OpenWeather API. Features location-based weather and beautiful UI animations.',
      techStack: ['Flutter', 'Dart', 'REST API', 'Provider', 'Geolocation'],
      imageUrl: 'https://images.unsplash.com/photo-1504608524841-42fe6f032b4b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&h=400&q=80',
      githubUrl: 'https://github.com/ahmar/weather-app',
      demoUrl: 'https://example.com/weather-demo',
      featured: true,
      createdAt: new Date('2024-02-01'),
      updatedAt: new Date('2024-02-01')
    },
    {
      id: '3',
      title: 'Task Management App',
      description: 'A productivity app for managing daily tasks and projects. Includes features like task categories, due dates, reminders, and progress tracking.',
      techStack: ['Flutter', 'Dart', 'SQLite', 'Provider', 'Local Storage'],
      imageUrl: 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&h=400&q=80',
      githubUrl: 'https://github.com/ahmar/task-app',
      demoUrl: 'https://example.com/task-demo',
      featured: false,
      createdAt: new Date('2024-01-20'),
      updatedAt: new Date('2024-01-20')
    },
    {
      id: '4',
      title: 'Social Media Dashboard',
      description: 'A dashboard application for managing social media accounts. Provides analytics, scheduling, and engagement metrics in a clean, modern interface.',
      techStack: ['Flutter', 'Dart', 'Firebase', 'Charts', 'REST API'],
      imageUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&h=400&q=80',
      githubUrl: 'https://github.com/ahmar/social-dashboard',
      demoUrl: 'https://example.com/social-demo',
      featured: true,
      createdAt: new Date('2024-02-10'),
      updatedAt: new Date('2024-02-10')
    },
    {
      id: '5',
      title: 'Fitness Tracker',
      description: 'A comprehensive fitness tracking application that helps users monitor workouts, set goals, and track progress over time with beautiful charts and statistics.',
      techStack: ['Flutter', 'Dart', 'Health APIs', 'Charts', 'Local Storage'],
      imageUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&h=400&q=80',
      githubUrl: 'https://github.com/ahmar/fitness-tracker',
      demoUrl: 'https://example.com/fitness-demo',
      featured: false,
      createdAt: new Date('2024-01-25'),
      updatedAt: new Date('2024-01-25')
    },
    {
      id: '6',
      title: 'Recipe Finder App',
      description: 'A recipe discovery app that suggests meals based on available ingredients. Includes step-by-step cooking instructions and nutritional information.',
      techStack: ['Flutter', 'Dart', 'Recipe API', 'Caching', 'Search'],
      imageUrl: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&h=400&q=80',
      githubUrl: 'https://github.com/ahmar/recipe-app',
      demoUrl: 'https://example.com/recipe-demo',
      featured: false,
      createdAt: new Date('2024-02-05'),
      updatedAt: new Date('2024-02-05')
    }
  ];

  const displayProjects = projects.length > 0 ? projects : defaultProjects;

  // Get all unique technologies for filtering
  const allTechnologies = Array.from(
    new Set(displayProjects.flatMap(project => project.techStack))
  );

  // Filter projects based on selected technology
  const filteredProjects = filter === 'all' 
    ? displayProjects 
    : displayProjects.filter(project => 
        project.techStack.some(tech => 
          tech.toLowerCase().includes(filter.toLowerCase())
        )
      );

  const handleFilterChange = (newFilter: string) => {
    setFilter(newFilter);
  };

  if (loading && projects.length === 0) {
    return (
      <div className="min-h-screen section-padding">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <LoadingSkeleton type="card" count={6} />
          </div>
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
          className="text-center mb-12"
        >
          <h1 className="text-5xl font-heading font-bold mb-6 text-text-dark">
            My <span className="text-gradient">Projects</span>
          </h1>
          <p className="text-xl text-text-light max-w-3xl mx-auto mb-8">
            Here are some of the projects I&apos;ve been working on. Each project represents 
            my journey in learning Flutter and mobile development.
          </p>

          {/* Filter Buttons */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="flex flex-wrap justify-center gap-3 mb-8"
          >
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-2xl font-medium transition-all duration-300 ${
                filter === 'all'
                  ? 'bg-primary text-white shadow-lg'
                  : 'bg-secondary text-text-dark hover:bg-primary hover:text-white'
              }`}
            >
              All Projects
            </button>
            {allTechnologies.slice(0, 8).map((tech) => (
              <button
                key={tech}
                onClick={() => setFilter(tech)}
                className={`px-4 py-2 rounded-2xl font-medium transition-all duration-300 ${
                  filter === tech
                    ? 'bg-primary text-white shadow-lg'
                    : 'bg-secondary text-text-dark hover:bg-primary hover:text-white'
                }`}
              >
                {tech}
              </button>
            ))}
          </motion.div>

          {/* Active Filter Indicator */}
          {filter !== 'all' && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="inline-block bg-primary bg-opacity-10 text-primary px-4 py-2 rounded-2xl mb-4"
            >
              Showing projects with: <strong>{filter}</strong>
              <button
                onClick={() => setFilter('all')}
                className="ml-2 text-primary hover:text-accent"
              >
                ×
              </button>
            </motion.div>
          )}
        </motion.div>

        {/* Projects Grid */}
        <motion.div
          variants={staggerContainer}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {filteredProjects.map((project, index) => (
            <ProjectCard
              key={project.id}
              project={project}
              index={index}
              onFilterChange={handleFilterChange}
            />
          ))}
        </motion.div>

        {/* Empty State */}
        {filteredProjects.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-16"
          >
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-2xl font-heading font-bold mb-4 text-text-dark">
              No projects found
            </h3>
            <p className="text-text-light mb-6">
              No projects match the selected filter. Try a different technology or view all projects.
            </p>
            <CustomButton
              variant="primary"
              onClick={() => setFilter('all')}
            >
              View All Projects
            </CustomButton>
          </motion.div>
        )}

        {/* Projects Summary */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-16 text-center"
        >
          <CustomCard className="p-8 bg-gradient-to-br from-primary to-accent text-white" hover>
            <h3 className="text-2xl font-heading font-bold mb-4">
              Ready to Start Your Project?
            </h3>
            <p className="text-secondary text-lg mb-6 max-w-2xl mx-auto">
              I&apos;m always excited to work on new challenges and bring ideas to life. 
              Whether you need a mobile app or have a project in mind, let&apos;s discuss how we can work together.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <CustomButton
                variant="secondary"
                size="lg"
                href="/contact"
              >
                Get In Touch
              </CustomButton>
              <CustomButton
                variant="outline"
                size="lg"
                href={displayProjects.length > 0 ? displayProjects[0].githubUrl : 'https://github.com'}
              >
                View GitHub
              </CustomButton>
            </div>
          </CustomCard>
        </motion.div>
      </div>
    </div>
  );
};

export default Projects;