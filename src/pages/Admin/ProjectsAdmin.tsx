import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useProjects } from '../../hooks/useFirestore';
import Modal from '../../components/ui/Modal';
import LoadingSkeleton from '../../components/LoadingSkeleton';
import { staggerContainer, scale } from '../../utils/animations';
import { validateProjectForm, hasErrors, type ProjectFormErrors } from '../../utils/validators';
import type { ProjectFormData, Project } from '../../firebase/models';

const ProjectsAdmin: React.FC = () => {
  const { projects, loading, addProject, updateProject, deleteProject } = useProjects();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState<ProjectFormData>({
    title: '',
    description: '',
    techStack: [],
    imageUrl: '',
    githubUrl: '',
    demoUrl: '',
    featured: false
  });

  const [errors, setErrors] = useState<ProjectFormErrors & { submit?: string }>({
    title: '',
    description: '',
    imageUrl: '',
    githubUrl: '',
    demoUrl: '',
    techStack: ''
  });

  const [techInput, setTechInput] = useState('');

  // Custom Button Component
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

  // Custom Input Component
  interface InputProps {
    label: string;
    type?: 'text' | 'email' | 'password' | 'number' | 'url';
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

  // Custom Textarea Component
  interface TextareaProps {
    label: string;
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

  // Custom Card Component
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

  const openAddModal = () => {
    setEditingProject(null);
    setFormData({
      title: '',
      description: '',
      techStack: [],
      imageUrl: '',
      githubUrl: '',
      demoUrl: '',
      featured: false
    });
    setTechInput('');
    setErrors({
      title: '',
      description: '',
      imageUrl: '',
      githubUrl: '',
      demoUrl: '',
      techStack: ''
    });
    setIsModalOpen(true);
  };

  const openEditModal = (project: Project) => {
    setEditingProject(project);
    setFormData({
      title: project.title,
      description: project.description,
      techStack: project.techStack,
      imageUrl: project.imageUrl,
      githubUrl: project.githubUrl,
      demoUrl: project.demoUrl,
      featured: project.featured
    });
    setTechInput('');
    setErrors({
      title: '',
      description: '',
      imageUrl: '',
      githubUrl: '',
      demoUrl: '',
      techStack: ''
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingProject(null);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));

    if (errors[name as keyof typeof errors]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleAddTech = () => {
    if (techInput.trim() && !formData.techStack.includes(techInput.trim())) {
      setFormData(prev => ({
        ...prev,
        techStack: [...prev.techStack, techInput.trim()]
      }));
      setTechInput('');
    }
  };

  const handleRemoveTech = (tech: string) => {
    setFormData(prev => ({
      ...prev,
      techStack: prev.techStack.filter(t => t !== tech)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const validationErrors = validateProjectForm(formData);
    setErrors(validationErrors);
    
    // Convert ProjectFormErrors to Record<string, string> for hasErrors function
    const errorRecord: Record<string, string> = {
      title: validationErrors.title,
      description: validationErrors.description,
      imageUrl: validationErrors.imageUrl,
      githubUrl: validationErrors.githubUrl,
      demoUrl: validationErrors.demoUrl,
      techStack: validationErrors.techStack
    };
    
    if (!hasErrors(errorRecord)) {
      setIsSubmitting(true);
      try {
        if (editingProject) {
          await updateProject(editingProject.id, formData);
        } else {
          await addProject(formData);
        }
        closeModal();
      } catch (error) {
        console.error('Error saving project:', error);
        setErrors(prev => ({
          ...prev,
          submit: 'Failed to save project. Please try again.'
        }));
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const handleDelete = async (projectId: string) => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      try {
        await deleteProject(projectId);
      } catch (error) {
        console.error('Error deleting project:', error);
        alert('Failed to delete project. Please try again.');
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="max-w-7xl mx-auto">
          <LoadingSkeleton type="card" count={6} />
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
                Manage Projects
              </h1>
              <p className="text-text-light">
                Add, edit, or remove projects from your portfolio
              </p>
            </div>
            <Button variant="primary" onClick={openAddModal}>
              Add New Project
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        {/* Projects Grid */}
        <motion.div
          variants={staggerContainer}
          initial="initial"
          animate="animate"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {projects.map((project, index) => (
            <motion.div
              key={project.id}
              variants={scale}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="h-full flex flex-col" hover>
                {/* Project Image */}
                <div className="relative overflow-hidden">
                  <img
                    src={project.imageUrl}
                    alt={project.title}
                    className="w-full h-48 object-cover"
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
                  <h3 className="text-xl font-heading font-bold mb-3 text-text-dark">
                    {project.title}
                  </h3>
                  
                  <p className="text-text-light mb-4 flex-1 leading-relaxed line-clamp-3">
                    {project.description}
                  </p>

                  {/* Tech Stack */}
                  <div className="mb-4">
                    <div className="flex flex-wrap gap-2">
                      {project.techStack.map((tech, techIndex) => (
                        <span
                          key={techIndex}
                          className="px-3 py-1 bg-secondary text-text-dark rounded-full text-sm font-medium"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex space-x-3">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={() => openEditModal(project)}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="primary"
                      size="sm"
                      className="flex-1"
                      onClick={() => handleDelete(project.id)}
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Empty State */}
        {projects.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-16"
          >
            <div className="text-6xl mb-4">📁</div>
            <h3 className="text-2xl font-heading font-bold mb-4 text-text-dark">
              No Projects Yet
            </h3>
            <p className="text-text-light mb-6">
              Start by adding your first project to showcase your work.
            </p>
            <Button variant="primary" onClick={openAddModal}>
              Add Your First Project
            </Button>
          </motion.div>
        )}
      </div>

      {/* Add/Edit Project Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={editingProject ? 'Edit Project' : 'Add New Project'}
        size="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          <Input
            label="Project Title"
            type="text"
            value={formData.title}
            onChange={handleInputChange}
            placeholder="Enter project title"
            required={true}
            error={errors.title}
          />

          <Textarea
            label="Project Description"
            value={formData.description}
            onChange={handleInputChange}
            placeholder="Describe your project..."
            required={true}
            rows={4}
            error={errors.description}
          />

          <Input
            label="Project Image URL"
            type="url"
            value={formData.imageUrl}
            onChange={handleInputChange}
            placeholder="https://example.com/image.jpg"
            required={true}
            error={errors.imageUrl}
          />

          <Input
            label="GitHub Repository URL"
            type="url"
            value={formData.githubUrl}
            onChange={handleInputChange}
            placeholder="https://github.com/username/repo"
            required={true}
            error={errors.githubUrl}
          />

          <Input
            label="Live Demo URL"
            type="url"
            value={formData.demoUrl}
            onChange={handleInputChange}
            placeholder="https://example.com/demo"
            error={errors.demoUrl}
          />

          {/* Tech Stack Input */}
          <div>
            <label className="text-sm font-medium text-text-dark mb-2 block">
              Technologies Used
            </label>
            <div className="flex space-x-2 mb-2">
              <input
                type="text"
                value={techInput}
                onChange={(e) => setTechInput(e.target.value)}
                placeholder="Add a technology..."
                className="flex-1 px-4 py-2 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddTech();
                  }
                }}
              />
              <Button type="button" variant="secondary" onClick={handleAddTech}>
                Add
              </Button>
            </div>
            {errors.techStack && (
              <p className="text-red-500 text-sm mt-1">{errors.techStack}</p>
            )}
            
            {/* Tech Stack Display */}
            <div className="flex flex-wrap gap-2 mt-2">
              {formData.techStack.map((tech, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-secondary text-text-dark rounded-full text-sm font-medium flex items-center space-x-1"
                >
                  <span>{tech}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveTech(tech)}
                    className="text-text-dark hover:text-red-500"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Featured Checkbox */}
          <div className="flex items-center space-x-3">
            <input
              type="checkbox"
              name="featured"
              checked={formData.featured}
              onChange={handleInputChange}
              className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
            />
            <label className="text-sm font-medium text-text-dark">
              Mark as featured project
            </label>
          </div>

          {/* Error Display */}
          {errors.submit && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-2xl text-red-600 text-sm">
              {errors.submit}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex space-x-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={closeModal}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              disabled={isSubmitting}
              className="flex-1"
            >
              {isSubmitting ? (
                <div className="flex items-center justify-center">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  {editingProject ? 'Updating...' : 'Adding...'}
                </div>
              ) : (
                editingProject ? 'Update Project' : 'Add Project'
              )}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default ProjectsAdmin;