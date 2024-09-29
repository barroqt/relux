const ProductCard = ({ product, key, onClick }) => {
  return (
    <div key={key} className="min-w-[162px]" onClick={onClick}>
      <div className="w-full h-48 bg-gray-300 mb-2"></div>
      {/* Gray rectangle instead of image */}
      <h2 className="tracking-wide font-bold uppercase text-sm">{product.name}</h2>
      <h2 className="tracking-wide text-xs">{product.model}</h2>
      <p className="font-semibold text-sm mt-1">{product.price } USDC</p>
    </div>
  );
};

export default ProductCard;
