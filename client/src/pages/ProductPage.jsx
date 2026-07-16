import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { CartContext } from "../contexts/CartContext";
import { dummyProducts } from "../assets/assets";
import Loading from "../components/Loading";
import {
  ArrowLeftIcon,
  ArrowRight,
  ArrowRightIcon,
  HomeIcon,
  LeafIcon,
  MinusIcon,
  PlusIcon,
  StarIcon,
} from "lucide-react";
import DummyReviewsSection from "../components/DummyReviewsSection";
import ProductCart from "../components/ProductCart";

const ProductPage = () => {
  const currency = import.meta.env.VITE_CURRENCY_SYMBOL || "$";
  const navigate = useNavigate();
  const { id } = useParams();
  const { items, addToCart, removeFromCart, updateQuantity } = useContext(CartContext);

  const [product, setProduct] = useState(null);
  const [relatedProduct, setRelatedProduct] = useState([]);
  const [localQuantity, setLocalQuantity] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
  setLocalQuantity(1);
  window.scrollTo(0, 0);
  const foundProduct = dummyProducts.find((p) => p._id === id);

  if (foundProduct) {
    setProduct(foundProduct);
    setRelatedProduct(dummyProducts.filter((p) => p._id !== id));
  } else {
    setProduct(null);
  }

  setLoading(false);
}, [id]);

  if (loading) return <Loading />;
  if (!product) return null;

  const cartItem = items.find((item) => item.product._id === product._id);
  const inCart = !!cartItem;
  const displayQuantity = inCart ? cartItem.quantity : localQuantity;
  const categoryLabel = product?.category?.replace(/-/g, " ") || "";

  const handleMinus = () => {
    if (inCart) {
      if (cartItem.quantity > 1) {
        updateQuantity(product._id, cartItem.quantity - 1);
      } else {
        removeFromCart(product._id);
      }
    } else {
      setLocalQuantity(Math.max(1, localQuantity - 1));
    }
  };

  const handlePlus = () => {
    if (inCart) {
      updateQuantity(product._id, cartItem.quantity + 1);
    } else {
      setLocalQuantity(localQuantity + 1);
    }
  };

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Breadcrumb navigation */}
        <nav className="flex items-center gap-1 text-sm text-light mb-6">
          <Link to="/" className="hover:text-green-400 transition-colors">
            <HomeIcon className="size-4" />
          </Link>
          <span>/</span>
          <Link to="/products" className="hover:text-green-500 transition-colors">
            Products
          </Link>
          <span>/</span>
          <Link
            to={`/products?category=${product.category}`}
            className="hover:text-green-300 transition-colors capitalize"
          >
            {categoryLabel}
          </Link>
          <span>/</span>
          <span className="text-green-400 font-medium truncate max-w-[200px]">
            {product.name}
          </span>
        </nav>

        {/* Back button */}
        <button
          onClick={() => navigate(-1)}
          className="mb-6 flex items-center gap-1.5 text-sm text-green-900 hover:text-green-400 transition-colors"
        >
          <ArrowLeftIcon className="size-4" /> Back
        </button>

        {/* Product details section */}
        <div className="bg-white/50 rounded-2xl overflow-hidden">
          <div className="grid md:grid-cols-2 gap-0">
            {/* Left image column */}
            <div className="relative flex items-center justify-center p-8 md:p-12 min-h-[320px] md:min-h-[480px]">
              <img
                src={product.image}
                alt={product.name}
                className="max-h-[360px] w-auto object-contain"
              />

              <div className="absolute top-5 left-5 flex flex-wrap gap-1.5 z-10">
                {product.isOrganic && (
                  <span className="flex items-center gap-1 px-2.5 py-1 text-xs font-semibold bg-green-600 text-white rounded-full">
                    <LeafIcon className="w-3 h-3" />
                    Organic
                  </span>
                )}
                {product.discount > 0 && (
                  <span className="px-2.5 py-1 text-xs font-semibold bg-orange-500 text-white rounded-full flex items-center">
                    {product?.discount}% OFF
                  </span>
                )}
              </div>
            </div>

            {/* Right details column */}
            <div className="p-6 md:p-10 flex flex-col justify-center">
              <span className="text-xs font-medium text-light tracking-wide mb-1 capitalize">
                {categoryLabel}
              </span>
              <h1 className="text-2xl md:text-3xl font-semibold text-[#1b3022] mb-3">
                {product.name}
              </h1>

              {/* Rating */}
              {product.rating > 0 && (
                <div className="flex items-center gap-2 mb-5">
                  <div className="flex items-center gap-0.5">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <StarIcon
                        key={star}
                        className={`w-4 h-4 ${
                          star <= Math.round(product.rating)
                            ? "text-[#f59e0b] fill-[#f59e0b]"
                            : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-sm font-medium">{product.rating}</span>
                  <span className="text-sm text-light">
                    ({product.reviewCount} reviews)
                  </span>
                </div>
              )}

              {/* Price */}
              <div className="flex items-baseline gap-3 mb-3">
                <span className="text-3xl md:text-4xl font-semibold text-[#1b3022]">
                  {currency}
                  {product?.price?.toFixed(2)}
                </span>
                {product?.originalPrice > product?.price && (
                  <span className="text-lg text-light line-through">
                    {currency}
                    {product?.originalPrice?.toFixed(2)}
                  </span>
                )}
              </div>

              {/* Description */}
              <p className="text-sm text-light leading-relaxed mb-6">
                {product?.description}
              </p>

              {/* Stock */}
              <div className="mb-6">
                {product.stock > 0 ? (
                  <span className="text-sm text-green-500 font-medium">
                    ✓ In Stock ({product.stock} available)
                  </span>
                ) : (
                  <span className="text-sm text-red-500 font-medium">
                    Out of Stock
                  </span>
                )}
              </div>

              {/* Quantity controls & Add to Cart */}
              <div className="flex items-center gap-3">
                <div className="flex items-center border border-[#e5e7eb] rounded-xl overflow-hidden">
                  <button
                    className="p-3 hover:bg-[#f2efef] transition-colors"
                    onClick={handleMinus}
                  >
                    <MinusIcon className="w-4 h-4" />
                  </button>
                  <span className="px-5 text-sm font-semibold min-w-[40px] text-center">
                    {displayQuantity}
                  </span>
                  <button
                    className="p-3 hover:bg-[#f2efef] transition-colors"
                    onClick={handlePlus}
                  >
                    <PlusIcon className="w-4 h-4" />
                  </button>
                </div>

                <button
                  disabled={product.stock === 0}
                  onClick={() => {
                    if (!inCart) addToCart(product, localQuantity);
                  }}
                  className={`flex-1 py-3 font-semibold rounded-xl transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98] ${
                    inCart
                      ? "bg-[#fdfaf9] text-[#6c7381] border-[#6c7381] border"
                      : "bg-amber-400 text-white hover:bg-amber-500 border-[#94908f]"
                  }`}
                >
                  {inCart ? "Added To Cart" : "Add To cart"}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Customer Reviews Section */}
        {product?.reviewCount > 0 && <DummyReviewsSection product={product} />}
        {/* relatedproduct */}
        {relatedProduct.length>0 && (
          <section className="mt-12 mb-44">
         <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-semibold text-green-500">Related Products</h2>
          <p className="text-sm text-light mt-1">More from {categoryLabel}</p>
        </div>
        <Link className="text-sm font-semibold text-orange-500 hover:text-orange-300 flex items-center gap-1 transition-colors" to={`/products?category=${product.category}`}>View All <ArrowRightIcon className="size-4"/></Link>
         </div>
         <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 xl:gap-8">
         {relatedProduct.slice(0, 5).map((rp) => (
  <ProductCart key={rp._id} product={rp} /> 
))}
         </div>
          </section>
        )}
      </div>
    </div>
  );
};

export default ProductPage;