import React, { useState } from 'react';
import { useLanguage, languages } from '../../contexts/LanguageContext';
import { IconButton, Menu, MenuItem, ListItemText, Typography } from '@mui/material';
import TranslateIcon from '@mui/icons-material/Translate';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';

const LanguageSelector = () => {
  const { language, changeLanguage } = useLanguage();
  const [anchorEl, setAnchorEl] = useState(null);
  
  const handleOpenMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  const handleLanguageChange = (code) => {
    changeLanguage(code);
    handleCloseMenu();
  };

  // Find current language name
  const currentLanguage = languages.find(lang => lang.code === language);

  return (
    <>
      <IconButton 
        onClick={handleOpenMenu} 
        color="inherit" 
        aria-label="select language"
        sx={{ 
          display: 'flex', 
          alignItems: 'center',
          borderRadius: '8px',
          padding: '4px 8px',
          '&:hover': {
            backgroundColor: 'rgba(106, 27, 154, 0.04)'
          }
        }}
      >
        <TranslateIcon sx={{ color: '#6a1b9a' }} />
        <Typography 
          variant="body2" 
          sx={{ 
            ml: 0.5, 
            display: { xs: 'none', sm: 'block' },
            fontWeight: 500,
            color: '#333333'
          }}
        >
          {currentLanguage?.name}
        </Typography>
        <KeyboardArrowDownIcon fontSize="small" sx={{ color: '#6a1b9a' }} />
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleCloseMenu}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        sx={{ 
          '& .MuiPaper-root': {
            borderRadius: '12px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
            minWidth: '150px'
          }
        }}
      >
        {languages.map((lang) => (
          <MenuItem 
            key={lang.code} 
            onClick={() => handleLanguageChange(lang.code)}
            selected={lang.code === language}
            sx={{ 
              py: 1.5,
              '&.Mui-selected': {
                backgroundColor: 'rgba(106, 27, 154, 0.08)',
              },
              '&:hover': {
                backgroundColor: 'rgba(106, 27, 154, 0.04)'
              }
            }}
          >
            <ListItemText 
              primary={lang.name} 
              primaryTypographyProps={{ 
                fontWeight: lang.code === language ? 600 : 500,
                color: lang.code === language ? '#6a1b9a' : '#333333'
              }} 
            />
          </MenuItem>
        ))}
      </Menu>
    </>
  );
};

export default LanguageSelector;