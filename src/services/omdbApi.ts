import { Movie, MovieDetails, OMDbSearchResponse } from '@/types/movie';

const OMDB_BASE_URL = 'https://www.omdbapi.com/';

// Custom error class
class ApiError extends Error {
  isThrottled?: boolean;
  
  constructor(message: string, isThrottled: boolean = false) {
    super(message);
    this.name = 'ApiError';
    this.isThrottled = isThrottled;
  }
}

class OMDbApiService {
  private apiKey: string | null = 'cc244580';

  constructor() {
    // Use default API key
  }

  setApiKey(key: string) {
    this.apiKey = key.trim();
  }

  clearApiKey() {
    this.apiKey = null;
  }

  getApiKey(): string | null {
    return this.apiKey;
  }

  private async makeRequest(params: Record<string, string>): Promise<any> {
    if (!this.apiKey) {
      throw new ApiError('API key is required. Please set your OMDb API key.');
    }

    const url = new URL(OMDB_BASE_URL);
    url.searchParams.append('apikey', this.apiKey);
    
    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.append(key, value);
    });

    try {
      const response = await fetch(url.toString());
      
      if (!response.ok) {
        if (response.status === 429) {
          throw new ApiError('API rate limit exceeded. Please wait a moment before trying again.', true);
        }
        throw new ApiError(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.Response === 'False') {
        if (data.Error?.includes('Request limit reached')) {
          throw new ApiError('Daily API limit reached. Please try again tomorrow.', true);
        }
        if (data.Error?.includes('Too many results')) {
          throw new ApiError('Too many results found. Please be more specific with your search term.', false);
        }
        throw new ApiError(data.Error || 'An error occurred while fetching data.');
      }

      return data;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      
      // Network or other errors
      throw new ApiError('Failed to connect to the movie database. Please check your internet connection.');
    }
  }

  async searchMovies(title: string, page: number = 1): Promise<{ movies: Movie[], totalResults: number }> {
    if (!title.trim()) {
      return { movies: [], totalResults: 0 };
    }

    const data: OMDbSearchResponse = await this.makeRequest({
      s: title.trim(),
      page: page.toString(),
      type: 'movie'
    });

    return {
      movies: data.Search || [],
      totalResults: parseInt(data.totalResults || '0')
    };
  }

  async getMovieDetails(imdbId: string): Promise<MovieDetails> {
    const data: MovieDetails = await this.makeRequest({
      i: imdbId,
      plot: 'full'
    });

    return data;
  }
}

// Create a singleton instance
export const omdbApi = new OMDbApiService();
export { ApiError };