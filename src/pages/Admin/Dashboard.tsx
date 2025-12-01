import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useProjects, useSkills, useMessages, useProfile } from '../../hooks/useFirestore';
import LoadingSkeleton from '../../components/LoadingSkeleton';
import { fadeUp, staggerContainer } from '../../utils/animations';

// Button component (keeping as is, but with slight enhancement)
interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
  className?: string;
  icon?: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  onClick,
  type = 'button',
  disabled = false,
  className = '',
  icon
}) => {
  const baseClasses = 'rounded-xl font-medium transition-all duration-300 focus:outline-none focus:ring-2 flex items-center justify-center gap-2';
  
  const variantClasses = {
    primary: 'bg-gradient-to-r from-primary to-orange-500 text-white hover:shadow-xl hover:shadow-primary/25 active:scale-95',
    secondary: 'bg-gradient-to-r from-secondary to-purple-500 text-white hover:shadow-xl hover:shadow-secondary/25 active:scale-95',
    outline: 'border-2 border-primary text-primary bg-transparent hover:bg-primary/5 active:scale-95',
    ghost: 'text-primary hover:bg-primary/10 active:scale-95'
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
      whileHover={!disabled ? { scale: 1.02 } : {}}
      whileTap={!disabled ? { scale: 0.98 } : {}}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
    >
      {icon && <span>{icon}</span>}
      {children}
    </motion.button>
  );
};

// Card component with enhanced design
interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  glass?: boolean;
  gradient?: boolean;
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

const Card: React.FC<CardProps> = ({ 
  children, 
  className = '', 
  hover = false,
  glass = false,
  gradient = false,
  padding = 'md'
}) => {
  const paddingClasses = {
    none: '',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8'
  };

  const baseClasses = 'rounded-2xl shadow-lg overflow-hidden';
  
  const styleClasses = glass 
    ? 'bg-white/10 backdrop-blur-lg border border-white/20 shadow-xl'
    : gradient
    ? 'bg-gradient-to-br from-white to-gray-50 border border-gray-100'
    : 'bg-white border border-gray-100';
  
  const hoverClasses = hover 
    ? 'transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:border-primary/20' 
    : '';

  const classes = `${baseClasses} ${styleClasses} ${hoverClasses} ${paddingClasses[padding]} ${className}`;

  return (
    <motion.div
      className={classes}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
};

// Dashboard Component
const Dashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const { projects, loading: projectsLoading } = useProjects();
  const { skills, loading: skillsLoading } = useSkills();
  const { messages, loading: messagesLoading } = useMessages();
  const { profile, loading: profileLoading } = useProfile();
  const [sidebarOpen, setSidebarOpen] = useState(false);

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
      color: 'from-primary via-orange-400 to-red-400',
      bgColor: 'bg-gradient-to-br from-primary/10 to-orange-100',
      trend: '+12%',
      link: '/admin/projects'
    },
    {
      title: 'Skills',
      value: skills.length,
      icon: '⚡',
      color: 'from-accent via-green-500 to-emerald-500',
      bgColor: 'bg-gradient-to-br from-accent/10 to-green-100',
      trend: '+5',
      link: '/admin/skills'
    },
    {
      title: 'Messages',
      value: messages.length,
      icon: '✉️',
      color: 'from-purple-500 via-pink-500 to-rose-500',
      bgColor: 'bg-gradient-to-br from-purple-100 to-pink-100',
      trend: unreadMessages > 0 ? `${unreadMessages} unread` : 'All read',
      link: '/admin/messages',
      badge: unreadMessages > 0 ? unreadMessages : undefined
    },
    {
      title: 'Featured',
      value: featuredProjects,
      icon: '⭐',
      color: 'from-yellow-500 via-orange-500 to-amber-500',
      bgColor: 'bg-gradient-to-br from-yellow-100 to-orange-100',
      trend: `${Math.round((featuredProjects / projects.length) * 100) || 0}%`,
      link: '/admin/projects'
    }
  ];

  const quickActions = [
    {
      title: 'New Project',
      description: 'Create project entry',
      icon: '➕',
      link: '/admin/projects?action=add',
      color: 'from-primary to-orange-500',
      iconColor: 'text-primary'
    },
    {
      title: 'Manage Skills',
      description: 'Update skills list',
      icon: '⚡',
      link: '/admin/skills',
      color: 'from-accent to-green-500',
      iconColor: 'text-accent'
    },
    {
      title: 'Messages',
      description: 'Check inbox',
      icon: '✉️',
      link: '/admin/messages',
      color: 'from-purple-500 to-pink-500',
      iconColor: 'text-purple-600'
    },
    {
      title: 'Profile',
      description: 'Update info',
      icon: '👤',
      link: '/admin/profile',
      color: 'from-secondary to-blue-500',
      iconColor: 'text-secondary'
    },
    {
      title: 'Analytics',
      description: 'View stats',
      icon: '📊',
      link: '/admin/analytics',
      color: 'from-cyan-500 to-blue-500',
      iconColor: 'text-cyan-600'
    },
    {
      title: 'Settings',
      description: 'System settings',
      icon: '⚙️',
      link: '/admin/settings',
      color: 'from-gray-600 to-gray-800',
      iconColor: 'text-gray-600'
    }
  ];

  const recentMessages = messages.slice(0, 3);

  if (projectsLoading || skillsLoading || messagesLoading || profileLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-gray-50 to-background p-4 md:p-6">
        <div className="max-w-7xl mx-auto">
          <LoadingSkeleton type="card" count={6} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-gray-50 to-background">
      {/* Header */}
      <motion.header 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="sticky top-0 z-50 bg-white/90 backdrop-blur-lg border-b border-gray-200/50 shadow-sm"
      >
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button 
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="md:hidden p-2 rounded-lg hover:bg-gray-100"
              >
                <span className="text-2xl">☰</span>
              </button>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-orange-500 bg-clip-text text-transparent">
                  Dashboard
                </h1>
                <p className="text-sm text-gray-500">
                  Welcome back, <span className="font-semibold">{user?.email?.split('@')[0]}</span>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Link to="/" className="hidden md:block">
                <Button variant="ghost" size="sm" icon="🌐">
                  View Site
                </Button>
              </Link>
              <Button 
                variant="primary" 
                size="sm" 
                onClick={handleLogout}
                icon="🚪"
                className="shadow-lg shadow-primary/25"
              >
                Logout
              </Button>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ x: -300 }}
            animate={{ x: 0 }}
            exit={{ x: -300 }}
            className="fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 shadow-xl md:hidden"
          >
            <div className="p-4">
              <h3 className="font-bold text-lg mb-4">Navigation</h3>
              <div className="space-y-2">
                {quickActions.map((action) => (
                  <Link 
                    key={action.title} 
                    to={action.link}
                    onClick={() => setSidebarOpen(false)}
                  >
                    <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 transition-colors">
                      <div className="text-lg">{action.icon}</div>
                      <div>
                        <div className="font-medium">{action.title}</div>
                        <div className="text-sm text-gray-500">{action.description}</div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto p-4 md:p-6">
        {/* Hero Section */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mb-8"
        >
          <Card gradient padding="lg" className="relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary/20 to-accent/20 rounded-full -translate-y-16 translate-x-16"></div>
            <div className="relative z-10">
              <h2 className="text-3xl font-bold text-gray-800 mb-2">
                Hello, {profile?.name?.split(' ')[0] || 'Admin'}! 👋
              </h2>
              <p className="text-gray-600 mb-6 max-w-2xl">
                Here's what's happening with your portfolio today. You have {unreadMessages} unread messages and {featuredProjects} featured projects.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link to="/admin/projects?action=add">
                  <Button variant="primary" icon="🚀">
                    Create New Project
                  </Button>
                </Link>
                <Link to="/admin/messages">
                  <Button variant="outline" icon="📨">
                    Check Messages
                  </Button>
                </Link>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          variants={staggerContainer}
          initial="initial"
          animate="animate"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8"
        >
          {stats.map((stat, index) => (
            <motion.div
              key={stat.title}
              variants={fadeUp}
              transition={{ delay: index * 0.1 }}
            >
              <Card hover padding="md" className="h-full">
                <Link to={stat.link}>
                  <div className="flex items-start justify-between mb-4">
                    <div className={`p-3 rounded-xl ${stat.bgColor}`}>
                      <span className="text-2xl">{stat.icon}</span>
                    </div>
                    {stat.badge && (
                      <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full animate-pulse">
                        {stat.badge} new
                      </span>
                    )}
                  </div>
                  
                  <div className="flex items-end justify-between">
                    <div>
                      <p className="text-sm text-gray-500 font-medium mb-1">
                        {stat.title}
                      </p>
                      <h3 className="text-2xl md:text-3xl font-bold text-gray-800">
                        {stat.value}
                      </h3>
                    </div>
                    <span className="text-sm font-medium text-gray-600">
                      {stat.trend}
                    </span>
                  </div>

                  <div className="mt-4">
                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${Math.min(100, (stat.value / 10) * 100)}%` }}
                        transition={{ delay: 0.5, duration: 1 }}
                        className={`h-full rounded-full bg-gradient-to-r ${stat.color}`}
                      />
                    </div>
                  </div>
                </Link>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
          {/* Quick Actions Grid */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="lg:col-span-2"
          >
            <Card padding="lg">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-800">
                  Quick Actions
                </h2>
                <span className="text-sm text-gray-500">
                  {quickActions.length} options
                </span>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {quickActions.map((action, index) => (
                  <motion.div
                    key={action.title}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.5 + index * 0.1 }}
                  >
                    <Link to={action.link}>
                      <Card hover padding="sm" className="h-full">
                        <div className="flex flex-col items-center text-center p-4">
                          <div className={`text-3xl mb-3 ${action.iconColor}`}>
                            {action.icon}
                          </div>
                          <h3 className="font-bold text-gray-800 mb-1">
                            {action.title}
                          </h3>
                          <p className="text-sm text-gray-500">
                            {action.description}
                          </p>
                          <motion.div 
                            className="mt-4 w-8 h-1 rounded-full bg-gradient-to-r opacity-0 group-hover:opacity-100"
                            whileHover={{ width: '100%' }}
                            transition={{ duration: 0.3 }}
                          />
                        </div>
                      </Card>
                    </Link>
                  </motion.div>
                ))}
              </div>
            </Card>
          </motion.div>

          {/* Recent Messages */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <Card padding="lg" className="h-full">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-800">
                  Recent Messages
                </h2>
                <span className="text-sm text-primary font-medium">
                  {unreadMessages} unread
                </span>
              </div>

              <div className="space-y-4">
                {recentMessages.length > 0 ? (
                  recentMessages.map((message, index) => (
                    <motion.div
                      key={message.id}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.7 + index * 0.1 }}
                      className={`p-4 rounded-xl border transition-all duration-300 hover:shadow-md ${
                        !message.read 
                          ? 'bg-gradient-to-r from-primary/5 to-orange-50 border-primary/20' 
                          : 'bg-gray-50/50 border-gray-200'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          !message.read 
                            ? 'bg-primary/20 text-primary' 
                            : 'bg-gray-200 text-gray-600'
                        }`}>
                          {message.name.charAt(0)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <h4 className="font-semibold text-gray-800 truncate">
                              {message.name}
                            </h4>
                            {!message.read && (
                              <span className="bg-primary text-white text-xs px-2 py-0.5 rounded-full animate-pulse">
                                New
                              </span>
                            )}
                          </div>
                          <p className="text-gray-600 text-sm mb-2 line-clamp-2">
                            {message.message}
                          </p>
                          <div className="flex items-center justify-between text-xs text-gray-500">
                            <span className="truncate">{message.email}</span>
                            <span>
                              {message.createdAt.toLocaleDateString('en-US', { 
                                month: 'short', 
                                day: 'numeric' 
                              })}
                            </span>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <div className="text-5xl mb-4 opacity-20">📭</div>
                    <p className="text-gray-500">No messages yet</p>
                    <p className="text-sm text-gray-400 mt-2">
                      Messages from your portfolio will appear here
                    </p>
                  </div>
                )}
              </div>

              {messages.length > 3 && (
                <div className="mt-6 text-center">
                  <Link to="/admin/messages">
                    <Button variant="outline" size="sm" className="w-full">
                      View All Messages ({messages.length})
                    </Button>
                  </Link>
                </div>
              )}
            </Card>
          </motion.div>
        </div>

        {/* Profile & Projects Summary */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="mt-8"
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
            {/* Profile Summary */}
            <Card padding="lg">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-800">
                  Profile Overview
                </h2>
                <Link to="/admin/profile">
                  <Button variant="ghost" size="sm" icon="✏️">
                    Edit
                  </Button>
                </Link>
              </div>
              
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-r from-primary to-orange-500 flex items-center justify-center text-white text-2xl font-bold">
                    {profile?.name?.charAt(0) || 'A'}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-800">
                      {profile?.name || 'Ahmar Ali'}
                    </h3>
                    <p className="text-gray-600">
                      {profile?.title || 'Flutter Developer'}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-50 rounded-xl p-4">
                    <div className="text-sm text-gray-500 mb-1">Location</div>
                    <div className="font-medium text-gray-800">
                      {profile?.location?.split(',')[0] || 'Okara'}
                    </div>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-4">
                    <div className="text-sm text-gray-500 mb-1">University</div>
                    <div className="font-medium text-gray-800">
                      {profile?.university?.split('(')[0]?.trim() || 'UET Lahore'}
                    </div>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-4">
                    <div className="text-sm text-gray-500 mb-1">Projects</div>
                    <div className="font-medium text-gray-800">
                      {projects.length} total
                    </div>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-4">
                    <div className="text-sm text-gray-500 mb-1">Skills</div>
                    <div className="font-medium text-gray-800">
                      {skills.length} skills
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            {/* Projects Overview */}
            <Card padding="lg">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-800">
                  Projects Overview
                </h2>
                <Link to="/admin/projects">
                  <Button variant="ghost" size="sm" icon="📊">
                    Details
                  </Button>
                </Link>
              </div>
              
              <div className="space-y-6">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-600">Featured Projects</span>
                    <span className="font-bold text-primary">{featuredProjects}</span>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${(featuredProjects / projects.length) * 100 || 0}%` }}
                      className="h-full bg-gradient-to-r from-primary to-orange-500"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-600">Active Projects</span>
                    <span className="font-bold text-green-600">{projects.length}</span>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.min(100, (projects.length / 20) * 100)}%` }}
                      className="h-full bg-gradient-to-r from-green-500 to-emerald-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mt-6">
                  <Link to="/admin/projects?filter=featured">
                    <Card hover padding="sm" className="text-center">
                      <div className="text-2xl mb-2">⭐</div>
                      <div className="font-medium">Featured</div>
                      <div className="text-sm text-gray-500">{featuredProjects} projects</div>
                    </Card>
                  </Link>
                  <Link to="/admin/projects?filter=recent">
                    <Card hover padding="sm" className="text-center">
                      <div className="text-2xl mb-2">🕒</div>
                      <div className="font-medium">Recent</div>
                      <div className="text-sm text-gray-500">
                        {projects.slice(0, 3).length} new
                      </div>
                    </Card>
                  </Link>
                </div>
              </div>
            </Card>
          </div>
        </motion.div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="mt-8 text-center text-sm text-gray-500"
        >
          <p>Last updated: {new Date().toLocaleDateString()} • Dashboard v2.0</p>
          <p className="mt-1">Total: {projects.length} projects • {skills.length} skills • {messages.length} messages</p>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;