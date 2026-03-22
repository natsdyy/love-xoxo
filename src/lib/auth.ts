import { db } from './firebase';
import { collection, addDoc, query, where, getDocs, Timestamp } from 'firebase/firestore';

// Authentication configuration with all user credentials
export interface User {
  username: string;
  password: string;
  role: 'admin' | 'owner';
  displayName: string;
}

export const USERS: User[] = [
  // Owner
  {
    username: 'ownereli',
    password: 'silverdawn',
    role: 'owner',
    displayName: 'Eli'
  },
  // Admins
  {
    username: 'admin_cherry',
    password: 'xzshop123',
    role: 'admin',
    displayName: 'Cherry'
  },
  {
    username: 'admin_mir',
    password: 'xzshop123',
    role: 'admin',
    displayName: 'Mir'
  },
  {
    username: 'admin_sica',
    password: 'xzshop123',
    role: 'admin',
    displayName: 'Sica'
  }
];

// Validate user credentials
export const validateCredentials = (username: string, password: string): User | null => {
  const user = USERS.find(u => u.username === username && u.password === password);
  return user || null;
};

// Get user display name from username
export const getUserDisplayName = (username: string): string => {
  const user = USERS.find(u => u.username === username);
  return user?.displayName || username;
};

// Get user role from username
export const getUserRole = (username: string): 'admin' | 'owner' | null => {
  const user = USERS.find(u => u.username === username);
  return user?.role || null;
};

// Store login record in Firestore
export const storeLoginRecord = async (username: string, role: 'admin' | 'owner', displayName: string) => {
  try {
    const loginRecord = {
      username,
      displayName,
      role,
      loginTime: Timestamp.now(),
      loginDate: new Date().toLocaleDateString(),
      loginTimeFormatted: new Date().toLocaleString(),
      ipAddress: 'N/A', // Can be enhanced with actual IP detection
      device: navigator.userAgent,
    };

    // Store in 'users' collection with subcollection for each user's logins
    const docRef = await addDoc(collection(db, 'users'), loginRecord);
    
    console.log(`Login record stored in Firestore: users`, docRef.id);
    return docRef.id;
  } catch (error) {
    console.warn('Note: Login record not stored in Firestore (Firestore rules may need setup):', error);
    // Don't throw - allow login to proceed even if Firestore fails
    return null;
  }
};

// Fetch login history for a user
export const getLoginHistory = async (username: string) => {
  try {
    const q = query(collection(db, 'users'), where('username', '==', username));
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Error fetching login history:', error);
    return [];
  }
};
