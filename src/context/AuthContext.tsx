import React, { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { 
  type User as FirebaseUser,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  onAuthStateChanged,
  type AuthError,
  AuthErrorCodes
} from 'firebase/auth';
import { auth } from '../firebase/firebaseClient';
import type { User, AuthContextType } from '../firebase/models';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

// Helper function to check if error is an AuthError
const isAuthError = (error: unknown): error is AuthError => {
  return error instanceof Error && 'code' in error;
};

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const login = async (email: string, password: string): Promise<void> => {
    try {
      console.log('🔄 Attempting login with:', email);
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const firebaseUser = userCredential.user;
      
      console.log('✅ Login successful!');
      console.log('📧 User email:', firebaseUser.email);
      console.log('🔑 User UID:', firebaseUser.uid);
      
      setUser({
        uid: firebaseUser.uid,
        email: firebaseUser.email,
        displayName: firebaseUser.displayName
      });
    } catch (error: unknown) {
      console.error('❌ Login error:', error);
      
      // Provide more user-friendly error messages
      let errorMessage = 'Failed to login. Please try again.';
      
      if (isAuthError(error)) {
        console.error('❌ Login error code:', error.code);
        
        switch (error.code) {
          case AuthErrorCodes.INVALID_EMAIL:
            errorMessage = 'Invalid email address.';
            break;
          case AuthErrorCodes.USER_DISABLED:
            errorMessage = 'This account has been disabled.';
            break;
          case AuthErrorCodes.USER_DELETED:
            errorMessage = 'No account found with this email.';
            break;
          case AuthErrorCodes.INVALID_PASSWORD:
            errorMessage = 'Incorrect password.';
            break;
          case AuthErrorCodes.TOO_MANY_ATTEMPTS_TRY_LATER:
            errorMessage = 'Too many failed attempts. Please try again later.';
            break;
          case AuthErrorCodes.NETWORK_REQUEST_FAILED:
            errorMessage = 'Network error. Please check your internet connection.';
            break;
        }
      }
      
      throw new Error(errorMessage);
    }
  };

  const logout = async (): Promise<void> => {
    try {
      console.log('🔄 Logging out...');
      await signOut(auth);
      setUser(null);
      console.log('✅ Logout successful');
    } catch (error: unknown) {
      console.error('❌ Logout error:', error);
      
      let errorMessage = 'Failed to logout. Please try again.';
      
      if (isAuthError(error)) {
        console.error('❌ Logout error code:', error.code);
        
        if (error.code === AuthErrorCodes.NETWORK_REQUEST_FAILED) {
          errorMessage = 'Network error. Please check your internet connection.';
        }
      }
      
      throw new Error(errorMessage);
    }
  };

  const resetPassword = async (email: string): Promise<void> => {
    try {
      console.log('🔄 Sending password reset to:', email);
      await sendPasswordResetEmail(auth, email);
      console.log('✅ Password reset email sent');
    } catch (error: unknown) {
      console.error('❌ Password reset error:', error);
      
      let errorMessage = 'Failed to send password reset email.';
      
      if (isAuthError(error)) {
        console.error('❌ Password reset error code:', error.code);
        
        switch (error.code) {
          case AuthErrorCodes.USER_DELETED:
            errorMessage = 'No account found with this email.';
            break;
          case AuthErrorCodes.INVALID_EMAIL:
            errorMessage = 'Invalid email address.';
            break;
          case AuthErrorCodes.NETWORK_REQUEST_FAILED:
            errorMessage = 'Network error. Please check your internet connection.';
            break;
        }
      }
      
      throw new Error(errorMessage);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser: FirebaseUser | null) => {
      console.log('🔄 Auth state changed:', firebaseUser ? `User ${firebaseUser.email} (UID: ${firebaseUser.uid})` : 'No user');
      
      if (firebaseUser) {
        setUser({
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          displayName: firebaseUser.displayName
        });
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const value: AuthContextType = {
    user,
    loading,
    login,
    logout,
    resetPassword
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};