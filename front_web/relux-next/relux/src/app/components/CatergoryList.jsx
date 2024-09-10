import React from 'react';

const CategoryList = ({ categories }) => {
  return (
    <div className="flex overflow-x-scroll p-4 space-x-4">
      {categories.map((category, index) => (
        <button 
          key={index}
          className="flex-shrink-0 bg-gray-200 rounded-full px-6 py-2 text-sm font-semibold">
          {category}
        </button>
      ))}
    </div>
  );
};

export default CategoryList;