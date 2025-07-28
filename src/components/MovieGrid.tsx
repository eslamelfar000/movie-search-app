import React from 'react';
import { MovieCard } from './MovieCard';
import { Movie } from '@/types/movie';

interface MovieGridProps {
  movies: Movie[];
  onMovieClick: (movie: Movie) => void;
}

export const MovieGrid: React.FC<MovieGridProps> = ({ movies, onMovieClick }) => {
  if (movies.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-24 h-24 mx-auto mb-4 opacity-50">
          <svg viewBox="0 0 24 24" fill="none" className="w-full h-full">
            <path
              d="M12 2L2 7V17L12 22L22 17V7L12 2Z"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinejoin="round"
            />
            <path
              d="M12 22V12"
              stroke="currentColor"
              strokeWidth="2"
            />
            <path
              d="M22 17L12 12L2 17"
              stroke="currentColor"
              strokeWidth="2"
            />
          </svg>
        </div>
        <h3 className="text-xl font-semibold text-muted-foreground mb-2">
          No movies found
        </h3>
        <p className="text-muted-foreground">
          Try searching with different keywords
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {movies.map((movie) => (
        <MovieCard
          key={movie.imdbID}
          movie={movie}
          onClick={() => onMovieClick(movie)}
        />
      ))}
    </div>
  );
};