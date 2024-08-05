import React from "react";
import { Link } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  List,
  ListItem,
  ListItemText,
  Drawer,
  Typography,
  Box,
  IconButton,
  Button,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { useNavigate } from "react-router-dom";

function Menu({ open, drawerWidth, handleDrawerToggle }) {
  const navigate = useNavigate();

  return (
    <>
      <AppBar
        position="fixed"
        sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
        color="primary"
      >
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerToggle}
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div">
            FinanceTrack
          </Typography>
        </Toolbar>
      </AppBar>
      <Drawer
        variant="persistent"
        open={open}
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: {
            width: drawerWidth,
            boxSizing: "border-box",
            mt: 8,
            display: "flex",
            flexDirection: "column",
            height: "calc(100% - 64px)",
            justifyContent: "space-between",
            zIndex: 1,
          },
        }}
      >
        <List>
          {[
            "Dashboard",
            "Accounts",
            "Income",
            "Expenses",
            "Transfer",
            "Budget",
            "Goals",
          ].map((text, index) => (
            <ListItem
              button
              key={text}
              component={Link}
              to={`/${text.toLowerCase()}`}
            >
              <ListItemText primary={text} />
            </ListItem>
          ))}
        </List>
        <Box sx={{ p: 2, alignSelf: "flex-end", width: "100%" }}>
          <Button
            variant="contained"
            color="primary"
            fullWidth
            onClick={() => {
              navigate("/login");
            }}
          >
            Logout
          </Button>
        </Box>
      </Drawer>
    </>
  );
}

export default Menu;
