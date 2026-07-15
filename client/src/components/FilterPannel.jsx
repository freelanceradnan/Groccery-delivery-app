import React from 'react';

const FilterPannel = ({categories,category,minPrice,maxPrice,updateFilter,clearFilter,hasFilters}) => {
    const categoriesWithAll=[{slug:"",name:"All categories"},...categories]
    return (
        <div className='space-y-6'>
            {/* categories */}
        <div>
            <h3 className='text-sm font-semibold text-green-500 mb-3'>Categories</h3>
            <div className='space-y-1'>
               {categoriesWithAll.map((cat)=>(
                <button key={cat.slug} onClick={()=>updateFilter("category",cat.slug)}
                className={`block w-full text-left px-2 py-1 text-sm rounded-md transition-all ${category===cat.slug?"bg-[#1B3022] text-white":"hover:bg-[#FAF7F2]"}`}>{cat.name}</button>
               ))}
            </div>
        </div>
        {/* filter-price-range */}
        <div>
            <h3 className="text-sm font-semibold text-green-500 mb-3">Price Range</h3>
            <div className="flex items-center gap-2">
                <input type="number" placeholder='Min' value={minPrice} onChange={(e)=>updateFilter('minPrice',e.target.value)} className='w-full px-3 py-2 text-sm bg-white rounded-lg border not-focus:border-black/20'/>
                <span className='text-light'>-</span>
                <input type="number" placeholder='Max' value={maxPrice} onChange={(e)=>updateFilter('maxPrice',e.target.value)} className='w-full px-3 py-2 text-sm bg-white rounde-lg border not-focus:border-black/20'/>
            </div>
        </div>
        {hasFilters && (
            <button onClick={clearFilter} className='w-full py-2 text-sm text-red-400 hover:bg-[#fef2f2] rounded-lg transition-colors font-medium'>
Clear All Filters
            </button>
        )}
        </div>
    );
};

export default FilterPannel;