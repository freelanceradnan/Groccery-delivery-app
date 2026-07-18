import React, { useEffect, useState } from 'react';
import { dummyAddressData } from '../assets/assets';
import { MapPinIcon, PlusIcon } from 'lucide-react';
import Loading from '../components/Loading';
import AddressCard from '../components/AddressCard';
import AddressFrom from '../components/AddressFrom';

const Addresses = () => {
    const [addresses,setAddresses]=useState([])
    const [loading,setLoading]=useState(true)
    const [showForm,setShowForm]=useState(false)
    const [editingId,setEditingId]=useState(null)
    const [form,setForm]=useState({
        label:"",
        address:"",
        city:"",
        state:"",
        zip:"",
        isDefault:false
    })
const resetForm=()=>{
    setForm({label:"",address:"",city:"",state:"",zip:""})
    setForm({isDefault:false})
    setShowForm(false)
   setEditingId(null)
}
const onEditHandler=(address)=>{
    setForm({
        label:address.label,
        address:address.address,
        city:address.city,
        state:address.state,
        zip:address.zip,
        isDefault:address.isDefault
    })
    setEditingId(address._id)
    setShowForm(true)
}
useEffect(()=>{
setAddresses(dummyAddressData)
setTimeout(() => {
    setLoading(false)
}, 1000);
},[])
const handleSubmit=()=>{

}
    return (
        <div className='min-h-screen bg-[#FAF7F2]'>
     <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* pages-header */}
    <div className="flex items-center justify-between mb-8">
        <h1 className='text-2xl font-semibold text-[#2d4a35]'>My Addresses</h1>
        <button onClick={()=>{
            resetForm();
            setShowForm(true)
        }} className='bg-[#2d4a35] px-4 py-2 text-white text-sm font-semibold rounded-xl hover:bg-[#142418] transition-colors flex items-center gap-2'>
            <PlusIcon className='size-4'/>Add Address
        </button>
    </div>
    {/* form-modal */}
{showForm && <AddressFrom resetForm={resetForm} handleSubmit={handleSubmit} form={form} editingId={editingId}/>}
    {/* addresses list */}
    {loading?(
<Loading/>    
):addresses.length===0?(
    <div className='text-center py-16'>
<MapPinIcon className='size-16 text-[#e5e7eb] mx-auto mb-4'/>
<h2 className="text-lg font-semibold text-[#2d4a35] mb-2">No Addresses saved</h2>
<p className='text-sm text-light'>Add an Address for first checkout</p>
    </div>
):(
    <div className='space-y-4'>
{addresses.map((addr)=>(
<AddressCard key={addr._id} addr={addr} onEditHandler={onEditHandler} setAddress={setAddresses}/>
))}
    </div>
)}
        </div>       
        </div>
    );
};

export default Addresses;