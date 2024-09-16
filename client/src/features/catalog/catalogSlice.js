import { createAsyncThunk, createEntityAdapter, createSlice } from "@reduxjs/toolkit";
import agent from "../../app/api/agent";

const productsAdapter=createEntityAdapter(); 

export const fetchProductAsync = createAsyncThunk(
    "catalog/fetchProductAsync",
    async (_,thunkAPI) => {
        try {
            return await agent.Catalog.list();
        } catch (error) {     
            return thunkAPI.rejectWithValue({error:error.data}); //bunu denemek istersen agenttaki catalogtaki listin urlsini buggy/server-error yap.
        }
    }
);  //Ürünleri artık basket,setBasket yerine burdan alacağız çünkü catalog sayfasına her girdiğimizde sayfa yükleniyor bu da zaman kaybı sadece en başta index.js'te yüklencek 
//ve loading yazısı göreceğiz bidaha da yüklenmeyecek. Başka sayfadan cataloga girdiğimizde yüklenmeyeceğini görürsün.

export const fetchOneProductAsync = createAsyncThunk(
    "catalog/fetchOneProductAsync",
    async(productId,thunkAPI)=>{
        try {
            return await agent.Catalog.details(productId);  //ürün detaylarına bakmak istediğimizde ürünler her seferinde yüklenmesin diye yapıyoruz.
        } catch (error) {   //bunlarda catch'e girsek bile dışarıdaki fonksiyon isteğin yerine getirildiğini düşünür.örneğin id'si 300 olan ürünü aradığını düşün.
            return thunkAPI.rejectWithValue({error:error.data}); //bu yüzden biz bunu içerden reddedmeliyizki dışardaki anlayabilsin.
        }
    }
)

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
        });
        builder.addCase(fetchProductAsync.rejected,(state,action)=>{
            console.log(action.payload);
            state.status="idle";
        });
        builder.addCase(fetchOneProductAsync.pending,(state)=>{
            state.status="pendingFetchOneProduct";
        });
        builder.addCase(fetchOneProductAsync.fulfilled,(state,action)=>{
            productsAdapter.upsertOne(state,action.payload);
            state.status="idle";
        }); 
        builder.addCase(fetchOneProductAsync.rejected,(state,action)=>{
            console.log(action);
            state.status="idle";
        })
    })

})

export const productSelectors =  productsAdapter.getSelectors(state=>state.catalog); //  const products = useSelector(productSelectors.selectAll); verileri böyle çekeriz

