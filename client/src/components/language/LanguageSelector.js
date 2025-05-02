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
        sx={{ display: 'flex', alignItems: 'center' }}
      >
        <TranslateIcon />
        <Typography variant="body2" sx={{ ml: 0.5, display: { xs: 'none', sm: 'block' } }}>
          {currentLanguage?.name}
        </Typography>
        <KeyboardArrowDownIcon fontSize="small" />
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
      >
        {languages.map((lang) => (
          <MenuItem 
            key={lang.code} 
            onClick={() => handleLanguageChange(lang.code)}
            selected={lang.code === language}
          >
            <ListItemText primary={lang.name} />
          </MenuItem>
        ))}
      </Menu>
    </>
  );
};

export default LanguageSelector;