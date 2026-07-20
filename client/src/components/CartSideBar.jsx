import React, { useContext } from "react";
import { CartContext } from "../contexts/CartContext";
import { useNavigate } from "react-router-dom";
import { ArrowRightIcon, MinusIcon, PlusIcon, ShoppingBagIcon, Trash2Icon, XIcon } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { modifyQuantityAnItem, removeItemFromCart } from "../Feature/CartSlice";

const CartSideBar = () => {
  const navigate = useNavigate();
  const cart=useSelector(state=>state.cart)
  const dispatch=useDispatch()
  const currency = import.meta.env.VITE_CURRENCY_SYMBOL || "$";
  const {
    isCartOpen,
    setIsCartOpen,
  } = useContext(CartContext);

  if (!isCartOpen) return null;


  const cartTotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const deliveryFee = cartTotal > 20 ? 0 : 1.99;
  const grandTotal = cartTotal + deliveryFee;
  return (
    <>
      
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 transition-opacity"
        onClick={() => setIsCartOpen(false)}
      />


      <div className="fixed right-0 top-0 h-full w-full max-w-md bg-slate-50 z-50 shadow-2xl flex flex-col border-l border-slate-100">
        
       
        <div className="flex items-center justify-between p-5 bg-white border-b border-slate-100">
          <div className="flex items-center gap-2">
            <ShoppingBagIcon className="size-5 text-amber-600"/>
            <h2 className="text-lg font-bold text-slate-800">Your Cart</h2>
            <span className="flex items-center justify-center text-xs bg-amber-100 text-amber-800 font-bold px-2 py-0.5 rounded-full">
              {cart.length} {cart.length <= 1 ? "item" : "items"}
            </span>
          </div>
          <button 
            onClick={() => setIsCartOpen(false)}
            className="p-1.5 rounded-full text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
          >
            <XIcon className="size-5"/>
          </button>
        </div>

    
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {cart.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center p-6">
              <div className="p-4 bg-amber-50 rounded-full mb-3">
                <ShoppingBagIcon className="size-12 text-amber-500/80"/>
              </div>
              <h3 className="text-base font-semibold text-slate-700 mb-1">Your cart is empty</h3>
              <p className="text-sm text-slate-400 max-w-xs">Looks like you haven't added anything to your cart yet.</p>
            </div>
          ) : (
            cart.map((item) => (
              
              <div key={item.id} className="flex gap-4 bg-white border border-slate-100 rounded-xl p-3 shadow-sm">
                <img 
                  src={item.product.image} 
                  alt={item.product.name} 
                  className="size-16 rounded-lg object-cover shrink-0 bg-slate-50 border border-slate-100"
                />
                
                <div className="flex flex-col justify-between flex-1 min-w-0">
                  <div>
                    <h4 className="text-sm font-bold text-slate-800 truncate">{item.product.name}</h4>
                    <p className="text-xs text-slate-400 font-medium">
                      {currency}{item?.product.price.toFixed(2)}/{item?.product.unit || "pcs"}
                    </p>
                  </div>

             
                  <div className="flex items-center justify-between mt-1">
                    <div className="flex items-center bg-slate-100 border border-slate-200/60 rounded-lg p-0.5">
                      <button 
                        onClick={() => dispatch(modifyQuantityAnItem({id:item.id,quantity:item.quantity- 1}))}
                        className="p-1 rounded-md hover:bg-white text-slate-600 hover:text-amber-600 transition-all active:scale-90"
                      >
                        <MinusIcon className="size-3.5"/>
                      </button>
                      <span className="w-8 text-center text-xs font-bold text-slate-700">{item.quantity}</span>
                      <button 
                        onClick={() => dispatch(modifyQuantityAnItem({id:item.id,quantity:item.quantity+1}))}
                        className="p-1 rounded-md hover:bg-white text-slate-600 hover:text-amber-600 transition-all active:scale-90"
                      >
                        <PlusIcon className="size-3.5"/>
                      </button>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-slate-800">
                        {currency}{(item.product.price * item.quantity).toFixed(2)}
                      </span>
                      <button 
                        className="p-1 rounded-lg text-slate-400 hover:bg-red-50 hover:text-red-500 transition-colors" 
                        onClick={() => dispatch(removeItemFromCart(item.id))}
                      >
                        <Trash2Icon className="size-4"/>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
        {cart.length > 0 && (
          <div className="bg-white border-t border-slate-100 p-5 space-y-4 shadow-[0_-10px_20px_rgba(0,0,0,0.02)]">
            <div className="space-y-2">
              <div className="flex justify-between text-sm text-slate-500">
                <span>Subtotal</span>
                <span className="text-slate-800 font-semibold">{currency}{cartTotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm text-slate-500">
                <span>Delivery</span>
                <span className="text-slate-800 font-semibold">
                  {deliveryFee === 0 ? <span className="text-emerald-600 font-bold">Free</span> : `${currency}${deliveryFee.toFixed(2)}`}
                </span>
              </div>
              {deliveryFee > 0 && (
                <p className="text-xs text-amber-600 bg-amber-50 rounded-lg p-2 font-medium text-center border border-amber-100/50">
                  Add more items worth <span className="font-bold">{currency}{(20 - cartTotal).toFixed(2)}</span> for Free Delivery!
                </p>
              )}
            </div>

            <div className="flex justify-between text-base font-bold text-slate-800 border-t border-dashed border-slate-200 pt-3">
              <span>Total Bill</span>
              <span className="text-lg text-amber-600 font-black">{currency}{grandTotal.toFixed(2)}</span>
            </div>

            <button 
              onClick={() => {
                setIsCartOpen(false);
                navigate('/checkout');
                window.scrollTo(0, 0);
              }} 
              className="w-full py-3 bg-amber-500 text-white font-bold rounded-xl shadow-lg shadow-amber-500/10 hover:bg-amber-600 transition-all flex items-center justify-center gap-2 active:scale-[0.99]"
            >
              Proceed to Checkout 
              <ArrowRightIcon className="size-4"/>
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default CartSideBar;