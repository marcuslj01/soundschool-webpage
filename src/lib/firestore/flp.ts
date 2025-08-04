import { addDoc, collection, doc, getDoc, getDocs, Timestamp, query, orderBy, limit, deleteDoc, where } from "firebase/firestore";
import { FLP, FLPInput } from "../types/FLP";
import { db } from "../firebase";

export async function addFLP(flp: FLPInput) {
    if (!db) {
        throw new Error("Firebase Firestore is not initialized");
    }
    const flpsCollection = collection(db, "flps");
    await addDoc(flpsCollection, {
        ...flp,
        created_at: Timestamp.now(),
    });
}

export async function getFLPs() {
    if (!db) {
        throw new Error("Firebase Firestore is not initialized");
    }
    const flpsCollection = collection(db, "flps");
    const snapshot = await getDocs(flpsCollection);
    return snapshot.docs.map((doc) => {
        const data = doc.data();
        return {
            ...data,
            id: doc.id,
            created_at: data.created_at.toDate(),
        } as FLP;
    });
}

export async function getFLP(id: string): Promise<FLP | null> {
    if (!db) {
        throw new Error("Firebase Firestore is not initialized");
    }
    const flpDoc = doc(db, "flps", id);
    const flpSnapshot = await getDoc(flpDoc);
    
    if (!flpSnapshot.exists()) {
        return null;
    }
    
    const data = flpSnapshot.data();
    return {
        ...data,
        id: flpSnapshot.id,
        created_at: data.created_at.toDate(),
    } as FLP;
}

// Get latest FLPs for homepage (cached)
export async function getLatestFLPs(count: number = 3) {
    if (!db) {
        throw new Error("Firebase Firestore is not initialized");
    }
    const flpsCollection = collection(db, "flps");
    const q = query(flpsCollection, orderBy("created_at", "desc"), limit(count));
    const snapshot = await getDocs(q);
    
    return snapshot.docs.map((doc) => {
        const data = doc.data();
        return {
            ...data,
            id: doc.id,
            created_at: data.created_at.toDate(),
        } as FLP;
    });
}

// Delete FLP
export async function deleteFLP(id: string): Promise<boolean> {
    if (!db) {
        throw new Error("Firebase Firestore is not initialized");
    }
    
    try {
        const flpDoc = doc(db, "flps", id);
        await deleteDoc(flpDoc);
        return true;
    } catch (error) {
        console.error("Error deleting FLP:", error);
        return false;
    }
} 

// Get similar FLPs based on genre and tags
export async function getSimilarFLPs(id: string): Promise<FLP[]> {
    try {
        console.log("getSimilarFLPs called with id:", id);
        
        // Get the current FLP
        const flpDoc = await getDoc(doc(db, "flps", id));
        if (!flpDoc.exists()) {
            console.log("FLP not found with id:", id);
            return [];
        }
        
        const flpData = flpDoc.data();
        const flpGenre = flpData?.genre;
        const flpTags = flpData?.tags || [];
        
        console.log("Current FLP data:", {
            id,
            genre: flpGenre,
            tags: flpTags,
            hidden: flpData?.hidden
        });
        
        // Check if FLP is hidden
        if (flpData?.hidden) {
            console.log("FLP is hidden, returning empty array");
            return [];
        }
        
        // More checks - only require genre OR tags
        if (!flpGenre && flpTags.length === 0) {
            console.log("No genre or tags found, will use fallback queries");
        }

        const similarFLPs: FLP[] = [];
        const flpCollection = collection(db, "flps");

        // Helper function to shuffle array and take first N
        const shuffleAndTake = (array: FLP[], count: number): FLP[] => {
            const shuffled = [...array].sort(() => Math.random() - 0.5);
            return shuffled.slice(0, count);
        };

        // Priority 1: Same genre and matching tags (only if both exist)
        if (flpGenre && flpTags.length > 0) {
            try {
                console.log("Trying genre + tags query...");
                const sameGenreAndTagsQuery = query(
                    flpCollection, 
                    where("genre", "==", flpGenre),
                    where("hidden", "==", false),
                    limit(20)
                );
                const sameGenreAndTagsSnapshot = await getDocs(sameGenreAndTagsQuery);
                
                console.log("Found", sameGenreAndTagsSnapshot.size, "FLPs with same genre");
                
                const sameGenreAndTagsFLPs: FLP[] = [];
                sameGenreAndTagsSnapshot.forEach((docSnapshot) => {
                    if (docSnapshot.id !== id) {
                        const data = docSnapshot.data();
                        const matchingTags = data.tags?.filter((tag: string) => 
                            flpTags.includes(tag)
                        ) || [];
                        
                        console.log(`FLP ${docSnapshot.id} has ${matchingTags.length} matching tags`);
                        
                        // Only include if there are matching tags
                        if (matchingTags.length > 0) {
                            sameGenreAndTagsFLPs.push({
                                ...data,
                                id: docSnapshot.id,
                                created_at: data.created_at.toDate(),
                            } as FLP);
                        }
                    }
                });
                
                console.log("FLPs with matching tags:", sameGenreAndTagsFLPs.length);
                
                // If we have more than 3, randomize and take 3
                if (sameGenreAndTagsFLPs.length >= 3) {
                    const result = shuffleAndTake(sameGenreAndTagsFLPs, 3);
                    console.log("Returning 3 FLPs with genre + tags match");
                    return result;
                }
                
                // Otherwise, add all of them
                similarFLPs.push(...sameGenreAndTagsFLPs);
            } catch (error) {
                console.log("Genre and tags query failed", error);
            }
        }

        // Priority 2: Same genre only
        if (similarFLPs.length < 3 && flpGenre) {
            try {
                console.log("Trying genre-only query...");
                const sameGenreQuery = query(
                    flpCollection, 
                    where("genre", "==", flpGenre),
                    where("hidden", "==", false),
                    limit(20)
                );
                const sameGenreSnapshot = await getDocs(sameGenreQuery);
                
                console.log("Found", sameGenreSnapshot.size, "FLPs with same genre");
                
                const sameGenreFLPs: FLP[] = [];
                sameGenreSnapshot.forEach((docSnapshot) => {
                    if (docSnapshot.id !== id && 
                        !similarFLPs.some(flp => flp.id === docSnapshot.id)) {
                        const data = docSnapshot.data();
                        sameGenreFLPs.push({
                            ...data,
                            id: docSnapshot.id,
                            created_at: data.created_at.toDate(),
                        } as FLP);
                    }
                });
                
                console.log("FLPs with same genre (excluding current):", sameGenreFLPs.length);
                
                // If we have enough to fill up to 3, randomize and take what we need
                const needed = 3 - similarFLPs.length;
                if (sameGenreFLPs.length >= needed) {
                    const randomGenreFLPs = shuffleAndTake(sameGenreFLPs, needed);
                    similarFLPs.push(...randomGenreFLPs);
                } else {
                    similarFLPs.push(...sameGenreFLPs);
                }
            } catch (error) {
                console.log("Genre query failed", error);
            }
        }

        // Priority 3: Most popular FLPs (highest sales)
        if (similarFLPs.length < 3) {
            try {
                console.log("Trying popular FLPs query...");
                const popularQuery = query(
                    flpCollection,
                    where("hidden", "==", false),
                    orderBy("sales", "desc"),
                    limit(20)
                );
                const popularSnapshot = await getDocs(popularQuery);
                
                console.log("Found", popularSnapshot.size, "popular FLPs");
                
                const popularFLPs: FLP[] = [];
                popularSnapshot.forEach((docSnapshot) => {
                    if (docSnapshot.id !== id && 
                        !similarFLPs.some(flp => flp.id === docSnapshot.id)) {
                        const data = docSnapshot.data();
                        popularFLPs.push({
                            ...data,
                            id: docSnapshot.id,
                            created_at: data.created_at.toDate(),
                        } as FLP);
                    }
                });
                
                console.log("Popular FLPs (excluding current):", popularFLPs.length);
                
                // Take what we need from popular FLPs
                const needed = 3 - similarFLPs.length;
                if (popularFLPs.length >= needed) {
                    const selectedPopularFLPs = popularFLPs.slice(0, needed);
                    similarFLPs.push(...selectedPopularFLPs);
                } else {
                    similarFLPs.push(...popularFLPs);
                }
            } catch (error) {
                console.log("Popular FLPs query failed", error);
            }
        }

        // Priority 4: Random FLPs as fallback
        if (similarFLPs.length < 3) {
            try {
                console.log("Trying random FLPs query...");
                const randomQuery = query(
                    flpCollection,
                    where("hidden", "==", false),
                    limit(50)
                );
                const randomSnapshot = await getDocs(randomQuery);
                
                console.log("Found", randomSnapshot.size, "random FLPs");
                
                const randomFLPs: FLP[] = [];
                randomSnapshot.forEach((docSnapshot) => {
                    if (docSnapshot.id !== id && 
                        !similarFLPs.some(flp => flp.id === docSnapshot.id)) {
                        const data = docSnapshot.data();
                        randomFLPs.push({
                            ...data,
                            id: docSnapshot.id,
                            created_at: data.created_at.toDate(),
                        } as FLP);
                    }
                });
                
                console.log("Random FLPs (excluding current):", randomFLPs.length);
                
                // Randomize and take what we need
                const needed = 3 - similarFLPs.length;
                if (randomFLPs.length >= needed) {
                    const randomSelectedFLPs = shuffleAndTake(randomFLPs, needed);
                    similarFLPs.push(...randomSelectedFLPs);
                } else {
                    similarFLPs.push(...randomFLPs);
                }
            } catch (error) {
                console.log("Random FLPs query failed", error);
            }
        }

        console.log("Final result:", similarFLPs.length, "similar FLPs found");
        return similarFLPs.slice(0, 3);
    } catch (error) {
        console.error("Error getting similar FLPs:", error);
        return [];
    }
} 