import React, { useState } from 'react';
import PropTypes from 'prop-types';
import theme from './theme';

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
  component: CustomComponent,
  startIcon, // Destructure startIcon
  ...otherProps // Remainder of props
}) => {
  const [isPressed, setIsPressed] = useState(false);

  // Get color from theme
  const getVariantColor = () => {
    // Returns the characteristic color of the variant (e.g., blue for primary)
    if (variant === 'primary') return theme.colors.primary.main;
    if (variant === 'secondary') return theme.colors.secondary.main;
    if (variant === 'success') return theme.colors.success.main;
    if (variant === 'error') return theme.colors.error.main;
    if (variant === 'warning') return theme.colors.warning.main;
    if (variant === 'info') return theme.colors.info.main;
    // For 'text' variant, there isn't a specific background color,
    // it usually blends with the parent background.
    // The text color will be handled separately.
    return theme.colors.background; // Default surface for neumorphism if no specific variant color
  };

  // Get size styles
  const getSizeStyles = () => {
    switch (size) {
      case 'small':
        return {
          padding: `${theme.spacing.xs} ${theme.spacing.sm}`,
          fontSize: '0.75rem',
        };
      case 'large':
        return {
          padding: `${theme.spacing.md} ${theme.spacing.lg}`,
          fontSize: '1rem',
        };
      case 'medium':
      default:
        return {
          padding: `${theme.spacing.sm} ${theme.spacing.md}`,
          fontSize: '0.875rem',
        };
    }
  };

  // Base button styles
  const baseStyles = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: theme.borderRadius.medium,
    border: 'none',
    outline: 'none',
    cursor: disabled ? 'not-allowed' : 'pointer',
    transition: 'all 0.2s ease-in-out',
    fontWeight: 500,
    color:
      variant === 'text' ? theme.colors.text.primary :
      variant === 'warning' ? theme.colors.text.primary : // Warning bg is light, so dark text
      '#fff', // Default white text for other variants
    opacity: disabled ? 0.6 : 1,
    width: fullWidth ? '100%' : 'auto',
    ...getSizeStyles(),
  };

  // Determine the background color for the neumorphic effect
  const actualBackgroundColorForEffect = variant === 'text'
    ? theme.colors.background // Text buttons should appear on the page background
    : getVariantColor();

  // Apply neumorphic styles
  const neumorphicStyles = {
    ...baseStyles,
    ...theme.createNeumorphicStyle(isPressed ? 'pressed' : 'flat', actualBackgroundColorForEffect),
    ...style,
  };

  // Event handlers
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
    CustomComponent ? (
      <CustomComponent
        style={neumorphicStyles}
        onClick={disabled ? undefined : onClick}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
        className={className}
        disabled={disabled}
        {...otherProps} // Spread otherProps
      >
        {startIcon && <span style={{ marginRight: children ? '8px' : '0', display: 'inline-flex', alignItems: 'center' }}>{startIcon}</span>}
        {children}
      </CustomComponent>
    ) : (
      <button
        style={neumorphicStyles}
        onClick={disabled ? undefined : onClick}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
        className={className}
        disabled={disabled}
        {...otherProps} // Spread otherProps
      >
        {startIcon && <span style={{ marginRight: children ? '8px' : '0', display: 'inline-flex', alignItems: 'center' }}>{startIcon}</span>}
        {children}
      </button>
    )
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
  component: PropTypes.elementType,
  startIcon: PropTypes.node, // Added prop type for startIcon
};

export default Button;