import React, { useEffect, useState } from "react";
import ProductList from "./ProductList";
import agent from "../../app/api/agent";

const Catalog = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    agent.Catalog.list().then((products)=>setProducts(products));
  }, []);

  return (
    <>
      <ProductList products={products} />
    </>
  );
};

export default Catalog;
