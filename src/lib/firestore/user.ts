import { doc, setDoc, getDoc, updateDoc, serverTimestamp, deleteDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { User as FirebaseUser } from 'firebase/auth';
import { db } from '@/lib/firebase';
import { User } from '@/lib/types/user';
import { OwnedFile } from '../types/ownedFile';
import { Order } from '../types/order';

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

export async function getOwnedFiles(uid: string): Promise<OwnedFile[]> {
  const userRef = doc(db, 'users', uid);
  const userDoc = await getDoc(userRef);
  return userDoc.data()?.ownedFiles || [];
}

// Claims all the files a user owns and adds them to their ownedFiles array
// Runs through all orders with customer_email = email for the logged in user
export async function claimFiles(uid: string, email: string): Promise<{ success: boolean; claimedCount: number; message: string }> {
  try {
    const userRef = doc(db, 'users', uid);
    const userDoc = await getDoc(userRef);
    
    if (!userDoc.exists()) {
      throw new Error('User not found');
    }

    // Get all orders with this email
    const ordersCollection = collection(db, 'orders');
    const ordersQuery = query(ordersCollection, where('customer_email', '==', email));
    const ordersSnapshot = await getDocs(ordersQuery);
    
    if (ordersSnapshot.empty) {
      return {
        success: false,
        claimedCount: 0,
        message: 'No orders found with this email address.'
      };
    }

    const orders = ordersSnapshot.docs.map((doc) => doc.data() as Order);
    
    // Get current owned files
    const currentOwnedFiles: OwnedFile[] = userDoc.data()?.ownedFiles || [];
    const existingFilesMap = new Map(currentOwnedFiles.map((file: OwnedFile) => [file.id, file]));
    
    // Extract all files from orders
    const newOwnedFiles: OwnedFile[] = [];
    let claimedCount = 0;
    
    for (const order of orders) {
      for (const orderItem of order.orderItems) {
        // Only add if not already owned
        if (!existingFilesMap.has(orderItem.id)) {
          const ownedFile: OwnedFile = {
            id: orderItem.id,
            type: orderItem.type,
            name: orderItem.title,
          };
          existingFilesMap.set(orderItem.id, ownedFile);
          newOwnedFiles.push(ownedFile);
          claimedCount++;
        }
      }
    }
    
    if (claimedCount === 0) {
      return {
        success: true,
        claimedCount: 0,
        message: 'All files from your previous orders are already claimed.'
      };
    }
    
    // Update user with new owned files
    const updatedOwnedFiles = Array.from(existingFilesMap.values());
    await updateDoc(userRef, { ownedFiles: updatedOwnedFiles });
    
    return {
      success: true,
      claimedCount,
      message: `Successfully claimed ${claimedCount} files from your previous orders!`
    };
    
  } catch (error) {
    console.error('Error claiming files:', error);
    throw error;
  }
}

// Update displayName and preferences for a user
export async function updateUserProfile(uid: string, displayName: string, preferences: { newsletter: boolean; marketing: boolean }) {
  try {
    const userRef = doc(db, 'users', uid);
    await updateDoc(userRef, {
      displayName,
      preferences,
    });
  } catch (error) {
    console.error('Error updating user profile:', error);
    throw error;
  }
}