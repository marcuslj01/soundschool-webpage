"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion, useInView } from "framer-motion";
import MidiCard from "./MidiCard";
import { Midi } from "@/lib/types/midi";
import { useAuth } from "@/contexts/AuthContext";
import { OwnedFile } from "@/lib/types/ownedFile";
import { getOwnedFiles } from "@/lib/firestore/user";

interface LazyMidigridProps {
  initialData: Midi[];
}

function LazyMidigrid({ initialData }: LazyMidigridProps) {
  const { user } = useAuth();
  const [ownedFiles, setOwnedFiles] = useState<OwnedFile[]>([]);
  const [midiFiles, setMidiFiles] = useState<Midi[]>(initialData);
  const [currentlyPlaying, setCurrentlyPlaying] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(initialData.length >= 10);
  const [lastId, setLastId] = useState<string | null>(
    initialData.length > 0 ? initialData[initialData.length - 1].id : null,
  );
  const [error, setError] = useState<string | null>(null);

  // Animation refs
  const gridRef = useRef(null);
  const isGridInView = useInView(gridRef, { once: true, margin: "-100px" });

  useEffect(() => {
    if (user) {
      const fetchOwnedFiles = async () => {
        const ownedFiles = await getOwnedFiles(user.uid);
        setOwnedFiles(ownedFiles);
      };
      fetchOwnedFiles();
    }
  }, [user]);

  // Search states
  const [searchTerm, setSearchTerm] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [isInSearchMode, setIsInSearchMode] = useState(false);

  const observer = useRef<IntersectionObserver | null>(null);
  const loadingRef = useRef<HTMLDivElement>(null);

  // Use useCallback for handleSearch
  const handleSearch = useCallback(
    async (term: string) => {
      if (term.length < 2) {
        // Reset to original data
        setMidiFiles(initialData);
        setIsInSearchMode(false);
        setHasMore(initialData.length >= 10);
        setLastId(
          initialData.length > 0
            ? initialData[initialData.length - 1].id
            : null,
        );
        return;
      }

      try {
        setIsSearching(true);
        const response = await fetch(
          `/api/midi/search?term=${encodeURIComponent(term)}`,
        );

        if (response.ok) {
          const data = await response.json();
          setMidiFiles(data.midiFiles);
          setIsInSearchMode(true);
          setHasMore(false); // Disable infinite scroll during search
          setLastId(null);
        }
      } catch (error) {
        console.error("Search failed:", error);
      } finally {
        setIsSearching(false);
      }
    },
    [initialData],
  );

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      handleSearch(searchTerm);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchTerm, handleSearch]);

  const loadMore = useCallback(async () => {
    if (loading || !hasMore || isInSearchMode) return; // Added isInSearchMode check

    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams({
        limit: "10",
      });

      if (lastId) {
        params.append("lastId", lastId);
      }

      const response = await fetch(`/api/midi/lazy?${params}`);

      if (!response.ok) {
        throw new Error("Failed to fetch more MIDI files");
      }

      const data = await response.json();
      setMidiFiles((prev) => [...prev, ...data.midiFiles]);
      setHasMore(data.hasMore);
      setLastId(data.lastId);
    } catch (err) {
      console.error("Error in loadMore:", err);
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  }, [loading, hasMore, lastId, isInSearchMode]);

  // Set up intersection observer for infinite scroll
  useEffect(() => {
    if (loading || isInSearchMode) return; // Added isInSearchMode check

    if (observer.current) observer.current.disconnect();

    observer.current = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore) {
          loadMore();
        }
      },
      { threshold: 0, rootMargin: "200px" },
    );

    if (loadingRef.current) {
      observer.current.observe(loadingRef.current);
    }

    return () => {
      if (observer.current) observer.current.disconnect();
    };
  }, [loadMore, loading, hasMore, isInSearchMode]);

  return (
    <div className="w-full flex flex-col items-center p-4 rounded-lg max-w-7xl mb-8">
      {/* TODO: Implement limited time offer */}
      {/* <h1 className="text-lg font-bold text-center bg-indigo-600 text-white p-2 w-full shadow-xl">
        Limited time: Buy 2 get 1 free!
      </h1> */}

      {/* Search input */}
      <div className="w-full py-4">
        <div className="relative">
          <input
            type="text"
            placeholder="Search MIDI files... (min 2 characters)"
            className="w-full px-4 py-2 pr-10 rounded-lg border border-gray-600 bg-gray-800 text-white placeholder-gray-400"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm("")}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white hover:cursor-pointer transition-colors"
              aria-label="Clear search"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          )}
        </div>
        {isSearching && (
          <p className="text-gray-400 text-sm mt-1">Searching...</p>
        )}
      </div>

      <div
        ref={gridRef}
        className="w-full flex flex-col items-center max-h-[80vh] overflow-y-auto py-4"
      >
        <div className="flex flex-col gap-2 w-full mb-8">
          {midiFiles.map(
            (file, index) =>
              !file.hidden && (
                <motion.div
                  key={file.id}
                  initial={{ opacity: 0, y: 20, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{
                    duration: 0.2,
                    delay: index < 10 ? index * 0.05 : 0,
                    ease: "easeOut",
                  }}
                >
                  <MidiCard
                    id={file.id}
                    title={file.name}
                    date={
                      file.created_at instanceof Date
                        ? file.created_at.toISOString()
                        : new Date(file.created_at).toISOString()
                    }
                    root={file.root}
                    scale={file.scale}
                    bpm={file.bpm}
                    previewUrl={file.preview_url}
                    isDiscounted={file.is_discounted || false}
                    discountPrice={file.discount_price || file.price}
                    price={file.price}
                    isPlaying={currentlyPlaying === file.id}
                    onPlay={() => setCurrentlyPlaying(file.id)}
                    onPause={() => setCurrentlyPlaying(null)}
                    isOwned={ownedFiles.some(
                      (ownedFile) =>
                        ownedFile.id === file.id && ownedFile.type === "midi",
                    )}
                  />
                </motion.div>
              ),
          )}
        </div>

        {/* Load More Button - only show when not searching */}
        {hasMore && !loading && !isInSearchMode && (
          <motion.button
            onClick={loadMore}
            className="px-6 py-3 bg-primary hover:bg-primary/80 hover:cursor-pointer text-white font-medium rounded-lg transition-colors mb-4"
            initial={{ opacity: 0, y: 30 }}
            animate={
              isGridInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }
            }
            transition={{
              duration: 0.8,
              delay: midiFiles.length * 0.1,
              ease: "easeOut",
            }}
          >
            Load More MIDI Files
          </motion.button>
        )}

        {/* Loading indicator */}
        {loading && (
          <div className="flex justify-center items-center py-4">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
            <span className="ml-2 text-white">Loading more MIDI files...</span>
          </div>
        )}

        {/* Search results indicator */}
        {isInSearchMode && midiFiles.length === 0 && !isSearching && (
          <div className="flex justify-center items-center py-4">
            <p className="text-gray-400">No MIDI files found</p>
          </div>
        )}

        {/* Error message */}
        {error && (
          <div className="flex justify-center items-center py-4">
            <p className="text-red-400">Error: {error}</p>
          </div>
        )}

        {/* End of list indicator */}
        {!hasMore && midiFiles.length > 0 && !isInSearchMode && (
          <div className="flex justify-center items-center py-4">
            <p className="text-gray-400">No more MIDI files to load</p>
          </div>
        )}

        {/* Loading ref for infinite scroll */}
        <div ref={loadingRef} />
      </div>
    </div>
  );
}

export default LazyMidigrid;
