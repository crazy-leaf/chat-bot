'use client'
import React, { useState, useRef, useEffect } from 'react';
import {
  Box,
  Fab,
  Paper,
  Typography,
  TextField,
  IconButton,
  List,
  ListItem,
  Avatar,
  Collapse,
  CircularProgress,
  Chip,
  Divider
} from '@mui/material';
import {
  Chat as ChatIcon,
  Close as CloseIcon,
  Send as SendIcon,
  SmartToy,
  Person,
  Minimize
} from '@mui/icons-material';
import { sendChatMessage } from '../api/chat';

const ChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hello! I'm your AI assistant. How can I help you today?",
      sender: 'bot',
      timestamp: new Date().toLocaleTimeString()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState('connecting');
  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const savedMessages = localStorage.getItem('chatHistory');
    if (savedMessages) {
      setMessages(JSON.parse(savedMessages));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('chatHistory', JSON.stringify(messages));
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage = {
      id: Date.now(),
      text: inputValue,
      sender: 'user',
      timestamp: new Date().toLocaleTimeString()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);
    setConnectionStatus('connecting');

    try {
      const result = await sendChatMessage(inputValue);
      
      const botMessage = {
        id: Date.now() + 1,
        text: result.message,
        sender: 'bot',
        timestamp: new Date().toLocaleTimeString()
      };

      setMessages(prev => [...prev, botMessage]);
      setConnectionStatus(result.success ? 'connected' : 'error');
    } catch (error) {
      console.error('Error sending message:', error);
      
      const errorMessage = {
        id: Date.now() + 1,
        text: "I'm currently having trouble connecting to the AI service. Please try again later.",
        sender: 'bot',
        timestamp: new Date().toLocaleTimeString()
      };

      setMessages(prev => [...prev, errorMessage]);
      setConnectionStatus('error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const clearHistory = () => {
    setMessages([{
      id: 1,
      text: "Hello! I'm your AI assistant. How can I help you today?",
      sender: 'bot',
      timestamp: new Date().toLocaleTimeString()
    }]);
    localStorage.removeItem('chatHistory');
  };

  const getStatusColor = () => {
    switch (connectionStatus) {
      case 'connected': return 'success';
      case 'error': return 'error';
      default: return 'warning';
    }
  };

  const getStatusText = () => {
    switch (connectionStatus) {
      case 'connected': return 'Connected to Langflow';
      case 'error': return 'Connection Error';
      default: return 'Connecting...';
    }
  };

  if (!isOpen) {
    return (
      <Fab
        color="primary"
        sx={{
          position: 'fixed',
          bottom: 24,
          right: 24,
          zIndex: 1000,
          width: 64,
          height: 64,
          boxShadow: 4,
          '&:hover': {
            transform: 'scale(1.1)',
            boxShadow: 6
          },
          transition: 'all 0.2s ease-in-out'
        }}
        onClick={() => setIsOpen(true)}
      >
        <ChatIcon sx={{ fontSize: 28 }} />
      </Fab>
    );
  }

  return (
    <Paper
      elevation={8}
      sx={{
        position: 'fixed',
        bottom: 24,
        right: 24,
        width: { xs: 320, sm: 380 },
        height: isMinimized ? 60 : 500,
        zIndex: 1000,
        display: 'flex',
        flexDirection: 'column',
        borderRadius: 2,
        overflow: 'hidden',
        transition: 'height 0.3s ease-in-out'
      }}
    >
      <Box
        sx={{
          bgcolor: 'primary.main',
          color: 'white',
          p: 2,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexShrink: 0
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <SmartToy />
          <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
            AI Assistant
          </Typography>
        </Box>
        <Box>
          <IconButton 
            size="small" 
            sx={{ color: 'white', mr: 1 }}
            onClick={() => setIsMinimized(!isMinimized)}
          >
            <Minimize />
          </IconButton>
          <IconButton 
            size="small" 
            sx={{ color: 'white' }}
            onClick={() => setIsOpen(false)}
          >
            <CloseIcon />
          </IconButton>
        </Box>
      </Box>

      <Collapse in={!isMinimized}>
        <Box sx={{ 
          p: 1, 
          bgcolor: 'grey.50', 
          borderBottom: 1, 
          borderColor: 'grey.200',
          flexShrink: 0
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 1 }}>
            <Chip 
              label={getStatusText()}
              size="small" 
              color={getStatusColor()}
              variant="outlined"
            />
            <Typography variant="caption" color="text.secondary">
              Langflow API Integration
            </Typography>
          </Box>
        </Box>

        {/* Messages container with explicit height and scrolling */}
        <Box
          ref={messagesContainerRef}
          sx={{
            height: 'calc(100% - 160px)', // Explicit height calculation
            maxHeight: '300px',
            overflowY: 'scroll',
            overflowX: 'hidden',
            bgcolor: 'grey.50',
            p: 1,
            // Force scrollbar to always be visible
            '&::-webkit-scrollbar': {
              width: '8px',
              display: 'block'
            },
            '&::-webkit-scrollbar-track': {
              background: '#f1f1f1',
              borderRadius: '4px',
            },
            '&::-webkit-scrollbar-thumb': {
              background: '#888',
              borderRadius: '4px',
              '&:hover': {
                background: '#555',
              },
            },
            // Firefox
            scrollbarWidth: 'auto',
            scrollbarColor: '#888 #f1f1f1',
          }}
        >
          <List sx={{ p: 0 }}>
            {messages.map((message) => (
              <ListItem
                key={message.id}
                sx={{
                  display: 'flex',
                  justifyContent: message.sender === 'user' ? 'flex-end' : 'flex-start',
                  p: 0.5,
                  alignItems: 'flex-start'
                }}
              >
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: 1,
                    maxWidth: '85%',
                    flexDirection: message.sender === 'user' ? 'row-reverse' : 'row'
                  }}
                >
                  <Avatar
                    sx={{
                      width: 32,
                      height: 32,
                      bgcolor: message.sender === 'user' ? 'primary.main' : 'secondary.main',
                      flexShrink: 0
                    }}
                  >
                    {message.sender === 'user' ? <Person sx={{ fontSize: 18 }} /> : <SmartToy sx={{ fontSize: 18 }} />}
                  </Avatar>
                  <Box sx={{ minWidth: 0 }}>
                    <Paper
                      elevation={1}
                      sx={{
                        p: 1.5,
                        bgcolor: message.sender === 'user' ? 'primary.main' : 'white',
                        color: message.sender === 'user' ? 'white' : 'text.primary',
                        borderRadius: 2,
                        maxWidth: '100%',
                        wordWrap: 'break-word',
                        overflowWrap: 'break-word'
                      }}
                    >
                      <Typography variant="body2" sx={{ 
                        wordBreak: 'break-word',
                        whiteSpace: 'pre-wrap'
                      }}>
                        {message.text}
                      </Typography>
                    </Paper>
                    <Typography 
                      variant="caption" 
                      color="text.secondary" 
                      sx={{ 
                        display: 'block', 
                        mt: 0.5,
                        textAlign: message.sender === 'user' ? 'right' : 'left'
                      }}
                    >
                      {message.timestamp}
                    </Typography>
                  </Box>
                </Box>
              </ListItem>
            ))}
            {isLoading && (
              <ListItem sx={{ justifyContent: 'flex-start', p: 0.5 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Avatar sx={{ width: 32, height: 32, bgcolor: 'secondary.main' }}>
                    <SmartToy sx={{ fontSize: 18 }} />
                  </Avatar>
                  <Paper elevation={1} sx={{ p: 1.5, borderRadius: 2 }}>
                    <CircularProgress size={16} />
                    <Typography variant="body2" component="span" sx={{ ml: 1 }}>
                      Thinking...
                    </Typography>
                  </Paper>
                </Box>
              </ListItem>
            )}
          </List>
          {/* Scroll anchor */}
          <div ref={messagesEndRef} style={{ height: '1px' }} />
        </Box>

        <Divider />
        <Box sx={{ 
          p: 1, 
          bgcolor: 'grey.50', 
          fontSize: '0.75rem',
          flexShrink: 0
        }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Typography variant="caption" color="text.secondary">
              {messages.length - 1} messages stored locally
            </Typography>
            <Typography 
              variant="caption" 
              color="primary" 
              sx={{ cursor: 'pointer', textDecoration: 'underline' }}
              onClick={clearHistory}
            >
              Clear history
            </Typography>
          </Box>
        </Box>
        <Box sx={{ 
          p: 2, 
          bgcolor: 'white', 
          borderTop: 1, 
          borderColor: 'grey.200',
          flexShrink: 0
        }}>
          <Box sx={{ display: 'flex', gap: 1, alignItems: 'flex-end' }}>
            <TextField
              fullWidth
              multiline
              maxRows={3}
              placeholder="Type your message..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              variant="outlined"
              size="small"
              disabled={isLoading}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2
                }
              }}
            />
            <IconButton
              color="primary"
              onClick={handleSendMessage}
              disabled={!inputValue.trim() || isLoading}
              sx={{
                bgcolor: 'primary.main',
                color: 'white',
                '&:hover': {
                  bgcolor: 'primary.dark'
                },
                '&:disabled': {
                  bgcolor: 'grey.300'
                }
              }}
            >
              <SendIcon />
            </IconButton>
          </Box>
        </Box>
      </Collapse>
    </Paper>
  );
};

export default ChatWidget;