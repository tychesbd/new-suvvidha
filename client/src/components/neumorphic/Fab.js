import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { colors, borderRadius, spacing, createNeumorphicStyle } from './theme';

/**
 * Neumorphic Floating Action Button Component
 * A circular button that floats above the UI with soft shadows
 */
const Fab = ({
  children,
  color = 'primary',
  size = 'medium',
  disabled = false,
  onClick,
  position = { bottom: '2rem', right: '2rem' },
  style,
  className,
  ...props
}) => {
  const [isPressed, setIsPressed] = useState(false);

  // Get color from theme
  const getColor = () => {
    if (color === 'primary') return colors.primary.main;
    if (color === 'secondary') return colors.secondary.main;
    if (color === 'success') return colors.success.main;
    if (color === 'error') return colors.error.main;
    if (color === 'warning') return colors.warning.main;
    if (color === 'info') return colors.info.main;
    return colors.background;
  };

  // Get size styles
  const getSizeStyles = () => {
    switch (size) {
      case 'small':
        return {
          width: '40px',
          height: '40px',
          fontSize: '1.25rem',
        };
      case 'large':
        return {
          width: '64px',
          height: '64px',
          fontSize: '2rem',
        };
      case 'medium':
      default:
        return {
          width: '56px',
          height: '56px',
          fontSize: '1.75rem',
        };
    }
  };

  // Base FAB styles
  const baseStyles = {
    position: 'fixed',
    ...position,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: borderRadius.full,
    border: 'none',
    outline: 'none',
    cursor: disabled ? 'not-allowed' : 'pointer',
    transition: 'all 0.2s ease-in-out',
    backgroundColor: getColor(),
    color: '#fff',
    opacity: disabled ? 0.6 : 1,
    zIndex: 1000,
    ...getSizeStyles(),
  };

  // Apply neumorphic styles
  const neumorphicStyles = {
    ...baseStyles,
    ...createNeumorphicStyle(isPressed ? 'pressed' : 'flat', getColor()),
    '&:hover': {
      transform: 'translateY(-2px)',
    },
    ...style,
  };

  const handleMouseDown = () => {
    if (!disabled) setIsPressed(true);
  };

  const handleMouseUp = () => {
    if (!disabled) setIsPressed(false);
  };

  const handleMouseLeave = () => {
    if (isPressed) setIsPressed(false);
  };

  return (
    <button
      style={neumorphicStyles}
      onClick={disabled ? undefined : onClick}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseLeave}
      className={`neumorphic-fab ${className || ''}`}
      {...props}
    >
      {children}
    </button>
  );
};

Fab.propTypes = {
  children: PropTypes.node.isRequired,
  color: PropTypes.oneOf(['primary', 'secondary', 'success', 'error', 'warning', 'info']),
  size: PropTypes.oneOf(['small', 'medium', 'large']),
  disabled: PropTypes.bool,
  onClick: PropTypes.func,
  position: PropTypes.shape({
    top: PropTypes.string,
    right: PropTypes.string,
    bottom: PropTypes.string,
    left: PropTypes.string,
  }),
  style: PropTypes.object,
  className: PropTypes.string,
};

export default Fab;
