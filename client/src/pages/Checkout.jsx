import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CartContext } from '../contexts/CartContext';
import { ArrowLeft, CheckIcon, ChevronRightIcon, CreditCardIcon, MapPinIcon } from 'lucide-react';
import { dummyAddressData } from '../assets/assets';
import CheckoutAddress from '../components/CheckoutAddress';
import CheckoutPayment from '../components/CheckoutPayment';
import CheckoutReview from '../components/CheckoutReview';

const Checkout = () => {
    const navigate = useNavigate();
    const currency = import.meta.env.VITE_CURRENCY_SYMBOL || "$";
    const { items, cartTotal } = useContext(CartContext);
    
    const [step, setStep] = useState("address");
    const [loading, setLoading] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState('card');
    
    // Initial state setup
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

    const deliveryFee = cartTotal > 20 ? 0 : 1.99;
    const tax = cartTotal * 0.08;
    const total = cartTotal + deliveryFee + tax;

    const steps = [
        { Key: "address", label: "Address", icon: MapPinIcon },
        { Key: "payment", label: "Payment", icon: CreditCardIcon },
        { Key: "review", label: "Review", icon: CheckIcon }
    ];

    const handlePlaceOrder = async () => {
        setLoading(true);
        navigate('/orders');
    };

    // GUARANTEED RUN: Sets address data cleanly on mount
    useEffect(() => {
        const addressesArray = dummyAddressData?.addresses || dummyAddressData; // Handle variations in data nesting
        
        if (Array.isArray(addressesArray) && addressesArray.length > 0) {
            // Find default address, or grab the very first available item
            const defaultAddr = addressesArray.find((a) => a.isDefault) || addressesArray[0];
            
            if (defaultAddr) {
                setAddress({
                    id: defaultAddr._id || defaultAddr.id || "addr_1",
                    label: defaultAddr.label || "Home",
                    address: defaultAddr.address || "",
                    city: defaultAddr.city || "",
                    state: defaultAddr.state || "",
                    zip: defaultAddr.zip || "",
                    isDefault: !!defaultAddr.isDefault,
                    lat: defaultAddr.lat || 0,
                    lng: defaultAddr.lng || 0
                });
            }
        }
    }, []); // Empty array guarantees execution exactly once when layout loads

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
                        {step === 'address' && <CheckoutAddress address={address} setAddress={setAddress} setStep={setStep} user={dummyAddressData} />}
                        {step === 'payment' && <CheckoutPayment paymentMethod={paymentMethod} setPaymentMethod={setPaymentMethod} setStep={setStep} />}
                        {step === 'review' && <CheckoutReview address={address} items={items} handlePlaceOrder={handlePlaceOrder} loading={loading} total={total} />}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Checkout;