/* eslint-disable react/react-in-jsx-scope */
import {
  Container,
  createTheme,
  CssBaseline,
  ThemeProvider,
} from "@mui/material";
import Header from "./Header";
import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import {ToastContainer} from "react-toastify"
import 'react-toastify/dist/ReactToastify.css'
import { useStoreContext } from "../context/StoreContext";
import agent from "../api/agent";
import LoadingComponent from "./LoadingComponent";

function App() {
  const {setBasket}=useStoreContext();
  const [loading,setLoading]=useState(true);

  useEffect(()=>{
    agent.Basket.get()
      .then(basket=>setBasket(basket))
      .catch(error=>console.log(error))
      .finally(()=>setLoading(false));
  },[setBasket])

  const [darkMode,setDarkMode]=useState(false);
  const palletType=darkMode ? 'dark' : 'light';

  const theme = createTheme({
    palette: {
      mode: palletType,
      background:{
        default: palletType==='light' ? '#eaeaea' : '#121212',
      }
    },
  });

  const handleThemeChange = () =>{
    setDarkMode(!darkMode);
  }

  if(loading) return <LoadingComponent Message="Initialising app..." />

  return (
    <ThemeProvider theme={theme}>
      <ToastContainer position="bottom-right" hideProgressBar theme="colored"/>
      <CssBaseline />
      <Header darkMode={darkMode} handleThemeChange={handleThemeChange} />
      <Container>
        <Outlet/>
      </Container>
    </ThemeProvider>
  );
}

export default App;
