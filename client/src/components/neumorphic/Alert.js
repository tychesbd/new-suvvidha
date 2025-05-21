import React, { useState } from 'react';
import PropTypes from 'prop-types';
import theme from './theme';

const { colors, spacing, borderRadius, createNeumorphicStyle } = theme;

/**
 * Neumorphic Alert Component
 */
const Alert = ({
  severity = 'info',
  variant = 'standard',
  children,
  onClose,
  elevation = 'medium',
  style,
  className,
  ...props
}) => {
  const [isHovered, setIsHovered] = useState(false);

  const getColor = () => {
    switch (severity) {
      case 'error':
        return colors.error;
      case 'warning':
        return colors.warning;
      case 'success':
        return colors.success;
      case 'info':
      default:
        return colors.info;
    }
  };

  const color = getColor();

  const getNeumorphicType = () => {
    if (variant === 'filled') return 'flat';
    if (variant === 'outlined') return 'pressed';
    return isHovered ? 'convex' : 'flat';
  };

  const baseStyles = {
    display: 'flex',
    alignItems: 'center',
    padding: `${spacing.sm} ${spacing.md}`,
    borderRadius: borderRadius.medium,
    backgroundColor: variant === 'filled' ? color.main : colors.background,
    color: variant === 'filled' ? '#fff' : color.main,
    borderLeft: variant === 'outlined' ? `4px solid ${color.main}` : 'none',
    ...createNeumorphicStyle(getNeumorphicType(), variant === 'filled' ? color.main : colors.background),
    marginBottom: spacing.md,
    transition: 'all 0.3s ease',
    transform: isHovered ? 'translateY(-2px)' : 'translateY(0)',
  };

  const iconContainerStyles = {
    marginRight: spacing.sm,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '28px',
    height: '28px',
    borderRadius: '50%',
    ...createNeumorphicStyle(variant === 'filled' ? 'flat' : 'pressed', variant === 'filled' ? color.light : colors.background),
  };

  const iconStyles = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '0.875rem',
  };

  const contentStyles = {
    flex: 1,
    padding: `${spacing.xs} 0`,
  };

  const closeButtonStyles = {
    cursor: 'pointer',
    fontSize: '1rem',
    color: variant === 'filled' ? '#fff' : color.main,
    marginLeft: spacing.sm,
    width: '24px',
    height: '24px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    border: 'none',
    ...createNeumorphicStyle(variant === 'filled' ? 'pressed' : 'pressed', variant === 'filled' ? color.dark : colors.background),
  };

  const getIcon = () => {
    switch (severity) {
      case 'error':
      case 'warning':
        return '⚠️';
      case 'success':
        return '✓';
      case 'info':
      default:
        return 'i';
    }
  };

  return (
    <div
      style={{ ...baseStyles, ...style }}
      className={className}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      {...props}
    >
      <div style={iconContainerStyles}>
        <span style={iconStyles}>{getIcon()}</span>
      </div>
      <div style={contentStyles}>
        {children}
      </div>
      {onClose && (
        <button style={closeButtonStyles} onClick={onClose}>
          ×
        </button>
      )}
    </div>
  );
};

Alert.propTypes = {
  severity: PropTypes.oneOf(['error', 'warning', 'info', 'success']),
  variant: PropTypes.oneOf(['standard', 'filled', 'outlined']),
  children: PropTypes.node,
  onClose: PropTypes.func,
  elevation: PropTypes.oneOf(['small', 'medium', 'large']),
  style: PropTypes.object,
  className: PropTypes.string,
};

export default Alert;
