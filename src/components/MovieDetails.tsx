import React from "react";
import {
  ArrowLeft,
  Calendar,
  Clock,
  Star,
  Award,
  Users,
  Globe,
  DollarSign,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MovieDetails as MovieDetailsType } from "@/types/movie";

interface MovieDetailsProps {
  movie: MovieDetailsType;
  onBack: () => void;
}

export const MovieDetails: React.FC<MovieDetailsProps> = ({
  movie,
  onBack,
}) => {
  const posterUrl =
    movie.Poster && movie.Poster !== "N/A" ? movie.Poster : "/placeholder.svg";

  const genres = movie.Genre?.split(", ") || [];
  const ratings = movie.Ratings || [];

  return (
    <div className="max-w-6xl mx-auto">
      <Button
        onClick={onBack}
        variant="outline"
        className="mb-6 cinema-card border-cinema-gold/30 hover:border-cinema-gold text-white bg-black/50 hover:bg-cinema-gold hover:text-black"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Search
      </Button>

      <div className="cinema-card rounded-xl p-6 lg:p-8 bg-black/20 text-white">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Poster */}
          <div className="lg:col-span-1">
            <div className="aspect-[2/3] rounded-lg overflow-hidden cinema-glow">
              <img
                src={posterUrl}
                alt={movie.Title}
                className="w-full h-full object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = "/placeholder.svg";
                }}
              />
            </div>
          </div>

          {/* Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Title and Basic Info */}
            <div>
              <h1 className="text-3xl lg:text-4xl font-bold text-cinema-gold mb-3 text-white">
                {movie.Title}
              </h1>

              <div className="flex flex-wrap items-center gap-4 text-white mb-4">
                {movie.Year && (
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    <span>{movie.Year}</span>
                  </div>
                )}

                {movie.Runtime && (
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    <span>{movie.Runtime}</span>
                  </div>
                )}

                {movie.Rated && (
                  <Badge variant="secondary">{movie.Rated}</Badge>
                )}
              </div>

              {/* Genres */}
              {genres.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {genres.map((genre) => (
                    <Badge
                      key={genre}
                      className="cinema-button bg-cinema-gold text-black"
                    >
                      {genre}
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            {/* Ratings */}
            {ratings.length > 0 && (
              <div className="space-y-3">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <Star className="h-5 w-5 text-cinema-gold" />
                  Ratings
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {ratings.map((rating) => (
                    <div
                      key={rating.Source}
                      className="cinema-card rounded-lg p-3 text-center bg-black/20 border-cinema-gold/30 border"
                    >
                      <div className="text-sm text-white mb-1">
                        {rating.Source}
                      </div>
                      <div className="font-semibold text-cinema-gold">
                        {rating.Value}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Plot */}
            {movie.Plot && movie.Plot !== "N/A" && (
              <div className="space-y-3">
                <h3 className="text-lg font-semibold">Plot</h3>
                <p className="text-white leading-relaxed">
                  {movie.Plot}
                </p>
              </div>
            )}

            {/* Additional Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {movie.Director && movie.Director !== "N/A" && (
                <div>
                  <h4 className="font-semibold text-cinema-gold mb-2">
                    Director
                  </h4>
                  <p className="text-white">{movie.Director}</p>
                </div>
              )}

              {movie.Actors && movie.Actors !== "N/A" && (
                <div>
                  <h4 className="font-semibold text-cinema-gold mb-2 flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    Cast
                  </h4>
                  <p className="text-white">{movie.Actors}</p>
                </div>
              )}

              {movie.Country && movie.Country !== "N/A" && (
                <div>
                  <h4 className="font-semibold text-cinema-gold mb-2 flex items-center gap-2">
                    <Globe className="h-4 w-4" />
                    Country
                  </h4>
                  <p className="text-white">{movie.Country}</p>
                </div>
              )}

              {movie.BoxOffice && movie.BoxOffice !== "N/A" && (
                <div>
                  <h4 className="font-semibold text-cinema-gold mb-2 flex items-center gap-2">
                    <DollarSign className="h-4 w-4" />
                    Box Office
                  </h4>
                  <p className="text-white">{movie.BoxOffice}</p>
                </div>
              )}
            </div>

            {/* Awards */}
            {movie.Awards && movie.Awards !== "N/A" && (
              <div className="space-y-3">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <Award className="h-5 w-5 text-cinema-gold" />
                  Awards
                </h3>
                <p className="text-white leading-relaxed">
                  {movie.Awards}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
