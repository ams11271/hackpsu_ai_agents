import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  AppBar,
  Box,
  Toolbar,
  Typography,
  Button,
  Link,
} from '@mui/material';

const Navbar = () => {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            <Link
              component={RouterLink}
              to="/"
              color="inherit"
              underline="none"
            >
              License Generator
            </Link>
          </Typography>
          <Button color="inherit" component={RouterLink} to="/dashboard">
            Dashboard
          </Button>
          <Button color="inherit" component={RouterLink} to="/generator">
            Generate
          </Button>
          <Button color="inherit" component={RouterLink} to="/clauses">
            Clauses
          </Button>
          <Button color="inherit" component={RouterLink} to="/chatbot">
            AI Chatbot
          </Button>
        </Toolbar>
      </AppBar>
    </Box>
  );
};

export default Navbar; 