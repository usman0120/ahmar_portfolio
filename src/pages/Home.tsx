import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useProfile } from '../hooks/useFirestore';
import LoadingSkeleton from '../components/LoadingSkeleton';
import { heroAnimations, fadeUp } from '../utils/animations';

// Floating shapes component moved outside to prevent recreation
const FloatingShapes: React.FC = () => (
  <>
    <motion.div
      className="absolute top-20 left-10 w-20 h-20 bg-primary rounded-full opacity-10"
      animate={{
        y: [0, -30, 0],
        x: [0, 20, 0],
      }}
      transition={{
        duration: 8,
        repeat: Infinity,
        ease: "easeInOut"
      }}
    />
    <motion.div
      className="absolute top-40 right-20 w-16 h-16 bg-accent rounded-full opacity-10"
      animate={{
        y: [0, 40, 0],
        x: [0, -10, 0],
      }}
      transition={{
        duration: 6,
        repeat: Infinity,
        ease: "easeInOut"
      }}
    />
    <motion.div
      className="absolute bottom-40 left-1/4 w-24 h-24 bg-secondary rounded-full opacity-10"
      animate={{
        y: [0, -20, 0],
        scale: [1, 1.1, 1],
      }}
      transition={{
        duration: 7,
        repeat: Infinity,
        ease: "easeInOut"
      }}
    />
  </>
);

// Custom Button component
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



const Home: React.FC = () => {
  const { profile, loading } = useProfile();

  // Safe profile data extraction
  const profileName = profile?.name || 'Muhammad Ahmar Saleem';
  const profileTitle = profile?.title || 'Flutter Developer & Software Engineering Student';
  const profileImage = profile?.profileImage || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=200&h=200&q=80";
  const resumeUrl = profile?.resumeUrl || "#";

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSkeleton type="card" count={1} className="w-full max-w-4xl h-96" />
      </div>
    );
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background Shapes */}
      <FloatingShapes />
      
      {/* Hero Section */}
      <section className="min-h-screen flex items-center justify-center relative">
        <div className="container-custom text-center">
          <motion.div
            variants={heroAnimations.container}
            initial="initial"
            animate="animate"
            className="max-w-4xl mx-auto mb-4"
          >
            {/* Profile Image */}
            <motion.div
              variants={fadeUp}
              className="mb-8"
            >
              <motion.img
                src={profileImage}
                alt={profileName}
                className="w-56 h-56 rounded-full mx-auto mt-16 border-4 border-white shadow-lg object-cover"
                whileHover={{ scale: 1.1 }}
                transition={{ type: "spring", stiffness: 300 }}
              />
            </motion.div>

            {/* Main Heading */}
            <motion.h1
              variants={fadeUp}
              className="text-5xl md:text-7xl font-heading font-bold mb-6"
            >
              <span className="text-text-dark">Hi, I'm </span>
              <span className="text-gradient">{profile?.name}</span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              variants={fadeUp}
              className="text-2xl md:text-3xl text-text-light mb-3 font-light"
            >
              {profileTitle}
            </motion.p>

            {/* Tagline */}
            <motion.p
              variants={fadeUp}
              className="text-xl text-text-light mb-4 max-w-2xl mx-auto leading-relaxed"
            >
              I build modern, fast, and beautiful mobile applications.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              variants={fadeUp}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            >
              <Link to="/projects">
                <Button variant="primary" size="lg">
                  View My Projects
                </Button>
              </Link>
              <a 
                href={resumeUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className={!profile?.resumeUrl ? 'pointer-events-none opacity-50' : ''}
              >
                <Button variant="outline" size="lg">
                  Download Resume
                </Button>
              </a>
              <Link to="/contact">
                <Button variant="secondary" size="lg">
                  Hire Me
                </Button>
              </Link>
            </motion.div>

            {/* Stats */}
            <motion.div
              variants={fadeUp}
              className="grid grid-cols-3 gap-8 max-w-2xl mx-4 mr-6 mt-16"
            >
              <div className="text-center">
                <motion.div
                  className="text-3xl font-bold text-primary mb-2"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.5, type: "spring" }}
                >
                  2+
                </motion.div>
                <div className="text-text-light">Years Learning</div>
              </div>
              <div className="text-center">
                <motion.div
                  className="text-3xl font-bold text-primary mb-2"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.7, type: "spring" }}
                >
                  10+
                </motion.div>
                <div className="text-text-light">Projects</div>
              </div>
              <div className="text-center">
                <motion.div
                  className="text-3xl font-bold text-primary mb-2"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.9, type: "spring" }}
                >
                  5+
                </motion.div>
                <div className="text-text-light">Technologies</div>
              </div>
            </motion.div>
          </motion.div>
        </div>

        
      </section>

      {/* Quick About Preview */}
      <section className="py-20 bg-white">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto text-center"
          >
            <h2 className="text-4xl font-heading font-bold mb-8 text-text-dark">
              Let&apos;s Build Something <span className="text-gradient">Amazing</span> Together
            </h2>
            <p className="text-xl text-text-light mb-8 leading-relaxed">
              I&apos;m passionate about creating mobile applications that not only look great but 
              also provide exceptional user experiences. With a strong foundation in Flutter 
              and continuous learning, I&apos;m ready to bring your ideas to life.
            </p>
            <Link to="/about">
              <Button variant="primary" size="lg">
                Learn More About Me
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Home;