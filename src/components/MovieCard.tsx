import React from "react";
import { Calendar, Film } from "lucide-react";
import { Movie } from "@/types/movie";

interface MovieCardProps {
  movie: Movie;
  onClick: () => void;
}

export const MovieCard: React.FC<MovieCardProps> = ({ movie, onClick }) => {
  const posterUrl =
    movie.Poster && movie.Poster !== "N/A" ? movie.Poster : "/placeholder.svg";

  return (
    <div
      className="group cinema-card rounded-lg overflow-hidden cursor-pointer bg-black/50 relative"
      onClick={onClick}
    >
      <div className="absolute top-0 left-0 right-0 h-10 bg-black/50 z-10 h-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      <div className="aspect-[2/3] relative overflow-hidden">
        <img
          src={posterUrl}
          alt={movie.Title}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = "/placeholder.svg";
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>

      <div className="p-4 space-y-2 absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <h3 className="font-semibold text-lg leading-tight line-clamp-2 text-cinema-gold">
          {movie.Title}
        </h3>

        <div className="flex items-center justify-between text-sm text-white">
          <div className="flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            <span>{movie.Year}</span>
          </div>

          <div className="flex items-center gap-1 capitalize">
            <Film className="h-3 w-3" />
            <span>{movie.Type}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
