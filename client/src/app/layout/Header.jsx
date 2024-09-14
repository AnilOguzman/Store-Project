/* eslint-disable react/react-in-jsx-scope */
/* eslint-disable react/prop-types */
import { AppBar, Badge, Box, IconButton, List, ListItem, Switch, Toolbar, Typography } from "@mui/material";
import { ShoppingCart } from '@mui/icons-material';
import { Link, NavLink } from "react-router-dom";
import { useSelector } from "react-redux";

const Header = ({ darkMode, handleThemeChange }) => {
  const {basket}=useSelector(i=>i.basket);
  const itemCount=basket?.items.reduce((sum,item)=>sum+item.quantity,0);

  const navStyles={
    color:'inherit', 
    textDecoration:'none',
    typography:'h6',
    '&:hover':{color:'grey.500'},
    '&.active':{color:'text.secondary'}
  };
  return (
    <AppBar position="sticky" sx={{ mb: 4 }}>
      <Toolbar sx={{display:'flex',justifyContent:"space-between",alignItems:"center"}}>
        <Box>

        <Typography variant="h6" component={NavLink} to={'/'} sx={navStyles}>STORE</Typography>
        <Switch checked={darkMode} onChange={handleThemeChange} />
        </Box>
        <Box>

        <List sx={{display:'flex'}}>
          <ListItem component={NavLink} to={'/catalog'} key={'/catalog'} sx={navStyles}>
              Catalog
          </ListItem>
          <ListItem component={NavLink} to={'/about'} key={'/about'} sx={navStyles}>
              About
          </ListItem>
          <ListItem component={NavLink} to={'/contact'} key={'/contact'} sx={navStyles}>
              Contact
          </ListItem>
        </List>
        </Box>
        <Box sx={{display:'flex', alignItems:'center'}}>

        <IconButton component={Link} to="/basket" size="large" edge="start" color="inherit" sx={{mr:2}}>
          <Badge badgeContent={itemCount} color="secondary">
            <ShoppingCart/>
          </Badge>
        </IconButton>
        <List sx={{display:'flex'}}>
          <ListItem component={NavLink} to={'/login'} key={'/login'} sx={navStyles}>
              Login
          </ListItem>
          <ListItem component={NavLink} to={'/register'} key={'/register'} sx={navStyles}>
              Register
          </ListItem>
        </List>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
