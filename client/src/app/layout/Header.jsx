import { AppBar, Switch, Toolbar, Typography } from "@mui/material";
import React from "react";

const Header = ({ darkMode, handleThemeChange }) => {
  return (
    <AppBar position="sticky" sx={{ mb: 4 }}>
      <Toolbar>
        <Typography variant="h6">STORE</Typography>
        <Switch checked={darkMode} onChange={handleThemeChange} />
      </Toolbar>
    </AppBar>
  );
};

export default Header;
