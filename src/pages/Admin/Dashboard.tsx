import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useProjects, useSkills, useMessages, useProfile } from '../../hooks/useFirestore';
import LoadingSkeleton from '../../components/LoadingSkeleton';
import { fadeUp, staggerContainer } from '../../utils/animations';

// Button component implementation
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

// Card component implementation
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

const Dashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const { projects, loading: projectsLoading } = useProjects();
  const { skills, loading: skillsLoading } = useSkills();
  const { messages, loading: messagesLoading } = useMessages();
  const { profile, loading: profileLoading } = useProfile();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const unreadMessages = messages.filter(msg => !msg.read).length;
  const featuredProjects = projects.filter(project => project.featured).length;

  const stats = [
    {
      title: 'Total Projects',
      value: projects.length,
      icon: '📁',
      color: 'from-primary to-orange-400',
      link: '/admin/projects'
    },
    {
      title: 'Skills',
      value: skills.length,
      icon: '⚡',
      color: 'from-accent to-green-500',
      link: '/admin/skills'
    },
    {
      title: 'Messages',
      value: messages.length,
      icon: '✉️',
      color: 'from-purple-500 to-pink-500',
      link: '/admin/messages',
      badge: unreadMessages > 0 ? unreadMessages : undefined
    },
    {
      title: 'Featured Projects',
      value: featuredProjects,
      icon: '⭐',
      color: 'from-yellow-500 to-orange-500',
      link: '/admin/projects'
    }
  ];

  const quickActions = [
    {
      title: 'Add New Project',
      description: 'Create a new project entry',
      icon: '➕',
      link: '/admin/projects?action=add',
      color: 'bg-primary'
    },
    {
      title: 'Manage Skills',
      description: 'Update your skills list',
      icon: '⚡',
      link: '/admin/skills',
      color: 'bg-accent'
    },
    {
      title: 'View Messages',
      description: 'Check incoming messages',
      icon: '✉️',
      link: '/admin/messages',
      color: 'bg-purple-500'
    },
    {
      title: 'Profile Settings',
      description: 'Update your profile info',
      icon: '👤',
      link: '/admin/profile',
      color: 'bg-secondary'
    }
  ];

  if (projectsLoading || skillsLoading || messagesLoading || profileLoading) {
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
                Admin Dashboard
              </h1>
              <p className="text-text-light">
                Welcome back, {user?.email}
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <Link to="/">
                <Button variant="outline" size="sm">
                  View Site
                </Button>
              </Link>
              <Button variant="primary" size="sm" onClick={handleLogout}>
                Logout
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        {/* Stats Grid */}
        <motion.div
          variants={staggerContainer}
          initial="initial"
          animate="animate"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
          {stats.map((stat, index) => (
            <motion.div
              key={stat.title}
              variants={fadeUp}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="p-6 hover-lift" hover>
                <Link to={stat.link}>
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-12 h-12 bg-gradient-to-r ${stat.color} rounded-2xl flex items-center justify-center text-white text-xl`}>
                      {stat.icon}
                    </div>
                    {stat.badge && (
                      <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                        {stat.badge} new
                      </span>
                    )}
                  </div>
                  <h3 className="text-2xl font-bold text-text-dark mb-1">
                    {stat.value}
                  </h3>
                  <p className="text-text-light font-medium">
                    {stat.title}
                  </p>
                </Link>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="lg:col-span-2"
          >
            <Card className="p-6">
              <h2 className="text-2xl font-heading font-bold mb-6 text-text-dark">
                Quick Actions
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {quickActions.map((action, index) => (
                  <motion.div
                    key={action.title}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 + index * 0.1 }}
                  >
                    <Link to={action.link}>
                      <Card className="p-4 hover-lift group" hover>
                        <div className="flex items-center space-x-4">
                          <div className={`w-12 h-12 ${action.color} rounded-2xl flex items-center justify-center text-white text-xl group-hover:scale-110 transition-transform`}>
                            {action.icon}
                          </div>
                          <div>
                            <h3 className="font-heading font-semibold text-text-dark group-hover:text-primary transition-colors">
                              {action.title}
                            </h3>
                            <p className="text-text-light text-sm">
                              {action.description}
                            </p>
                          </div>
                        </div>
                      </Card>
                    </Link>
                  </motion.div>
                ))}
              </div>
            </Card>
          </motion.div>

          {/* Recent Activity */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <Card className="p-6">
              <h2 className="text-2xl font-heading font-bold mb-6 text-text-dark">
                Recent Messages
              </h2>
              {messages.slice(0, 5).length > 0 ? (
                <div className="space-y-4">
                  {messages.slice(0, 5).map((message, index) => (
                    <motion.div
                      key={message.id}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.7 + index * 0.1 }}
                      className={`p-4 rounded-2xl border ${
                        !message.read 
                          ? 'bg-primary bg-opacity-5 border-primary border-opacity-20' 
                          : 'bg-gray-50 border-gray-200'
                      }`}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-semibold text-text-dark">
                          {message.name}
                        </h4>
                        {!message.read && (
                          <span className="bg-primary text-white text-xs px-2 py-1 rounded-full">
                            New
                          </span>
                        )}
                      </div>
                      <p className="text-text-light text-sm mb-2 line-clamp-2">
                        {message.message}
                      </p>
                      <div className="flex items-center justify-between text-xs text-text-light">
                        <span>{message.email}</span>
                        <span>
                          {message.createdAt.toLocaleDateString()}
                        </span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="text-4xl mb-4">📭</div>
                  <p className="text-text-light">No messages yet</p>
                </div>
              )}
              {messages.length > 5 && (
                <div className="mt-4 text-center">
                  <Link to="/admin/messages">
                    <Button variant="outline" size="sm">
                      View All Messages
                    </Button>
                  </Link>
                </div>
              )}
            </Card>
          </motion.div>
        </div>

        {/* Profile Summary */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="mt-8"
        >
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-heading font-bold text-text-dark">
                Profile Summary
              </h2>
              <Link to="/admin/profile">
                <Button variant="outline" size="sm">
                  Edit Profile
                </Button>
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary mb-2">
                  {profile?.name?.split(' ')[0] || 'Ahmar'}
                </div>
                <div className="text-text-light">First Name</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary mb-2">
                  {profile?.title?.split('|')[0]?.trim() || 'Flutter Developer'}
                </div>
                <div className="text-text-light">Primary Role</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary mb-2">
                  {profile?.location?.split(',')[0] || 'Okara'}
                </div>
                <div className="text-text-light">City</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary mb-2">
                  {profile?.university?.split('(')[0]?.trim() || 'UET Lahore'}
                </div>
                <div className="text-text-light">University</div>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;