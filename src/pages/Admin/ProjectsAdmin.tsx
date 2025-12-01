// import React, { useState, useRef } from 'react';
// import { motion } from 'framer-motion';
// import { useProjects } from '../../hooks/useFirestore';
// import Modal from '../../components/ui/Modal';
// import LoadingSkeleton from '../../components/LoadingSkeleton';
// import { staggerContainer, scale } from '../../utils/animations';
// import { validateProjectForm, hasErrors, type ProjectFormErrors } from '../../utils/validators';
// import type { ProjectFormData, Project } from '../../firebase/models';

// const ProjectsAdmin: React.FC = () => {
//   const { projects, loading, addProject, updateProject, deleteProject } = useProjects();
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [editingProject, setEditingProject] = useState<Project | null>(null);
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [imagePreview, setImagePreview] = useState<string>('');
//   const [isUploadingImage, setIsUploadingImage] = useState(false);
//   const fileInputRef = useRef<HTMLInputElement>(null);

//   const [formData, setFormData] = useState<ProjectFormData>({
//     title: '',
//     description: '',
//     techStack: [],
//     imageUrl: '',
//     githubUrl: '',
//     demoUrl: '',
//     featured: false
//   });

//   const [errors, setErrors] = useState<ProjectFormErrors & { submit?: string }>({
//     title: '',
//     description: '',
//     imageUrl: '',
//     githubUrl: '',
//     demoUrl: '',
//     techStack: ''
//   });

//   const [techInput, setTechInput] = useState('');

//   // Function to convert image to Base64
//   const convertImageToBase64 = (file: File): Promise<string> => {
//     return new Promise((resolve, reject) => {
//       const reader = new FileReader();
//       reader.readAsDataURL(file);
//       reader.onload = () => resolve(reader.result as string);
//       reader.onerror = error => reject(error);
//     });
//   };

//   // Handle image upload
//   const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (!file) return;

//     // Check if file is an image
//     if (!file.type.startsWith('image/')) {
//       alert('Please select an image file (JPEG, PNG, etc.)');
//       return;
//     }

//     // Check file size (max 2MB)
//     if (file.size > 2 * 1024 * 1024) {
//       alert('Image size should be less than 2MB');
//       return;
//     }

//     setIsUploadingImage(true);

//     try {
//       // Convert image to Base64
//       const base64Image = await convertImageToBase64(file);
      
//       // Set the Base64 string as image URL
//       setFormData(prev => ({
//         ...prev,
//         imageUrl: base64Image
//       }));

//       // Set preview
//       setImagePreview(base64Image);
      
//       // Clear any previous image error
//       setErrors(prev => ({
//         ...prev,
//         imageUrl: ''
//       }));
//     } catch (error) {
//       console.error('Error converting image:', error);
//       setErrors(prev => ({
//         ...prev,
//         imageUrl: 'Failed to upload image. Please try again.'
//       }));
//     } finally {
//       setIsUploadingImage(false);
//     }
//   };

//   // Remove uploaded image
//   const handleRemoveImage = () => {
//     setFormData(prev => ({
//       ...prev,
//       imageUrl: ''
//     }));
//     setImagePreview('');
//     if (fileInputRef.current) {
//       fileInputRef.current.value = '';
//     }
//   };

//   // Trigger file input click
//   const triggerFileInput = () => {
//     fileInputRef.current?.click();
//   };

//   // Custom Button Component
//   interface ButtonProps {
//     children: React.ReactNode;
//     variant?: 'primary' | 'secondary' | 'outline';
//     size?: 'sm' | 'md' | 'lg';
//     onClick?: () => void;
//     type?: 'button' | 'submit' | 'reset';
//     disabled?: boolean;
//     className?: string;
//   }

//   const Button: React.FC<ButtonProps> = ({
//     children,
//     variant = 'primary',
//     size = 'md',
//     onClick,
//     type = 'button',
//     disabled = false,
//     className = ''
//   }) => {
//     const baseClasses = 'rounded-2xl font-medium transition-all duration-300 focus:outline-none focus:ring-2';
    
//     const variantClasses = {
//       primary: 'bg-primary text-white hover:shadow-lg hover:scale-105 focus:ring-primary focus:ring-opacity-50',
//       secondary: 'bg-secondary text-text-dark hover:shadow-lg hover:scale-105 focus:ring-secondary focus:ring-opacity-50',
//       outline: 'border-2 border-primary text-primary bg-transparent hover:bg-primary hover:text-white focus:ring-primary focus:ring-opacity-50'
//     };

//     const sizeClasses = {
//       sm: 'px-4 py-2 text-sm',
//       md: 'px-6 py-3 text-base',
//       lg: 'px-8 py-4 text-lg'
//     };

//     const classes = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className} ${
//       disabled ? 'opacity-50 cursor-not-allowed' : ''
//     }`;

//     return (
//       <motion.button
//         type={type}
//         onClick={onClick}
//         disabled={disabled}
//         className={classes}
//         whileHover={!disabled ? { scale: 1.05 } : {}}
//         whileTap={!disabled ? { scale: 0.95 } : {}}
//         transition={{ type: "spring", stiffness: 400, damping: 17 }}
//       >
//         {children}
//       </motion.button>
//     );
//   };

//   // Custom Input Component
//   interface InputProps {
//     label: string;
//     type?: 'text' | 'email' | 'password' | 'number' | 'url';
//     value: string;
//     onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
//     placeholder?: string;
//     required?: boolean;
//     error?: string;
//     className?: string;
//   }

//   const Input: React.FC<InputProps> = ({
//     label,
//     type = 'text',
//     value,
//     onChange,
//     placeholder,
//     required = false,
//     error,
//     className = ''
//   }) => {
//     return (
//       <div className={`flex flex-col space-y-2 ${className}`}>
//         <label className="text-sm font-medium text-text-dark">
//           {label} {required && <span className="text-primary">*</span>}
//         </label>
//         <input
//           type={type}
//           value={value}
//           onChange={onChange}
//           placeholder={placeholder}
//           required={required}
//           className={`
//             w-full px-4 py-3 
//             border border-gray-300 
//             rounded-2xl 
//             focus:outline-none 
//             focus:ring-2 
//             focus:ring-primary 
//             focus:border-transparent 
//             transition-all 
//             duration-300
//             bg-white
//             text-text-dark
//             placeholder-gray-400
//             ${error ? 'border-red-500 focus:ring-red-500' : ''}
//           `}
//         />
//         {error && (
//           <p className="text-red-500 text-sm">{error}</p>
//         )}
//       </div>
//     );
//   };

//   // Custom Textarea Component
//   interface TextareaProps {
//     label: string;
//     value: string;
//     onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
//     placeholder?: string;
//     required?: boolean;
//     rows?: number;
//     error?: string;
//     className?: string;
//   }

//   const Textarea: React.FC<TextareaProps> = ({
//     label,
//     value,
//     onChange,
//     placeholder,
//     required = false,
//     rows = 4,
//     error,
//     className = ''
//   }) => {
//     return (
//       <div className={`flex flex-col space-y-2 ${className}`}>
//         <label className="text-sm font-medium text-text-dark">
//           {label} {required && <span className="text-primary">*</span>}
//         </label>
//         <textarea
//           value={value}
//           onChange={onChange}
//           placeholder={placeholder}
//           required={required}
//           rows={rows}
//           className={`
//             w-full px-4 py-3 
//             border border-gray-300 
//             rounded-2xl 
//             focus:outline-none 
//             focus:ring-2 
//             focus:ring-primary 
//             focus:border-transparent 
//             transition-all 
//             duration-300 
//             resize-none
//             bg-white
//             text-text-dark
//             placeholder-gray-400
//             ${error ? 'border-red-500 focus:ring-red-500' : ''}
//           `}
//         />
//         {error && (
//           <p className="text-red-500 text-sm">{error}</p>
//         )}
//       </div>
//     );
//   };

//   // Custom Card Component
//   interface CardProps {
//     children: React.ReactNode;
//     className?: string;
//     hover?: boolean;
//     glass?: boolean;
//   }

//   const Card: React.FC<CardProps> = ({ 
//     children, 
//     className = '', 
//     hover = false,
//     glass = false 
//   }) => {
//     const baseClasses = 'rounded-2xl shadow-lg';
    
//     const styleClasses = glass 
//       ? 'bg-white bg-opacity-10 backdrop-blur-xs border border-white border-opacity-20'
//       : 'bg-white border border-gray-100';
    
//     const hoverClasses = hover ? 'transition-transform duration-300 hover:-translate-y-2 hover:shadow-xl' : '';

//     const classes = `${baseClasses} ${styleClasses} ${hoverClasses} ${className}`;

//     return (
//       <motion.div
//         className={classes}
//         initial={{ opacity: 0, y: 20 }}
//         whileInView={{ opacity: 1, y: 0 }}
//         viewport={{ once: true }}
//         transition={{ duration: 0.5 }}
//       >
//         {children}
//       </motion.div>
//     );
//   };

//   const openAddModal = () => {
//     setEditingProject(null);
//     setFormData({
//       title: '',
//       description: '',
//       techStack: [],
//       imageUrl: '',
//       githubUrl: '',
//       demoUrl: '',
//       featured: false
//     });
//     setTechInput('');
//     setImagePreview('');
//     setErrors({
//       title: '',
//       description: '',
//       imageUrl: '',
//       githubUrl: '',
//       demoUrl: '',
//       techStack: ''
//     });
//     setIsModalOpen(true);
//   };

//   const openEditModal = (project: Project) => {
//     setEditingProject(project);
//     setFormData({
//       title: project.title,
//       description: project.description,
//       techStack: project.techStack,
//       imageUrl: project.imageUrl,
//       githubUrl: project.githubUrl,
//       demoUrl: project.demoUrl,
//       featured: project.featured
//     });
//     setTechInput('');
//     // Check if imageUrl is a Base64 string (starts with data:image)
//     if (project.imageUrl && project.imageUrl.startsWith('data:image')) {
//       setImagePreview(project.imageUrl);
//     } else {
//       setImagePreview('');
//     }
//     setErrors({
//       title: '',
//       description: '',
//       imageUrl: '',
//       githubUrl: '',
//       demoUrl: '',
//       techStack: ''
//     });
//     setIsModalOpen(true);
//   };

//   const closeModal = () => {
//     setIsModalOpen(false);
//     setEditingProject(null);
//     setImagePreview('');
//   };

//   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
//     const { name, value, type } = e.target;
//     setFormData(prev => ({
//       ...prev,
//       [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
//     }));

//     if (errors[name as keyof typeof errors]) {
//       setErrors(prev => ({
//         ...prev,
//         [name]: ''
//       }));
//     }
//   };

//   const handleAddTech = () => {
//     if (techInput.trim() && !formData.techStack.includes(techInput.trim())) {
//       setFormData(prev => ({
//         ...prev,
//         techStack: [...prev.techStack, techInput.trim()]
//       }));
//       setTechInput('');
//     }
//   };

//   const handleRemoveTech = (tech: string) => {
//     setFormData(prev => ({
//       ...prev,
//       techStack: prev.techStack.filter(t => t !== tech)
//     }));
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
    
//     const validationErrors = validateProjectForm(formData);
//     setErrors(validationErrors);
    
//     // Convert ProjectFormErrors to Record<string, string> for hasErrors function
//     const errorRecord: Record<string, string> = {
//       title: validationErrors.title,
//       description: validationErrors.description,
//       imageUrl: validationErrors.imageUrl,
//       githubUrl: validationErrors.githubUrl,
//       demoUrl: validationErrors.demoUrl,
//       techStack: validationErrors.techStack
//     };
    
//     if (!hasErrors(errorRecord)) {
//       setIsSubmitting(true);
//       try {
//         if (editingProject) {
//           await updateProject(editingProject.id, formData);
//         } else {
//           await addProject(formData);
//         }
//         closeModal();
//       } catch (error) {
//         console.error('Error saving project:', error);
//         setErrors(prev => ({
//           ...prev,
//           submit: 'Failed to save project. Please try again.'
//         }));
//       } finally {
//         setIsSubmitting(false);
//       }
//     }
//   };

//   const handleDelete = async (projectId: string) => {
//     if (window.confirm('Are you sure you want to delete this project?')) {
//       try {
//         await deleteProject(projectId);
//       } catch (error) {
//         console.error('Error deleting project:', error);
//         alert('Failed to delete project. Please try again.');
//       }
//     }
//   };

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-background p-6">
//         <div className="max-w-7xl mx-auto">
//           <LoadingSkeleton type="card" count={6} />
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-background">
//       {/* Header */}
//       <div className="bg-white border-b border-gray-200">
//         <div className="max-w-7xl mx-auto px-6 py-4">
//           <div className="flex items-center justify-between">
//             <div>
//               <h1 className="text-3xl font-heading font-bold text-text-dark">
//                 Manage Projects
//               </h1>
//               <p className="text-text-light">
//                 Add, edit, or remove projects from your portfolio
//               </p>
//             </div>
//             <Button variant="primary" onClick={openAddModal}>
//               Add New Project
//             </Button>
//           </div>
//         </div>
//       </div>

//       <div className="max-w-7xl mx-auto p-6">
//         {/* Projects Grid */}
//         <motion.div
//           variants={staggerContainer}
//           initial="initial"
//           animate="animate"
//           className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
//         >
//           {projects.map((project, index) => (
//             <motion.div
//               key={project.id}
//               variants={scale}
//               transition={{ delay: index * 0.1 }}
//             >
//               <Card className="h-full flex flex-col" hover>
//                 {/* Project Image */}
//                 <div className="relative overflow-hidden">
//                   <img
//                     src={project.imageUrl}
//                     alt={project.title}
//                     className="w-full h-48 object-cover"
//                   />
//                   {project.featured && (
//                     <div className="absolute top-4 right-4">
//                       <span className="bg-primary text-white px-3 py-1 rounded-full text-sm font-medium">
//                         Featured
//                       </span>
//                     </div>
//                   )}
//                 </div>

//                 {/* Project Content */}
//                 <div className="p-6 flex-1 flex flex-col">
//                   <h3 className="text-xl font-heading font-bold mb-3 text-text-dark">
//                     {project.title}
//                   </h3>
                  
//                   <p className="text-text-light mb-4 flex-1 leading-relaxed line-clamp-3">
//                     {project.description}
//                   </p>

//                   {/* Tech Stack */}
//                   <div className="mb-4">
//                     <div className="flex flex-wrap gap-2">
//                       {project.techStack.map((tech, techIndex) => (
//                         <span
//                           key={techIndex}
//                           className="px-3 py-1 bg-secondary text-text-dark rounded-full text-sm font-medium"
//                         >
//                           {tech}
//                         </span>
//                       ))}
//                     </div>
//                   </div>

//                   {/* Action Buttons */}
//                   <div className="flex space-x-3">
//                     <Button
//                       variant="outline"
//                       size="sm"
//                       className="flex-1"
//                       onClick={() => openEditModal(project)}
//                     >
//                       Edit
//                     </Button>
//                     <Button
//                       variant="primary"
//                       size="sm"
//                       className="flex-1"
//                       onClick={() => handleDelete(project.id)}
//                     >
//                       Delete
//                     </Button>
//                   </div>
//                 </div>
//               </Card>
//             </motion.div>
//           ))}
//         </motion.div>

//         {/* Empty State */}
//         {projects.length === 0 && (
//           <motion.div
//             initial={{ opacity: 0, y: 30 }}
//             animate={{ opacity: 1, y: 0 }}
//             className="text-center py-16"
//           >
//             <div className="text-6xl mb-4">📁</div>
//             <h3 className="text-2xl font-heading font-bold mb-4 text-text-dark">
//               No Projects Yet
//             </h3>
//             <p className="text-text-light mb-6">
//               Start by adding your first project to showcase your work.
//             </p>
//             <Button variant="primary" onClick={openAddModal}>
//               Add Your First Project
//             </Button>
//           </motion.div>
//         )}
//       </div>

//       {/* Add/Edit Project Modal */}
//       <Modal
//         isOpen={isModalOpen}
//         onClose={closeModal}
//         title={editingProject ? 'Edit Project' : 'Add New Project'}
//         size="lg"
//       >
//         <form onSubmit={handleSubmit} className="space-y-6">
//           <Input
//             label="Project Title"
//             type="text"
//             value={formData.title}
//             onChange={handleInputChange}
//             placeholder="Enter project title"
//             required={true}
//             error={errors.title}
//           />

//           <Textarea
//             label="Project Description"
//             value={formData.description}
//             onChange={handleInputChange}
//             placeholder="Describe your project..."
//             required={true}
//             rows={4}
//             error={errors.description}
//           />

//           {/* Image Upload Section */}
//           <div>
//             <label className="text-sm font-medium text-text-dark mb-2 block">
//               Project Thumbnail *
//             </label>
            
//             {/* Hidden file input */}
//             <input
//               type="file"
//               ref={fileInputRef}
//               onChange={handleImageUpload}
//               accept="image/*"
//               className="hidden"
//             />
            
//             {/* Image Upload Area */}
//             {imagePreview || formData.imageUrl ? (
//               <div className="space-y-3">
//                 {/* Image Preview */}
//                 <div className="relative">
//                   <img
//                     src={imagePreview || formData.imageUrl}
//                     alt="Project preview"
//                     className="w-full h-48 object-cover rounded-2xl border-2 border-gray-200"
//                   />
//                   <button
//                     type="button"
//                     onClick={handleRemoveImage}
//                     className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors"
//                   >
//                     <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
//                     </svg>
//                   </button>
//                 </div>
                
//                 {/* Change Image Button */}
//                 <Button
//                   type="button"
//                   variant="outline"
//                   onClick={triggerFileInput}
//                   disabled={isUploadingImage}
//                 >
//                   {isUploadingImage ? (
//                     <>
//                       <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin mr-2" />
//                       Uploading...
//                     </>
//                   ) : (
//                     'Change Image'
//                   )}
//                 </Button>
//               </div>
//             ) : (
//               /* Upload Prompt */
//               <div
//                 onClick={triggerFileInput}
//                 className="border-2 border-dashed border-gray-300 rounded-2xl p-8 text-center cursor-pointer hover:border-primary transition-colors"
//               >
//                 <div className="text-4xl mb-2">📁</div>
//                 <p className="text-text-light mb-1">
//                   Click to upload project thumbnail
//                 </p>
//                 <p className="text-sm text-gray-500">
//                   Supports JPG, PNG, GIF (Max 2MB)
//                 </p>
//                 {isUploadingImage && (
//                   <div className="mt-4 flex items-center justify-center">
//                     <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin mr-2" />
//                     <span className="text-primary">Uploading...</span>
//                   </div>
//                 )}
//               </div>
//             )}
            
//             {errors.imageUrl && (
//               <p className="text-red-500 text-sm mt-2">{errors.imageUrl}</p>
//             )}
//           </div>

//           <Input
//             label="GitHub Repository URL"
//             type="url"
//             value={formData.githubUrl}
//             onChange={handleInputChange}
//             placeholder="https://github.com/username/repo"
//             required={true}
//             error={errors.githubUrl}
//           />

//           <Input
//             label="Live Demo URL"
//             type="url"
//             value={formData.demoUrl}
//             onChange={handleInputChange}
//             placeholder="https://example.com/demo"
//             error={errors.demoUrl}
//           />

//           {/* Tech Stack Input */}
//           <div>
//             <label className="text-sm font-medium text-text-dark mb-2 block">
//               Technologies Used
//             </label>
//             <div className="flex space-x-2 mb-2">
//               <input
//                 type="text"
//                 value={techInput}
//                 onChange={(e) => setTechInput(e.target.value)}
//                 placeholder="Add a technology..."
//                 className="flex-1 px-4 py-2 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
//                 onKeyPress={(e) => {
//                   if (e.key === 'Enter') {
//                     e.preventDefault();
//                     handleAddTech();
//                   }
//                 }}
//               />
//               <Button type="button" variant="secondary" onClick={handleAddTech}>
//                 Add
//               </Button>
//             </div>
//             {errors.techStack && (
//               <p className="text-red-500 text-sm mt-1">{errors.techStack}</p>
//             )}
            
//             {/* Tech Stack Display */}
//             <div className="flex flex-wrap gap-2 mt-2">
//               {formData.techStack.map((tech, index) => (
//                 <span
//                   key={index}
//                   className="px-3 py-1 bg-secondary text-text-dark rounded-full text-sm font-medium flex items-center space-x-1"
//                 >
//                   <span>{tech}</span>
//                   <button
//                     type="button"
//                     onClick={() => handleRemoveTech(tech)}
//                     className="text-text-dark hover:text-red-500"
//                   >
//                     ×
//                   </button>
//                 </span>
//               ))}
//             </div>
//           </div>

//           {/* Featured Checkbox */}
//           <div className="flex items-center space-x-3">
//             <input
//               type="checkbox"
//               name="featured"
//               checked={formData.featured}
//               onChange={handleInputChange}
//               className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
//             />
//             <label className="text-sm font-medium text-text-dark">
//               Mark as featured project
//             </label>
//           </div>

//           {/* Error Display */}
//           {errors.submit && (
//             <div className="p-4 bg-red-50 border border-red-200 rounded-2xl text-red-600 text-sm">
//               {errors.submit}
//             </div>
//           )}

//           {/* Action Buttons */}
//           <div className="flex space-x-3 pt-4">
//             <Button
//               type="button"
//               variant="outline"
//               onClick={closeModal}
//               className="flex-1"
//             >
//               Cancel
//             </Button>
//             <Button
//               type="submit"
//               variant="primary"
//               disabled={isSubmitting || isUploadingImage}
//               className="flex-1"
//             >
//               {isSubmitting ? (
//                 <div className="flex items-center justify-center">
//                   <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
//                   {editingProject ? 'Updating...' : 'Adding...'}
//                 </div>
//               ) : (
//                 editingProject ? 'Update Project' : 'Add Project'
//               )}
//             </Button>
//           </div>
//         </form>
//       </Modal>
//     </div>
//   );
// };

// export default ProjectsAdmin;

































import React, { useState, useRef } from 'react';
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
  const [imagePreview, setImagePreview] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

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
    name?: string;
  }

  const Input: React.FC<InputProps> = ({
    label,
    type = 'text',
    value,
    onChange,
    placeholder,
    required = false,
    error,
    className = '',
    name
  }) => {
    return (
      <div className={`flex flex-col space-y-2 ${className}`}>
        <label className="text-sm font-medium text-text-dark">
          {label} {required && <span className="text-primary">*</span>}
        </label>
        <input
          type={type}
          name={name}
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
    name?: string;
  }

  const Textarea: React.FC<TextareaProps> = ({
    label,
    value,
    onChange,
    placeholder,
    required = false,
    rows = 4,
    error,
    className = '',
    name
  }) => {
    return (
      <div className={`flex flex-col space-y-2 ${className}`}>
        <label className="text-sm font-medium text-text-dark">
          {label} {required && <span className="text-primary">*</span>}
        </label>
        <textarea
          name={name}
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

  // Image Upload Functions
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.match('image.*')) {
      setErrors(prev => ({ ...prev, imageUrl: 'Please upload an image file' }));
      return;
    }

    // Validate file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      setErrors(prev => ({ ...prev, imageUrl: 'Image size should be less than 2MB' }));
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      // Convert to data URL format
      setFormData(prev => ({ ...prev, imageUrl: base64String }));
      setImagePreview(base64String);
      if (errors.imageUrl) {
        setErrors(prev => ({ ...prev, imageUrl: '' }));
      }
    };
    reader.readAsDataURL(file);
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const clearImage = () => {
    setFormData(prev => ({ ...prev, imageUrl: '' }));
    setImagePreview('');
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
    setImagePreview('');
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
    // If the image is already a base64 string, set it as preview
    if (project.imageUrl && project.imageUrl.startsWith('data:image')) {
      setImagePreview(project.imageUrl);
    } else {
      setImagePreview('');
    }
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
    setImagePreview('');
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
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://via.placeholder.com/400x200?text=Project+Image';
                    }}
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
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            placeholder="Enter project title"
            required={true}
            error={errors.title}
          />

          <Textarea
            label="Project Description"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            placeholder="Describe your project..."
            required={true}
            rows={4}
            error={errors.description}
          />

          {/* Image Upload Section */}
          <div>
            <label className="text-sm font-medium text-text-dark mb-2 block">
              Project Thumbnail
            </label>
            
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImageUpload}
              accept="image/*"
              className="hidden"
            />
            
            <div className="space-y-4">
              {imagePreview ? (
                <div className="relative">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full h-48 object-cover rounded-2xl"
                  />
                  <button
                    type="button"
                    onClick={clearImage}
                    className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600"
                  >
                    ✕
                  </button>
                </div>
              ) : (
                <div className="border-2 border-dashed border-gray-300 rounded-2xl p-8 text-center">
                  <svg className="w-12 h-12 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <p className="text-gray-500 mb-2">Upload project thumbnail</p>
                  <p className="text-gray-400 text-sm mb-4">JPG, PNG up to 2MB</p>
                  <Button type="button" variant="outline" onClick={triggerFileInput}>
                    Choose Image
                  </Button>
                </div>
              )}
              
              <Input
                label="Or enter image URL"
                type="url"
                name="imageUrl"
                value={formData.imageUrl.startsWith('data:image') ? '' : formData.imageUrl}
                onChange={handleInputChange}
                placeholder="https://example.com/image.jpg"
                required={!imagePreview && !formData.imageUrl.startsWith('data:image')}
                error={errors.imageUrl}
                className={imagePreview ? 'opacity-50' : ''}
              />
            </div>
          </div>

          <Input
            label="GitHub Repository URL"
            type="url"
            name="githubUrl"
            value={formData.githubUrl}
            onChange={handleInputChange}
            placeholder="https://github.com/username/repo"
            required={true}
            error={errors.githubUrl}
          />

          <Input
            label="Live Demo URL"
            type="url"
            name="demoUrl"
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