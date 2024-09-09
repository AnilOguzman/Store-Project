import React, { useEffect, useState } from 'react'
import agent from '../../app/api/agent';
import { IconButton, Typography } from '@mui/material';
import LoadingComponent from '../../app/layout/LoadingComponent';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { Delete } from '@mui/icons-material';


const BasketPage = () => {
    const [loading,setLoading]=useState(true);
    const [basket,setBasket]=useState(null);

    useEffect(()=>{
        agent.Basket.get()
            .then((response)=>setBasket(response))
            .catch(error=>console.log(error))
            .finally(()=>setLoading(false));

    },[])

    if(loading) return <LoadingComponent Message='Loading basket...'/> 

    if(basket==null) return <Typography variant='h3'>Your basket is empty.</Typography>

    return (
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} >
            <TableHead>
              <TableRow>
                <TableCell>Product</TableCell>
                <TableCell align="right">Price</TableCell>
                <TableCell align="right">Quantity</TableCell>
                <TableCell align="right">Subtotal</TableCell>
                <TableCell align="right"></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {basket.items.map((item) => (
                <TableRow
                  key={item.productId}
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                  <TableCell component="th" scope="row">
                    {item.name}
                  </TableCell>
                  <TableCell align="right">${(item.price/100).toFixed(2)}</TableCell>
                  <TableCell align="right">{item.quantity}</TableCell>
                  <TableCell align="right">${((item.price/100) * item.quantity).toFixed(2)}</TableCell>
                  <TableCell align="right">
                    <IconButton color='error'>
                        <Delete/>
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      );
}

export default BasketPage