import React, { useEffect, useState } from 'react';
import { Box, Typography, Container, CircularProgress, Grid, Paper } from '@mui/material';
import { keyframes } from '@emotion/react';
import { styled } from '@mui/material/styles';

// Icons for services
import CleaningServicesIcon from '@mui/icons-material/CleaningServices';
import PlumbingIcon from '@mui/icons-material/Plumbing';
import ElectricalServicesIcon from '@mui/icons-material/ElectricalServices';
import FormatPaintIcon from '@mui/icons-material/FormatPaint';

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

const slideInFromLeft = keyframes`
  from { opacity: 0; transform: translateX(-50px); }
  to { opacity: 1; transform: translateX(0); }
`;

const slideInFromRight = keyframes`
  from { opacity: 0; transform: translateX(50px); }
  to { opacity: 1; transform: translateX(0); }
`;

const slideInFromBottom = keyframes`
  from { opacity: 0; transform: translateY(30px); }
  to { opacity: 1; transform: translateY(0); }
`;

// Styled components
const AnimatedContainer = styled(Container)(({ theme, isExiting }) => ({
  height: '100vh',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  background: `linear-gradient(135deg, #f5f7fa 0%, #e4ecfb 50%, #f8f0ff 100%)`,
  animation: isExiting
    ? `${fadeOut} 0.8s ease-out forwards`
    : `${fadeIn} 0.8s ease-out forwards`,
  overflow: 'hidden',
}));

const LogoBox = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(3),
  animation: `${pulse} 2s infinite ease-in-out`,
}));

const WelcomeText = styled(Typography)(({ theme }) => ({
  color: theme.palette.primary.main,
  textAlign: 'center',
  fontWeight: 700,
  marginBottom: theme.spacing(2),
}));

const SubText = styled(Typography)(({ theme, delay }) => ({
  color: theme.palette.text.primary,
  textAlign: 'center',
  marginBottom: theme.spacing(3),
  animation: `${slideInFromBottom} 0.8s ease-out forwards`,
  animationDelay: `${delay}s`,
  opacity: 0,
}));

const ServiceCard = styled(Paper)(({ theme, delay, fromLeft }) => ({
  padding: theme.spacing(2),
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  borderRadius: 12,
  boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
  height: '100%',
  animation: fromLeft 
    ? `${slideInFromLeft} 0.8s ease-out forwards`
    : `${slideInFromRight} 0.8s ease-out forwards`,
  animationDelay: `${delay}s`,
  opacity: 0,
}));

const SplashScreen = ({ onFinished }) => {
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    // Start exit animation after 4.2 seconds (5 seconds total with animation time)
    const exitTimer = setTimeout(() => {
      setIsExiting(true);
    }, 4200);

    // Call onFinished after 5 seconds (total display time)
    const finishTimer = setTimeout(() => {
      if (onFinished) onFinished();
    }, 5000);

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
          sx={{ width: { xs: 150, sm: 180, md: 200 }, height: 'auto' }}
        />
      </LogoBox>
      
      <WelcomeText variant="h2" component="h1">
        Welcome To Suvvidha
      </WelcomeText>
      
      <SubText variant="h6" delay={0.3}>
        Your One-Stop Solution for All Services
      </SubText>
      
      <SubText variant="body1" delay={0.6}>
        Quality services at your fingertips - anytime, anywhere
      </SubText>
      <CircularProgress 
        size={40} 
        thickness={4} 
        sx={{ 
          color: 'primary.main',
          opacity: 0.8,
        }} 
      />
    </AnimatedContainer>
  );
};

export default SplashScreen;