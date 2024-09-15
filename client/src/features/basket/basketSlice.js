import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import agent from "../../app/api/agent";

const initialState = {
  basket: null,
  status: "idle",
};

export const addBasketItemAsync = createAsyncThunk(
  "basket/addBasketItemAsync",
  async ({ productId, quantity=1 }) => {
    try {
      return await agent.Basket.addItem(productId, quantity);
    } catch (error) {
      console.log(error);
    }
  }
);

export const basketSlice = createSlice({
  name: "basket",
  initialState,
  reducers: {
    setBasket(state, action) {
      state.basket = action.payload;
    },
    removeItem(state, action) {
      const { productId, quantity } = action.payload;
      const itemIndex = state.basket.items.findIndex(
        (i) => i.productId === productId
      );
      if (itemIndex === -1 || itemIndex === undefined) return;
      state.basket.items[itemIndex].quantity -= quantity;
      if (state.basket.items[itemIndex].quantity === 0)
        state.basket.splice(itemIndex, 1);
    },
  },
  extraReducers: (builder) => {
    builder.addCase(addBasketItemAsync.pending, (state, action) => {
      //console.log(action); action içerisinde neler var ona baktık aşağıdaki productId'yi nereden alacağımızı öğrenmek için
      state.status = "pendingAddItem" + action.meta.arg.productId;   //böyle yaptık çünkü add'e bastığımızda loading işlemi olurken butonda tüm butonlar loading oluyordu butonu özel tanımlayacak şekilde verdik  
    });
    builder.addCase(addBasketItemAsync.fulfilled, (state, action) => {
      state.basket=action.payload;
      state.status = "idle";
    });
    builder.addCase(addBasketItemAsync.rejected, (state) => {
        state.status = "idle";
    });
  },
});

export const { setBasket, removeItem } = basketSlice.actions;
