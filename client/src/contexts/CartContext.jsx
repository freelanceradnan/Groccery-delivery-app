import { createContext, useEffect, useState } from "react";


export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  
  const [isCartOpen, setIsCartOpen] = useState(false);



  const initstate = {
    isCartOpen,
    setIsCartOpen,
  };

  return (
    <CartContext.Provider value={initstate}>{children}</CartContext.Provider>
  );
};