import React from "react";
import { Grid, List } from "@mui/material";
import ProductCard from "./ProductCard";

const ProductList = ({ products }) => {
  return (
    <Grid container spacing={4}>
      {products.map((product) => (
        <Grid item xs={3} key={product.id}>
          <ProductCard product={product} />
        </Grid>
      ))}
    </Grid>
  );
};

export default ProductList;
