import React from 'react';
import { Paper, Box, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';

// Create a more modern styled card component
const StyledCard = styled(Paper)(({ theme, color = 'primary' }) => ({
  backgroundColor: theme.palette.background.paper,
  padding: theme.spacing(3),
  borderRadius: theme.shape.borderRadius * 2,
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
  position: 'relative',
  overflow: 'hidden',
  border: '1px solid rgba(0, 0, 0, 0.05)',
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
  },
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '4px',
    backgroundColor: theme.palette[color].main,
  }
}));

const IconWrapper = styled(Box)(({ theme, color = 'primary' }) => ({
  fontSize: '3rem',
  color: theme.palette[color].main,
  marginBottom: theme.spacing(2),
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: theme.spacing(1.5),
  borderRadius: '50%',
  backgroundColor: `${theme.palette[color].light}30`,
}));

const DashboardCard = ({ title, value, icon, color = 'primary' }) => {
  return (
    <StyledCard elevation={0} color={color}>
      <IconWrapper color={color}>{icon}</IconWrapper>
      <Typography variant="h6" component="div" gutterBottom sx={{ fontWeight: 500 }}>
        {title}
      </Typography>
      <Typography 
        variant="h4" 
        component="div" 
        color="text.primary" 
        sx={{ fontWeight: 600 }}
      >
        {value}
      </Typography>
    </StyledCard>
  );
};

export default DashboardCard;