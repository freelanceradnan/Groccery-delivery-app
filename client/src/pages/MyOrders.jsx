import React, { useContext, useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { CartContext } from '../contexts/CartContext';
import { dummyDashboardOrdersData, statusColors } from '../assets/assets';
import Loading from '../components/Loading';
import { Calendar, ChevronRightIcon, PackageIcon } from 'lucide-react';
import { useGetAllProductQuery, useGetUserAllOrdersQuery } from '../Feature/ApiSlice';

const MyOrders = () => {
    const {data:AllOrders=[]}=useGetUserAllOrdersQuery()
    const {data:allProducts}=useGetAllProductQuery()
    
   
    const currency = import.meta.env.VITE_CURRENCY_SYMBOL || "$";
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [products,setProducts]=useState([])
    const [activeTab, setActiveTab] = useState('all');
    const [searchParams, setSearchParams] = useSearchParams();
    const tabs = ["all", "Placed", "Out for Delivery", "Delivered"];
    const { clearCart } = useContext(CartContext);
    
    const fetchOrders = async () => {
        let filteredOrders = AllOrders;
        
        // Filter orders based on active tab
        if (activeTab !== 'all') {
            filteredOrders = AllOrders.filter(
                (order) => order.status === activeTab
            );
        }
        
        setOrders(filteredOrders);
        setLoading(false);
    };
    // console.log(orders)
    useEffect(() => {
        if (searchParams.get("clearCart")) {
            clearCart("");
            setSearchParams({});
            setTimeout(() => {
                fetchOrders();
            }, 2000);
        } else {
            fetchOrders();
        }
    }, [activeTab,AllOrders]);
    useEffect(()=>{
   if(allProducts){
setProducts(allProducts)
   }
    },[allProducts])


    return (
        <div className='min-h-screen bg-[#faf7f2] mb-20'>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <h1 className='pb-4 text-2xl text-[#1b3022] font-semibold'>My Orders</h1>
                
                {/* Tabs */}
                <div className='flex gap-2 mb-6 overflow-x-auto pb-2'>
                    {tabs.map((tab) => (
                        <button 
                            key={tab} 
                            onClick={() => setActiveTab(tab)} 
                            className={`px-4 py-2 text-sm font-medium rounded-xl whitespace-nowrap transition-colors ${
                                activeTab === tab ? "bg-[#1b3022] text-white" : "bg-white text-light hover:bg-yellow-100"
                            }`}
                        >
                            {tab === 'all' ? "All Orders" : tab}
                        </button>
                    ))}
                </div>

                {/* Orders-List */}
                {loading ? (
                    <Loading />
                ) : orders.length === 0 ? (
                    <div className='text-center py-16'>
                        <PackageIcon className='size-16 text-black/20 mx-auto mb-4' />
                        <h2 className='text-lg font-medium text-green-500 mb-2'>No Orders yet</h2>
                        <p>Start Shopping to see orders here</p>
                        <Link to="/products">
                            Start Shopping
                        </Link>
                    </div>
                ) : (
                    <div className='space-y-4'>
                        {orders.map((order) => (
                            
                            <Link 
                                key={order._id || order.id} 
                                to={`/orders/${order._id}`} 
                                className='block max-w-4xl bg-white rounded-2xl p-5 hover:shadow transition-all'
                            >
                                {/* orders id, date and status */}
                                <div className='flex items-center justify-between mb-3'>
                                    <div>
                                        <p className='text-sm font-medium text-green-500'>
                                            Order #{order._id?.slice(-8).toUpperCase()}
                                        </p>
                                        <div className='flex items-center gap-2 mt-1'>
                                            <Calendar className='size-3 text-light' />
                                            <span className='text-xs text-light'>
                                                {new Date(order.createdAt).toLocaleDateString("en-US", {
                                                    month: "short",
                                                    day: "numeric",
                                                    year: "numeric"
                                                })}
                                            </span>
                                        </div>
                                    </div>

                                    <div className='flex items-center gap-2'>
                                        <span className={`px-4 py-1 text-xs font-medium rounded-full ${
                                            statusColors[order?.status] || "bg-yellow-300 text-gray-700"
                                        }`}>
                                            {order.status}
                                        </span>
                                        <ChevronRightIcon className='size-4 text-light' />
                                    </div>
                                </div>

                                {/* items-image */}
                                <div className="flex flex-wrap items-center gap-3">
  {order?.items?.map((item, i) => {
    const filtered = products.find((c) => c._id === item.product);

    return (
      <img
        key={filtered?._id || item.product || i}
        alt={filtered?.name || "Product image"}
        src={filtered?.image}
        className="size-12 sm:size-16 rounded-lg object-cover border border-black/20"
      />
    );
  })}
</div>

                                {/* total items-price */}
                                <div className="flex justify-between items-center pt-3 text-sm">
                                    <span className="text-light">
                                        {order.items.length} {order.items.length > 1 ? "items" : "item"}
                                    </span>
                                    <span className="font-semibold text-green-500">
                                        {currency}{order.total?.toFixed(2)}
                                    </span>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default MyOrders;