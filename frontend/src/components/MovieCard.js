import React from 'react';
import { Link } from 'react-router-dom';

function MovieCard({ movie }) {
  if (!movie) {
    return null; // Or a placeholder
  }

  const { id, title, posterUrl, genre } = movie;

  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden">
      <img 
        src={posterUrl || 'https://via.placeholder.com/300x450?text=No+Image'} 
        alt={title} 
        className="w-full h-64 object-cover" 
      />
      <div className="p-4">
        <h3 className="text-lg font-semibold mb-2">{title || 'No Title'}</h3>
        <p className="text-sm text-gray-600 mb-2">Genre: {genre || 'N/A'}</p>
        <Link 
          to={`/movie/${id}`} 
          className="inline-block bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded text-sm"
        >
          View Details
        </Link>
      </div>
    </div>
  );
}

export default MovieCard;
