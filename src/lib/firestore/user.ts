import { doc, setDoc, getDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { User as FirebaseUser } from 'firebase/auth';
import { db } from '@/lib/firebase';
import { User } from '@/lib/types/user';

// Create or update user in Firestore
export async function createOrUpdateUser(firebaseUser: FirebaseUser): Promise<void> {
  try {
    const userRef = doc(db, 'users', firebaseUser.uid);
    const userDoc = await getDoc(userRef);

    if (userDoc.exists()) {
      // Update existing user
      await updateDoc(userRef, {
        lastLoginAt: serverTimestamp(),
        displayName: firebaseUser.displayName || userDoc.data().displayName,
        email: firebaseUser.email,
      });
    } else {
      // Create new user
      const userData: Omit<User, 'createdAt' | 'lastLoginAt'> = {
        uid: firebaseUser.uid,
        email: firebaseUser.email || '',
        displayName: firebaseUser.displayName || '',
        cartItems: [],
        preferences: {
          newsletter: false,
          marketing: false,
        },
        favorites: [],
      };

      await setDoc(userRef, {
        ...userData,
        createdAt: serverTimestamp(),
        lastLoginAt: serverTimestamp(),
      });
    }
  } catch (error) {
    console.error('Error creating/updating user:', error);
    throw error;
  }
}

// Get user data from Firestore
export async function getUserData(uid: string): Promise<User | null> {
  try {
    const userRef = doc(db, 'users', uid);
    const userDoc = await getDoc(userRef);

    if (userDoc.exists()) {
      return userDoc.data() as User;
    }
    return null;
  } catch (error) {
    console.error('Error getting user data:', error);
    throw error;
  }
}

// Update user preferences
export async function updateUserPreferences(uid: string, preferences: Partial<User['preferences']>): Promise<void> {
  try {
    const userRef = doc(db, 'users', uid);
    await updateDoc(userRef, {
      preferences: preferences,
    });
  } catch (error) {
    console.error('Error updating user preferences:', error);
    throw error;
  }
} 