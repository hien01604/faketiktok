import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTv, faSearch } from '@fortawesome/free-solid-svg-icons';

const TopNavbar = ({ onSearch }) => {
  const [isSearchOpen, setIsSearchOpen] = useState(false); // State to toggle search input

  // Handle search icon click to show/hide input field
  const handleSearchClick = () => {
    setIsSearchOpen(!isSearchOpen);
  };

  return (
    <div className="top-navbar">
      {/* TV Icon */}
      <FontAwesomeIcon icon={faTv} className="icon" />

      {/* Navbar Title */}
      <h2>Following | <span>For You</span></h2>

      {/* Search Icon */}
      <FontAwesomeIcon icon={faSearch} className="icon" onClick={handleSearchClick} />

      {/* Conditional rendering of search input */}
      {isSearchOpen && (
        <input
          type="text"
          placeholder="Search by hashtag"
          onChange={(e) => onSearch(e.target.value)} // Pass input value to parent (App.js)
          className="search-input"
        />
      )}
    </div>
  );
};

export default TopNavbar;
