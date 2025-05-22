import React, { useState } from 'react';

function SearchBar({ onSearch }) {
  const [query, setQuery] = useState('');

  const handleInputChange = (e) => {
    const newQuery = e.target.value;
    setQuery(newQuery);
    if (onSearch) {
      onSearch(newQuery); // Call onSearch prop as user types
    }
  };

  // Optional: if you want a search button
  // const handleSubmit = (e) => {
  //   e.preventDefault();
  //   if (onSearch) {
  //     onSearch(query);
  //   }
  // };

  return (
    <form 
      className="mb-8" 
      // onSubmit={handleSubmit} // Uncomment if using a search button
    >
      <input
        type="text"
        placeholder="Search movies by title or genre..."
        value={query}
        onChange={handleInputChange}
        className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      />
      {/* <button 
        type="submit" 
        className="ml-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        Search
      </button> */}
    </form>
  );
}

export default SearchBar;
