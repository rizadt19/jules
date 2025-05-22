import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

function ProfilePage() {
  const { user, token, isAuthenticated, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [profileData, setProfileData] = useState(null);
  const [watchedMoviesDetails, setWatchedMoviesDetails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate('/login');
    }
  }, [authLoading, isAuthenticated, navigate]);

  useEffect(() => {
    const fetchProfileAndWatchHistory = async () => {
      if (token && isAuthenticated) {
        try {
          setLoading(true);
          setError(null);
          const response = await fetch('/api/user/profile', {
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          });

          if (!response.ok) {
            if (response.status === 401 || response.status === 403) {
              setError('Unauthorized. Please log in again.');
              // Consider logging out the user here if token is invalid
            } else {
              setError(`Error fetching profile: ${response.statusText}`);
            }
            return;
          }

          const data = await response.json();
          setProfileData(data);

          // If watchHistory contains movie IDs, fetch details for each
          if (data.watchHistory && data.watchHistory.length > 0) {
            const moviePromises = data.watchHistory.map(movieId =>
              fetch(`/api/movies/${movieId}`).then(res => {
                if (!res.ok) {
                  console.warn(`Failed to fetch details for movie ID: ${movieId}`);
                  return null; // Return null for movies that couldn't be fetched
                }
                return res.json();
              })
            );
            const moviesDetails = (await Promise.all(moviePromises)).filter(movie => movie !== null);
            setWatchedMoviesDetails(moviesDetails);
          } else {
            setWatchedMoviesDetails([]); // No watch history or empty
          }

        } catch (e) {
          setError(`Failed to fetch profile data: ${e.message}`);
        } finally {
          setLoading(false);
        }
      } else if (!authLoading && !isAuthenticated) {
         // Handled by the first useEffect, but good to be cautious
        setLoading(false);
      }
    };

    if (!authLoading) { // Only fetch if auth state is resolved
        fetchProfileAndWatchHistory();
    }
  }, [token, isAuthenticated, authLoading]); // Re-run if token or auth status changes

  if (authLoading || loading) {
    return <div className="text-center py-10">Loading profile...</div>;
  }

  if (error) {
    return <div className="text-center py-10 text-red-500">Error: {error}</div>;
  }

  if (!profileData) {
    return <div className="text-center py-10">Could not load profile data.</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white shadow-xl rounded-lg p-6 md:p-8">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">User Profile</h1>
        <div className="mb-6">
          <p className="text-lg text-gray-700">
            <span className="font-semibold">Email:</span> {profileData.email || user?.email || 'N/A'}
          </p>
          {/* Add more profile details here if available, e.g., name */}
        </div>

        <h2 className="text-2xl font-semibold mb-4 text-gray-700">Watch History</h2>
        {watchedMoviesDetails.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {watchedMoviesDetails.map(movie => (
              movie && ( // Ensure movie object exists
                <div key={movie.id} className="bg-gray-50 shadow-md rounded-lg overflow-hidden">
                  <img 
                    src={movie.posterUrl || 'https://via.placeholder.com/300x450?text=No+Image'} 
                    alt={movie.title || 'Movie Title'} 
                    className="w-full h-64 object-cover" 
                  />
                  <div className="p-4">
                    <h3 className="text-md font-semibold mb-1">{movie.title || 'No Title'}</h3>
                    <p className="text-xs text-gray-600 mb-2">Genre: {movie.genre || 'N/A'}</p>
                    <Link 
                      to={`/movie/${movie.id}`} 
                      className="inline-block text-xs bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-3 rounded"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              )
            ))}
          </div>
        ) : (
          <p className="text-gray-600">You haven't watched any movies yet.</p>
        )}
      </div>
    </div>
  );
}

export default ProfilePage;
