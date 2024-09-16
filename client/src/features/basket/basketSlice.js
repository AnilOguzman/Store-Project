import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import agent from "../../app/api/agent";

const initialState = {
  basket: null,
  status: "idle",
};

export const addBasketItemAsync = createAsyncThunk(
  "basket/addBasketItemAsync",
  async ({ productId, quantity = 1 },thunkAPI) => {
    try {
      return await agent.Basket.addItem(productId, quantity);
    } catch (error) {
      return  thunkAPI.rejectWithValue({error:error.data});
    }
  }
);

export const removeBasketItemAsync = createAsyncThunk(
  "basket/removeBasketItemAsync",
  async ({ productId, quantity = 1 },thunkAPI) => {
    try {
      return await agent.Basket.removeItem(productId, quantity);
    } catch (error) {
      return thunkAPI.rejectWithValue({error:error.data});
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
  },
  extraReducers: (builder) => {
    builder.addCase(addBasketItemAsync.pending, (state, action) => {
      //console.log(action); action içerisinde neler var ona baktık aşağıdaki productId'yi nereden alacağımızı öğrenmek için
      state.status = "pendingAddItem" + action.meta.arg.productId; //böyle yaptık çünkü add'e bastığımızda loading işlemi olurken butonda tüm butonlar loading oluyordu butonu özel tanımlayacak şekilde verdik
    });
    builder.addCase(addBasketItemAsync.fulfilled, (state, action) => {
      state.basket = action.payload;
      state.status = "idle";
    });
    builder.addCase(addBasketItemAsync.rejected, (state,action) => {
      console.log(action.payload);
      state.status = "idle";
    });
    builder.addCase(removeBasketItemAsync.pending, (state, action) => {
      state.status = "pendingRemoveItem" + action.meta.arg.productId + action.meta.arg.name;
    });
    builder.addCase(removeBasketItemAsync.fulfilled, (state, action) => {
      const { productId, quantity=1 } = action.meta.arg;
      const itemIndex = state.basket.items.findIndex((i) => i.productId === productId);
      if (itemIndex === -1 || itemIndex === undefined) return;
      state.basket.items[itemIndex].quantity -= quantity;
      if (state.basket.items[itemIndex].quantity === 0) state.basket.items.splice(itemIndex, 1);

      state.status="idle";
    });
    builder.addCase(removeBasketItemAsync.rejected, (state,action) => {
      console.log(action.payload);  
      state.status = "idle" ;
    });
  },
});

export const { setBasket } = basketSlice.actions;
