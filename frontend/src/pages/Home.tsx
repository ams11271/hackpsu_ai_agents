import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Container,
  Typography,
  Paper,
} from '@mui/material';
import DescriptionIcon from '@mui/icons-material/Description';
import SecurityIcon from '@mui/icons-material/Security';
import SpeedIcon from '@mui/icons-material/Speed';
import { GridContainer, GridItem } from '../components/GridWrapper';

const Home = () => {
  const navigate = useNavigate();

  return (
    <Container maxWidth="lg">
      <Box
        sx={{
          mt: 8,
          mb: 4,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Typography
          component="h1"
          variant="h2"
          align="center"
          color="text.primary"
          gutterBottom
        >
          License Agreement Generator
        </Typography>
        <Typography variant="h5" align="center" color="text.secondary" paragraph>
          Create professional license agreements quickly and easily.
          Customize templates, manage clauses, and generate agreements
          that protect your intellectual property.
        </Typography>
        <Box sx={{ mt: 4 }}>
          <Button
            variant="contained"
            size="large"
            onClick={() => navigate('/generator')}
          >
            Create Agreement
          </Button>
        </Box>
      </Box>

      <GridContainer spacing={4} sx={{ mt: 4 }}>
        <GridItem xs={12} md={4}>
          <Paper
            sx={{
              p: 3,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              height: '100%',
            }}
          >
            <DescriptionIcon sx={{ fontSize: 48, mb: 2, color: 'primary.main' }} />
            <Typography variant="h5" component="h2" gutterBottom>
              Customizable Templates
            </Typography>
            <Typography align="center" color="text.secondary">
              Choose from a variety of pre-built templates or create your own.
              Customize every aspect of your license agreements.
            </Typography>
          </Paper>
        </GridItem>
        <GridItem xs={12} md={4}>
          <Paper
            sx={{
              p: 3,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              height: '100%',
            }}
          >
            <SecurityIcon sx={{ fontSize: 48, mb: 2, color: 'primary.main' }} />
            <Typography variant="h5" component="h2" gutterBottom>
              Legally Sound
            </Typography>
            <Typography align="center" color="text.secondary">
              Our templates are crafted by legal experts to ensure your
              agreements are comprehensive and legally binding.
            </Typography>
          </Paper>
        </GridItem>
        <GridItem xs={12} md={4}>
          <Paper
            sx={{
              p: 3,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              height: '100%',
            }}
          >
            <SpeedIcon sx={{ fontSize: 48, mb: 2, color: 'primary.main' }} />
            <Typography variant="h5" component="h2" gutterBottom>
              Fast & Efficient
            </Typography>
            <Typography align="center" color="text.secondary">
              Generate professional license agreements in minutes, not hours.
              Save time with our streamlined process.
            </Typography>
          </Paper>
        </GridItem>
      </GridContainer>
    </Container>
  );
};

export default Home; 