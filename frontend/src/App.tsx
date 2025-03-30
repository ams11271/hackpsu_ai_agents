import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Container } from '@mui/material';

// Components
import Navbar from './components/Navbar';

// Pages
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import AgreementGenerator from './pages/AgreementGenerator';
import ClauseManager from './pages/ClauseManager';
import ChatLicenseGenerator from './pages/ChatLicenseGenerator';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Navbar />
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/generator" element={<AgreementGenerator />} />
            <Route path="/clauses" element={<ClauseManager />} />
            <Route path="/chatbot" element={<ChatLicenseGenerator />} />
          </Routes>
        </Container>
      </Router>
    </ThemeProvider>
  );
}

export default App;
