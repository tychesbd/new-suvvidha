import React, { useState } from 'react';
import PropTypes from 'prop-types';
import theme from './theme';

// Import icon from Material UI
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';

const {  colors, spacing, borderRadius, createNeumorphicStyle } = theme;
/**
 * Neumorphic SearchBar Component
 * A soft, extruded search input with subtle shadows and monochromatic styling
 */
const SearchBar = ({
  placeholder = 'Search...',
  value: initialValue = '',
  onChange,
  onSearch,
  width = '100%',
  style,
  className,
  ...props
}) => {
  const [value, setValue] = useState(initialValue);
  const [isFocused, setIsFocused] = useState(false);

  const handleChange = (e) => {
    const newValue = e.target.value;
    setValue(newValue);
    if (onChange) {
      onChange(newValue);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && onSearch) {
      onSearch(value);
    }
  };

  const handleClear = () => {
    setValue('');
    if (onChange) {
      onChange('');
    }
    if (onSearch) {
      onSearch('');
    }
  };

  const containerStyles = {
    position: 'relative',
    width,
    ...createNeumorphicStyle(isFocused ? 'pressed' : 'flat'),
    borderRadius: borderRadius.medium,
    display: 'flex',
    alignItems: 'center',
    padding: `${spacing.sm}px ${spacing.md}px`,
    transition: 'all 0.3s ease',
    ...style,
  };

  const inputStyles = {
    flex: 1,
    border: 'none',
    outline: 'none',
    background: 'transparent',
    color: colors.text.primary,
    fontSize: '1rem',
    padding: `${spacing.xs}px ${spacing.sm}px`,
    width: '100%',
  };

  const iconStyles = {
    color: colors.text.secondary,
    marginRight: spacing.sm,
    fontSize: '1.25rem',
  };

  const clearButtonStyles = {
    background: 'transparent',
    border: 'none',
    cursor: 'pointer',
    display: value ? 'flex' : 'none',
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xs,
    borderRadius: '50%',
    color: colors.text.secondary,
    transition: 'all 0.2s ease',
    '&:hover': {
      color: colors.text.primary,
      background: colors.background,
    },
  };

  return (
    <div 
      style={containerStyles} 
      className={`neumorphic-searchbar ${className || ''}`}
      {...props}
    >
      <SearchIcon style={iconStyles} />
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        style={inputStyles}
      />
      <button 
        type="button" 
        onClick={handleClear}
        style={clearButtonStyles}
        aria-label="Clear search"
      >
        <ClearIcon style={{ fontSize: '1rem' }} />
      </button>
    </div>
  );
};

SearchBar.propTypes = {
  placeholder: PropTypes.string,
  value: PropTypes.string,
  onChange: PropTypes.func,
  onSearch: PropTypes.func,
  width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  style: PropTypes.object,
  className: PropTypes.string,
};

export default SearchBar;