import { addDoc, collection, doc, getDoc, getDocs, Timestamp, query, orderBy, limit, deleteDoc, where } from "firebase/firestore";
import { Pack, PackInput } from "../types/pack";
import { db } from "../firebase";

export async function addPack(pack: PackInput) {
    if (!db) {
        throw new Error("Firebase Firestore is not initialized");
    }
    const packsCollection = collection(db, "packs");
    await addDoc(packsCollection, {
        ...pack,
        created_at: Timestamp.now(),
    });
}

export async function getPacks() {
    if (!db) {
        throw new Error("Firebase Firestore is not initialized");
    }
    const packsCollection = collection(db, "packs");
    const snapshot = await getDocs(packsCollection);
    return snapshot.docs.map((doc) => {
        const data = doc.data();
        return {
            ...data,
            id: doc.id,
            created_at: data.created_at.toDate(),
        } as Pack;
    });
}

export async function getPack(id: string): Promise<Pack | null> {
    if (!db) {
        throw new Error("Firebase Firestore is not initialized");
    }
    const packDoc = doc(db, "packs", id);
    const packSnapshot = await getDoc(packDoc);
    
    if (!packSnapshot.exists()) {
        return null;
    }
    
    const data = packSnapshot.data();
    return {
        ...data,
        id: packSnapshot.id,
        created_at: data.created_at.toDate(),
    } as Pack;
}

export async function getLatestPack() {
    if (!db) {
        throw new Error("Firebase Firestore is not initialized");
    }
    const packsCollection = collection(db, "packs");
    const q = query(packsCollection, orderBy("created_at", "desc"), limit(1));
    const snapshot = await getDocs(q);
    
    if (snapshot.empty) {
        return null;
    }
    
    const doc = snapshot.docs[0];
    const data = doc.data();
    return {
        ...data,
        id: doc.id,
        created_at: data.created_at.toDate(),
    } as Pack;
}

// Get latest packs for homepage (cached)
export async function getLatestPacks(count: number = 3) {
    if (!db) {
        throw new Error("Firebase Firestore is not initialized");
    }
    const packsCollection = collection(db, "packs");
    const q = query(packsCollection, orderBy("created_at", "desc"), limit(count));
    const snapshot = await getDocs(q);
    
    return snapshot.docs.map((doc) => {
        const data = doc.data();
        return {
            ...data,
            id: doc.id,
            created_at: data.created_at.toDate(),
        } as Pack;
    });
}

// Delete pack
export async function deletePack(id: string): Promise<boolean> {
    if (!db) {
        throw new Error("Firebase Firestore is not initialized");
    }
    
    try {
        const packDoc = doc(db, "packs", id);
        await deleteDoc(packDoc);
        return true;
    } catch (error) {
        console.error("Error deleting pack:", error);
        return false;
    }
}

// Get similar packs based on genre and tags
export async function getSimilarPacks(id: string): Promise<Pack[]> {
    try {
        
        // Get the current pack
        const packDoc = await getDoc(doc(db, "packs", id));
        if (!packDoc.exists()) {
            console.log("Pack not found with id:", id);
            return [];
        }
        
        const packData = packDoc.data();
        const packGenre = packData?.genre;
        const packTags = packData?.tags || [];
        
        
        // Check if pack is hidden
        if (packData?.hidden) {
            console.log("Pack is hidden, returning empty array");
            return [];
        }
        
        // More lenient check - only require genre OR tags
        if (!packGenre && packTags.length === 0) {
            console.log("No genre or tags found, will use fallback queries");
        }

        const similarPacks: Pack[] = [];
        const packCollection = collection(db, "packs");

        // Helper function to shuffle array and take first N
        const shuffleAndTake = (array: Pack[], count: number): Pack[] => {
            const shuffled = [...array].sort(() => Math.random() - 0.5);
            return shuffled.slice(0, count);
        };

        // Priority 1: Same genre and matching tags (only if both exist)
        if (packGenre && packTags.length > 0) {
            try {
                const sameGenreAndTagsQuery = query(
                    packCollection, 
                    where("genre", "==", packGenre),
                    where("hidden", "==", false),
                    limit(20)
                );
                const sameGenreAndTagsSnapshot = await getDocs(sameGenreAndTagsQuery);
                
                
                const sameGenreAndTagsPacks: Pack[] = [];
                sameGenreAndTagsSnapshot.forEach((docSnapshot) => {
                    if (docSnapshot.id !== id) {
                        const data = docSnapshot.data();
                        const matchingTags = data.tags?.filter((tag: string) => 
                            packTags.includes(tag)
                        ) || [];
                        
                        
                        // Only include if there are matching tags
                        if (matchingTags.length > 0) {
                            sameGenreAndTagsPacks.push({
                                ...data,
                                id: docSnapshot.id,
                                created_at: data.created_at.toDate(),
                            } as Pack);
                        }
                    }
                });
                
                
                // If we have more than 3, randomize and take 3
                if (sameGenreAndTagsPacks.length >= 3) {
                    const result = shuffleAndTake(sameGenreAndTagsPacks, 3);
                    return result;
                }
                
                // Otherwise, add all of them
                similarPacks.push(...sameGenreAndTagsPacks);
            } catch (error) {
                console.log("Genre and tags query failed", error);
            }
        }

        // Priority 2: Same genre only
        if (similarPacks.length < 3 && packGenre) {
            try {
                console.log("Trying genre-only query...");
                const sameGenreQuery = query(
                    packCollection, 
                    where("genre", "==", packGenre),
                    where("hidden", "==", false),
                    limit(20)
                );
                const sameGenreSnapshot = await getDocs(sameGenreQuery);
                
                console.log("Found", sameGenreSnapshot.size, "packs with same genre");
                
                const sameGenrePacks: Pack[] = [];
                sameGenreSnapshot.forEach((docSnapshot) => {
                    if (docSnapshot.id !== id && 
                        !similarPacks.some(pack => pack.id === docSnapshot.id)) {
                        const data = docSnapshot.data();
                        sameGenrePacks.push({
                            ...data,
                            id: docSnapshot.id,
                            created_at: data.created_at.toDate(),
                        } as Pack);
                    }
                });
                
                console.log("Packs with same genre (excluding current):", sameGenrePacks.length);
                
                // If we have enough to fill up to 3, randomize and take what we need
                const needed = 3 - similarPacks.length;
                if (sameGenrePacks.length >= needed) {
                    const randomGenrePacks = shuffleAndTake(sameGenrePacks, needed);
                    similarPacks.push(...randomGenrePacks);
                } else {
                    similarPacks.push(...sameGenrePacks);
                }
            } catch (error) {
                console.log("Genre query failed", error);
            }
        }

        // Priority 3: Most popular packs (highest sales)
        if (similarPacks.length < 3) {
            try {
                console.log("Trying popular packs query...");
                const popularQuery = query(
                    packCollection,
                    where("hidden", "==", false),
                    orderBy("sales", "desc"),
                    limit(20)
                );
                const popularSnapshot = await getDocs(popularQuery);
                
                console.log("Found", popularSnapshot.size, "popular packs");
                
                const popularPacks: Pack[] = [];
                popularSnapshot.forEach((docSnapshot) => {
                    if (docSnapshot.id !== id && 
                        !similarPacks.some(pack => pack.id === docSnapshot.id)) {
                        const data = docSnapshot.data();
                        popularPacks.push({
                            ...data,
                            id: docSnapshot.id,
                            created_at: data.created_at.toDate(),
                        } as Pack);
                    }
                });
                
                console.log("Popular packs (excluding current):", popularPacks.length);
                
                // Take what we need from popular packs
                const needed = 3 - similarPacks.length;
                if (popularPacks.length >= needed) {
                    const selectedPopularPacks = popularPacks.slice(0, needed);
                    similarPacks.push(...selectedPopularPacks);
                } else {
                    similarPacks.push(...popularPacks);
                }
            } catch (error) {
                console.log("Popular packs query failed", error);
            }
        }

        // Priority 4: Random packs as fallback
        if (similarPacks.length < 3) {
            try {
                console.log("Trying random packs query...");
                const randomQuery = query(
                    packCollection,
                    where("hidden", "==", false),
                    limit(50)
                );
                const randomSnapshot = await getDocs(randomQuery);
                
                console.log("Found", randomSnapshot.size, "random packs");
                
                const randomPacks: Pack[] = [];
                randomSnapshot.forEach((docSnapshot) => {
                    if (docSnapshot.id !== id && 
                        !similarPacks.some(pack => pack.id === docSnapshot.id)) {
                        const data = docSnapshot.data();
                        randomPacks.push({
                            ...data,
                            id: docSnapshot.id,
                            created_at: data.created_at.toDate(),
                        } as Pack);
                    }
                });
                
                console.log("Random packs (excluding current):", randomPacks.length);
                
                // Randomize and take what we need
                const needed = 3 - similarPacks.length;
                if (randomPacks.length >= needed) {
                    const randomSelectedPacks = shuffleAndTake(randomPacks, needed);
                    similarPacks.push(...randomSelectedPacks);
                } else {
                    similarPacks.push(...randomPacks);
                }
            } catch (error) {
                console.log("Random packs query failed", error);
            }
        }

        console.log("Final result:", similarPacks.length, "similar packs found");
        return similarPacks.slice(0, 3);
    } catch (error) {
        console.error("Error getting similar packs:", error);
        return [];
    }
}