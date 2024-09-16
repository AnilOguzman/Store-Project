import React, { useEffect } from "react";
import ProductList from "./ProductList";
import LoadingComponent from "../../app/layout/LoadingComponent";
import { useDispatch, useSelector } from "react-redux";
import { fetchProductAsync, productSelectors } from "./catalogSlice";

const Catalog = () => {
  const products = useSelector(productSelectors.selectAll);
  const {productsLoaded,status} = useSelector(i=>i.catalog);
  const dispatch=useDispatch();

  useEffect(() => {
    if(!productsLoaded) dispatch(fetchProductAsync());
  }, [productsLoaded,dispatch]);

  if(status.includes("pending")) return <LoadingComponent Message="Loading products..."/>
  return (
    <>
      <ProductList products={products} />
    </>
  );
};

export default Catalog;
