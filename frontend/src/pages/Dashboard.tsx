import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Paper,
  Typography,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';
import { GridContainer, GridItem } from '../components/GridWrapper';

const Dashboard = () => {
  const navigate = useNavigate();

  // Mock data for recent agreements
  const recentAgreements = [
    { id: 1, title: 'Software License Agreement v1.0', date: '2024-03-15' },
    { id: 2, title: 'Enterprise License Agreement', date: '2024-03-14' },
    { id: 3, title: 'SaaS License Agreement', date: '2024-03-13' },
  ];

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <GridContainer spacing={3}>
        {/* Welcome Section */}
        <GridItem xs={12}>
          <Paper sx={{ p: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box>
              <Typography variant="h4" gutterBottom>
                Welcome to Your Dashboard
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Manage your license agreements and templates
              </Typography>
            </Box>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => navigate('/generator')}
            >
              New Agreement
            </Button>
          </Paper>
        </GridItem>

        {/* Quick Stats */}
        <GridItem xs={12} md={4}>
          <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', height: 140 }}>
            <Typography variant="h6" gutterBottom>
              Total Agreements
            </Typography>
            <Typography component="p" variant="h3">
              15
            </Typography>
          </Paper>
        </GridItem>
        <GridItem xs={12} md={4}>
          <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', height: 140 }}>
            <Typography variant="h6" gutterBottom>
              Active Templates
            </Typography>
            <Typography component="p" variant="h3">
              5
            </Typography>
          </Paper>
        </GridItem>
        <GridItem xs={12} md={4}>
          <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', height: 140 }}>
            <Typography variant="h6" gutterBottom>
              Custom Clauses
            </Typography>
            <Typography component="p" variant="h3">
              24
            </Typography>
          </Paper>
        </GridItem>

        {/* Recent Agreements */}
        <GridItem xs={12}>
          <Paper sx={{ p: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6">Recent Agreements</Typography>
              <Button
                size="small"
                onClick={() => navigate('/generator')}
              >
                View All
              </Button>
            </Box>
            <List>
              {recentAgreements.map((agreement) => (
                <ListItem key={agreement.id} divider>
                  <ListItemText
                    primary={agreement.title}
                    secondary={`Created: ${agreement.date}`}
                  />
                  <ListItemSecondaryAction>
                    <IconButton edge="end" aria-label="edit" sx={{ mr: 1 }}>
                      <EditIcon />
                    </IconButton>
                    <IconButton edge="end" aria-label="delete">
                      <DeleteIcon />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
              ))}
            </List>
          </Paper>
        </GridItem>
      </GridContainer>
    </Container>
  );
};

export default Dashboard; 