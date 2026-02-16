export function getYouTubeEmbedUrl(videoUrl: string): string {
    const patterns = [
      /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
      /youtube\.com\/watch\?.*v=([^&\n?#]+)/,
    ];
  
    for (const pattern of patterns) {
      const match = videoUrl.match(pattern);
      if (match) {
        return `https://www.youtube.com/embed/${match[1]}`;
      }
    }
  
    return videoUrl; // Fallback to original URL if no match
  }