import { useState, useEffect } from 'react';
import { 
  collection,
  doc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  Timestamp
} from 'firebase/firestore';
import { db } from '../firebase/firebaseClient';
import { 
  type Project, 
  type Skill, 
  type Message, 
  type Profile, 
  type ContactFormData, 
  type ProjectFormData, 
  type SkillFormData,
  type ProfileFormData,
  COLLECTIONS 
} from '../firebase/models';

// Projects hooks
export const useProjects = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const projectsQuery = query(
        collection(db, COLLECTIONS.PROJECTS),
        orderBy('createdAt', 'desc')
      );
      const querySnapshot = await getDocs(projectsQuery);
      const projectsData: Project[] = [];
      
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        projectsData.push({
          id: doc.id,
          ...data,
          createdAt: data.createdAt?.toDate() || new Date(),
          updatedAt: data.updatedAt?.toDate() || new Date(),
        } as Project);
      });
      
      setProjects(projectsData);
      setError(null);
    } catch (err) {
      setError('Failed to fetch projects');
      console.error('Error fetching projects:', err);
    } finally {
      setLoading(false);
    }
  };

  const addProject = async (projectData: ProjectFormData): Promise<string> => {
    try {
      const docRef = await addDoc(collection(db, COLLECTIONS.PROJECTS), {
        ...projectData,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      });
      await fetchProjects(); // Refresh the list
      return docRef.id;
    } catch (err) {
      console.error('Error adding project:', err);
      throw err;
    }
  };

  const updateProject = async (id: string, projectData: Partial<ProjectFormData>): Promise<void> => {
    try {
      const projectRef = doc(db, COLLECTIONS.PROJECTS, id);
      await updateDoc(projectRef, {
        ...projectData,
        updatedAt: Timestamp.now(),
      });
      await fetchProjects(); // Refresh the list
    } catch (err) {
      console.error('Error updating project:', err);
      throw err;
    }
  };

  const deleteProject = async (id: string): Promise<void> => {
    try {
      await deleteDoc(doc(db, COLLECTIONS.PROJECTS, id));
      await fetchProjects(); // Refresh the list
    } catch (err) {
      console.error('Error deleting project:', err);
      throw err;
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  return {
    projects,
    loading,
    error,
    refetch: fetchProjects,
    addProject,
    updateProject,
    deleteProject
  };
};

// Skills hooks
export const useSkills = () => {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSkills = async () => {
    try {
      setLoading(true);
      const skillsQuery = query(
        collection(db, COLLECTIONS.SKILLS),
        orderBy('proficiency', 'desc')
      );
      const querySnapshot = await getDocs(skillsQuery);
      const skillsData: Skill[] = [];
      
      querySnapshot.forEach((doc) => {
        skillsData.push({
          id: doc.id,
          ...doc.data(),
        } as Skill);
      });
      
      setSkills(skillsData);
      setError(null);
    } catch (err) {
      setError('Failed to fetch skills');
      console.error('Error fetching skills:', err);
    } finally {
      setLoading(false);
    }
  };

  const addSkill = async (skillData: SkillFormData): Promise<string> => {
    try {
      const docRef = await addDoc(collection(db, COLLECTIONS.SKILLS), skillData);
      await fetchSkills(); // Refresh the list
      return docRef.id;
    } catch (err) {
      console.error('Error adding skill:', err);
      throw err;
    }
  };

  const updateSkill = async (id: string, skillData: Partial<SkillFormData>): Promise<void> => {
    try {
      const skillRef = doc(db, COLLECTIONS.SKILLS, id);
      await updateDoc(skillRef, skillData);
      await fetchSkills(); // Refresh the list
    } catch (err) {
      console.error('Error updating skill:', err);
      throw err;
    }
  };

  const deleteSkill = async (id: string): Promise<void> => {
    try {
      await deleteDoc(doc(db, COLLECTIONS.SKILLS, id));
      await fetchSkills(); // Refresh the list
    } catch (err) {
      console.error('Error deleting skill:', err);
      throw err;
    }
  };

  useEffect(() => {
    fetchSkills();
  }, []);

  return {
    skills,
    loading,
    error,
    refetch: fetchSkills,
    addSkill,
    updateSkill,
    deleteSkill
  };
};

// Messages hooks
export const useMessages = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMessages = async () => {
    try {
      setLoading(true);
      const messagesQuery = query(
        collection(db, COLLECTIONS.MESSAGES),
        orderBy('createdAt', 'desc')
      );
      const querySnapshot = await getDocs(messagesQuery);
      const messagesData: Message[] = [];
      
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        messagesData.push({
          id: doc.id,
          ...data,
          createdAt: data.createdAt?.toDate() || new Date(),
        } as Message);
      });
      
      setMessages(messagesData);
      setError(null);
    } catch (err) {
      setError('Failed to fetch messages');
      console.error('Error fetching messages:', err);
    } finally {
      setLoading(false);
    }
  };

  const addMessage = async (messageData: ContactFormData): Promise<string> => {
    try {
      const docRef = await addDoc(collection(db, COLLECTIONS.MESSAGES), {
        ...messageData,
        read: false,
        createdAt: Timestamp.now(),
      });
      await fetchMessages(); // Refresh the list
      return docRef.id;
    } catch (err) {
      console.error('Error adding message:', err);
      throw err;
    }
  };

  const markAsRead = async (id: string): Promise<void> => {
    try {
      const messageRef = doc(db, COLLECTIONS.MESSAGES, id);
      await updateDoc(messageRef, { read: true });
      await fetchMessages(); // Refresh the list
    } catch (err) {
      console.error('Error marking message as read:', err);
      throw err;
    }
  };

  const deleteMessage = async (id: string): Promise<void> => {
    try {
      await deleteDoc(doc(db, COLLECTIONS.MESSAGES, id));
      await fetchMessages(); // Refresh the list
    } catch (err) {
      console.error('Error deleting message:', err);
      throw err;
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  return {
    messages,
    loading,
    error,
    refetch: fetchMessages,
    addMessage,
    markAsRead,
    deleteMessage
  };
};

// Profile hooks
export const useProfile = () => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const profileQuery = query(collection(db, COLLECTIONS.PROFILE));
      const querySnapshot = await getDocs(profileQuery);
      
      if (!querySnapshot.empty) {
        const doc = querySnapshot.docs[0];
        const data = doc.data();
        setProfile({
          id: doc.id,
          ...data,
        } as Profile);
      } else {
        // Create default profile if none exists
        const defaultProfile: ProfileFormData = {
          name: 'Muhammad Ahmar Saleem',
          title: 'Flutter Developer | Software Engineering Student',
          bio: 'I am a passionate and dedicated Flutter developer and Software Engineering student at UET Lahore. I love building beautiful, modern, and functional mobile applications. With a strong foundation in programming and continuous learning, I aim to become a professional mobile app developer and begin my freelancing journey.',
          profileImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=200&h=200&q=80',
          email: 'ahmar@example.com',
          location: 'Okara, Punjab, Pakistan',
          university: 'University of Engineering & Technology (UET), Lahore',
          department: 'Software Engineering',
          hometown: 'Okara, Punjab, Pakistan',
          resumeUrl: '',
          socialLinks: {
            github: 'https://github.com/ahmar',
            linkedin: 'https://linkedin.com/in/ahmar',
            email: 'mailto:ahmar@example.com'
          }
        };
        await addProfile(defaultProfile);
      }
      setError(null);
    } catch (err) {
      setError('Failed to fetch profile');
      console.error('Error fetching profile:', err);
    } finally {
      setLoading(false);
    }
  };

  const addProfile = async (profileData: ProfileFormData): Promise<string> => {
    try {
      const docRef = await addDoc(collection(db, COLLECTIONS.PROFILE), profileData);
      await fetchProfile(); // Refresh the profile
      return docRef.id;
    } catch (err) {
      console.error('Error adding profile:', err);
      throw err;
    }
  };

  const updateProfile = async (id: string, profileData: Partial<ProfileFormData>): Promise<void> => {
    try {
      const profileRef = doc(db, COLLECTIONS.PROFILE, id);
      await updateDoc(profileRef, profileData);
      await fetchProfile(); // Refresh the profile
    } catch (err) {
      console.error('Error updating profile:', err);
      throw err;
    }
  };

  useEffect(() => {
    fetchProfile();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    profile,
    loading,
    error,
    refetch: fetchProfile,
    updateProfile
  };
};