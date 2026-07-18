import { XIcon } from 'lucide-react';
import React from 'react';

const AddressFrom = ({resetForm,handleSubmit,form,setForm,editingId}) => {
    return (
        <>
            {/* overley */}
        <div className="fixed inset-0 bg-black/50 z-50" />
        {/* form container */}
<div onClick={resetForm} className="fixed inset-0 z-50 flex items-center justify-center p-4">
    <form onClick={e=>e.stopPropagation()} onSubmit={handleSubmit} className="bg-white rounded-2xl p-6 w-full max-w-lg animate-fade-in">
    {/* form-header */}
    <div className='flex justify-between'>
    <h2 className="text-lg font-semibold text-[#1B3022]">
        {editingId?"Edit Address":"Add New Address"}
    </h2>
    <button type='button' onClick={resetForm} className='p-2 hover:bg-[#FAF7F2] rounded-lg'>
        <XIcon className='size-5'/>
    </button>
    </div>
    {/* inputs */}
    <div className="space-y-4">
    <div>
        <label className='block text-sm font-medium text-[#1B3022] mb-1.5'>Label</label>
        <input type="text" placeholder='Home, Work, etc.' required className='w-full px-4 py-2.5 text-sm rounded-xl border border-black/20 focus:border-green-500/50 outline-none' value={form.label} onChange={(e)=>setform({...form,label:e.target.value})}/>
    </div>
     <div>
        <label className='block text-sm font-medium text-[#1B3022] mb-1.5'>Street Address</label>
        <input type="text" placeholder='' required className='w-full px-4 py-2.5 text-sm rounded-xl border border-black/20 focus:border-green-500/50 outline-none' value={form.address} onChange={(e)=>setform({...form,address:e.target.value})}/>
    </div>
    <div className='grid grid-cols-2 gap-2'>
       <div>
         <label className='block text-sm font-medium text-[#1B3022] mb-1.5'>City</label>
        <input type="text" placeholder='' required className='w-full px-4 py-2.5 text-sm rounded-xl border border-black/20 focus:border-green-500/50 outline-none' value={form.city} onChange={(e)=>setform({...form,city:e.target.value})}/>
       </div>
        <div>
             <label className='block text-sm font-medium text-[#1B3022] mb-1.5'>State</label>
        <input type="text" placeholder='' required className='w-full px-4 py-2.5 text-sm rounded-xl border border-black/20 focus:border-green-500/50 outline-none' value={form.state} onChange={(e)=>setform({...form,state:e.target.value})}/>
        </div>
    </div>
    <div className='grid grid-cols-2 gap-2'>
       <div>
         <label className='block text-sm font-medium text-[#1B3022] mb-1.5'>Street Address</label>
        <input type="text" placeholder='' required className='w-full px-4 py-2.5 text-sm rounded-xl border border-black/20 focus:border-green-500/50 outline-none' value={form.label} onChange={(e)=>setform({...form,address:e.target.value})}/>
       </div>
       <div className='items-end pb-1 flex'>
        <label htmlFor="" className='flex items-center gap-2 cursor-pointer'>
        <input type="checkbox" name="" id="" checked={form.isDefault} onChange={(e)=>({...form,isDefault:e.target.value})}/>
        <span className='text-sm text-blue-500'>Set as default</span>
        </label>
       </div>
    </div>
    </div>
    {/* button-submit */}
    <button type='submit' className='mt-6 w-full py-3 bg-[#1B3022] text-white font-semibold rounded-xl hover:bg-[#0a180f] transition-colors'>
{editingId?"Update Address":"Save Address"}
    </button>
    </form>
</div>
        </>
    );
};

export default AddressFrom;