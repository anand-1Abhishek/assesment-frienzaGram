import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  IconButton,
  InputBase,
  Button,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
} from "@mui/material";
import {
  Search as SearchIcon,
  Logout as LogoutIcon,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { styled } from "@mui/material/styles";

const Search = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: theme.shape.borderRadius,
  backgroundColor: theme.palette.common.white,
  "&:hover": {
    backgroundColor: theme.palette.common.white,
  },
  marginRight: theme.spacing(2),
  width: "100%",
  [theme.breakpoints.up("sm")]: {
    marginLeft: theme.spacing(3),
    width: "auto",
  },
}));

const SearchIconWrapper = styled("div")(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: "100%",
  position: "absolute",
  pointerEvents: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: "black",
  "& .MuiInputBase-input": {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create("width"),
    width: "100%",
    [theme.breakpoints.up("md")]: {
      width: "20ch",
    },
  },
}));

const Navbar = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      try {
        const headers = {
          headers: {
            "x-auth-token": token,
          },
        };
        const response = await axios.get(
          `http://localhost:3001/api/auth/user-search?username_id=${searchQuery}`,
          headers
        );
        setSearchResults(response.data);
        setShowResults(true);
      } catch (error) {
        console.error("Search failed", error.response?.data || error.message);
      }
    }
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    if (e.target.value === "") {
      setShowResults(false);
    }
  };

  const handleResultClick = (userId) => {
    navigate(`/profile/${userId}`);
    setShowResults(false);
  };

  const handleFriendFinderClick = () => {
    if (token) {
      navigate("/dashboard");
    } else {
      navigate("/login");
    }
  };

  return (
    <AppBar position="static" className="bg-blue-600">
      <Toolbar
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        {/* Brand Name or Logo */}
        <Typography
          variant="h6"
          noWrap
          className="text-white"
          onClick={handleFriendFinderClick}
          style={{ cursor: "pointer" }}
        >
          Friend Finder
        </Typography>

        {/* Search Bar */}
        {token && (
          <div
            style={{ flexGrow: 1, display: "flex", justifyContent: "center" }}
          >
            <form
              onSubmit={handleSearch}
              style={{
                display: "flex",
                alignItems: "center",
                width: "100%",
                maxWidth: "600px",
              }}
            >
              <Search>
                <SearchIconWrapper>
                  <SearchIcon />
                </SearchIconWrapper>
                <StyledInputBase
                  placeholder="Search users…"
                  inputProps={{ "aria-label": "search" }}
                  value={searchQuery}
                  onChange={handleSearchChange}
                />
              </Search>
              <Button
                type="submit"
                variant="contained"
                className="bg-blue-500 text-white hover:bg-blue-700"
              >
                Search
              </Button>
            </form>

           
            {showResults && searchResults.length > 0 && (
              <List
                style={{
                  position: "absolute",
                  top: "100%",
                  left: 0,
                  right: 0,
                  backgroundColor: "white",
                  zIndex: 1,
                  border: "1px solid #ddd",
                  maxHeight: "200px",
                  overflowY: "auto",
                }}
              >
                {searchResults.map((user) => (
                  <ListItem
                    key={user._id}
                    button
                    onClick={() => handleResultClick(user._id)}
                    style={{ color: "black" }} 
                  >
                    <ListItemText
                      primary={user.username}
                      style={{ color: "black" }}
                    />{" "}
                    
                    <ListItemSecondaryAction>
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={() => handleResultClick(user._id)}
                      >
                        View Profile
                      </Button>
                    </ListItemSecondaryAction>
                  </ListItem>
                ))}
              </List>
            )}
          </div>
        )}

       
        {token && (
          <IconButton edge="end" color="inherit" onClick={handleLogout}>
            <LogoutIcon />
            <span className="ml-2">Logout</span>
          </IconButton>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
