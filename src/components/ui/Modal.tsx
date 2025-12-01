import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX } from 'react-icons/fi';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  closeOnBackdropClick?: boolean;
  showCloseButton?: boolean;
}

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  size = 'md',
  closeOnBackdropClick = true,
  showCloseButton = true
}) => {
  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-2xl',
    lg: 'max-w-4xl',
    xl: 'max-w-6xl',
    full: 'max-w-7xl'
  };

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      document.body.style.paddingRight = '0px'; // Prevent layout shift
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Handle escape key to close modal
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  return (
    <AnimatePresence mode="wait">
      {isOpen && (
        <>
          {/* Backdrop with blur effect */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={closeOnBackdropClick ? onClose : undefined}
          >
            {/* Modal Container */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ 
                type: "spring", 
                damping: 25, 
                stiffness: 300,
                mass: 0.8
              }}
              className={`bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full ${sizeClasses[size]} max-h-[90vh] flex flex-col`}
              onClick={(e) => e.stopPropagation()}
              role="dialog"
              aria-modal="true"
              aria-labelledby="modal-title"
            >
              {/* Header with gradient */}
              <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-800 bg-gradient-to-r from-white to-gray-50 dark:from-gray-900 dark:to-gray-800">
                <div className="flex-1 min-w-0">
                  <h3 
                    id="modal-title"
                    className="text-xl font-heading font-semibold text-text-dark dark:text-white truncate"
                  >
                    {title}
                  </h3>
                </div>
                {showCloseButton && (
                  <button
                    onClick={onClose}
                    className="ml-4 flex-shrink-0 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200 p-2 rounded-full"
                    aria-label="Close modal"
                  >
                    <FiX className="w-5 h-5" />
                  </button>
                )}
              </div>
              
              {/* Scrollable Content Area */}
              <div 
                className="flex-1 overflow-y-auto overscroll-contain"
                style={{
                  maxHeight: 'calc(90vh - 73px)', // 73px is header height
                  WebkitOverflowScrolling: 'touch' // Smooth scrolling on iOS
                }}
              >
                <div className="p-6">
                  {children}
                </div>
              </div>

              {/* Optional Footer for buttons */}
              <div className="border-t border-gray-200 dark:border-gray-800 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-b-2xl">
                <div className="flex justify-end space-x-3">
                  <button
                    onClick={onClose}
                    className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors duration-200"
                  >
                    Close
                  </button>
                  <button
                    onClick={() => {
                      // Add your primary action here
                      console.log('Primary action');
                    }}
                    className="px-4 py-2 text-sm font-medium text-white bg-primary hover:bg-primary/90 rounded-lg transition-colors duration-200"
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* Prevent background scroll */}
          <style >{`
            body.modal-open {
              overflow: hidden;
              padding-right: 0px;
            }
          `}</style>
        </>
      )}
    </AnimatePresence>
  );
};

// Alternative Modal without footer (for flexibility)
export const SimpleModal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  size = 'md',
  closeOnBackdropClick = true,
  showCloseButton = true
}) => {
  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-2xl',
    lg: 'max-w-4xl',
    xl: 'max-w-6xl',
    full: 'max-w-7xl'
  };

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto"
          onClick={closeOnBackdropClick ? onClose : undefined}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ 
              type: "spring", 
              damping: 25, 
              stiffness: 300 
            }}
            className={`bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full ${sizeClasses[size]} my-8`}
            onClick={(e) => e.stopPropagation()}
            style={{ maxHeight: 'calc(100vh - 4rem)' }}
          >
            {/* Header */}
            <div className="sticky top-0 z-10 flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 rounded-t-2xl">
              <h3 className="text-xl font-heading font-semibold text-text-dark dark:text-white">
                {title}
              </h3>
              {showCloseButton && (
                <button
                  onClick={onClose}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors duration-200 p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full"
                  aria-label="Close modal"
                >
                  <FiX className="w-6 h-6" />
                </button>
              )}
            </div>
            
            {/* Scrollable Content */}
            <div 
              className="overflow-y-auto p-6"
              style={{ 
                maxHeight: 'calc(80vh - 120px)',
                overscrollBehavior: 'contain'
              }}
            >
              {children}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// Usage Example Component
export const ModalExample: React.FC = () => {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <div>
      <button 
        onClick={() => setIsOpen(true)}
        className="px-4 py-2 bg-primary text-white rounded-lg"
      >
        Open Modal
      </button>

      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="Example Modal"
        size="lg"
      >
        <div className="space-y-4">
          <p className="text-gray-600 dark:text-gray-300">
            This is a scrollable modal example. Try adding more content to see the scroll behavior.
          </p>
          
          {/* Example long content */}
          {Array.from({ length: 20 }).map((_, i) => (
            <div key={i} className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <h4 className="font-medium text-text-dark dark:text-white">Section {i + 1}</h4>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                This is some example content to demonstrate scrolling within the modal.
              </p>
            </div>
          ))}
        </div>
      </Modal>
    </div>
  );
};

export default Modal;