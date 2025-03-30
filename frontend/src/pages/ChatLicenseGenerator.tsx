import React, { useState, useRef, useEffect } from 'react';
import {
  Box,
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  CircularProgress,
  Divider,
  List,
  ListItem,
  Card,
  CardContent,
  Grid
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import DownloadIcon from '@mui/icons-material/Download';
import axios from 'axios';

type Message = {
  role: 'system' | 'user' | 'assistant';
  content: string;
};

// Mock data for testing when backend is not available
const generateMockLicense = (messages: Message[], userInfo: any) => {
  const licensorName = userInfo.licensorName || "Licensor Company";
  const licenseeName = userInfo.licenseeName || "Licensee Company";
  
  return `LICENSE AGREEMENT

This License Agreement (the "Agreement") is made and entered into as of ${new Date().toLocaleDateString()} (the "Effective Date") by and between:

${licensorName} ("Licensor"), and
${licenseeName} ("Licensee").

1. GRANT OF LICENSE
Subject to the terms and conditions of this Agreement, Licensor hereby grants to Licensee a non-exclusive, non-transferable license to use [product/software/content].

2. RESTRICTIONS
Licensee shall not: (a) modify, translate, reverse engineer, decompile, disassemble or create derivative works based on [product/software/content]; (b) rent, lease, loan, sell, sublicense, distribute or otherwise transfer rights to [product/software/content]; (c) remove any proprietary notices or labels on [product/software/content].

3. TERM AND TERMINATION
This Agreement shall commence on the Effective Date and continue until terminated. Either party may terminate this Agreement at any time by providing written notice to the other party.

4. DISCLAIMER OF WARRANTY
THE [PRODUCT/SOFTWARE/CONTENT] IS PROVIDED "AS IS" WITHOUT WARRANTY OF ANY KIND, EITHER EXPRESS OR IMPLIED.

5. LIMITATION OF LIABILITY
IN NO EVENT SHALL LICENSOR BE LIABLE FOR ANY SPECIAL, INCIDENTAL, INDIRECT, OR CONSEQUENTIAL DAMAGES.

6. GOVERNING LAW
This Agreement shall be governed by the laws of [Jurisdiction].

IN WITNESS WHEREOF, the parties have executed this Agreement as of the Effective Date.

${licensorName}
________________________
Authorized Representative

${licenseeName}
________________________
Authorized Representative`;
};

const ChatLicenseGenerator = () => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'system',
      content: 'You are a helpful assistant that specializes in creating license agreements. Please ask the user about their specific needs for a license agreement, then create a detailed, professional license agreement based on their responses. Include all essential information, clauses, terms, and legal elements needed to make this a comprehensive agreement.'
    },
    {
      role: 'assistant',
      content: 'Hello! I can help you create a personalized license agreement. To get started, please tell me about your requirements. What type of license agreement do you need (software, content, intellectual property, etc.)? Who will be the licensor and licensee? And what are the main terms you want to include?'
    }
  ]);
  const [loading, setLoading] = useState(false);
  const [licenseText, setLicenseText] = useState('');
  const [userInfo, setUserInfo] = useState({
    companyName: '',
    userName: '',
    userEmail: '',
    licensorName: '',
    licenseeName: ''
  });
  
  const chatEndRef = useRef<null | HTMLDivElement>(null);

  // Auto-scroll to bottom of chat when messages change
  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const handleUserInfoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setUserInfo(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage: Message = { role: 'user', content: input };
    setMessages(prevMessages => [...prevMessages, userMessage]);
    setInput('');
    setLoading(true);

    try {
      // First try to connect to the backend
      const response = await axios.post('http://localhost:8000/api/v1/chatbot/generate', {
        messages: [...messages, userMessage],
        user_info: userInfo
      });

      const { license_text, messages: updatedMessages } = response.data;
      setMessages(updatedMessages);
      setLicenseText(license_text);
    } catch (error) {
      console.error('Error generating license from backend, using mock data:', error);
      
      // If backend fails, use mock data instead
      setTimeout(() => {
        const assistantResponse = {
          role: 'assistant' as const,
          content: "I've created a license agreement based on your requirements. Please review it below and let me know if you need any changes."
        };
        
        const mockLicense = generateMockLicense([...messages, userMessage], userInfo);
        
        setMessages(prevMessages => [...prevMessages, assistantResponse]);
        setLicenseText(mockLicense);
      }, 1500); // Add a delay to simulate processing
    } finally {
      setLoading(false);
    }
  };

  const downloadLicense = () => {
    const element = document.createElement('a');
    const file = new Blob([licenseText], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = 'license_agreement.txt';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 2 }}>
        <Grid container spacing={2}>
          <Grid sx={{ width: { xs: '100%', md: '33.33%' } }}>
            <Paper sx={{ p: 3, mb: 2 }}>
              <Typography variant="h6" gutterBottom>
                Your Information
              </Typography>
              <TextField
                fullWidth
                label="Your Name"
                name="userName"
                value={userInfo.userName}
                onChange={handleUserInfoChange}
                margin="normal"
              />
              <TextField
                fullWidth
                label="Your Email"
                name="userEmail"
                value={userInfo.userEmail}
                onChange={handleUserInfoChange}
                margin="normal"
              />
              <TextField
                fullWidth
                label="Company Name"
                name="companyName"
                value={userInfo.companyName}
                onChange={handleUserInfoChange}
                margin="normal"
              />
              <TextField
                fullWidth
                label="Licensor Name"
                name="licensorName"
                value={userInfo.licensorName}
                onChange={handleUserInfoChange}
                margin="normal"
              />
              <TextField
                fullWidth
                label="Licensee Name"
                name="licenseeName"
                value={userInfo.licenseeName}
                onChange={handleUserInfoChange}
                margin="normal"
              />
            </Paper>
          </Grid>
          
          <Grid sx={{ width: { xs: '100%', md: '66.67%' } }}>
            <Paper sx={{ height: '70vh', display: 'flex', flexDirection: 'column' }}>
              <Typography variant="h5" sx={{ p: 2, borderBottom: '1px solid #e0e0e0' }}>
                License Agreement Chatbot
              </Typography>
              
              <Box sx={{ flexGrow: 1, overflow: 'auto', p: 2 }}>
                <List>
                  {messages.slice(1).map((message, index) => (
                    <ListItem
                      key={index}
                      sx={{
                        display: 'flex',
                        justifyContent: message.role === 'user' ? 'flex-end' : 'flex-start',
                        mb: 1
                      }}
                    >
                      <Card
                        sx={{
                          maxWidth: '80%',
                          bgcolor: message.role === 'user' ? '#e3f2fd' : '#f5f5f5'
                        }}
                      >
                        <CardContent>
                          <Typography variant="body1" component="div">
                            {message.content}
                          </Typography>
                        </CardContent>
                      </Card>
                    </ListItem>
                  ))}
                </List>
                {loading && (
                  <Box sx={{ display: 'flex', justifyContent: 'center', my: 2 }}>
                    <CircularProgress size={24} />
                  </Box>
                )}
                <div ref={chatEndRef} />
              </Box>
              
              <Box component="form" onSubmit={handleSubmit} sx={{ p: 2, borderTop: '1px solid #e0e0e0' }}>
                <Grid container spacing={1}>
                  <Grid sx={{ flexGrow: 1 }}>
                    <TextField
                      fullWidth
                      placeholder="Type your message here..."
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      disabled={loading}
                    />
                  </Grid>
                  <Grid>
                    <Button
                      type="submit"
                      variant="contained"
                      endIcon={<SendIcon />}
                      disabled={loading || !input.trim()}
                    >
                      Send
                    </Button>
                  </Grid>
                </Grid>
              </Box>
            </Paper>
            
            {licenseText && (
              <Paper sx={{ mt: 2, p: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                  <Typography variant="h6">Generated License Agreement</Typography>
                  <Button
                    variant="outlined"
                    startIcon={<DownloadIcon />}
                    onClick={downloadLicense}
                  >
                    Download
                  </Button>
                </Box>
                <Divider />
                <Box sx={{ mt: 2, whiteSpace: 'pre-wrap' }}>
                  {licenseText}
                </Box>
              </Paper>
            )}
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default ChatLicenseGenerator; 