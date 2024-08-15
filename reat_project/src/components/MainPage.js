import React, { useState } from 'react';
import Navbar from './Navbar';
import ProductList from './ProductList'; // Assume you have this component

const MainPage = () => {
  const [category, setCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const handleCategorySelect = (selectedCategory) => {
    setCategory(selectedCategory);
  };

  const handleSearch = (query, selectedCategory) => {
    setSearchQuery(query);
    setCategory(selectedCategory);
  };

  return (
    <div>
      <Navbar onCategorySelect={handleCategorySelect} onSearch={handleSearch} />
      <ProductList category={category} searchQuery={searchQuery} />
    </div>
  );
};

export default MainPage;
