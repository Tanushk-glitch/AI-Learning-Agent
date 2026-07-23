export type YouTubeVideo = {
  title: string;
  channel: string;
  thumbnailUrl: string;
  videoUrl: string;
};

type YouTubeSearchResponse = {
  items?: Array<{
    id?: {
      videoId?: string;
    };
    snippet?: {
      title?: string;
      channelTitle?: string;
      thumbnails?: {
        medium?: {
          url?: string;
        };
        default?: {
          url?: string;
        };
      };
    };
  }>;
};

const YOUTUBE_API_KEY = import.meta.env.VITE_YOUTUBE_API_KEY as
  | string
  | undefined;

export async function searchYouTubeTutorial(
  topic: string
): Promise<YouTubeVideo | null> {
  if (!YOUTUBE_API_KEY) {
    return null;
  }

  const params = new URLSearchParams({
    key: YOUTUBE_API_KEY,
    part: "snippet",
    maxResults: "1",
    q: `${topic} tutorial`,
    safeSearch: "moderate",
    type: "video",
    videoEmbeddable: "true",
  });

  const response = await fetch(
    `https://www.googleapis.com/youtube/v3/search?${params.toString()}`
  );

  if (!response.ok) {
    return null;
  }

  const payload = (await response.json()) as YouTubeSearchResponse;
  const item = payload.items?.[0];
  const videoId = item?.id?.videoId;
  const snippet = item?.snippet;

  if (!videoId || !snippet?.title || !snippet.channelTitle) {
    return null;
  }

  return {
    title: decodeHtmlEntities(snippet.title),
    channel: snippet.channelTitle,
    thumbnailUrl:
      snippet.thumbnails?.medium?.url ?? snippet.thumbnails?.default?.url ?? "",
    videoUrl: `https://www.youtube.com/watch?v=${videoId}`,
  };
}

function decodeHtmlEntities(value: string): string {
  const parser = new DOMParser();
  return parser.parseFromString(value, "text/html").documentElement.textContent ?? value;
}
