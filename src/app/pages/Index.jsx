'use client'
import React from 'react';
import { Box, Container, Typography, Card, CardContent, Button, Grid } from '@mui/material';
import { Chat, Support, QuestionAnswer } from '@mui/icons-material';
import ChatWidget from '@/components/ChatWidget';


const Index = () => {
  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Box textAlign="center" mb={6}>
          <Typography variant="h2" component="h1" gutterBottom color="primary" fontWeight="bold">
            AI Support Chat System
          </Typography>
          <Typography variant="h5" color="text.secondary" mb={4}>
            Experience intelligent customer support powered by Langflow and OpenAI
          </Typography>
        </Box>

        <Grid container spacing={4} mb={6}>
          <Grid item xs={12} md={4}>
            <Card sx={{ height: '100%', transition: 'transform 0.2s', '&:hover': { transform: 'translateY(-4px)' } }}>
              <CardContent sx={{ textAlign: 'center', p: 4 }}>
                <Chat sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
                <Typography variant="h6" gutterBottom>
                  Intelligent Chat
                </Typography>
                <Typography color="text.secondary">
                  AI-powered conversations using advanced language models
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card sx={{ height: '100%', transition: 'transform 0.2s', '&:hover': { transform: 'translateY(-4px)' } }}>
              <CardContent sx={{ textAlign: 'center', p: 4 }}>
                <Support sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
                <Typography variant="h6" gutterBottom>
                  24/7 Support
                </Typography>
                <Typography color="text.secondary">
                  Always available assistance for your questions and concerns
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        <Box textAlign="center">
          <Typography variant="h4" gutterBottom color="primary">
            Try the Chat Widget
          </Typography>
          <Typography variant="body1" color="text.secondary" mb={4}>
            Click the chat icon in the bottom right corner to start a conversation
          </Typography>

        </Box>
      </Container>
      <ChatWidget />
    </Box>
  );
};

export default Index;