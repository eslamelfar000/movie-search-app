import React, { useState, useCallback } from 'react';
import { Search, Key } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { omdbApi } from '@/services/omdbApi';
import { useToast } from '@/hooks/use-toast';

interface SearchBarProps {
  onSearch: (query: string) => void;
  isLoading: boolean;
}

export const SearchBar: React.FC<SearchBarProps> = ({ onSearch, isLoading }) => {
  const [query, setQuery] = useState('');
  const [apiKey, setApiKey] = useState(omdbApi.getApiKey() || '');
  const [isApiKeyDialogOpen, setIsApiKeyDialogOpen] = useState(false);
  const { toast } = useToast();

  const handleSearch = useCallback((searchQuery: string) => {
    if (!omdbApi.getApiKey()) {
      setIsApiKeyDialogOpen(true);
      return;
    }
    onSearch(searchQuery);
  }, [onSearch]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      handleSearch(query.trim());
    }
  };

  const handleApiKeySubmit = () => {
    if (apiKey.trim()) {
      omdbApi.setApiKey(apiKey.trim());
      setIsApiKeyDialogOpen(false);
      toast({
        title: "API Key saved",
        description: "You can now search for movies!"
      });
      if (query.trim()) {
        handleSearch(query.trim());
      }
    }
  };

  const needsApiKey = !omdbApi.getApiKey();

  return (
    <div className="w-full max-w-2xl mx-auto">
      <form onSubmit={handleSubmit} className="relative flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            type="text"
            placeholder="Search for movies..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-10 h-12 text-lg cinema-card border-cinema-gold/20 focus-visible:ring-0 focus-visible:ring-offset-0 focus:ring-0 text-white bg-black/20"
            disabled={isLoading}
          />
        </div>
        
        <Button 
          type="submit" 
          className="h-12 px-6 cinema-button text-white bg-black/50 hover:bg-cinema-gold hover:text-black"
          disabled={isLoading || !query.trim()}
        >
          {isLoading ? (
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
          ) : (
            'Search'
          )}
        </Button>

        {needsApiKey && (
          <Dialog open={isApiKeyDialogOpen} onOpenChange={setIsApiKeyDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="icon" className="h-12 w-12">
                <Key className="h-4 w-4" />
              </Button>
            </DialogTrigger>
            <DialogContent className="cinema-card">
              <DialogHeader>
                <DialogTitle className="text-cinema-gold">Set OMDb API Key</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  You need an OMDb API key to search for movies. 
                  Get one for free at{' '}
                  <a 
                    href="https://www.omdbapi.com/apikey.aspx" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-cinema-gold hover:underline"
                  >
                    omdbapi.com
                  </a>
                </p>
                <Input
                  type="text"
                  placeholder="Enter your API key..."
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  className="cinema-card"
                />
                <Button 
                  onClick={handleApiKeySubmit}
                  className="w-full cinema-button"
                  disabled={!apiKey.trim()}
                >
                  Save API Key
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </form>
    </div>
  );
};