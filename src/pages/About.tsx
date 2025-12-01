import React from 'react';
import { motion } from 'framer-motion';
import { useProfile } from '../hooks/useFirestore';
import LoadingSkeleton from '../components/LoadingSkeleton';
import { fadeUp, staggerContainer, slideInLeft, slideInRight } from '../utils/animations';

// Card component recreated locally
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

const About: React.FC = () => {
  const { profile, loading } = useProfile();

  if (loading) {
    return (
      <div className="min-h-screen section-padding">
        <div className="container-custom">
          <LoadingSkeleton type="card" count={3} className="mb-8" />
        </div>
      </div>
    );
  }

  const education = profile?.education || [
    {
      institution: "University of Engineering & Technology (UET), Lahore",
      degree: "Bachelor of Science",
      field: "Software Engineering",
      startDate: "2023",
      endDate: "2027",
      current: true,
      description: "Currently in 2nd year, learning fundamentals of software engineering and mobile development."
    }
  ];

  const goals = profile?.goals || [
    "Become a professional Flutter developer",
    "Start freelancing career",
    "Build complex, scalable mobile applications",
    "Contribute to open-source projects",
    "Master state management and architecture patterns"
  ];

  const experience = profile?.experience || [
    "Learning Flutter development from basics to advanced concepts",
    "Building personal projects to practice skills",
    "Exploring different state management solutions (GetX, Provider, Riverpod)",
    "Working with Firebase for backend services",
    "Developing responsive and adaptive UI designs"
  ];

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
            About <span className="text-gradient">Me</span>
          </h1>
          <p className="text-xl text-text-light max-w-3xl mx-auto">
            Learn more about my journey, education, and aspirations in the world of software development.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
          {/* Profile Image */}
          <motion.div
            variants={slideInLeft}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            className="lg:col-span-1"
          >
            <Card className="p-6 text-center" hover>
              <img
                src={profile?.profileImage || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&h=400&q=80"}
                alt={profile?.name}
                className="w-64 h-64 rounded-full mx-auto mb-6 object-cover border-4 border-white shadow-lg"
              />
              <h3 className="text-2xl font-heading font-bold mb-2 text-text-dark">
                {profile?.name}
              </h3>
              <p className="text-primary text-lg mb-4">
                {profile?.title}
              </p>
              <div className="space-y-2 text-text-light">
                <p><strong>Location:</strong> {profile?.location}</p>
                <p><strong>University:</strong> {profile?.university}</p>
                <p><strong>Department:</strong> {profile?.department}</p>
                <p><strong>Hometown:</strong> {profile?.hometown}</p>
              </div>
            </Card>
          </motion.div>

          {/* Bio Section */}
          <motion.div
            variants={slideInRight}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            className="lg:col-span-2"
          >
            <Card className="p-8" hover>
              <h2 className="text-3xl font-heading font-bold mb-6 text-text-dark">
                My Story
              </h2>
              <div className="text-text-light">
                <p className="text-lg leading-relaxed mb-6">
                  {profile?.bio || "I am a passionate and dedicated Flutter developer and Software Engineering student at UET Lahore. I love building beautiful, modern, and functional mobile applications. With a strong foundation in programming and continuous learning, I aim to become a professional mobile app developer and begin my freelancing journey. I enjoy turning ideas into real working applications with clean UI, pixel-perfect design, and smooth performance."}
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                  <div>
                    <h4 className="text-xl font-heading font-semibold mb-4 text-text-dark">My Goals</h4>
                    <ul className="space-y-2">
                      {goals.map((goal, index) => (
                        <motion.li
                          key={index}
                          initial={{ opacity: 0, x: -20 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          viewport={{ once: true }}
                          className="flex items-start space-x-2"
                        >
                          <span className="text-primary mt-1">•</span>
                          <span>{goal}</span>
                        </motion.li>
                      ))}
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="text-xl font-heading font-semibold mb-4 text-text-dark">Experience</h4>
                    <ul className="space-y-2">
                      {experience.map((exp, index) => (
                        <motion.li
                          key={index}
                          initial={{ opacity: 0, x: -20 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          viewport={{ once: true }}
                          className="flex items-start space-x-2"
                        >
                          <span className="text-primary mt-1">•</span>
                          <span>{exp}</span>
                        </motion.li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        </div>

        {/* Education Timeline */}
        <motion.div
          variants={staggerContainer}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          className="mb-16"
        >
          <h2 className="text-4xl font-heading font-bold text-center mb-12 text-text-dark">
            Education <span className="text-gradient">Timeline</span>
          </h2>
          
          <div className="max-w-4xl mx-auto">
            {education.map((edu, index) => (
              <motion.div
                key={index}
                variants={fadeUp}
                className="flex flex-col md:flex-row mb-8 last:mb-0"
              >
                {/* Timeline Line */}
                <div className="flex items-center justify-center md:justify-start md:w-32 mb-4 md:mb-0">
                  <div className="w-4 h-4 bg-primary rounded-full border-4 border-white shadow-lg z-10" />
                  {index !== education.length - 1 && (
                    <div className="hidden md:block absolute h-8 w-0.5 bg-primary ml-2 mt-16" />
                  )}
                </div>
                
                {/* Content */}
                <Card className="flex-1 p-6 ml-0 md:ml-8" hover>
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-heading font-bold text-text-dark mb-2">
                        {edu.institution}
                      </h3>
                      <p className="text-lg text-primary font-semibold">
                        {edu.degree} in {edu.field}
                      </p>
                    </div>
                    <div className="mt-2 md:mt-0">
                      <span className="inline-block bg-secondary text-text-dark px-3 py-1 rounded-full text-sm font-medium">
                        {edu.startDate} - {edu.current ? 'Present' : edu.endDate}
                      </span>
                    </div>
                  </div>
                  <p className="text-text-light leading-relaxed">
                    {edu.description}
                  </p>
                  {edu.current && (
                    <div className="mt-4">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary bg-opacity-10 text-primary">
                        <span className="w-2 h-2 bg-primary rounded-full mr-2 animate-pulse"></span>
                        Currently Studying
                      </span>
                    </div>
                  )}
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Personal Details Table */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto"
        >
          <Card className="p-8" hover>
            <h2 className="text-3xl font-heading font-bold mb-6 text-text-dark text-center">
              Personal Details
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex justify-between border-b border-gray-200 pb-2">
                  <span className="font-semibold text-text-dark">Full Name</span>
                  <span className="text-text-light">{profile?.name}</span>
                </div>
                <div className="flex justify-between border-b border-gray-200 pb-2">
                  <span className="font-semibold text-text-dark">Email</span>
                  <span className="text-text-light">{profile?.email}</span>
                </div>
                <div className="flex justify-between border-b border-gray-200 pb-2">
                  <span className="font-semibold text-text-dark">Location</span>
                  <span className="text-text-light">{profile?.location}</span>
                </div>
                <div className="flex justify-between border-b border-gray-200 pb-2">
                  <span className="font-semibold text-text-dark">University</span>
                  <span className="text-text-light">{profile?.university}</span>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="flex justify-between border-b border-gray-200 pb-2">
                  <span className="font-semibold text-text-dark">Department</span>
                  <span className="text-text-light">{profile?.department}</span>
                </div>
                <div className="flex justify-between border-b border-gray-200 pb-2">
                  <span className="font-semibold text-text-dark">Hometown</span>
                  <span className="text-text-light">{profile?.hometown}</span>
                </div>
                <div className="flex justify-between border-b border-gray-200 pb-2">
                  <span className="font-semibold text-text-dark">Status</span>
                  <span className="text-primary font-semibold">2nd Year Student</span>
                </div>
                <div className="flex justify-between border-b border-gray-200 pb-2">
                  <span className="font-semibold text-text-dark">Focus</span>
                  <span className="text-text-light">Flutter Development</span>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default About;