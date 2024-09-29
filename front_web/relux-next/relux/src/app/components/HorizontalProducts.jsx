import React from 'react';
import ProductCard from './ProductCard';

const HorizontalProducts = ({ title, products, onProductClick, visible }) => {
  if (!visible) return null;

  return (
    <div className="horizontal-products">
      <h1 className="text-2xl font-bold mb-4">{title}</h1>
      <div className="flex overflow-x-auto space-x-4">
        {products.map((product, index) => (
          <div key={index} className="flex-shrink-0">
            <ProductCard
              product={product}
              onClick={() => onProductClick(product)}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default HorizontalProducts;