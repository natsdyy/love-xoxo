import { auth, db } from './firebase';
import { signInAnonymously, signOut, createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc, collection, getDocs, query, where, updateDoc } from 'firebase/firestore';

// Initialize anonymous Firebase authentication when app loads
export const initializeFirebaseAuth = async () => {
  try {
    if (!auth.currentUser) {
      // Sign in anonymously to enable Firestore access
      await signInAnonymously(auth);
      console.log('Anonymous Firebase authentication initialized');
    }
  } catch (error) {
    console.error('Error initializing Firebase auth:', error);
  }
};

// Get current authenticated user ID
export const getCurrentUserFirebaseId = () => {
  return auth.currentUser?.uid || null;
};

// Sign in user with email and password
export const signInUserWithEmailPassword = async (username: string, password: string) => {
  try {
    const email = `${username}@xoxoxz.site`;
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    console.log('User signed in with Firebase Auth:', userCredential.user.uid);
    return userCredential.user;
  } catch (error) {
    console.warn('Firebase Auth sign in failed (user may not exist in Firebase Auth yet):', error);
    // Return null if sign in fails - the app can still work with Firestore-only session
    return null;
  }
};

// Store user session data in Firestore
export const storeUserSession = async (username: string, role: 'admin' | 'owner', displayName: string) => {
  try {
    const userSessionRef = doc(db, 'users', `${role}_${username}`);
    
    await setDoc(userSessionRef, {
      username,
      displayName,
      role,
      lastLogin: new Date(),
      lastLoginFormatted: new Date().toLocaleString(),
      firebaseUid: auth.currentUser?.uid,
      isActive: true,
      device: navigator.userAgent,
    }, { merge: true });

    console.log('User session stored:', username);
    return true;
  } catch (error) {
    console.error('Error storing user session:', error);
    return false;
  }
};

// Get all admin users
export const getAllAdminUsers = async () => {
  try {
    const q = query(collection(db, 'users'), where('role', '==', 'admin'));
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      username: doc.data().username,
      displayName: doc.data().displayName,
      role: doc.data().role,
      lastLogin: doc.data().lastLogin?.toDate?.() || doc.data().lastLogin,
      lastLoginFormatted: doc.data().lastLoginFormatted,
      isActive: doc.data().isActive,
      device: doc.data().device,
    }));
  } catch (error) {
    console.error('Error fetching admin users:', error);
    return [];
  }
};

// Get all users (both admins and owner)
export const getAllUsers = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, 'users'));
    
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      username: doc.data().username,
      displayName: doc.data().displayName,
      role: doc.data().role,
      lastLogin: doc.data().lastLogin?.toDate?.() || doc.data().lastLogin,
      lastLoginFormatted: doc.data().lastLoginFormatted,
      isActive: doc.data().isActive,
      device: doc.data().device,
    }));
  } catch (error) {
    console.error('Error fetching all users:', error);
    return [];
  }
};

// Add a new user manually to BOTH Firebase Auth and Firestore
export const addUserManually = async (username: string, displayName: string, role: 'admin' | 'owner', password: string = 'xzshop123') => {
  try {
    // Generate email from username
    const email = `${username}@xoxoxz.site`;

    // Create user in Firebase Authentication
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const firebaseUid = userCredential.user.uid;

    console.log('User created in Firebase Auth with UID:', firebaseUid);

    // Store user data in Firestore
    const userRef = doc(db, 'users', `${role}_${username}`);
    
    await setDoc(userRef, {
      username,
      displayName,
      role,
      email,
      firebaseUid,
      lastLogin: new Date(),
      lastLoginFormatted: new Date().toLocaleString(),
      isActive: true,
      device: 'Manual Entry - Admin',
      createdAt: new Date(),
      createdAtFormatted: new Date().toLocaleString(),
      authMethod: 'firebase_auth',
    });

    console.log('User stored in Firestore:', username);
    return true;
  } catch (error: any) {
    console.error('Error adding user:', error);
    
    // Give user-friendly error messages
    if (error.code === 'auth/email-already-in-use') {
      throw new Error('This user already exists in Firebase Authentication');
    } else if (error.code === 'auth/weak-password') {
      throw new Error('Password must be at least 6 characters');
    } else if (error.code === 'auth/invalid-email') {
      throw new Error('Invalid email format');
    } else {
      throw new Error(`Failed to add user: ${error.message}`);
    }
  }
};

// Update user display name and role in Firestore
export const updateUserProfile = async (userId: string, role: string, displayName: string) => {
  try {
    const userRef = doc(db, 'users', userId);
    
    await updateDoc(userRef, {
      displayName,
      role,
      updatedAt: new Date(),
      updatedAtFormatted: new Date().toLocaleString(),
    });

    console.log('User profile updated:', userId);
    return true;
  } catch (error: any) {
    console.error('Error updating user profile:', error);
    throw new Error(`Failed to update user: ${error.message}`);
  }
};

// Update user password in Firebase Auth (via admin)
export const updateUserPassword = async (username: string, newPassword: string) => {
  try {
    if (newPassword.length < 6) {
      throw new Error('Password must be at least 6 characters');
    }
    
    // Get the specific user by email from Firestore to get their firebaseUid
    const q = query(collection(db, 'users'), where('username', '==', username));
    const querySnapshot = await getDocs(q);
    
    if (querySnapshot.empty) {
      throw new Error('User not found');
    }

    const userData = querySnapshot.docs[0].data();
    const firebaseUid = userData.firebaseUid;

    if (!firebaseUid) {
      throw new Error('User has no Firebase UID');
    }

    // Update password via Firebase Admin SDK would be ideal, but in client we can only update current user
    // So we'll just log this for now - in production you'd use Cloud Functions or Firebase Admin SDK
    console.log(`Password update requested for ${username} (UID: ${firebaseUid})`);
    
    // For now, we'll update Firestore with a flag that helps tracking password changes
    const userRef = doc(db, 'users', querySnapshot.docs[0].id);
    await updateDoc(userRef, {
      passwordUpdatedAt: new Date(),
      passwordUpdatedAtFormatted: new Date().toLocaleString(),
      passwordUpdatedBy: 'admin',
    });

    return true;
  } catch (error: any) {
    console.error('Error updating user password:', error);
    throw new Error(`Failed to update password: ${error.message}`);
  }
};

// Sign out from Firebase
export const firebaseSignOut = async () => {
  try {
    await signOut(auth);
    console.log('Signed out from Firebase');
  } catch (error) {
    console.error('Error signing out:', error);
  }
};
