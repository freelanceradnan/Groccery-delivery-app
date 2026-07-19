import React, { useEffect, useState } from 'react';
import { Zap } from 'lucide-react';
import Loading from '../components/Loading';
import ProductCart from '../components/ProductCart';
import { useGetFlashDealsQuery } from '../Feature/ApiSlice';

const FlashDeals = () => {
    const [products,setProducts]=useState([])
    
    const {data,isLoading:loading}=useGetFlashDealsQuery()
    
    useEffect(()=>{
        setProducts(data?.filter((p)=>p.stock>0))
    },[data])
    return (
        <div className='min-h-screen bg-[#faf7f2]'>
            {/* banner */}
        <div className="bg-linear-to-r from-[#f87115] to-[#F76F15] text-white py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-6 text-center">
            <div className='flex gap-4 justify-center items-center'>
            <Zap className="size-6 fill-white"/>
            <h1 className="text-3xl font-semibold">Flash Deals</h1>
            <Zap className="size-6 fill-white"/>
            </div>
            <p className='text-white/80 max-w-md mx-auto'>Limited-time offers on your favorite organic products. Grab them before they're gone!</p>
        </div>
        </div>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
    {loading?(<Loading/>):(
        products?.length===0?(
<div className='text-center py-16'>
<Zap className='size-16 text-black mx-auto mb-4'/>
<h2 className='text-lg font-semibold text-green-500 mb-2'>No deals right now</h2>
<p className='text-sm text-light'>Check Back Soon for amazing offers!</p>
</div>
        ):(
<div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-4'>
{products?.map((product)=>product.stock>0 && (
    <ProductCart key={product._id} product={product}/>
))}
</div>
        )
    )}
        </div>
        </div>
    );
};

export default FlashDeals;