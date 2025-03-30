import React, { useState } from 'react';
import {
  Box,
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';
import { GridContainer, GridItem } from '../components/GridWrapper';

interface Clause {
  id: number;
  title: string;
  content: string;
  category: string;
}

const ClauseManager = () => {
  const [clauses, setClauses] = useState<Clause[]>([
    {
      id: 1,
      title: 'Standard License Grant',
      content: 'Subject to the terms and conditions of this Agreement...',
      category: 'License Grant',
    },
    {
      id: 2,
      title: 'Restrictions on Use',
      content: 'Licensee shall not modify, reverse engineer...',
      category: 'Restrictions',
    },
    {
      id: 3,
      title: 'Term and Termination',
      content: 'This Agreement shall commence on the Effective Date...',
      category: 'Term',
    },
  ]);

  const [open, setOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedClause, setSelectedClause] = useState<Clause | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category: '',
  });

  const handleOpen = (clause?: Clause) => {
    if (clause) {
      setSelectedClause(clause);
      setFormData({
        title: clause.title,
        content: clause.content,
        category: clause.category,
      });
      setEditMode(true);
    } else {
      setSelectedClause(null);
      setFormData({
        title: '',
        content: '',
        category: '',
      });
      setEditMode(false);
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedClause(null);
    setEditMode(false);
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCategoryChange = (event: SelectChangeEvent) => {
    setFormData((prev) => ({
      ...prev,
      category: event.target.value,
    }));
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (editMode && selectedClause) {
      setClauses((prev) =>
        prev.map((clause) =>
          clause.id === selectedClause.id
            ? { ...clause, ...formData }
            : clause
        )
      );
    } else {
      const newClause: Clause = {
        id: Math.max(...clauses.map((c) => c.id)) + 1,
        ...formData,
      };
      setClauses((prev) => [...prev, newClause]);
    }
    handleClose();
  };

  const handleDelete = (id: number) => {
    setClauses((prev) => prev.filter((clause) => clause.id !== id));
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Paper sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h4">Clause Manager</Typography>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => handleOpen()}
            >
              Add Clause
            </Button>
          </Box>

          <List>
            {clauses.map((clause) => (
              <ListItem
                key={clause.id}
                divider
                sx={{
                  '&:hover': {
                    backgroundColor: 'action.hover',
                  },
                }}
              >
                <ListItemText
                  primary={clause.title}
                  secondary={
                    <>
                      <Typography
                        component="span"
                        variant="body2"
                        color="text.primary"
                      >
                        {clause.category}
                      </Typography>
                      {` — ${clause.content.substring(0, 100)}...`}
                    </>
                  }
                />
                <ListItemSecondaryAction>
                  <IconButton
                    edge="end"
                    aria-label="edit"
                    onClick={() => handleOpen(clause)}
                    sx={{ mr: 1 }}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    edge="end"
                    aria-label="delete"
                    onClick={() => handleDelete(clause.id)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
            ))}
          </List>
        </Paper>
      </Box>

      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogTitle>{editMode ? 'Edit Clause' : 'Add New Clause'}</DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent>
            <GridContainer spacing={2}>
              <GridItem xs={12}>
                <TextField
                  required
                  fullWidth
                  label="Title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                />
              </GridItem>
              <GridItem xs={12}>
                <FormControl fullWidth>
                  <InputLabel>Category</InputLabel>
                  <Select
                    value={formData.category}
                    label="Category"
                    onChange={handleCategoryChange}
                  >
                    <MenuItem value="License Grant">License Grant</MenuItem>
                    <MenuItem value="Restrictions">Restrictions</MenuItem>
                    <MenuItem value="Term">Term</MenuItem>
                    <MenuItem value="Payment">Payment</MenuItem>
                    <MenuItem value="Warranty">Warranty</MenuItem>
                    <MenuItem value="Liability">Liability</MenuItem>
                  </Select>
                </FormControl>
              </GridItem>
              <GridItem xs={12}>
                <TextField
                  required
                  fullWidth
                  multiline
                  rows={4}
                  label="Content"
                  name="content"
                  value={formData.content}
                  onChange={handleChange}
                />
              </GridItem>
            </GridContainer>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button type="submit" variant="contained">
              {editMode ? 'Save Changes' : 'Add Clause'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Container>
  );
};

export default ClauseManager; 