import React, { useState, useCallback, useMemo } from 'react';
import { SearchBar } from './SearchBar';
import { MovieGrid } from './MovieGrid';
import { MovieDetails } from './MovieDetails';
import { LoadingGrid, LoadingSpinner } from './LoadingSpinner';
import { ErrorMessage } from './ErrorMessage';
import { useDebounce } from '@/hooks/useDebounce';
import { omdbApi, ApiError } from '@/services/omdbApi';
import { Movie, MovieDetails as MovieDetailsType } from '@/types/movie';
import { useToast } from '@/hooks/use-toast';
import { Archive } from 'lucide-react';

type ViewState = 'search' | 'details';

interface AppState {
  view: ViewState;
  movies: Movie[];
  selectedMovie: MovieDetailsType | null;
  searchQuery: string;
  isLoading: boolean;
  isLoadingDetails: boolean;
  error: string | null;
  isThrottled: boolean;
}

export const MovieSearchApp: React.FC = () => {
  const { toast } = useToast();
  
  const [state, setState] = useState<AppState>({
    view: 'search',
    movies: [],
    selectedMovie: null,
    searchQuery: '',
    isLoading: false,
    isLoadingDetails: false,
    error: null,
    isThrottled: false
  });

  // Debounce search query to reduce API calls
  const debouncedSearchQuery = useDebounce(state.searchQuery, 300);

  // Perform search when debounced query changes
  React.useEffect(() => {
    if (debouncedSearchQuery.trim()) {
      performSearch(debouncedSearchQuery);
    } else {
      setState(prev => ({ ...prev, movies: [], error: null }));
    }
  }, [debouncedSearchQuery]);

  const performSearch = useCallback(async (query: string) => {
    if (!query.trim()) return;

    setState(prev => ({ 
      ...prev, 
      isLoading: true, 
      error: null, 
      isThrottled: false 
    }));

    try {
      const { movies } = await omdbApi.searchMovies(query);
      setState(prev => ({ 
        ...prev, 
        movies, 
        isLoading: false,
        error: null
      }));

      if (movies.length === 0) {
        toast({
          title: "No results found",
          description: `No movies found for "${query}". Try different keywords.`
        });
      }
    } catch (error) {
      const isApiError = error instanceof ApiError;
      const errorMessage = isApiError ? error.message : 'An unexpected error occurred';
      const isThrottled = isApiError ? error.isThrottled || false : false;

      setState(prev => ({ 
        ...prev, 
        isLoading: false, 
        error: errorMessage,
        isThrottled,
        movies: []
      }));

      if (!isThrottled) {
        toast({
          title: "Search failed",
          description: errorMessage,
          variant: "destructive"
        });
      }
    }
  }, [toast]);

  const handleSearch = useCallback((query: string) => {
    setState(prev => ({ ...prev, searchQuery: query }));
  }, []);

  const handleMovieClick = useCallback(async (movie: Movie) => {
    setState(prev => ({ 
      ...prev, 
      isLoadingDetails: true, 
      view: 'details',
      error: null 
    }));

    try {
      const movieDetails = await omdbApi.getMovieDetails(movie.imdbID);
      setState(prev => ({ 
        ...prev, 
        selectedMovie: movieDetails, 
        isLoadingDetails: false 
      }));
    } catch (error) {
      const isApiError = error instanceof ApiError;
      const errorMessage = isApiError ? error.message : 'Failed to load movie details';

      setState(prev => ({ 
        ...prev, 
        isLoadingDetails: false, 
        error: errorMessage,
        view: 'search'
      }));

      toast({
        title: "Failed to load details",
        description: errorMessage,
        variant: "destructive"
      });
    }
  }, [toast]);

  const handleBackToSearch = useCallback(() => {
    setState(prev => ({ 
      ...prev, 
      view: 'search', 
      selectedMovie: null,
      error: null 
    }));
  }, []);

  const handleRetry = useCallback(() => {
    if (state.searchQuery.trim()) {
      performSearch(state.searchQuery);
    }
  }, [state.searchQuery, performSearch]);

  // Memoize expensive computations
  const hasSearchResults = useMemo(() => state.movies.length > 0, [state.movies.length]);
  const hasSearchQuery = useMemo(() => state.searchQuery.trim().length > 0, [state.searchQuery]);

  return (
    <div className="min-h-screen p-4 lg:p-8 bg-black/90">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl lg:text-6xl font-bold text-cinema-gold">
            Movie Search
          </h1>
          <p className="text-xl text-white max-w-2xl mx-auto">
            Discover movies from the world's largest movie database
          </p>
        </div>

        {/* Search Bar - Always visible */}
        {state.view === 'search' && (
          <SearchBar 
            onSearch={handleSearch}
            isLoading={state.isLoading}
          />
        )}

        {/* Content Area */}
        <div className="space-y-6">
          {state.view === 'search' && (
            <>
              {/* Error Message */}
              {state.error && (
                <ErrorMessage 
                  error={state.error}
                  onRetry={!state.isThrottled ? handleRetry : undefined}
                  isThrottled={state.isThrottled}
                />
              )}

              {/* Loading State */}
              {state.isLoading && <LoadingGrid />}

              {/* Search Results */}
              {!state.isLoading && !state.error && hasSearchResults && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-semibold text-cinema-gold">
                      Search Results
                    </h2>
                    <span className="text-muted-foreground">
                      {state.movies.length} movies found
                    </span>
                  </div>
                  <MovieGrid 
                    movies={state.movies}
                    onMovieClick={handleMovieClick}
                  />
                </div>
              )}

              {/* Empty State */}
              {!state.isLoading && !state.error && !hasSearchResults && hasSearchQuery && (
                <div className="text-center py-12">
                  <div className="w-24 h-24 mx-auto mb-4 opacity-80">
                    <Archive className="w-full h-full text-cinema-gold" />
                  </div>
                  <h3 className="text-xl font-semibold text-muted-foreground mb-2">
                    No movies found
                  </h3>
                  <p className="text-white">
                    Try searching with different keywords
                  </p>
                </div>
              )}

              {/* Welcome State */}
              {!hasSearchQuery && !state.error && (
                <div className="text-center py-16">
                  <div className="w-32 h-32 mx-auto mb-6 opacity-80">
                    <Archive className="w-full h-full text-cinema-gold" />
                  </div>
                  <h3 className="text-2xl font-semibold text-white mb-4">
                    Start your movie discovery
                  </h3>
                  <p className="text-white max-w-md mx-auto">
                    Search for any movie title to explore detailed information, ratings, and more
                  </p>
                </div>
              )}
            </>
          )}

          {/* Movie Details View */}
          {state.view === 'details' && (
            <>
              {state.isLoadingDetails ? (
                <div className="py-16">
                  <LoadingSpinner size="lg" className="mb-4" />
                  <p className="text-center text-muted-foreground">
                    Loading movie details...
                  </p>
                </div>
              ) : state.selectedMovie ? (
                <MovieDetails 
                  movie={state.selectedMovie}
                  onBack={handleBackToSearch}
                />
              ) : null}
            </>
          )}
        </div>
      </div>
    </div>
  );
};