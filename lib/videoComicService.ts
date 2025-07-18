export interface VideoComic {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  episodes?: Episode[];
}

export interface Episode {
  id: string;
  episodeNumber: number;
  title: string;
  description: string;
  thumbnail: string;
  duration: string;
  views: number;
  videos?: Video[];
}

export interface Video {
  id: string;
  url: string;
  quality: string;
}

export async function getVideoComicById(id: string): Promise<VideoComic> {
  // Mock implementation
  return {
    id,
    title: 'Sample Video Comic',
    description: 'A sample video comic',
    thumbnail: '/images/placeholder.png',
    episodes: []
  };
}

export async function getEpisodeById(videoComicId: string, episodeNumber: number): Promise<Episode> {
  // Mock implementation
  return {
    id: `${videoComicId}-episode-${episodeNumber}`,
    episodeNumber,
    title: `Episode ${episodeNumber}`,
    description: 'Sample episode description',
    thumbnail: '/images/placeholder.png',
    duration: '10:00',
    views: 1000,
    videos: []
  };
} 