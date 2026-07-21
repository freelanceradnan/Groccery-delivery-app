import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Loading from '../components/Loading';
import { ArrowLeftIcon, MapPinIcon, PhoneIcon } from 'lucide-react';
import OrderOTP from '../components/OrderOTP';
import LiveMap from '../components/LiveMap';
import OrderTimeLine from '../components/OrderTimeLine';
import { useGetAllProductQuery, useGetOrderDatailsByIdQuery } from '../Feature/ApiSlice';

const OrderDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  

  const { data: rawData, isLoading } = useGetOrderDatailsByIdQuery(id);
  const currency = import.meta.env.VITE_CURRENCY_SYMBOL || "$";

  const [order, setOrder] = useState(null);
  const [livelocation, setLiveLocation] = useState({ lat: "", lng: "" });
 const {data:allproduct}=useGetAllProductQuery()
 const [product,setProduct]=useState([])
  useEffect(() => {
    if (rawData) {
      const currentOrder = Array.isArray(rawData) ? rawData[0] : rawData;
      setOrder(currentOrder);

      const addressObj = currentOrder?.shippingAddress?.[0] || currentOrder?.shippingAddress;
      if (addressObj) {
        setLiveLocation({
          lat: addressObj.lat || "",
          lng: addressObj.lng || ""
        });
      }
    }
    if(allproduct){
        setProduct(allproduct)
    }
  }, [rawData]);

  if (isLoading || !order) return <Loading />;

  const shipping = Array.isArray(order.shippingAddress) ? order.shippingAddress[0] : order.shippingAddress;
  const deliveryPartner = order.deliveryPartner;

  return (
    <div className='min-h-screen mb-20 bg-[#FAF7F2]'>
      <div className='max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
        
        {/* Navigation */}
        <button 
          onClick={() => navigate('/orders')} 
          className='flex items-center gap-2 text-sm text-app-text-light hover:text-green-500 mb-6 transition-colors'
        >
          <ArrowLeftIcon className='size-4' /> Back to Orders
        </button>

        {/* Header Details */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className='text-2xl font-semibold text-green-600'>
              Order #{order._id ? order._id.slice(-8).toUpperCase() : ''}
            </h1>
            <p className='text-sm text-gray-500 mt-1'>
              Placed At {order?.createdAt ? new Date(order.createdAt).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric"
              }) : "N/A"}
            </p>
          </div>
          <span className={`px-4 py-1.5 text-sm font-semibold rounded-full ${
            order?.status === 'Delivered' ? "bg-green-100 text-green-700" :
            order?.status === 'Cancelled' ? "bg-red-100 text-red-700" : "bg-[#FAE9DB] text-[#f97316]"
          }`}>
            {order?.status}
          </span>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          
          {/* Left Side: Timeline & Map */}
          <div className='lg:col-span-2 space-y-6'>
            <OrderOTP order={order} />
            <LiveMap order={order} liveLocation={livelocation} />
            <OrderTimeLine order={order} />

            {/* Delivery Partner Details */}
            {deliveryPartner && order.status !== 'Delivered' && order.status !== 'Cancelled' && (
              <div className='bg-white rounded-2xl p-5 flex items-center justify-between shadow-sm'>
                <div className="flex items-center gap-3">
                  <div className='size-11 rounded-full bg-[#1b3022] flex items-center justify-center'>
                    <span className="text-white font-semibold text-sm">
                      {deliveryPartner.name?.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <p className='text-sm font-semibold text-[#1b3022]'>{deliveryPartner.name}</p>
                    <p className='text-xs text-gray-500 capitalize'>{deliveryPartner.vehicleType} • Delivery Partner</p>
                  </div>
                </div>
                <a href={`tel:${deliveryPartner.phone}`} className='p-2.5 bg-[#1B3022] rounded-xl hover:bg-yellow-600 transition-colors'>
                  <PhoneIcon className='size-4 text-white' />
                </a>
              </div>
            )}
          </div>

          {/* Right Side: Order Summary */}
          <div className='space-y-5'>
            
            {/* Delivery Address */}
            <div className="bg-white rounded-2xl p-5 shadow-sm">
              <h3 className='text-sm font-semibold text-green-600 mb-3 flex items-center gap-2'>
                <MapPinIcon className='size-4' /> Delivery Address
              </h3>
              {shipping ? (
                <p className='text-sm text-gray-600 leading-relaxed'>
                  {shipping.label && <strong>{shipping.label}<br /></strong>}
                  {shipping.address}<br />
                  {shipping.city}, {shipping.state}, {shipping.zip}
                </p>
              ) : (
                <p className="text-sm text-gray-400">Address not found</p>
              )}
            </div>

            {/* Items Summary */}
            <div className='bg-white rounded-2xl p-5 shadow-sm'>
              <h3 className='text-sm font-semibold text-[#1B3022] mb-3'>
                Items ({order?.items?.length || 0})
              </h3>
              
              <div className="space-y-3">
                {order?.items?.map((item, i) => 
                {
                   const filtered=product?.find(c=>c._id===item.product)
                  
                   return (
                    
                  <div key={i} className='flex items-center gap-3'>
                    <img src={filtered?.image} alt={filtered?.name} className='size-10 rounded-lg object-cover' />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-[#1B3022] truncate">{filtered?.name}</p>
                      <p className='text-xs text-gray-500'>x{item?.quantity}</p>
                    </div>
                    <span className='font-semibold text-sm'>
                      {currency}{(filtered?.price * item?.quantity).toFixed(2)}
                    </span>
                  </div>
                )
                }
                
                
               


                )}
              </div>

              {/* Price Calculation */}
              <div className="mt-4 pt-3 border-t border-gray-200 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Subtotal</span>
                  <span>{currency}{order?.subtotal?.toFixed(2) || "0.00"}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-500">Delivery</span>
                  <span>{order?.deliveryFee === 0 ? "Free" : `${currency}${order?.deliveryFee?.toFixed(2) || "0.00"}`}</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-500">Tax</span>
                  <span>{currency}{order?.tax?.toFixed(2) || "0.00"}</span>
                </div>
              </div>

              <div className="flex justify-between pt-3 mt-2 border-t border-gray-200 font-semibold text-[#1B3022]">
                <span>Total</span>
                <span>{currency}{order?.total?.toFixed(2) || "0.00"}</span>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;