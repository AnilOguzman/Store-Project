import {
  Divider,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import { useParams } from "react-router-dom";
import React, { useEffect, useState } from "react";
import NotFound from "../../app/errors/NotFound";
import LoadingComponent from "../../app/layout/LoadingComponent";
import { LoadingButton } from "@mui/lab";
import { useDispatch, useSelector } from "react-redux";
import { addBasketItemAsync, removeBasketItemAsync } from "../basket/basketSlice";
import { fetchOneProductAsync, productSelectors } from "./catalogSlice";

const ProductDetails = () => {
  const { id } = useParams();
  const { basket,status} = useSelector(i=>i.basket);
  const product=useSelector(state=>productSelectors.selectById(state,id));
  const dispatch = useDispatch();
  const {status:productStatus} = useSelector(i=>i.catalog) //status zaten olduğu için productStatus olarak kullancaz
  const [quantity, setQuantity] = useState(0);

  const item = basket?.items.find((i) => i.productId === product?.id);
  console.log("deneme",product);
  console.log("item",item);
  useEffect(() => {
    if (item) setQuantity(item.quantity);
    if(!product) dispatch(fetchOneProductAsync(parseInt(id)))
  }, [id, item,product,dispatch]); //item ekledik çünkü ürün detaylarındaki Quantity in cart kısmındaki miktar değişmiyodu yoksa

  const handleInputChange = (event) => {
    if (event.target.value >= 0) {
      setQuantity(parseInt(event.target.value));
    }
  };

  const handleUpdateCart = () => {
    if(!product) return;

    if (!item || quantity > item.quantity) {
      const updateQuantity = item ? quantity - item.quantity : quantity;
      dispatch(addBasketItemAsync({productId:product.id, quantity:updateQuantity}));
    } else {
      const updatedQuantity = item.quantity - quantity;
      dispatch(removeBasketItemAsync({productId:product.id, quantity:updatedQuantity}));

    }
  };

  if (productStatus.includes("pending")) return <LoadingComponent Message="Loading product..." />;
  if (!product) return <NotFound />; //normalde buna gerek yok ama görüyüm diye yazdım

  return (
    <Grid container spacing={6}>
      <Grid item xs={6}>
        <img
          src={product.pictureUrl}
          alt={product.name}
          style={{ width: "100%" }}
        ></img>
      </Grid>
      <Grid item xs={6}>
        <Typography variant="h3">{product.name}</Typography>
        <Divider sx={{ mb: 2 }} />
        <Typography variant="h4" color="secondary">
          ${(product.price / 100).toFixed(2)}
        </Typography>
        <TableContainer>
          <Table>
            <TableBody>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>{product.Name}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Description</TableCell>
                <TableCell>{product.description}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Type</TableCell>
                <TableCell>{product.type}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Brand</TableCell>
                <TableCell>{product.brand}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Quantity in Stock</TableCell>
                <TableCell>{product.quantityInStock}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <TextField
              onChange={handleInputChange}
              variant="outlined"
              type="number"
              label="Quantity in Cart"
              fullWidth
              value={quantity}
            />
          </Grid>
          <Grid item xs={6}>
            <LoadingButton
              disabled={item?.quantity === quantity || !item && quantity === 0 }
              loading={status.includes("pendingRemoveItem"+product.id)}
              onClick={handleUpdateCart}
              sx={{ height: "55px" }}
              color="primary"
              size="large"
              variant="contained"
              fullWidth
            >
              {item ? "Update Quantity" : "Add to Cart"}
            </LoadingButton>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default ProductDetails;
