import { createSlice } from "@reduxjs/toolkit";
import { useContext } from "react";
//get localstorage
const getInitialCart = () => {
  try {
    const cart = localStorage.getItem("cart_items");
    return cart ? JSON.parse(cart) : [];
  } catch (error) {
    return [];
  }
};

export const CartSlice = createSlice({
  name: "cart",
  initialState: getInitialCart(),
  reducers: {
    addToCart: (state, action) => {
  const { id, product, quantity } = action.payload;
  const qtyToAdd = quantity || 1; 

  const existingProduct = state.find((c) => c.id === id);

  if (existingProduct) {
    existingProduct.quantity += qtyToAdd;
  } else {
    state.push({
      ...action.payload,
      quantity: qtyToAdd,
    });
  }

  localStorage.setItem("cart_items", JSON.stringify(state));
},

    removeItemFromCart: (state, action) => {
      const updatedState = state.filter((item) => item.id !== action.payload);
      localStorage.setItem("cart_items", JSON.stringify(updatedState));
      return updatedState;
    },

    modifyQuantityAnItem: (state, action) => {
      const { id, quantity } = action.payload;
      const product = state.find((c) => c.id === id);

      if (product) {
        product.quantity = quantity;
        localStorage.setItem("cart_items", JSON.stringify(state));
      }
    },
    clearCart: (state) => {
  localStorage.setItem("cart_items", JSON.stringify([]));
  return [];
}
  },
});

export const { 
  addToCart, 
  removeItemFromCart, 
  modifyQuantityAnItem,clearCart
} = CartSlice.actions;

export default CartSlice.reducer;