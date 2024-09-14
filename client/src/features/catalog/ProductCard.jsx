/* eslint-disable react/prop-types */
import React, { useState } from "react";
import { Avatar, Button, Card, CardActions, CardContent, CardHeader, CardMedia, Typography } from "@mui/material";
import { Link } from "react-router-dom";
import agent from "../../app/api/agent";
import { LoadingButton } from '@mui/lab';
import { currencyFormat } from "../../app/util/util";
import { useDispatch } from "react-redux";
import { setBasket } from "../basket/basketSlice";

const ProductCard = ({ product }) => {
    const [loading,setLoading]=useState(false);
    const dispatch=useDispatch();

    const handleAddItem = (productId) => {
        setLoading(true);
        agent.Basket.addItem(productId)
            .then((basket)=>dispatch(setBasket(basket)))
            .catch(error=>console.log(error))
            .finally(setLoading(false));
    }
  return (
    <Card>
        
            <CardHeader
                avatar={
                    <Avatar sx={{ bgcolor: 'secondary.main' }}>
                        {product.name.charAt(0).toUpperCase()}
                    </Avatar>
                }
                title={product.name}
                titleTypographyProps={{
                    sx: { fontWeight: 'bold', color: 'primary.main' }
                }}
            />
            <CardMedia
                sx={{ height: 140, backgroundSize: 'contain', bgcolor: 'primary.light' }}
                image={product.pictureUrl}
                title={product.name}
            />
            <CardContent>
                <Typography gutterBottom color='secondary' variant="h5" component="div">
                    {currencyFormat(product.price)}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    {product.brand} / {product.type}
                </Typography>
            </CardContent>
            <CardActions>
                <LoadingButton loading={loading} onClick={()=>handleAddItem(product.id)} component={Link}  size="small">Add to Cart</LoadingButton>
                <Button component={Link} to={`/catalog/${product.id}`} size="small">View</Button>
            </CardActions>
        </Card>
  );
};

export default ProductCard;
