import React, { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import theme from './theme';

const {  colors, borderRadius, spacing, createNeumorphicStyle } = theme;

/**
 * Neumorphic Select Component
 * A soft, extruded dropdown select with subtle shadows for form inputs
 */
const Select = ({
  label,
  value,
  onChange,
  options = [],
  placeholder = 'Select an option',
  disabled = false,
  fullWidth = false,
  error = false,
  helperText,
  style,
  className,
  ...props
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const selectRef = useRef(null);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        selectRef.current &&
        !selectRef.current.contains(event.target) &&
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Container styles
  const containerStyles = {
    display: 'flex',
    flexDirection: 'column',
    position: 'relative',
    width: fullWidth ? '100%' : '240px',
    marginBottom: spacing.md,
  };

  // Label styles
  const labelStyles = {
    marginBottom: spacing.xs,
    fontSize: '0.875rem',
    fontWeight: 500,
    color: error ? colors.error.main : colors.text.primary,
  };

  // Select wrapper styles with neumorphic effect
  const selectWrapperStyles = {
    ...createNeumorphicStyle('pressed', colors.background),
    borderRadius: borderRadius.medium,
    padding: `${spacing.xs} ${spacing.sm}`,
    transition: 'all 0.3s ease',
    border: error ? `1px solid ${colors.error.main}` : 'none',
    cursor: disabled ? 'not-allowed' : 'pointer',
    opacity: disabled ? 0.7 : 1,
  };

  // Selected value display styles
  const selectedDisplayStyles = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: spacing.sm,
    color: value ? colors.text.primary : colors.text.secondary,
  };

  // Dropdown styles
  const dropdownStyles = {
    position: 'absolute',
    top: 'calc(100% + 8px)',
    left: 0,
    width: '100%',
    maxHeight: '200px',
    overflowY: 'auto',
    zIndex: 10,
    ...createNeumorphicStyle('flat', colors.background),
    borderRadius: borderRadius.medium,
    display: isOpen ? 'block' : 'none',
  };

  // Option styles
  const optionStyles = (isSelected) => ({
    padding: spacing.sm,
    cursor: 'pointer',
    backgroundColor: isSelected ? colors.primary.light : 'transparent',
    color: isSelected ? '#fff' : colors.text.primary,
    transition: 'background-color 0.2s ease',
    '&:hover': {
      backgroundColor: isSelected ? colors.primary.light : colors.primary.light + '20',
    },
  });

  // Helper text styles
  const helperTextStyles = {
    fontSize: '0.75rem',
    marginTop: spacing.xs,
    color: error ? colors.error.main : colors.text.secondary,
  };

  // Arrow icon styles
  const arrowIconStyles = {
    fontSize: '0.75rem',
    transition: 'transform 0.3s ease',
    transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
  };

  // Find selected option label
  const selectedOption = options.find(option => option.value === value);
  const displayText = selectedOption ? selectedOption.label : placeholder;

  const handleSelect = (optionValue) => {
    if (disabled) return;
    onChange(optionValue);
    setIsOpen(false);
  };

  const toggleDropdown = () => {
    if (disabled) return;
    setIsOpen(!isOpen);
  };

  return (
    <div style={{ ...containerStyles, ...style }} className={className} {...props}>
      {label && <label style={labelStyles}>{label}</label>}
      <div
        ref={selectRef}
        style={selectWrapperStyles}
        onClick={toggleDropdown}
      >
        <div style={selectedDisplayStyles}>
          <span>{displayText}</span>
          <span style={arrowIconStyles}>▼</span>
        </div>
      </div>

      <div ref={dropdownRef} style={dropdownStyles}>
        {options.map((option) => (
          <div
            key={option.value}
            style={optionStyles(option.value === value)}
            onClick={() => handleSelect(option.value)}
          >
            {option.label}
          </div>
        ))}
      </div>

      {helperText && <div style={helperTextStyles}>{helperText}</div>}
    </div>
  );
};

Select.propTypes = {
  label: PropTypes.string,
  value: PropTypes.any,
  onChange: PropTypes.func.isRequired,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.any.isRequired,
      label: PropTypes.node.isRequired,
    })
  ).isRequired,
  placeholder: PropTypes.string,
  disabled: PropTypes.bool,
  fullWidth: PropTypes.bool,
  error: PropTypes.bool,
  helperText: PropTypes.string,
  style: PropTypes.object,
  className: PropTypes.string,
};

export default Select;