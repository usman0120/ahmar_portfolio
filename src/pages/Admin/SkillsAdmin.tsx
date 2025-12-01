import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useSkills } from '../../hooks/useFirestore';
import Modal from '../../components/ui/Modal';
import LoadingSkeleton from '../../components/LoadingSkeleton';
import { staggerContainer, scale } from '../../utils/animations';
import { validateSkillForm, hasErrors, type SkillFormErrors } from '../../utils/validators';
import type { SkillFormData, Skill } from '../../firebase/models';

const SkillsAdmin: React.FC = () => {
  const { skills, loading, addSkill, updateSkill, deleteSkill } = useSkills();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSkill, setEditingSkill] = useState<Skill | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState<SkillFormData>({
    name: '',
    category: 'flutter',
    icon: '🚀',
    proficiency: 3,
    featured: false
  });

  const [errors, setErrors] = useState<SkillFormErrors & { submit?: string }>({
    name: '',
    category: '',
    icon: '',
    proficiency: ''
  });

  const categoryOptions = [
    { value: 'flutter', label: 'Flutter Development' },
    { value: 'programming', label: 'Programming Skills' },
    { value: 'tools', label: 'Tools & Technologies' },
    { value: 'soft', label: 'Soft Skills' }
  ];

  const iconOptions = [
    '🚀', '🎨', '🔄', '🌐', '🔥', '📱', '⚡', '🏗️', '💡', '🐍',
    '🗄️', '📚', '💻', '🤖', '💬', '👥', '📖', '🎯', '⚙️', '🔧'
  ];

  const openAddModal = () => {
    setEditingSkill(null);
    setFormData({
      name: '',
      category: 'flutter',
      icon: '🚀',
      proficiency: 3,
      featured: false
    });
    setErrors({
      name: '',
      category: '',
      icon: '',
      proficiency: ''
    });
    setIsModalOpen(true);
  };

  const openEditModal = (skill: Skill) => {
    setEditingSkill(skill);
    setFormData({
      name: skill.name,
      category: skill.category,
      icon: skill.icon,
      proficiency: skill.proficiency,
      featured: skill.featured
    });
    setErrors({
      name: '',
      category: '',
      icon: '',
      proficiency: ''
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingSkill(null);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? parseInt(value) : 
              type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));

    if (errors[name as keyof typeof errors]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleIconSelect = (icon: string) => {
    setFormData(prev => ({
      ...prev,
      icon
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const validationErrors = validateSkillForm(formData);
    setErrors(validationErrors);
    
    // Convert SkillFormErrors to Record<string, string> for hasErrors function
    const errorRecord: Record<string, string> = {
      name: validationErrors.name,
      category: validationErrors.category,
      icon: validationErrors.icon,
      proficiency: validationErrors.proficiency
    };
    
    if (!hasErrors(errorRecord)) {
      setIsSubmitting(true);
      try {
        if (editingSkill) {
          await updateSkill(editingSkill.id, formData);
        } else {
          await addSkill(formData);
        }
        closeModal();
      } catch (error) {
        console.error('Error saving skill:', error);
        setErrors(prev => ({
          ...prev,
          submit: 'Failed to save skill. Please try again.'
        }));
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const handleDelete = async (skillId: string) => {
    if (window.confirm('Are you sure you want to delete this skill?')) {
      try {
        await deleteSkill(skillId);
      } catch (error) {
        console.error('Error deleting skill:', error);
        alert('Failed to delete skill. Please try again.');
      }
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'flutter': return 'from-primary to-orange-400';
      case 'programming': return 'from-accent to-green-500';
      case 'tools': return 'from-purple-500 to-pink-500';
      case 'soft': return 'from-blue-500 to-cyan-400';
      default: return 'from-gray-500 to-gray-700';
    }
  };

  const getCategoryName = (category: string) => {
    return categoryOptions.find(opt => opt.value === category)?.label || category;
  };

  // Custom Button Component
  const Button: React.FC<{
    children: React.ReactNode;
    variant?: 'primary' | 'secondary' | 'outline';
    size?: 'sm' | 'md' | 'lg';
    onClick?: () => void;
    type?: 'button' | 'submit' | 'reset';
    disabled?: boolean;
    className?: string;
  }> = ({
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
  const Input: React.FC<{
    label: string;
    type?: 'text' | 'email' | 'password' | 'number' | 'url';
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    placeholder?: string;
    required?: boolean;
    error?: string;
  }> = ({
    label,
    type = 'text',
    value,
    onChange,
    placeholder,
    required = false,
    error
  }) => {
    return (
      <div className="flex flex-col space-y-2">
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
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        {children}
      </motion.div>
    );
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
                Manage Skills
              </h1>
              <p className="text-text-light">
                Add, edit, or remove skills from your portfolio
              </p>
            </div>
            <Button variant="primary" onClick={openAddModal}>
              Add New Skill
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        {/* Skills by Category */}
        <div className="space-y-8">
          {categoryOptions.map((category) => {
            const categorySkills = skills.filter(skill => skill.category === category.value);
            
            if (categorySkills.length === 0) return null;

            return (
              <motion.div
                key={category.value}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-heading font-bold text-text-dark">
                    {category.label}
                  </h2>
                  <span className="bg-secondary text-text-dark px-3 py-1 rounded-full text-sm font-medium">
                    {categorySkills.length} skills
                  </span>
                </div>

                <motion.div
                  variants={staggerContainer}
                  initial="initial"
                  animate="animate"
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                >
                  {categorySkills.map((skill, index) => (
                    <motion.div
                      key={skill.id}
                      variants={scale}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Card className="p-6 text-center group" hover>
                        {/* Skill Icon */}
                        <div className="text-4xl mb-4">
                          {skill.icon}
                        </div>

                        {/* Skill Name */}
                        <h3 className="text-lg font-heading font-semibold mb-3 text-text-dark group-hover:text-primary transition-colors">
                          {skill.name}
                        </h3>

                        {/* Proficiency */}
                        <div className="mb-4">
                          <div className="flex justify-center space-x-1 mb-2">
                            {[1, 2, 3, 4, 5].map((level) => (
                              <div
                                key={level}
                                className={`w-3 h-3 rounded-full ${
                                  level <= skill.proficiency
                                    ? 'bg-primary'
                                    : 'bg-gray-300'
                                }`}
                              />
                            ))}
                          </div>
                          <div className="text-sm text-text-light">
                            Level {skill.proficiency}/5
                          </div>
                        </div>

                        {/* Category Badge */}
                        <div className={`inline-block bg-gradient-to-r ${getCategoryColor(skill.category)} text-white px-3 py-1 rounded-full text-xs font-medium mb-4`}>
                          {getCategoryName(skill.category)}
                        </div>

                        {/* Action Buttons */}
                        <div className="flex space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex-1"
                            onClick={() => openEditModal(skill)}
                          >
                            Edit
                          </Button>
                          <Button
                            variant="primary"
                            size="sm"
                            className="flex-1"
                            onClick={() => handleDelete(skill.id)}
                          >
                            Delete
                          </Button>
                        </div>
                      </Card>
                    </motion.div>
                  ))}
                </motion.div>
              </motion.div>
            );
          })}
        </div>

        {/* Empty State */}
        {skills.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-16"
          >
            <div className="text-6xl mb-4">⚡</div>
            <h3 className="text-2xl font-heading font-bold mb-4 text-text-dark">
              No Skills Yet
            </h3>
            <p className="text-text-light mb-6">
              Start by adding your first skill to showcase your abilities.
            </p>
            <Button variant="primary" onClick={openAddModal}>
              Add Your First Skill
            </Button>
          </motion.div>
        )}
      </div>

      {/* Add/Edit Skill Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={editingSkill ? 'Edit Skill' : 'Add New Skill'}
        size="md"
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          <Input
            label="Skill Name"
            type="text"
            value={formData.name}
            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
            placeholder="Enter skill name"
            required={true}
            error={errors.name}
          />

          {/* Category Select */}
          <div>
            <label className="text-sm font-medium text-text-dark mb-2 block">
              Category
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-300"
            >
              {categoryOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            {errors.category && (
              <p className="text-red-500 text-sm mt-1">{errors.category}</p>
            )}
          </div>

          {/* Icon Selection */}
          <div>
            <label className="text-sm font-medium text-text-dark mb-2 block">
              Select Icon
            </label>
            <div className="grid grid-cols-5 gap-2 p-4 border border-gray-300 rounded-2xl max-h-40 overflow-y-auto">
              {iconOptions.map(icon => (
                <button
                  key={icon}
                  type="button"
                  onClick={() => handleIconSelect(icon)}
                  className={`w-10 h-10 text-2xl rounded-xl flex items-center justify-center transition-all duration-300 ${
                    formData.icon === icon
                      ? 'bg-primary text-white scale-110'
                      : 'bg-secondary hover:bg-primary hover:text-white hover:scale-105'
                  }`}
                >
                  {icon}
                </button>
              ))}
            </div>
            {errors.icon && (
              <p className="text-red-500 text-sm mt-1">{errors.icon}</p>
            )}
          </div>

          {/* Proficiency Slider */}
          <div>
            <label className="text-sm font-medium text-text-dark mb-2 block">
              Proficiency Level: {formData.proficiency}/5
            </label>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-text-light">1</span>
              <input
                type="range"
                name="proficiency"
                min="1"
                max="5"
                value={formData.proficiency}
                onChange={handleInputChange}
                className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-primary"
              />
              <span className="text-sm text-text-light">5</span>
            </div>
            {errors.proficiency && (
              <p className="text-red-500 text-sm mt-1">{errors.proficiency}</p>
            )}
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
              Mark as featured skill
            </label>
          </div>

          {/* Error Display */}
          {errors.submit && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-2xl text-red-600 text-sm">
              {errors.submit}
            </div>
          )}

          {/* Preview */}
          <div className="p-4 bg-gray-50 rounded-2xl">
            <h4 className="text-sm font-medium text-text-dark mb-2">Preview:</h4>
            <div className="text-center p-4">
              <div className="text-3xl mb-2">{formData.icon}</div>
              <div className="font-semibold text-text-dark">{formData.name}</div>
              <div className="text-sm text-text-light">{getCategoryName(formData.category)}</div>
              <div className="flex justify-center space-x-1 mt-2">
                {[1, 2, 3, 4, 5].map((level) => (
                  <div
                    key={level}
                    className={`w-2 h-2 rounded-full ${
                      level <= formData.proficiency ? 'bg-primary' : 'bg-gray-300'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>

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
                  {editingSkill ? 'Updating...' : 'Adding...'}
                </div>
              ) : (
                editingSkill ? 'Update Skill' : 'Add Skill'
              )}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default SkillsAdmin;