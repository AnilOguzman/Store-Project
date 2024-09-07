import React, { useEffect, useState } from "react";
import ProductList from "./ProductList";
import agent from "../../app/api/agent";
import LoadingComponent from "../../app/layout/LoadingComponent";

const Catalog = () => {
  const [products, setProducts] = useState([]);
  const [loading,setLoading]=useState(true)

  useEffect(() => {
    agent.Catalog.list().then((products)=>setProducts(products)).catch(error=>console.log(error)).finally(()=>setLoading(false)); //catch ve sonrasını loading için ekledik
  }, []);
  if(loading) return <LoadingComponent Message="Loading products..."/>
  return (
    <>
      <ProductList products={products} />
    </>
  );
};

export default Catalog;
