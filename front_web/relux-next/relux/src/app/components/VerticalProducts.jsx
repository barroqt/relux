import React from "react";
import { useRouter } from "next/navigation";
import ProductCard from "./ProductCard"; // Adjust the import path as needed

const VerticalProducts = ({ title, filteredProducts, showTitle }) => {
  const router = useRouter();

  return (
    <div>
      {showTitle && <h1 className="text-2xl font-bold mb-4 mt-12">{title}</h1>}
      <div className="grid grid-cols-2 gap-4">
        {filteredProducts.map((product, index) => (
          <ProductCard
            onClick={() => router.push("/productdetails")}
            product={product}
            key={`listed-product-${index}`}
          />
        ))}
      </div>
    </div>
  );
};

export default VerticalProducts;
