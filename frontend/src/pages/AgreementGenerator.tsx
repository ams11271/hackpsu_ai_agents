import React, { useState } from 'react';
import {
  Box,
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  SelectChangeEvent,
  Stepper,
  Step,
  StepLabel,
} from '@mui/material';
import { GridContainer, GridItem } from '../components/GridWrapper';

const steps = ['Select Template', 'Customize Details', 'Review & Generate'];

const AgreementGenerator = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState({
    templateType: '',
    title: '',
    licensor: '',
    licensee: '',
    effectiveDate: '',
    description: '',
  });

  const handleNext = () => {
    setActiveStep((prevStep) => prevStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSelectChange = (event: SelectChangeEvent) => {
    setFormData((prevData) => ({
      ...prevData,
      templateType: event.target.value,
    }));
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    // TODO: Implement agreement generation logic
    console.log('Form submitted:', formData);
  };

  const renderStepContent = (step: number) => {
    switch (step) {
      case 0:
        return (
          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel id="template-type-label">Template Type</InputLabel>
            <Select
              labelId="template-type-label"
              id="templateType"
              value={formData.templateType}
              label="Template Type"
              onChange={handleSelectChange}
            >
              <MenuItem value="software">Software License Agreement</MenuItem>
              <MenuItem value="enterprise">Enterprise License Agreement</MenuItem>
              <MenuItem value="saas">SaaS License Agreement</MenuItem>
            </Select>
          </FormControl>
        );
      case 1:
        return (
          <GridContainer spacing={2} sx={{ mt: 1 }}>
            <GridItem xs={12}>
              <TextField
                required
                fullWidth
                label="Agreement Title"
                name="title"
                value={formData.title}
                onChange={handleChange}
              />
            </GridItem>
            <GridItem xs={12} sm={6}>
              <TextField
                required
                fullWidth
                label="Licensor"
                name="licensor"
                value={formData.licensor}
                onChange={handleChange}
              />
            </GridItem>
            <GridItem xs={12} sm={6}>
              <TextField
                required
                fullWidth
                label="Licensee"
                name="licensee"
                value={formData.licensee}
                onChange={handleChange}
              />
            </GridItem>
            <GridItem xs={12}>
              <TextField
                required
                fullWidth
                type="date"
                label="Effective Date"
                name="effectiveDate"
                value={formData.effectiveDate}
                onChange={handleChange}
                InputLabelProps={{ shrink: true }}
              />
            </GridItem>
            <GridItem xs={12}>
              <TextField
                fullWidth
                multiline
                rows={4}
                label="Description"
                name="description"
                value={formData.description}
                onChange={handleChange}
              />
            </GridItem>
          </GridContainer>
        );
      case 2:
        return (
          <Box sx={{ mt: 2 }}>
            <Typography variant="h6" gutterBottom>
              Review Agreement Details
            </Typography>
            <GridContainer spacing={2}>
              <GridItem xs={12}>
                <Typography><strong>Template Type:</strong> {formData.templateType}</Typography>
              </GridItem>
              <GridItem xs={12}>
                <Typography><strong>Title:</strong> {formData.title}</Typography>
              </GridItem>
              <GridItem xs={12} sm={6}>
                <Typography><strong>Licensor:</strong> {formData.licensor}</Typography>
              </GridItem>
              <GridItem xs={12} sm={6}>
                <Typography><strong>Licensee:</strong> {formData.licensee}</Typography>
              </GridItem>
              <GridItem xs={12}>
                <Typography><strong>Effective Date:</strong> {formData.effectiveDate}</Typography>
              </GridItem>
              <GridItem xs={12}>
                <Typography><strong>Description:</strong> {formData.description}</Typography>
              </GridItem>
            </GridContainer>
          </Box>
        );
      default:
        return null;
    }
  };

  return (
    <Container maxWidth="md">
      <Paper sx={{ p: 4, mt: 4 }}>
        <Typography variant="h4" gutterBottom>
          Generate License Agreement
        </Typography>
        <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
        <form onSubmit={handleSubmit}>
          {renderStepContent(activeStep)}
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
            {activeStep !== 0 && (
              <Button onClick={handleBack} sx={{ mr: 1 }}>
                Back
              </Button>
            )}
            {activeStep === steps.length - 1 ? (
              <Button
                variant="contained"
                type="submit"
                color="primary"
              >
                Generate Agreement
              </Button>
            ) : (
              <Button
                variant="contained"
                onClick={handleNext}
                color="primary"
              >
                Next
              </Button>
            )}
          </Box>
        </form>
      </Paper>
    </Container>
  );
};

export default AgreementGenerator; 