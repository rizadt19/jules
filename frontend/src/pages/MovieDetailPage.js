import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';

function MovieDetailPage() {
  const { id } = useParams(); // Get movie ID from URL
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMovieDetail = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch(`/api/movies/${id}`);
        if (!response.ok) {
          if (response.status === 404) {
            throw new Error('Movie not found');
          }
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setMovie(data);
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchMovieDetail();
    }
  }, [id]); // Re-run effect if ID changes

  if (loading) {
    return <div className="text-center py-10">Loading movie details...</div>;
  }

  if (error) {
    return <div className="text-center py-10 text-red-500">Error: {error}</div>;
  }

  if (!movie) {
    return <div className="text-center py-10">Movie details not available.</div>;
  }

  const { title, posterUrl, description, genre } = movie;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white shadow-xl rounded-lg overflow-hidden md:flex">
        <div className="md:w-1/3">
          <img 
            src={posterUrl || 'https://via.placeholder.com/400x600?text=No+Image'} 
            alt={title} 
            className="w-full h-auto object-cover" // Adjusted for responsiveness
          />
        </div>
        <div className="md:w-2/3 p-6 flex flex-col justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-3">{title || 'No Title'}</h1>
            <p className="text-gray-700 text-lg mb-4">
              <strong>Genre:</strong> {genre || 'N/A'}
            </p>
            <p className="text-gray-600 mb-6 text-base">{description || 'No description available.'}</p>
          </div>
          <Link 
            to={`/player/${id}`} 
            // state={{ videoUrl: movie.videoUrl }} // Optional: pass videoUrl via route state
            className="w-full md:w-auto text-center bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-6 rounded-lg text-lg transition duration-300 ease-in-out transform hover:scale-105"
          >
            Watch Now
          </Link>
        </div>
      </div>
    </div>
  );
}

export default MovieDetailPage;
