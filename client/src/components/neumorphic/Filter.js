import React, { useState } from 'react';
import PropTypes from 'prop-types';
import theme from './theme';

// Import icon from Material UI
import FilterListIcon from '@mui/icons-material/FilterList';
import CheckIcon from '@mui/icons-material/Check';

const { colors, spacing, borderRadius, createNeumorphicStyle } = theme;
/**
 * Neumorphic Filter Component
 * A soft, extruded filter dropdown with subtle shadows and monochromatic styling
 */
const Filter = ({
  options = [],
  value = [],
  onChange,
  label = 'Filter',
  multiple = true,
  style,
  className,
  ...props
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedValues, setSelectedValues] = useState(value);

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  const handleSelect = (option) => {
    let newValues;
    
    if (multiple) {
      if (selectedValues.includes(option.value)) {
        newValues = selectedValues.filter(val => val !== option.value);
      } else {
        newValues = [...selectedValues, option.value];
      }
    } else {
      newValues = [option.value];
      setIsOpen(false);
    }
    
    setSelectedValues(newValues);
    
    if (onChange) {
      onChange(newValues);
    }
  };

  const containerStyles = {
    position: 'relative',
    display: 'inline-block',
    ...style,
  };

  const buttonStyles = {
    display: 'flex',
    alignItems: 'center',
    padding: `${spacing.sm}px ${spacing.md}px`,
    borderRadius: borderRadius.medium,
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    ...createNeumorphicStyle(isOpen ? 'pressed' : 'flat'),
  };

  const iconStyles = {
    marginRight: spacing.sm,
    color: colors.text.secondary,
    fontSize: '1.25rem',
  };

  const dropdownStyles = {
    position: 'absolute',
    top: 'calc(100% + 8px)',
    left: 0,
    minWidth: '200px',
    zIndex: 100,
    display: isOpen ? 'block' : 'none',
    ...createNeumorphicStyle('flat'),
    borderRadius: borderRadius.medium,
    padding: `${spacing.sm}px 0`,
  };

  const optionStyles = (isSelected) => ({
    padding: `${spacing.sm}px ${spacing.md}px`,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    transition: 'background-color 0.2s ease',
    backgroundColor: isSelected ? colors.background : 'transparent',
    '&:hover': {
      backgroundColor: colors.background,
    },
  });

  const checkIconStyles = {
    color: colors.primary.main,
    marginLeft: spacing.md,
  };

  const selectedCount = selectedValues.length;
  const labelText = selectedCount > 0 ? `${label} (${selectedCount})` : label;

  return (
    <div 
      style={containerStyles} 
      className={`neumorphic-filter ${className || ''}`}
      {...props}
    >
      <div style={buttonStyles} onClick={handleToggle}>
        <FilterListIcon style={iconStyles} />
        <span>{labelText}</span>
      </div>
      
      <div style={dropdownStyles}>
        {options.map((option) => {
          const isSelected = selectedValues.includes(option.value);
          
          return (
            <div 
              key={option.value} 
              style={optionStyles(isSelected)}
              onClick={() => handleSelect(option)}
            >
              <span>{option.label}</span>
              {isSelected && <CheckIcon style={checkIconStyles} />}
            </div>
          );
        })}
      </div>
    </div>
  );
};

Filter.propTypes = {
  options: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      label: PropTypes.string.isRequired,
    })
  ),
  value: PropTypes.array,
  onChange: PropTypes.func,
  label: PropTypes.string,
  multiple: PropTypes.bool,
  style: PropTypes.object,
  className: PropTypes.string,
};

export default Filter;