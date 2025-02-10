import React from "react";
import { AppBar, Toolbar, Typography, Container, Button } from "@mui/material";
import { Link, useLocation } from "react-router-dom";
import SearchIcon from "@mui/icons-material/Search";
import BarChartIcon from "@mui/icons-material/BarChart";

const Layout = ({ children }) => {
  const location = useLocation();

  return (
    <>
      <AppBar position="sticky" sx={{ backgroundColor: "#1976d2" }}>
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            <Link to="/" style={{ textDecoration: "none", color: "inherit" }}>
              ChEMBL Compound Dashboard
            </Link>
          </Typography>
          
          <Button
            variant={location.pathname === "/" ? "contained" : "outlined"}
            sx={{
              color: location.pathname === "/" ? "#000" : "#fff",
              backgroundColor:
                location.pathname === "/" ? "#64b5f6" : "transparent",
              borderColor: "#fff",
              "&:hover": {
                backgroundColor: "#1565c0",
                borderColor: "#fff",
              },
            }}
            component={Link}
            to="/"
            startIcon={<SearchIcon />}
          >
            Search
          </Button>
          {/* 📊 Charts Button with Icon */}
          <Button
            variant={location.pathname === "/charts" ? "contained" : "outlined"}
            sx={{
              marginLeft: 2,
              color: location.pathname === "/charts" ? "#000" : "#fff",
              backgroundColor:
                location.pathname === "/charts" ? "#64b5f6" : "transparent",
              borderColor: "#fff",
              "&:hover": {
                backgroundColor: "#1565c0",
                borderColor: "#fff",
              },
            }}
            component={Link}
            to="/charts"
            startIcon={<BarChartIcon />}
          >
            Charts
          </Button>
        </Toolbar>
      </AppBar>

      <Container sx={{ marginTop: 3, paddingBottom: 5 }}>{children}</Container>
    </>
  );
};

export default Layout;
