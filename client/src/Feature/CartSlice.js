import { createSlice } from "@reduxjs/toolkit";
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
      const product = state.find((c) => c.id === action.payload.id);
      if (product) {
        product.quantity++;
      } else {
        state.push({ ...action.payload, quantity: 1 });
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
  },
});

export const { 
  addToCart, 
  removeItemFromCart, 
  modifyQuantityAnItem
} = CartSlice.actions;

export default CartSlice.reducer;