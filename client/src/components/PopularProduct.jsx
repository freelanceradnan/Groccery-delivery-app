import { ArrowRightIcon } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import ProductCart from './ProductCart';
import { useGetAllProductQuery } from '../Feature/ApiSlice';
import Loading from './Loading';



const PopularProduct = () => {
    const [product,setProduct]=useState([])
    const {data:allProducts,isLoading}=useGetAllProductQuery()
 
    useEffect(()=>{
    if(allProducts){
        setProduct(allProducts.products)
    }
    },[allProducts])
    if(isLoading) return <Loading/>
    return (
        <section className='pb-16'>
            <div className="max-w-7xl mx-auto">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h2 className='text-2xl font-semibold'>Popular Products</h2>
                        <p className='text-sm text-light mt-1'>Top-rated products this season</p>
                    </div>
                    <Link className='text-sm font-semibold text-orange-500 hover:text-orange-400 flex items-center gap-1 transition-colors'>
                    View All <ArrowRightIcon className='size-4'/>
                    </Link>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 xl:gap-8">
                {product?.slice(0,10).map((product)=>(
                    <ProductCart key={product._id} product={product}/>
                ))}
                </div>
            </div>

        </section>
    );
};

export default PopularProduct;