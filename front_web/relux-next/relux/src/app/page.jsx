"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Header from "./components/Header";
import HorizontalProducts from "./components/HorizontalProducts";
import SearchBar from "./components/SearchBar";
import VerticalProducts from "./components/VerticalProducts";
import BottomBar from "./components/BottomBar";

const products = [
  { name: "Bobo Choses Shirt", price: 90, model: "Daytona 1992" },
  { name: "Bobo Choses Shoes", price: 90, model: "Daytona 1992" },
  { name: "Jellymallow Pants", price: 70, model: "Daytona 1992" },
  { name: "Bonpoint Earmuffs", price: 85, model: "Daytona 1992" },
  { name: "Bobo Choses Shirt", price: 90, model: "Daytona 1992" },
  { name: "Bobo Choses Shoes", price: 90, model: "Daytona 1992" },
  { name: "Jellymallow Pants", price: 70, model: "Daytona 1992" },
  { name: "Bonpoint Earmuffs", price: 85, model: "Daytona 1992" },
  { name: "Bobo Choses Shirt", price: 90, model: "Daytona 1992" },
  { name: "Bobo Choses Shoes", price: 90, model: "Daytona 1992" },
  { name: "Jellymallow Pants", price: 70, model: "Daytona 1992" },
  { name: "Bonpoint Earmuffs", price: 85, model: "Daytona 1992" },
];

const Page = () => {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleProductClick = (product) => {
    router.push("/productdetails");
  };

  return (
    <div>
      <div className="fixed top-0 bg-white w-full">
        <Header />
        <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
      </div>
      <div className="mt-[140px] px-4 pb-16 pt-4">
        <HorizontalProducts
          visible={searchTerm.length === 0}
          products={products}
          title={"New Listings"}
          onProductClick={handleProductClick}
        />
        <VerticalProducts
          showTitle={searchTerm.length === 0}
          title={"Featured Products"}
          filteredProducts={filteredProducts}
        />
      </div>
      <BottomBar />
    </div>
  );
};

export default Page;
