export type YouTubeVideo = {
  title: string;
  channel: string;
  thumbnailUrl: string;
  videoUrl: string;
};

export class YouTubeSearchError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "YouTubeSearchError";
  }
}

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
const tutorialCache = new Map<string, YouTubeVideo | null>();
const tutorialErrors = new Map<string, YouTubeSearchError>();
const tutorialRequests = new Map<string, Promise<YouTubeVideo | null>>();

export async function searchYouTubeTutorial(
  topic: string
): Promise<YouTubeVideo | null> {
  const topicCacheKey = getTopicCacheKey(topic);

  if (tutorialCache.has(topicCacheKey)) {
    return tutorialCache.get(topicCacheKey) ?? null;
  }
  const cachedError = tutorialErrors.get(topicCacheKey);
  if (cachedError) {
    throw cachedError;
  }

  const activeRequest = tutorialRequests.get(topicCacheKey);
  if (activeRequest) {
    return activeRequest;
  }

  const request = fetchYouTubeTutorial(topic, topicCacheKey)
    .catch((error: unknown) => {
      const searchError =
        error instanceof YouTubeSearchError
          ? error
          : new YouTubeSearchError("Unable to load YouTube tutorial.");
      tutorialErrors.set(topicCacheKey, searchError);
      throw searchError;
    })
    .finally(() => {
      tutorialRequests.delete(topicCacheKey);
    });
  tutorialRequests.set(topicCacheKey, request);

  return request;
}

async function fetchYouTubeTutorial(
  topic: string,
  topicCacheKey: string
): Promise<YouTubeVideo | null> {
  if (!YOUTUBE_API_KEY) {
    throw new YouTubeSearchError("YouTube API key is not configured.");
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
    const message = await getYouTubeErrorMessage(response);
    throw new YouTubeSearchError(message);
  }

  const payload = (await response.json()) as YouTubeSearchResponse;
  const item = payload.items?.[0];
  const videoId = item?.id?.videoId;
  const snippet = item?.snippet;

  if (!videoId || !snippet?.title || !snippet.channelTitle) {
    tutorialCache.set(topicCacheKey, null);
    return null;
  }

  const video = {
    title: decodeHtmlEntities(snippet.title),
    channel: snippet.channelTitle,
    thumbnailUrl:
      snippet.thumbnails?.medium?.url ?? snippet.thumbnails?.default?.url ?? "",
    videoUrl: `https://www.youtube.com/watch?v=${videoId}`,
  };
  tutorialCache.set(topicCacheKey, video);
  return video;
}

async function getYouTubeErrorMessage(response: Response): Promise<string> {
  try {
    const payload = (await response.json()) as {
      error?: { message?: string; status?: string };
    };
    return payload.error?.message
      ? `YouTube API error: ${payload.error.message}`
      : `YouTube API request failed with status ${response.status}.`;
  } catch {
    return `YouTube API request failed with status ${response.status}.`;
  }
}

function decodeHtmlEntities(value: string): string {
  const parser = new DOMParser();
  return parser.parseFromString(value, "text/html").documentElement.textContent ?? value;
}

function getTopicCacheKey(topic: string): string {
  return topic.trim().toLowerCase();
}
