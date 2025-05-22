import React, { useState } from 'react';
import PropTypes from 'prop-types';
import theme from './theme';

const { colors, borderRadius, spacing, createNeumorphicStyle } = theme;

/**
 * Neumorphic IconButton Component
 * A soft, extruded icon button with subtle shadows and hover effect
 */
const IconButton = ({
  children,
  color = 'default',
  disabled = false,
  size = 'medium',
  variant = 'flat',
  onClick,
  style,
  className,
  ...props
}) => {
  const [isPressed, setIsPressed] = useState(false);

  const getColor = () => {
    switch (color) {
      case 'primary':
        return {
          background: colors.primary.soft,
          color: colors.primary.main
        };
      case 'secondary':
        return {
          background: colors.secondary.soft,
          color: colors.secondary.main
        };
      case 'success':
        return {
          background: colors.success.soft,
          color: colors.success.main
        };
      case 'error':
        return {
          background: colors.error.soft,
          color: colors.error.main
        };
      case 'warning':
        return {
          background: colors.warning.soft,
          color: colors.warning.main
        };
      case 'info':
        return {
          background: colors.info.soft,
          color: colors.info.main
        };
      default:
        return {
          background: colors.background,
          color: colors.text.primary
        };
    }
  };

  const getSizeStyles = () => {
    switch (size) {
      case 'small':
        return {
          width: '32px',
          height: '32px',
          fontSize: '1.25rem',
        };
      case 'large':
        return {
          width: '48px',
          height: '48px',
          fontSize: '2rem',
        };
      case 'medium':
      default:
        return {
          width: '40px',
          height: '40px',
          fontSize: '1.75rem',
        };
    }
  };

  const { background, color: iconColor } = getColor();
  const sizeStyles = getSizeStyles();

  const baseStyles = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    border: 'none',
    cursor: disabled ? 'not-allowed' : 'pointer',
    transition: 'all 0.2s ease',
    padding: spacing.xs,
    borderRadius: borderRadius.medium,
    background,
    color: iconColor,
    opacity: disabled ? 0.6 : 1,
    ...sizeStyles,
  };

  const neumorphicStyles = {
    ...baseStyles,
    ...createNeumorphicStyle(isPressed || variant === 'pressed' ? 'pressed' : 'flat', background),
    '&:hover': {
      transform: disabled ? 'none' : 'translateY(-1px)',
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
      className={`neumorphic-icon-button ${className || ''}`}
      type="button"
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
};

IconButton.propTypes = {
  children: PropTypes.node.isRequired,
  color: PropTypes.oneOf(['default', 'primary', 'secondary', 'success', 'error', 'warning', 'info']),
  disabled: PropTypes.bool,
  size: PropTypes.oneOf(['small', 'medium', 'large']),
  variant: PropTypes.oneOf(['flat', 'pressed']),
  onClick: PropTypes.func,
  style: PropTypes.object,
  className: PropTypes.string,
};

export default IconButton;
