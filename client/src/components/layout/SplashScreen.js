import React, { useEffect, useState } from 'react';
import { Box, Typography, Container, CircularProgress } from '@mui/material';
import { keyframes } from '@emotion/react';
import { styled } from '@mui/material/styles';

// Define animations
const fadeIn = keyframes`
  from { opacity: 0; transform: scale(0.9); }
  to { opacity: 1; transform: scale(1); }
`;

const fadeOut = keyframes`
  from { opacity: 1; }
  to { opacity: 0; }
`;

const pulse = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
`;

// Styled components
const AnimatedContainer = styled(Container)(({ theme, isExiting }) => ({
  height: '100vh',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  background: `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.main} 50%, ${theme.palette.secondary.main} 100%)`,
  animation: isExiting
    ? `${fadeOut} 0.5s ease-out forwards`
    : `${fadeIn} 0.8s ease-out forwards`,
  overflow: 'hidden',
}));

const LogoBox = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(4),
  animation: `${pulse} 2s infinite ease-in-out`,
}));

const WelcomeText = styled(Typography)(({ theme }) => ({
  color: '#ffffff',
  textAlign: 'center',
  fontWeight: 700,
  textShadow: '0 2px 10px rgba(0,0,0,0.2)',
  marginBottom: theme.spacing(3),
}));

const SplashScreen = ({ onFinished }) => {
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    // Start exit animation after 1.5 seconds
    const exitTimer = setTimeout(() => {
      setIsExiting(true);
    }, 1500);

    // Call onFinished after 2 seconds (total display time)
    const finishTimer = setTimeout(() => {
      if (onFinished) onFinished();
    }, 2000);

    return () => {
      clearTimeout(exitTimer);
      clearTimeout(finishTimer);
    };
  }, [onFinished]);

  return (
    <AnimatedContainer maxWidth="xl" isExiting={isExiting}>
      <LogoBox>
        <Box
          component="img"
          src="/logo1.png"
          alt="Suvvidha Logo"
          sx={{ width: { xs: 120, sm: 150, md: 180 }, height: 'auto' }}
        />
      </LogoBox>
      
      <WelcomeText variant="h2" component="h1">
        Welcome To Suvvidha
      </WelcomeText>
      
      <CircularProgress 
        size={40} 
        thickness={4} 
        sx={{ 
          color: '#ffffff',
          opacity: 0.8,
        }} 
      />
    </AnimatedContainer>
  );
};

export default SplashScreen;