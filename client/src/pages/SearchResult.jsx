import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { dummyProducts } from '../assets/assets';
import { HomeIcon, Search } from 'lucide-react';
import Loading from '../components/Loading';
import ProductCart from '../components/ProductCart';

const SearchResult = () => {
    const [products,setProducts]=useState([])
    const [loading,setLoading]=useState(true)
    const [searchParams]=useSearchParams()
    const query=searchParams.get('q')||""
    useEffect(()=>{
        if(!query) return ;
        setLoading(true)
        setProducts(dummyProducts.filter((p)=>p.name.toLowerCase().includes(query.toLowerCase())))
        setLoading(false)
    },[query])
    return (
        <div className='min-h-screen bg-amber-50'>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
             <nav className="flex items-center gap-1 text-sm text-light mb-6">
          <Link to="/" className="hover:text-green-400 transition-colors">
            <HomeIcon className="size-4" />
          </Link>
          <span>/</span>
          <Link to="/products" className="hover:text-green-500 transition-colors font-semibold">
           Search Results
          </Link>
        
     
          <span className="text-green-400 font-medium truncate max-w-[200px]">
            {/* {product.name} */}
          </span>
        </nav>
        {/* header */}
        <div className="mb-8">
            <h1 className="text-2xl font-semibold text-green-500 mb01">
                Results for "{query}"
            </h1>
            <p className="text-sm text-light">
                {loading ?"Searching...":`${products.length} items found!`}
            </p>
        </div>
        {/* results */}
        {loading ?(
            <Loading/>
        ):products.length===0?(
            <div className='text-center py-20'>
<Search className='size-16 text-green-500 mx-auto mb-4'/>
<h2 className='text-xl font-semibold text-green-300 mb-2'>No Results Found!</h2>
<p className='text-sm text-light mb-6 max-w-md mx-auto'>
    We coundn't find any products matching "{query}" .Try a differnt search term.
</p>
<Link to="/" className='inline-flex px-5 py-2.5 bg-green-500 text-white text-sm font-medium rounded-lg'>Browse All Products</Link>
            </div>
        ):(
            <div className='grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4'>
{products.map((product)=>(
    <ProductCart key={product._id} product={product}/>
))}
            </div>
        )}
        </div>
        </div>
    );
};

export default SearchResult;