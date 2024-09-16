import { createAsyncThunk, createEntityAdapter, createSlice } from "@reduxjs/toolkit";
import agent from "../../app/api/agent";

const productsAdapter=createEntityAdapter(); 

export const fetchProductAsync = createAsyncThunk(
    "catalog/fetchProductAsync",
    async () => {
        try {
            return await agent.Catalog.list();
        } catch (error) {
            console.log(error);
        }
    }
);  //Ürünleri artık basket,setBasket yerine burdan alacağız çünkü catalog sayfasına her girdiğimizde sayfa yükleniyor bu da zaman kaybı sadece en başta index.js'te yüklencek 
//ve loading yazısı göreceğiz bidaha da yüklenmeyecek. Başka sayfadan cataloga girdiğimizde yüklenmeyeceğini görürsün.

export const catalogSlice = createSlice({
    name:"catalog",
    initialState:productsAdapter.getInitialState({
        productsLoaded:false, //ürünlerin yüklenip yüklenmediğini kontrol etmek için eğer yüklenmemişse fetch içinde yukardaki fetchProductAsync metotunu çağırcak
        status:"idle"   //isteğin durumunu belirtiyor.
    }),//getInitialState içerisinde ids ve entites kısımları var.
    reducers:{}, //buna ihtiyaç yok zaten productsAdapter içerisinde bazı işlevler otomatik tanımlı CRUD işlemler de dahil
    extraReducers:(builder=>{
        builder.addCase(fetchProductAsync.pending,(state)=>{
            state.status="pendingFetchProducts";
        });
        builder.addCase(fetchProductAsync.fulfilled,(state,action)=>{
            productsAdapter.setAll(state,action.payload);
            state.status="idle";
            state.productsLoaded=true;
        })
        builder.addCase(fetchProductAsync.rejected,(state)=>{
            state.status="idle";
        })
    })

})

export const productSelectors =  productsAdapter.getSelectors(state=>state.catalog); //  const products = useSelector(productSelectors.selectAll); verileri böyle çekeriz

