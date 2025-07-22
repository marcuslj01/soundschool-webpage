import { doc, setDoc, getDoc, updateDoc, serverTimestamp, deleteDoc, collection, query, where, getDocs } from 'firebase/firestore';
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
export async function updateUserPreferences(uid: string, newPreferences: Partial<User['preferences']>): Promise<void> {
  try {
    const userRef = doc(db, 'users', uid);
    
    // Get existing user data
    const userDoc = await getDoc(userRef);
    if (!userDoc.exists()) {
      throw new Error('User not found');
    }
    
    const userData = userDoc.data() as User;
    const currentPreferences = userData.preferences || { newsletter: false, marketing: false };
    
    // Update only the specific preferences, keep existing ones
    const updatedPreferences = {
      ...currentPreferences,
      ...newPreferences,
    };
    
    await updateDoc(userRef, {
      preferences: updatedPreferences,
    });
  } catch (error) {
    console.error('Error updating user preferences:', error);
    throw error;
  }
} 

// Deletes user and all related data from Firestore
export async function deleteUser(uid: string): Promise<void> {
  try {
    // Delete user document
    const userRef = doc(db, 'users', uid);
    await deleteDoc(userRef);

    // Delete user's orders
    const ordersCollection = collection(db, 'orders');
    const ordersQuery = query(ordersCollection, where('userId', '==', uid));
    const ordersSnapshot = await getDocs(ordersQuery);
    
    const orderDeletions = ordersSnapshot.docs.map(doc => deleteDoc(doc.ref));
    await Promise.all(orderDeletions);

    console.log(`Deleted user ${uid} and ${ordersSnapshot.docs.length} orders`);
  } catch (error) {
    console.error('Error deleting user and related data:', error);
    throw error;
  }
}

export async function getUsersCount(): Promise<number> {
  const usersCollection = collection(db, 'users');
  const usersQuery = query(usersCollection);
  const usersSnapshot = await getDocs(usersQuery);
  return usersSnapshot.size;
}

// TODO: Implement lazy loading for users to avoid loading all users at once
export async function getAllUsers(): Promise<User[]> {
  const usersCollection = collection(db, 'users');
  const usersQuery = query(usersCollection);
  const usersSnapshot = await getDocs(usersQuery);
  return usersSnapshot.docs.map((doc) => doc.data() as User);
}
