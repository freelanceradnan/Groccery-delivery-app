import { Plus, Star } from 'lucide-react';
import React from 'react';
import { useNavigate } from 'react-router-dom';

const ProductCart = ({product}) => {
    const { addtocart } = { addtocart: (product) => { console.log(product); } };
    const currency=import.meta.env.VITE_CURRENCY_SYMBOL||"$"
    const navigate=useNavigate()
    return (
        <div 
  className="bg-white rounded-2xl overflow-hidden shadow hover:shadow-md transition-all duration-300 group animate-fade-in cursor-pointer flex flex-col justify-between" 
  onClick={() => navigate(`/products/${product._id}`)}
>
  <div>
    {/* Product Image Wrapper */}
    <div className="relative aspect-square overflow-hidden bg-zinc-50 flex items-center justify-center">
      <img 
        src={product.image} 
        alt={product.name} 
        className="w-full h-full object-cover p-4 group-hover:p-2 transition-all duration-300"
      />
      
      {/* Badges */}
      <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
        {product.discount > 0 && (
          <span className="px-2 py-0.5 text-[10px] font-bold uppercase bg-orange-500 text-white rounded-full shadow-sm">
            {product.discount}% OFF
          </span>
        )}
      </div>
    </div>

    {/* Product Info */}
    <div className="p-3 text-zinc-700">
      <h3 className="text-sm font-medium leading-snug mb-1.5 line-clamp-2 group-hover:text-orange-500 transition-colors">
        {product.name}
      </h3>

      {/* Ratings */}
      {product.rating > 0 && (
        <div className="flex items-center gap-1 mb-2">
          <Star className="size-3.5 text-amber-400 fill-amber-400" />
          <span className="text-xs font-semibold text-zinc-800">{product.rating}</span>
          <span className="text-xs text-zinc-400">({product.reviewCount})</span>
        </div>
      )}
    </div>
  </div>

  {/* Price & Action Footer */}
{/* Price & Action Footer */}
<div className="p-3.5 pt-0 mt-auto">
  <div className="flex items-end justify-between gap-1">

    <div className="flex flex-col md:flex-row md:items-baseline gap-0.5 md:gap-1 min-w-0 overflow-hidden">
      
      {/* Current Price */}
      <div className="flex items-baseline gap-0.5">
        <span className="text-sm sm:text-base font-semibold text-zinc-900 whitespace-nowrap">
          {currency}{product.price.toFixed(2)}
        </span>
        <span className="text-[10px] sm:text-xs text-zinc-400 whitespace-nowrap">
          /{product.unit}
        </span>
      </div>
      
      {/* Original/Discounted Price */}
      {product.originalPrice > product.price && (
        <span className="text-[10px] sm:text-xs text-zinc-400 line-through md:ml-1 whitespace-nowrap">
          {currency}{product.originalPrice.toFixed(2)}
        </span>
      )}
    </div>

    {/* Add To Cart Button */}
    <button 
      onClick={(e) => {
        e.stopPropagation();
        addtocart(product);
      }} 
      className="size-7 sm:size-8 rounded-full bg-orange-500 text-white flex items-center justify-center shrink-0 hover:bg-orange-600 transition-all active:scale-90 shadow-sm"
      title="Add to cart"
    >
      <Plus className="size-3.5 sm:size-4 stroke-[3]" />
    </button>
    
  </div>
</div>
</div>
    );
};

export default ProductCart;