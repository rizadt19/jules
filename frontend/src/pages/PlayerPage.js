import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function PlayerPage() {
  const { id: movieId } = useParams();
  const { token, isAuthenticated } = useAuth();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const videoRef = useRef(null);
  const [watchHistoryRecorded, setWatchHistoryRecorded] = useState(false);

  useEffect(() => {
    const fetchMovieData = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch(`/api/movies/${movieId}`);
        if (!response.ok) {
          if (response.status === 404) throw new Error('Movie not found.');
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

    if (movieId) {
      fetchMovieData();
    }
  }, [movieId]);

  const handlePlay = async () => {
    if (isAuthenticated && token && movieId && !watchHistoryRecorded) {
      // Record watch history after 5 seconds of playback (or any other condition)
      // For simplicity, we'll record it almost immediately on play
      // More robust: track playback time with videoRef.current.currentTime
      try {
        const response = await fetch('/api/user/watch-history', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({ movieId: parseInt(movieId) }), // Ensure movieId is a number if your backend expects it
        });
        if (response.ok) {
          console.log('Watch history updated.');
          setWatchHistoryRecorded(true); // Prevent multiple submissions
        } else {
          const errorData = await response.json();
          console.error('Failed to update watch history:', errorData.message);
        }
      } catch (err) {
        console.error('Error updating watch history:', err);
      }
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-screen bg-gray-900 text-white"><p>Loading player...</p></div>;
  }

  if (error) {
    return (
      <div className="flex flex-col justify-center items-center h-screen bg-gray-900 text-white">
        <p className="text-red-500 text-xl mb-4">Error: {error}</p>
        <Link to="/" className="px-4 py-2 bg-blue-500 hover:bg-blue-700 rounded text-white">
          Go to Home
        </Link>
      </div>
    );
  }

  if (!movie || !movie.videoUrl) {
    return (
      <div className="flex flex-col justify-center items-center h-screen bg-gray-900 text-white">
        <p className="text-xl mb-4">Video not available for this movie.</p>
        <Link to="/" className="px-4 py-2 bg-blue-500 hover:bg-blue-700 rounded text-white">
          Go to Home
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-gray-900 min-h-screen flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        <h1 className="text-2xl sm:text-3xl font-bold text-white text-center mb-4 sm:mb-6">
          Now Playing: {movie.title || 'Untitled Movie'}
        </h1>
        <div className="aspect-video bg-black shadow-2xl rounded-lg overflow-hidden">
          <video
            ref={videoRef}
            src={movie.videoUrl}
            controls
            onPlay={handlePlay} // Call handlePlay when video starts playing
            // onTimeUpdate could be used for more precise history recording
            className="w-full h-full"
            // autoPlay // Optional: if you want the video to start playing automatically
          >
            Your browser does not support the video tag.
          </video>
        </div>
        <div className="mt-4 text-center">
          <Link 
            to={`/movie/${movieId}`} 
            className="text-blue-400 hover:text-blue-300 transition-colors"
          >
            &larr; Back to Movie Details
          </Link>
        </div>
      </div>
    </div>
  );
}

export default PlayerPage;
