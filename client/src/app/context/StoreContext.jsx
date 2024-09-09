/* eslint-disable react/prop-types */
/* eslint-disable react/react-in-jsx-scope */
import { createContext, useContext, useState } from "react";



export const StoreContext=createContext(undefined);

export const useStoreContext = () => {
    const context=useContext(StoreContext);

    if(context===undefined)
    {
        throw console.error('Oops - we do not seem to be inside the provider');
        
    }

    return context;
}

export const StoreProvider = ({children}) =>{
    const [basket,setBasket] = useState(null);

    const removeItem = (productId,quantity) => {
        if(!basket) return;

        const items=[...basket.items];
        const itemIndex=items.findIndex(i=> i.productId===productId);

        if(itemIndex >= 0 )
        {
            items[itemIndex].quantity -=quantity;
            if(items[itemIndex].quantity===0) items.splice(itemIndex,1);

            setBasket(prevState=>{
                return {
                    ...prevState,
                    items
                }
            });
        }

    }
    return (
        <StoreContext.Provider value={{basket,setBasket,removeItem}}>
            {children}
        </StoreContext.Provider>
    );
}  