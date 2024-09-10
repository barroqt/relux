"use client";

import React, { useState } from 'react';
import SearchBar from './components/SearchBar';
import CategoryList from './components/CatergoryList';

const products = [
  { name: 'Bobo Choses Shirt', price: 90 },
  { name: 'Bobo Choses Shoes', price: 90 },
  { name: 'Jellymallow Pants', price: 70 },
  { name: 'Bonpoint Earmuffs', price: 85 },
];

const categories = ['Clothing', 'Shoes', 'Accessories', 'New Arrivals'];


const Page = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
      <CategoryList categories={categories} />

      <h1 className="text-2xl font-bold p-4">Listed Products</h1>

      <div className="grid grid-cols-2 gap-4 p-4">
        {filteredProducts.map((product, index) => (
          <div key={index} className="border p-4">
            <div className="w-full h-32 bg-gray-300 mb-4"></div> {/* Gray rectangle instead of image */}
            <h2 className="font-semibold">{product.name}</h2>
            <p>{product.price} €</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Page;
