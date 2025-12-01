import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useMessages } from '../../hooks/useFirestore';
import LoadingSkeleton from '../../components/LoadingSkeleton';
import { fadeUp, staggerContainer } from '../../utils/animations';
import type { Message } from '../../firebase/models';

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

const MessagesAdmin: React.FC = () => {
  const { messages, loading, markAsRead, deleteMessage } = useMessages();
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [filter, setFilter] = useState<'all' | 'unread'>('all');

  const filteredMessages = filter === 'unread' 
    ? messages.filter(msg => !msg.read)
    : messages;

  const unreadCount = messages.filter(msg => !msg.read).length;

  const handleMarkAsRead = async (messageId: string) => {
    try {
      await markAsRead(messageId);
      if (selectedMessage?.id === messageId) {
        setSelectedMessage({ ...selectedMessage, read: true });
      }
    } catch (error) {
      console.error('Error marking message as read:', error);
    }
  };

  const handleMarkAllAsRead = async () => {
    const unreadMessages = messages.filter(msg => !msg.read);
    for (const message of unreadMessages) {
      try {
        await markAsRead(message.id);
      } catch (error) {
        console.error('Error marking message as read:', error);
      }
    }
  };

  const handleDelete = async (messageId: string) => {
    if (window.confirm('Are you sure you want to delete this message?')) {
      try {
        await deleteMessage(messageId);
        if (selectedMessage?.id === messageId) {
          setSelectedMessage(null);
        }
      } catch (error) {
        console.error('Error deleting message:', error);
        alert('Failed to delete message. Please try again.');
      }
    }
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
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
                Messages
              </h1>
              <p className="text-text-light">
                Manage incoming messages from your contact form
              </p>
            </div>
            <div className="flex items-center space-x-3">
              {unreadCount > 0 && (
                <Button variant="outline" size="sm" onClick={handleMarkAllAsRead}>
                  Mark All as Read
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Messages List */}
          <div className="lg:col-span-1">
            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-heading font-bold text-text-dark">
                  Inbox ({filteredMessages.length})
                </h2>
                <div className="flex space-x-2">
                  <button
                    onClick={() => setFilter('all')}
                    className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                      filter === 'all'
                        ? 'bg-primary text-white'
                        : 'bg-secondary text-text-dark hover:bg-primary hover:text-white'
                    }`}
                  >
                    All
                  </button>
                  <button
                    onClick={() => setFilter('unread')}
                    className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                      filter === 'unread'
                        ? 'bg-primary text-white'
                        : 'bg-secondary text-text-dark hover:bg-primary hover:text-white'
                    }`}
                  >
                    Unread {unreadCount > 0 && `(${unreadCount})`}
                  </button>
                </div>
              </div>

              {filteredMessages.length > 0 ? (
                <motion.div
                  variants={staggerContainer}
                  initial="initial"
                  animate="animate"
                  className="space-y-3 max-h-[600px] overflow-y-auto"
                >
                  {filteredMessages.map((message, index) => (
                    <motion.div
                      key={message.id}
                      variants={fadeUp}
                      transition={{ delay: index * 0.1 }}
                    >
                      <div 
                        className={`p-4 cursor-pointer transition-all duration-300 hover-lift rounded-2xl shadow-lg border border-gray-100 bg-white ${
                          selectedMessage?.id === message.id
                            ? 'border-2 border-primary bg-primary bg-opacity-5'
                            : !message.read
                            ? 'border-2 border-primary border-opacity-30 bg-primary bg-opacity-5'
                            : ''
                        }`}
                        onClick={() => setSelectedMessage(message)}
                      >
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="font-semibold text-text-dark truncate">
                            {message.name}
                          </h3>
                          {!message.read && (
                            <span className="bg-primary text-white text-xs px-2 py-1 rounded-full whitespace-nowrap">
                              New
                            </span>
                          )}
                        </div>
                        <p className="text-text-light text-sm mb-2 line-clamp-2">
                          {message.message}
                        </p>
                        <div className="flex items-center justify-between text-xs text-text-light">
                          <span className="truncate">{message.email}</span>
                          <span>{formatDate(message.createdAt)}</span>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              ) : (
                <div className="text-center py-8">
                  <div className="text-4xl mb-4">📭</div>
                  <p className="text-text-light">
                    {filter === 'unread' ? 'No unread messages' : 'No messages yet'}
                  </p>
                </div>
              )}
            </Card>
          </div>

          {/* Message Detail */}
          <div className="lg:col-span-2">
            {selectedMessage ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <Card className="p-6">
                  <div className="flex items-start justify-between mb-6">
                    <div>
                      <h2 className="text-2xl font-heading font-bold text-text-dark mb-2">
                        {selectedMessage.name}
                      </h2>
                      <a
                        href={`mailto:${selectedMessage.email}`}
                        className="text-primary hover:text-accent font-medium"
                      >
                        {selectedMessage.email}
                      </a>
                    </div>
                    <div className="flex items-center space-x-2">
                      {!selectedMessage.read && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleMarkAsRead(selectedMessage.id)}
                        >
                          Mark as Read
                        </Button>
                      )}
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => handleDelete(selectedMessage.id)}
                      >
                        Delete
                      </Button>
                    </div>
                  </div>

                  <div className="mb-6">
                    <div className="flex items-center space-x-4 text-sm text-text-light mb-4">
                      <span>Received: {formatDate(selectedMessage.createdAt)}</span>
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        selectedMessage.read 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-primary text-white'
                      }`}>
                        {selectedMessage.read ? 'Read' : 'Unread'}
                      </span>
                    </div>

                    <div className="bg-gray-50 rounded-2xl p-6">
                      <h3 className="font-semibold text-text-dark mb-3">Message:</h3>
                      <p className="text-text-light leading-relaxed whitespace-pre-wrap">
                        {selectedMessage.message}
                      </p>
                    </div>
                  </div>

                  <div className="flex space-x-3">
                    <a
                      href={`mailto:${selectedMessage.email}?subject=Re: Your message from portfolio&body=Hi ${selectedMessage.name},%0D%0A%0D%0AThank you for reaching out!%0D%0A%0D%0A`}
                      className="flex-1"
                    >
                      <Button variant="primary" className="w-full">
                        Reply via Email
                      </Button>
                    </a>
                    <Button
                      variant="outline"
                      className="flex-1"
                      onClick={() => handleDelete(selectedMessage.id)}
                    >
                      Delete Message
                    </Button>
                  </div>
                </Card>
              </motion.div>
            ) : (
              <Card className="p-8 text-center">
                <div className="text-6xl mb-4">👆</div>
                <h3 className="text-xl font-heading font-bold mb-4 text-text-dark">
                  Select a Message
                </h3>
                <p className="text-text-light">
                  Choose a message from the list to view its details and respond.
                </p>
              </Card>
            )}
          </div>
        </div>

        {/* Quick Stats */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-8"
        >
          <Card className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-center">
              <div>
                <div className="text-2xl font-bold text-primary mb-2">
                  {messages.length}
                </div>
                <div className="text-text-light font-medium">Total Messages</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-primary mb-2">
                  {unreadCount}
                </div>
                <div className="text-text-light font-medium">Unread</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-primary mb-2">
                  {messages.length - unreadCount}
                </div>
                <div className="text-text-light font-medium">Read</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-primary mb-2">
                  {messages.length > 0 
                    ? Math.round((unreadCount / messages.length) * 100)
                    : 0
                  }%
                </div>
                <div className="text-text-light font-medium">Unread Rate</div>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default MessagesAdmin;