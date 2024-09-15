/* eslint-disable react/prop-types */
import React from "react";
import { Avatar, Button, Card, CardActions, CardContent, CardHeader, CardMedia, Typography } from "@mui/material";
import { Link } from "react-router-dom";
import { LoadingButton } from '@mui/lab';
import { currencyFormat } from "../../app/util/util";
import { useDispatch, useSelector } from "react-redux";
import { addBasketItemAsync } from "../basket/basketSlice";

const ProductCard = ({ product }) => {
    const {status}=useSelector(i=>i.basket);
    const dispatch=useDispatch();

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
                <LoadingButton loading={status.includes("pendingAddItem" + product.id)} onClick={()=>dispatch(addBasketItemAsync({productId:product.id}))} component={Link}  size="small">Add to Cart</LoadingButton>
                <Button component={Link} to={`/catalog/${product.id}`} size="small">View</Button>
            </CardActions>
        </Card>
  );
};

export default ProductCard;
