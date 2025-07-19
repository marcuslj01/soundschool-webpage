"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import MidiCard from "./MidiCard";
import { Midi } from "@/lib/types/midi";

interface LazyMidigridProps {
  initialData: Midi[];
}

function LazyMidigrid({ initialData }: LazyMidigridProps) {
  const [midiFiles, setMidiFiles] = useState<Midi[]>(initialData);
  const [currentlyPlaying, setCurrentlyPlaying] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(initialData.length >= 10); // Assume more if we got 10
  const [lastId, setLastId] = useState<string | null>(
    initialData.length > 0 ? initialData[initialData.length - 1].id : null
  );
  const [error, setError] = useState<string | null>(null);

  const observer = useRef<IntersectionObserver | null>(null);
  const loadingRef = useRef<HTMLDivElement>(null);

  const loadMore = useCallback(async () => {
    console.log(
      "loadMore called - loading:",
      loading,
      "hasMore:",
      hasMore,
      "lastId:",
      lastId
    );
    if (loading || !hasMore) return;

    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams({
        limit: "2",
      });

      if (lastId) {
        params.append("lastId", lastId);
      }

      console.log("Fetching from:", `/api/midi/lazy?${params}`);
      const response = await fetch(`/api/midi/lazy?${params}`);

      if (!response.ok) {
        throw new Error("Failed to fetch more MIDI files");
      }

      const data = await response.json();
      console.log("Received data:", data);

      setMidiFiles((prev) => [...prev, ...data.midiFiles]);
      setHasMore(data.hasMore);
      setLastId(data.lastId);
    } catch (err) {
      console.error("Error in loadMore:", err);
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  }, [loading, hasMore, lastId]);

  // Set up intersection observer for infinite scroll
  useEffect(() => {
    if (loading) return;

    if (observer.current) observer.current.disconnect();

    observer.current = new IntersectionObserver(
      (entries) => {
        console.log(
          "Intersection observer triggered:",
          entries[0].isIntersecting,
          hasMore
        );
        if (entries[0].isIntersecting && hasMore) {
          console.log("Loading more files...");
          loadMore();
        }
      },
      { threshold: 0.1, rootMargin: "100px" }
    );

    if (loadingRef.current) {
      observer.current.observe(loadingRef.current);
      console.log("Observer set up for:", loadingRef.current);
    }

    return () => {
      if (observer.current) observer.current.disconnect();
    };
  }, [loadMore, loading, hasMore]);

  return (
    <div className="w-full flex flex-col items-center">
      <div className="flex flex-col gap-2 w-full max-w-md lg:max-w-lg mb-8">
        {midiFiles.map((file) => (
          <MidiCard
            key={file.id}
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
            price={file.price}
            isPlaying={currentlyPlaying === file.id}
            onPlay={() => setCurrentlyPlaying(file.id)}
            onPause={() => setCurrentlyPlaying(null)}
          />
        ))}
      </div>

      {/* Load More Button */}
      {hasMore && !loading && (
        <button
          onClick={loadMore}
          className="px-6 py-3 bg-primary hover:bg-primary/80 hover:cursor-pointer text-white font-medium rounded-lg transition-colors mb-4"
        >
          Load More MIDI Files
        </button>
      )}

      {/* Loading indicator */}
      {loading && (
        <div className="flex justify-center items-center py-4">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
          <span className="ml-2 text-white">Loading more MIDI files...</span>
        </div>
      )}

      {/* Error message */}
      {error && (
        <div className="flex justify-center items-center py-4">
          <p className="text-red-400">Error: {error}</p>
        </div>
      )}

      {/* End of list indicator */}
      {!hasMore && midiFiles.length > 0 && (
        <div className="flex justify-center items-center py-4">
          <p className="text-gray-400">No more MIDI files to load</p>
        </div>
      )}
    </div>
  );
}

export default LazyMidigrid;
