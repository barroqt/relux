"use client";
import React from "react";
import { useState } from "react";

const CategoryList = ({ categories }) => {
  const [selected, setSelected] = useState(0);

  return (
    <div className="flex overflow-x-scroll p-4 space-x-4">
      {categories.map((category, index) => (
        <button
          onClick={() => setSelected(index)}
          key={index}
          className={`flex-shrink-0 ${
            selected === index
              ? "bg-black text-[#FFFFFF]"
              : "bg-gray-200 text-black "
          }  rounded-full px-6 py-2 text-sm font-semibold`}
        >
          {category}
        </button>
      ))}
    </div>
  );
};

export default CategoryList;
