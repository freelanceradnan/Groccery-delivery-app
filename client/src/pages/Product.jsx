import React, { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { categoriesData, dummyProducts } from "../assets/assets";
import { ChevronDown, Home, SlidersHorizontal, XIcon } from "lucide-react";
import ProductCart from "../components/ProductCart";
import Loading from "../components/Loading";
import FilterPannel from "../components/FilterPannel";

const Product = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [product, setProduct] = useState([]);
  const [totalpages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [mobileFiterOpen, setMobileFiterOpen] = useState(false);
  const category = searchParams.get("category") || "";
  const organic = searchParams.get("organic") || "";
  const sort = searchParams.get("sort") || "";
  const page = Number(searchParams.get("page")) || 1;
  const minPrice = searchParams.get("minPrice") || "";
  const maxPrice = searchParams.get("maxPrice") || "";

  const fetchProduct = async () => {
    setLoading(true);
    setProduct(
      dummyProducts.filter((p) => p.category === category || category === ""),
    );
    setLoading(false);
  };
  const updateFilter = (key, value) => {
    const newParams = new URLSearchParams(searchParams);
    if (value) {
      newParams.set(key, value);
    } else {
      newParams.delete(key);
    }
   
    if (key !== "page") {
      newParams.delete("page");
    }

    setSearchParams(newParams);
  };
  const clearFilters = () => setSearchParams({});
  const activeCategory = categoriesData.find((c) => c.slug === category);
  const hasfilter = category || organic || minPrice || maxPrice;

  useEffect(() => {
    fetchProduct();
  }, [category, organic, sort, page, minPrice, maxPrice]);

  return (
    <div className="min-h-screen bg-[#FAF7F2]">
      <div className="max-w-7xl mx-auto px-4 sm:px-4 lg:px-8 py-6">
        {/* breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-tight mb-6">
         <div className="flex gap-2 items-center font-semibold">
             <Link to="/" >
             <Home className="size-4" />
             </Link>
            
            <span>/</span>
            <span className="text-tight text-sm">
              {activeCategory ? activeCategory.name : "All Products"}
            </span>
          
         </div>
        </nav>
        <div className="flex gap-8 xl:gap-10 shrink-0">
         {/* sidebar -desktop*/}
         <aside className="hidden lg:block w-64 shrink-0">
         <div className="bg-white rounded-2xl p-4 sticky top-24">
            <FilterPannel categories={categoriesData} category={category} organic={organic} minPrice={minPrice} maxPrice={maxPrice} clearFilter={clearFilters} hasFilters={hasfilter} updateFilter={updateFilter}/>
         </div>
         </aside>
         {/* main-content-desktop*/}
         <main className="flex-1">
{/* header */}
<div className="flex items-center justify-between mb-6">
    <div>
        <h1 className="text-2xl font-semibold text-tight">{activeCategory?activeCategory.name:"All Products"}</h1>
        <p className="text-sm text-light mt-0.5">{product.length} products found</p>
    </div>
    <div className="flex flex-col lg:items-center gap-3">
        {/* mobilefiltertoggle */}
    <button className="lg:hidden flex items-center gap-2 px-3 py-2 text-sm bg-[#FFFFFF] rounded-xl border border-[#E5E7EB] hover:bg-amber-50 transition-colors" onClick={()=>setMobileFiterOpen(true)}>
        <SlidersHorizontal className="size-4"/>Filters
    </button>
    {/* sort-menu */}
   <div className="relative">
  <select 
    name="sort" 
    id="sort" 
    className="pl-3 pr-10 py-1 text-sm rounded-xl border border-black/20 outline-none cursor-pointer bg-white" 
    value={sort} 
    onChange={(e) => updateFilter("sort", e.target.value)}
  >
    <option value="">Newest</option>
    <option value="price_asc">Price: Low → High</option>
    <option value="price_dsc">Price: High → Low</option>
    <option value="rating">Top Rated</option>
    <option value="name">A → Z</option>
  </select>
</div>
    </div>
</div>
{/* product-grid */}

{loading ?(
<Loading/>
):product.length===0?(
  <div className="text-center py-16">
<p className="text-lg font-semibold text-[#2D4A35] mb-2">No Products Found</p>
<p className="text-sm text-light mb-4">
  Try Adjusting your filters or search terms
</p>
<button onClick={clearFilters} className="px-5 py-2 text-sm font-medium bg-[#2D4A35] text-white rounded-xl hover:bg-[#122016] transition-colors">Clear Filters</button>
  </div>
)

:(
  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 xl:gap-8">
{product.map((product)=>product.stock>0 &&(
  <ProductCart key={product._id} product={product}/>
))}
  </div>
)}
{/* pagination */}
{totalpages>1 && (
  <div className="w-full flex justify-center py-4">
    {Array.from({length:totalpages}).map((_,i)=>(
      <button key={i} onClick={()=>{updateFilter("page",String(i+1));scrollTo(0,0)}} className={`size-9 rounded-lg text-sm font-medium transition-colors ${page===i+1?"bg-green-500 text-white ":"bg-white text-light hover:bg-yellow-500"}`}>{i+1}</button>
    ))}
  </div>
)}
         </main>
        </div>
      </div>
      {/* mobile-filteres */}
      {mobileFiterOpen &&(
        <>
        <div 
  className="fixed inset-0 z-50 bg-black/20 " 
  onClick={() => setMobileFiterOpen(false)}
/>
        <div className="fixed bottom-0 left-0 right-0 bg-white z-50 rounded-t-2xl max-h-[80vh] overflow-y-auto animate-slide-in-up">
        <div className="flex items-center justify-between p-4 border-b border-black/10">
          <h3 className="text-lg font-semibold text-green-500">Filters</h3>
          <button onClick={()=>setMobileFiterOpen(false)} className="p-2 hover:bg-amber-200 rounded-lg">
            <XIcon className="size-5"/>
          </button>
        </div>
        <div className="p-4">
 <FilterPannel categories={categoriesData} category={category} organic={organic} minPrice={minPrice} maxPrice={maxPrice} clearFilter={clearFilters} hasFilters={hasfilter} updateFilter={updateFilter}/>
        </div>
        </div>
        </>
      )}
    </div>
  );
};

export default Product;
