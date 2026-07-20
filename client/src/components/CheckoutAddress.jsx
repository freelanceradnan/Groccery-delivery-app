import React, { useEffect } from 'react';
import { ChevronRightIcon, MapPinIcon, PlusIcon } from 'lucide-react';
import { Link } from 'react-router-dom';

const CheckoutAddress = ({ user, address, setAddress, setStep }) => {
 
  const handleSelectAddress = (addr) => {
    setAddress({
      id: addr._id || addr.id || "addr_1",
      label: addr.label || "Home",
      address: addr.address || "",
      city: addr.city || "",
      state: addr.state || "",
      zip: addr.zip || "",
      lat: addr.lat || 0,
      lng: addr.lng || 0,
      isDefault: !!addr.isDefault,
    });
  };

  
  useEffect(() => {
    const addresses = Array.isArray(user) ? user : [];
    
    if (addresses.length > 0 && !address?.address) {
      const targetAddress = addresses.find((a) => a.isDefault) || addresses[0];
      handleSelectAddress(targetAddress);
    }
  }, [user]);

  // Helper to highlight active card
  const isSelected = (addr) => {
    if (!address) return false;
    return address.id 
      ? address.id === (addr._id || addr.id) 
      : address.address === addr.address;
  };

  return (
    <div className="bg-white rounded-2xl p-6 animate-fade-in">
      <h2 className="text-lg font-semibold text-app-green mb-5 flex items-center gap-2">
        <MapPinIcon className="size-5" /> Delivery Address
      </h2>

      {user && user.length > 0 ? (
        <div className="mb-6">
          <h3 className="text-sm font-semibold text-app-green mb-3">Saved Addresses</h3>
          <div className="grid sm:grid-cols-2 gap-3">
            {user.map((addr) => {
              const active = isSelected(addr);
              return (
                <div
                  key={addr._id || addr.id || addr.label}
                  onClick={() => handleSelectAddress(addr)}
                  className={`p-4 rounded-xl border cursor-pointer transition-colors ${
                    active
                      ? 'border-[#2D4A35] bg-[#FAF7F2] ring-1 ring-[#2D4A35]'
                      : 'border-[#FAF7F2] hover:bg-app-cream'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <MapPinIcon className="size-4 text-app-green" />
                    <span className="font-semibold text-zinc-900 text-sm">{addr.label}</span>
                    {addr.isDefault && (
                      <span className="text-[10px] font-semibold text-app-orange uppercase tracking-wider bg-[#FAF7F2] px-2 py-0.5 rounded-full">
                        Default
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-zinc-600 truncate">{addr.address}</p>
                  <p className="text-xs text-zinc-500">
                    {addr.city}, {addr.state} {addr.zip}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <p className="text-sm text-zinc-500 mb-6">No saved addresses found.</p>
      )}

      <div className="flex flex-col sm:flex-row gap-4 mt-6">
        <Link 
          to="/addresses" 
          className="px-6 py-3 border border-gray-600 text-gray-600 rounded-xl flex items-center justify-center gap-2 w-full sm:w-auto hover:bg-gray-50 transition-colors"
        >
          Add New Address <PlusIcon className="size-4" />
        </Link>
        <button 
          onClick={() => { setStep("payment"); window.scrollTo(0, 0); }} 
          disabled={!address?.address}
          className="px-6 py-3 bg-[#1B3022] font-semibold rounded-xl hover:bg-app-green-light transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 w-full sm:w-auto text-white"
        >
          Continue to Payment <ChevronRightIcon className="size-4" />
        </button>
      </div>
    </div>
  );
};

export default CheckoutAddress;