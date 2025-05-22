import React, { useState, useEffect } from 'react';
import MovieCard from '../components/MovieCard';
import SearchBar from '../components/SearchBar'; // Import SearchBar

function HomePage() {
  const [allMovies, setAllMovies] = useState([]); // Stores all fetched movies
  const [filteredMovies, setFilteredMovies] = useState([]); // Stores movies to display
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch all movies once on component mount
  useEffect(() => {
    const fetchMovies = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch('/api/movies');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setAllMovies(data);
        // Initially, display all movies
        // setFilteredMovies(data); // This will be handled by the filtering useEffect
      } catch (e) {
        setError(e.message);
        setAllMovies([]); // Ensure movies list is empty on error
        // setFilteredMovies([]);
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, []);

  // Filter movies when allMovies or searchQuery changes
  useEffect(() => {
    if (!searchQuery) {
      setFilteredMovies(allMovies); // If search is empty, show all movies
      return;
    }

    const lowerCaseQuery = searchQuery.toLowerCase();
    const filtered = allMovies.filter(movie => {
      const titleMatch = movie.title && movie.title.toLowerCase().includes(lowerCaseQuery);
      const genreMatch = movie.genre && movie.genre.toLowerCase().includes(lowerCaseQuery);
      return titleMatch || genreMatch;
    });
    setFilteredMovies(filtered);
  }, [searchQuery, allMovies]); // Re-run when searchQuery or the master list of movies changes

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  if (loading) {
    return <div className="text-center py-10">Loading movies...</div>;
  }

  if (error) {
    return <div className="text-center py-10 text-red-500">Error fetching movies: {error}</div>;
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-center my-8">Featured Movies</h1>
      <div className="mb-8 max-w-xl mx-auto"> {/* Centered SearchBar container */}
        <SearchBar onSearch={handleSearch} />
      </div>
      
      {filteredMovies.length === 0 && !loading && (
        <div className="text-center py-10">
          {searchQuery ? `No movies found matching "${searchQuery}".` : "No movies available."}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredMovies.map(movie => (
          <MovieCard key={movie.id} movie={movie} />
        ))}
      </div>
    </div>
  );
}

export default HomePage;
