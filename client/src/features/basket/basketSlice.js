import {createSlice} from "@reduxjs/toolkit"

const initialState = {
    basket: null
};

export const basketSlice = createSlice({
    name: 'basket',
    initialState,
    reducers: {
        setBasket(state, action) {
            state.basket=action.payload
        },
        removeItem(state,action){
            const {productId,quantity}=action.payload;
            const itemIndex = state.basket.items.findIndex(i => i.productId === productId);
            if(itemIndex === -1 || itemIndex === undefined) return;
            state.basket.items[itemIndex].quantity -= quantity;
            if(state.basket.items[itemIndex].quantity===0) state.basket.splice(itemIndex,1);

        }
}});

export const {setBasket,removeItem}= basketSlice.actions;