import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { colors, borderRadius, spacing, createNeumorphicStyle } from './theme';

/**
 * Neumorphic Button Component
 * A soft, extruded button with subtle shadows and pressed effect on interaction
 */
const Button = ({
  children,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  fullWidth = false,
  onClick,
  style,
  className,
  ...props
}) => {
  const [isPressed, setIsPressed] = useState(false);

  // Determine color based on variant
  const getColor = () => {
    if (variant === 'primary') return colors.primary.main;
    if (variant === 'secondary') return colors.secondary.main;
    if (variant === 'success') return colors.success.main;
    if (variant === 'error') return colors.error.main;
    if (variant === 'warning') return colors.warning.main;
    if (variant === 'info') return colors.info.main;
    return colors.background;
  };

  // Determine size styles
  const getSizeStyles = () => {
    switch (size) {
      case 'small':
        return {
          padding: `${spacing.xs} ${spacing.sm}`,
          fontSize: '0.75rem',
        };
      case 'large':
        return {
          padding: `${spacing.md} ${spacing.lg}`,
          fontSize: '1rem',
        };
      case 'medium':
      default:
        return {
          padding: `${spacing.sm} ${spacing.md}`,
          fontSize: '0.875rem',
        };
    }
  };

  // Base button styles
  const baseStyles = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: borderRadius.medium,
    border: 'none',
    outline: 'none',
    cursor: disabled ? 'not-allowed' : 'pointer',
    transition: 'all 0.2s ease-in-out',
    fontWeight: 500,
    color: variant === 'text' ? getColor() : '#fff',
    opacity: disabled ? 0.6 : 1,
    width: fullWidth ? '100%' : 'auto',
    ...getSizeStyles(),
  };

  // Apply neumorphic styles
  const neumorphicStyles = {
    ...baseStyles,
    ...createNeumorphicStyle(isPressed ? 'pressed' : 'flat', getColor()),
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
      className={className}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
};

Button.propTypes = {
  children: PropTypes.node.isRequired,
  variant: PropTypes.oneOf(['primary', 'secondary', 'success', 'error', 'warning', 'info', 'text']),
  size: PropTypes.oneOf(['small', 'medium', 'large']),
  disabled: PropTypes.bool,
  fullWidth: PropTypes.bool,
  onClick: PropTypes.func,
  style: PropTypes.object,
  className: PropTypes.string,
};

export default Button;