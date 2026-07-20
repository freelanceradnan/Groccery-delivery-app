import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CartContext } from '../contexts/CartContext';
import { ArrowLeft, CheckIcon, ChevronRightIcon, CreditCardIcon, MapPinIcon } from 'lucide-react';
import { dummyAddressData } from '../assets/assets';
import CheckoutAddress from '../components/CheckoutAddress';
import CheckoutPayment from '../components/CheckoutPayment';
import CheckoutReview from '../components/CheckoutReview';
import { useDispatch, useSelector } from 'react-redux';
import { useCreateOrderMutation, useGetUsersAddressQuery } from '../Feature/ApiSlice';
import { toast } from 'react-hot-toast';
import { clearCart } from '../Feature/CartSlice';
const Checkout = () => {
    const {data:addresses=[]}=useGetUsersAddressQuery()
    const dispatch=useDispatch()
    const [order]=useCreateOrderMutation()
    const navigate = useNavigate();
    const currency = import.meta.env.VITE_CURRENCY_SYMBOL || "$";
    const items=useSelector(state=>state.cart)
    
    const [step, setStep] = useState("address");
    const [loading, setLoading] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState('card');
    
  
    const [address, setAddress] = useState({
        id: "",
        label: "Home",
        address: "",
        city: "",
        state: "",
        zip: "",
        isDefault: false,
        lat: 0,
        lng: 0
    });
    const cartTotal = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
    const deliveryFee = cartTotal > 20 ? 0 : 1.99;
    const tax = cartTotal * 0.08;
    const total = cartTotal + deliveryFee + tax;

    const steps = [
        { Key: "address", label: "Address", icon: MapPinIcon },
        { Key: "payment", label: "Payment", icon: CreditCardIcon },
        { Key: "review", label: "Review", icon: CheckIcon }
    ];
   
    const handlePlaceOrder = async (e) => {
        e.preventDefault()
        setLoading(true);
    try {
      const orderData={
    items:items.map((item)=>({
        image:item.product.image,
        product:item.product._id,
        quantity:item.quantity
    })),
    shippingAddress:address,
    paymentMethod
    }
    const response=await order(orderData).unwrap()
  
    if(response.success===true){
        toast.success('Order Placed SuccessFully!')
        setTimeout(() => {
        dispatch(clearCart())
        navigate(`/orders/${response.order._id}`)
        
        }, 1000);
    }
    else{
        toast.error('Failed to Proccess Order!Try Next Time!')
    }
    setLoading(false)
    } catch (error) {
        
    }
    
    };


    if (items.length === 0) {
        return (
            <div className='min-h-screen bg-[#FAF7F2] flex items-center justify-center'>
                <div className="text-center">
                    <div className="text-xl font-semibold text-[#032E15] mb-2">
                        Your Cart is empty!
                    </div>
                    <p className='text-sm text-light mb-4'>Add some Products to checkout!</p>
                    <button onClick={() => navigate('/products')} className="px-5 py-2.5 bg-[#032E15] text-white text-sm font-medium rounded-xl hover:bg-green-500 transition-colors">
                        Browse Products
                    </button>
                </div>
            </div>
        );
    }
    
    return (
        <div className='min-h-screen bg-[#FAF7F2]'>
            <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
                <button className="flex items-center gap-2 text-sm text-light hover:text-green-500 mb-6 transition-colors" onClick={() => navigate(-1)}>
                    <ArrowLeft className='size-4' />Back
                </button>
                
                <h1 className="text-2xl font-semibold text-[#1B3022] mb-8">
                    Checkout
                </h1>

                {/* Steps Navigation */}
                <div className="flex items-center gap-2 mb-8">
                    {steps.map((s, i) => (
                        <div className='flex items-center gap-2' key={s.Key}>
                            <button
                                onClick={() => setStep(s.Key)}
                                className={`flex items-center gap-2 py-2 px-4 rounded-xl text-sm font-medium transition-colors ${
                                    step === s.Key ? "bg-[#1B3022] text-white" : "bg-white text-light"
                                }`}
                            >
                                <s.icon className='size-4' />
                                <span className="capitalize">{s.Key}</span>
                            </button>
                            {i < steps.length - 1 && <ChevronRightIcon className='size-4 text-light' />}
                        </div> 
                    ))}
                </div>

                <div className="grid md:grid-cols-3 gap-6">
                    <div className="md:col-span-2">
                        {step === 'address' && <CheckoutAddress address={address} setAddress={setAddress} setStep={setStep} user={addresses} />}
                        {step === 'payment' && <CheckoutPayment paymentMethod={paymentMethod} setPaymentMethod={setPaymentMethod} setStep={setStep} />}
                        {step === 'review' && <CheckoutReview address={address} items={items} handlePlaceOrder={handlePlaceOrder} loading={loading} total={total} />}
                    </div>
                    {/* order-summery */}
                    <div className='bg-white rounded-2xl p-5 h-fit sticky top-24'>
                <h3 className='text-sm font-semibold text-[#032E15] mb-4'>Order Summary</h3>
                <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                        <span className='text-light'>Subtotal({items.length}) items</span>
                        <span>{currency}{cartTotal.toFixed()}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className='text-light'>Delivery</span>
                        <span>{deliveryFee===0?<span className='text-green-500'>Free</span>:`${currency}${deliveryFee.toFixed()}`}</span>
                    </div>
                     <div className="flex justify-between">
                        <span className='text-light'>Fax</span>
                        <span>{currency}{tax.toFixed()}</span>
                    </div>
                    <div className="flex justify-between pt-3 border-t border-orange-200 text-base font-semibold">
                        <span>total</span>
                        <span>{currency}{total.toFixed()}</span>
                    </div>
                </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Checkout;