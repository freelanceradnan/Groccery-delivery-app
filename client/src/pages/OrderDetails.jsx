import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { dummyDashboardOrdersData } from '../assets/assets';
import Loading from '../components/Loading';
import { ArrowLeftIcon, MapPinIcon, PhoneIcon } from 'lucide-react';
import OrderOTP from '../components/OrderOTP';
import LiveMap from '../components/LiveMap';
import OrderTimeLine from '../components/OrderTimeLine';

const OrderDetails = () => {
    const currency=import.meta.env.VITE_CURRENCY_SYMBOL||"$"
    const {id}=useParams()
    const navigate=useNavigate()
    const [order,setOrder]=useState(null)
    const [loading,setLoading]=useState(true)
    const [livelocation,setLiveLocation]=useState({
        lat:"",
        lng:""
    })
    useEffect(()=>{
        setOrder(dummyDashboardOrdersData.find((o)=>o._id===id))
        setLoading(false)
    },[id,navigate])
    if(loading) return <Loading/>
    // if(!order) return null
    return (
        <div className='min-h-screen mb-20 bg-[#FAF7F2]'>
         <div className='max-w-6xl mx-auto px-4 sm:px-6  lg:px-8 py-8'>
        {/* header */}
        <button onClick={()=>navigate('/orders')}className='flex items-center gap-2 text-sm text-app-text-light hover:text-green-500 mb-6 transition-colors'>
            <ArrowLeftIcon className='size-4'/>Back to Orders
        </button>
        {/* orderid/date/status */}
        <div className="flex items-center justify-between mb-8">
        <div>
             <h1 className='text-2xl font-semibold text-green-500'>Order #{order._id.slice(-8).toUpperCase()}</h1>
            <p className='text-sm text-light mt-1'>Placed At {new Date(order.createdAt).toLocaleDateString("en-US", {
  month: "short",
  day: "numeric",
  year: "numeric"
})}</p>
        </div>
<span className={`px-4 py-1.5 text-sm font-semibold rounded-full ${order.status==='Delivered'?"bg-green-100 text-green-700":order.status==='Cancelled'?"bg-red-300 text-red-700":"bg-[#FAE9DB] text-[#f97316]"}`}>
{order?.status}
</span>
        </div>
<div className="grid lg:grid-cols-3 gap-6">
    {/* left-side-timeline-map */}
<div className='lg:col-span-2 space-y-6'>
{/* otp-card */}
<OrderOTP order={order}/>
{/* live-maps */}
<LiveMap order={order} liveLocation={livelocation}/>
<OrderTimeLine order={order}/>
{/* delivery-person */}
{order?.deliveryPartner && order.status!=='Delivered' && order.status!=='Cancelled'&&(
    <div className='bg-white rounded-2xl p-5 flex items-center justify-between'>
<div className="flex items-center gap-3">
<div className='size-11 rounded-full bg-[#1b3022] flex-center flex items-center justify-center'>
    <span className="text-white font-semibold text-sm ">
        {order.deliveryPartner.name.charAt(0)}
    </span>
</div>
<div className=''>
    <p className='text-sm font-semibold text-[#1b3022]'>{order.deliveryPartner.name}</p>
<p className='text-xs text-light capitalize'>{order.deliveryPartner.vehicleType} .Delivery Partener</p>
</div>
</div>
<a href={`tel:${order.deliveryPartner.phone}`} className='p-2.25 bg-[#1B3022] rounded-xl hover:bg-yellow-600 transition-colors'>
    <PhoneIcon className='size-4 text-white'/>
</a>
    </div>
)}
</div>
    {/* rightside-details */}
<div className='space-y-5'>
{/* delivery-address */}
<div className="bg-white rounded-2xl p-5">
    <h3 className='text-sm font-semibold text-green-400 mb-3 flex items-center gap-2'>
        <MapPinIcon className='size-4'/>
        Delivery Address
    </h3>
    <p className='text-sm text-light leading-relaxed'>
        {order?.shippingAddress.label}
        <br />
        {order?.shippingAddress.address}
        <br />
        {order?.shippingAddress.city},
        {order?.shippingAddress.state},
        {order?.shippingAddress.zip}
    </p>
</div>
{/* items */}
<div className='bg-white rounded-2xl p-5'>
    <h3 className='text-sm font-semibold text-[#1B3022] mb-3'>Items ({order?.items.length})</h3>
    <div className="space-y-3">
        {order?.items.map((item,i)=>(
       <div key={i} className='flex items-center gap-3'>
         <img src={item.image} alt={item.name} className='size-10 rounded-lg object-cover'/>
        <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-[#1B3022] truncate">
     {item.name}
            </p>
            <p className='text-xs text-light'>
                x{item.quantity}
            </p>
        </div>
        <span className='font-semibold'>
            {currency}{(item.price*item.quantity).toFixed(2)}
        </span>
       </div>
        
        ))}
    </div>
    <div className="mt-4 pt-3 border-t border-black/20 space-y-2 text-sm" >
    <div className="flex justify-between">
        <span className="text-light text-sm">Subtotal</span>
        <span className="text-sm">{currency}{order?.subtotal.toFixed(2)}</span>
    </div>
    
    <div className="flex justify-between">
        <span className="text-light text-sm">Delivery</span>
        <span className="text-sm">{order?.deliveryFee===0?"Free":`${currency}${order.deliveryFee.toFixed(2)}`}</span>
    </div>
    <div className="flex justify-between">
        <span className="text-light text-sm">Tax</span>
        <span className="text-sm">{currency}{order?.tax.toFixed()}</span>
    </div>
    </div>
   <div className="flex justify-between pt-2 border-t border-black/20 font-semibold text-[#1B3022]">
        <span className="text-light text-[#09110c] font-semibold">Total</span>
        <span className="text-sm">{currency}{order?.total.toFixed(2)}</span>
    </div>
    
</div>
</div>
<div>

</div>
</div>

         </div>
        </div>
    );
};

export default OrderDetails;