import React from 'react';
import { motion } from 'framer-motion';
import { useSkills } from '../hooks/useFirestore';
import LoadingSkeleton from '../components/LoadingSkeleton';
import { fadeUp, staggerContainer, scale } from '../utils/animations';

// Custom Card component moved outside
const Card: React.FC<{
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  glass?: boolean;
}> = ({ 
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

// ProficiencyBar component moved outside
const ProficiencyBar: React.FC<{ proficiency: number }> = ({ proficiency }) => {
  const width = `${(proficiency / 5) * 100}%`;
  
  return (
    <div className="w-full bg-gray-200 rounded-full h-2">
      <motion.div
        className="bg-gradient-to-r from-primary to-secondary h-2 rounded-full"
        initial={{ width: 0 }}
        whileInView={{ width }}
        transition={{ duration: 1, delay: 0.2 }}
        viewport={{ once: true }}
      />
    </div>
  );
};

const Skills: React.FC = () => {
  const { skills, loading } = useSkills();

  // Default skills if none in database
  const defaultSkills = [
    // Flutter Skills
    { id: '1', name: 'Dart Programming', category: 'flutter', icon: '🚀', proficiency: 4, featured: true },
    { id: '2', name: 'Flutter UI Design', category: 'flutter', icon: '🎨', proficiency: 4, featured: true },
    { id: '3', name: 'State Management (GetX)', category: 'flutter', icon: '🔄', proficiency: 3, featured: true },
    { id: '4', name: 'REST API Integration', category: 'flutter', icon: '🌐', proficiency: 3, featured: true },
    { id: '5', name: 'Firebase Integration', category: 'flutter', icon: '🔥', proficiency: 3, featured: true },
    { id: '6', name: 'Responsive Layouts', category: 'flutter', icon: '📱', proficiency: 4, featured: true },
    
    // Programming Skills
    { id: '7', name: 'C++ Basics', category: 'programming', icon: '⚡', proficiency: 3, featured: true },
    { id: '8', name: 'Object-Oriented Programming', category: 'programming', icon: '🏗️', proficiency: 4, featured: true },
    { id: '9', name: 'Problem Solving', category: 'programming', icon: '💡', proficiency: 4, featured: true },
    { id: '10', name: 'Basic Python', category: 'programming', icon: '🐍', proficiency: 2, featured: true },
    { id: '11', name: 'Basic SQL', category: 'programming', icon: '🗄️', proficiency: 3, featured: true },
    
    // Tools & Technologies
    { id: '12', name: 'Git & GitHub', category: 'tools', icon: '📚', proficiency: 4, featured: true },
    { id: '13', name: 'VS Code', category: 'tools', icon: '💻', proficiency: 5, featured: true },
    { id: '14', name: 'Android Studio', category: 'tools', icon: '🤖', proficiency: 3, featured: true },
    
    // Soft Skills
    { id: '15', name: 'Communication', category: 'soft', icon: '💬', proficiency: 4, featured: true },
    { id: '16', name: 'Team Collaboration', category: 'soft', icon: '👥', proficiency: 4, featured: true },
    { id: '17', name: 'Fast Learner', category: 'soft', icon: '📖', proficiency: 5, featured: true },
    { id: '18', name: 'Consistent & Dedicated', category: 'soft', icon: '🎯', proficiency: 5, featured: true },
  ];

  const displaySkills = skills.length > 0 ? skills : defaultSkills;

  // Group skills by category
  const skillsByCategory = {
    flutter: displaySkills.filter(skill => skill.category === 'flutter'),
    programming: displaySkills.filter(skill => skill.category === 'programming'),
    tools: displaySkills.filter(skill => skill.category === 'tools'),
    soft: displaySkills.filter(skill => skill.category === 'soft'),
  };

  const categoryTitles = {
    flutter: 'Flutter Development',
    programming: 'Programming Skills',
    tools: 'Tools & Technologies',
    soft: 'Soft Skills'
  };

  if (loading && skills.length === 0) {
    return (
      <div className="min-h-screen section-padding">
        <div className="container-custom">
          <LoadingSkeleton type="card" count={4} className="mb-8" />
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
          className="text-center mb-16"
        >
          <h1 className="text-5xl font-heading font-bold mb-6 text-text-dark">
            My <span className="text-gradient">Skills</span>
          </h1>
          <p className="text-xl text-text-light max-w-3xl mx-auto">
            Here are the technologies and skills I&apos;ve been working with. I&apos;m constantly learning 
            and expanding my skill set to build better applications.
          </p>
        </motion.div>

        {/* Skills Grid by Category */}
        <motion.div
          variants={staggerContainer}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          className="space-y-12"
        >
          {Object.entries(skillsByCategory).map(([category, categorySkills]) => (
            <motion.div
              key={category}
              variants={fadeUp}
              className="space-y-6"
            >
              {/* Category Header */}
              <div className="text-center">
                <h2 className="text-3xl font-heading font-bold text-text-dark mb-2">
                  {categoryTitles[category as keyof typeof categoryTitles]}
                </h2>
                <div className="w-24 h-1 bg-gradient-to-r from-primary to-secondary mx-auto rounded-full" />
              </div>

              {/* Skills Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {categorySkills.map((skill, index) => (
                  <motion.div
                    key={skill.id}
                    variants={scale}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className="p-6 text-center group hover-lift" hover>
                      {/* Skill Icon */}
                      <motion.div
                        className="text-4xl mb-4"
                        whileHover={{ scale: 1.2, rotate: 5 }}
                        transition={{ type: "spring", stiffness: 300 }}
                      >
                        {skill.icon}
                      </motion.div>

                      {/* Skill Name */}
                      <h3 className="text-lg font-heading font-semibold mb-3 text-text-dark group-hover:text-primary transition-colors">
                        {skill.name}
                      </h3>

                      {/* Proficiency Bar */}
                      <div className="mb-2">
                        <ProficiencyBar proficiency={skill.proficiency} />
                      </div>

                      {/* Proficiency Level Text */}
                      <div className="flex justify-between items-center text-sm text-text-light">
                        <span>Proficiency</span>
                        <span className="font-semibold">
                          {skill.proficiency}/5
                        </span>
                      </div>

                      {/* Skill Level Indicator */}
                      <div className="mt-3 flex justify-center space-x-1">
                        {[1, 2, 3, 4, 5].map((level) => (
                          <div
                            key={level}
                            className={`w-2 h-2 rounded-full ${
                              level <= skill.proficiency
                                ? 'bg-primary'
                                : 'bg-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Skills Summary */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-16"
        >
          <Card className="p-8 bg-gradient-to-br from-accent to-primary text-white" hover>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
              <div>
                <div className="text-3xl font-bold mb-2">{displaySkills.filter(s => s.category === 'flutter').length}</div>
                <div className="text-secondary font-semibold">Flutter Skills</div>
              </div>
              <div>
                <div className="text-3xl font-bold mb-2">{displaySkills.filter(s => s.category === 'programming').length}</div>
                <div className="text-secondary font-semibold">Programming Languages</div>
              </div>
              <div>
                <div className="text-3xl font-bold mb-2">{displaySkills.filter(s => s.category === 'tools').length + displaySkills.filter(s => s.category === 'soft').length}</div>
                <div className="text-secondary font-semibold">Tools & Soft Skills</div>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Learning Journey */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-16 text-center"
        >
          <Card className="p-8" hover>
            <h3 className="text-2xl font-heading font-bold mb-4 text-text-dark">
              Continuous Learning Journey
            </h3>
            <p className="text-text-light text-lg mb-6">
              I believe in constantly improving my skills and staying updated with the latest technologies. 
              Currently focusing on mastering Flutter and exploring advanced mobile development concepts.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <span className="px-4 py-2 bg-primary bg-opacity-10 text-primary rounded-full font-medium">
                Flutter Advanced
              </span>
              <span className="px-4 py-2 bg-primary bg-opacity-10 text-primary rounded-full font-medium">
                State Management
              </span>
              <span className="px-4 py-2 bg-primary bg-opacity-10 text-primary rounded-full font-medium">
                API Integration
              </span>
              <span className="px-4 py-2 bg-primary bg-opacity-10 text-primary rounded-full font-medium">
                UI/UX Design
              </span>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default Skills;