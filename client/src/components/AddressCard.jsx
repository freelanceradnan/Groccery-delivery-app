import { CheckIcon, MapPinIcon, PencilIcon, Trash2Icon } from 'lucide-react';
import React from 'react';
import { useDeleteUserAddressMutation } from '../Feature/ApiSlice';
import toast from 'react-hot-toast';

const AddressCard = ({addr,onEditHandler,setAddress}) => {
    const [deleteAddr]=useDeleteUserAddressMutation()
    const deleteHandler=async(id)=>{
  try {
    await deleteAddr(id).unwrap()
    
    toast.success('delete address success')
    setAddress([])
  } catch (error) {
     toast.error('delete address failed')
  }
}
    return (
        <div key={addr._id} className='max-w-3xl bg-white rounded-2xl p-6 items-start justify-between flex'>
           {/* left  */}
        <div className="flex gap-4">
        <div className="size-10 rounded-xl bg-[#FAF7F2] flex-center shrink-0 flex items-center justify-center">
        <MapPinIcon className='size-5 text-[#2D4A35]'/>
        </div>
        <div>
            <div className='flex items-center gap-2 mb-1'>
<p className='text-sm font-semibold text-[#1B3022]'>{addr.label}</p>
{addr.isDefault && (
    <span className='flex-center gap-1 px-2.5 py-0.5 text-[10px] font-medium bg-[#1B3022] text-white rounded-full flex justify-center items-center'>
<CheckIcon className='size-2.5'/>
Default
    </span>
)}
            </div>
            <p className='text-sm text-light'>
                {addr.address},{addr.city},<br/>{addr.state},{addr.zip}
            </p>
        </div>
        </div>
           {/* right */}
    <div className="flex items-center gap-1">
        <button onClick={()=>onEditHandler(addr)} className='p-2 text-light  hover:bg-[#FAF7F2] rounded-lg transtion-colors'>
<PencilIcon className='size-4 hover:text-[#1B3022]'/>
        </button>
        <button onClick={()=>deleteHandler(addr._id)} className='p-2 text-light  hover:bg-[#FEF2F2] rounded-lg transtion-colors'>
<Trash2Icon className='size-4 hover:text-[#EF4444]'/>
        </button>
    </div>
        </div>
    );
};

export default AddressCard;