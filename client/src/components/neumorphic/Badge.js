import React from 'react';
import PropTypes from 'prop-types';
import { createNeumorphicStyle, colors } from './theme';

/**
 * Neumorphic Badge Component
 * A small status indicator with neumorphic styling
 */
const Badge = ({
  children,
  variant = 'flat',
  color = 'primary',
  size = 'medium',
  content,
  max = 99,
  showZero = false,
  overlap = false,
  style,
  ...props
}) => {
  // Determine badge content
  let badgeContent = content;
  if (typeof content === 'number' && content > max) {
    badgeContent = `${max}+`;
  }
  
  if (content === 0 && !showZero) {
    badgeContent = '';
  }

  // Size dimensions
  const sizeMap = {
    small: {
      minWidth: '16px',
      height: '16px',
      fontSize: '0.65rem',
      padding: '0 4px'
    },
    medium: {
      minWidth: '20px',
      height: '20px',
      fontSize: '0.75rem',
      padding: '0 6px'
    },
    large: {
      minWidth: '24px',
      height: '24px',
      fontSize: '0.85rem',
      padding: '0 8px'
    }
  };

  // Color styles
  const colorMap = {
    primary: colors.primary,
    secondary: colors.secondary,
    success: colors.success,
    warning: colors.warning,
    error: colors.error,
    info: colors.info
  };

  const badgeStyle = {
    ...createNeumorphicStyle(variant, { intensity: 0.15 }),
    display: badgeContent ? 'flex' : 'none',
    alignItems: 'center',
    justifyContent: 'center',
    position: overlap ? 'absolute' : 'relative',
    top: overlap ? '-8px' : 'auto',
    right: overlap ? '-8px' : 'auto',
    backgroundColor: colorMap[color] || color,
    color: '#fff',
    borderRadius: '50%',
    fontWeight: 'bold',
    ...sizeMap[size],
    ...style
  };

  const containerStyle = {
    position: 'relative',
    display: 'inline-flex'
  };

  if (!children) {
    return (
      <div style={badgeStyle} {...props}>
        {badgeContent}
      </div>
    );
  }

  return (
    <div style={containerStyle}>
      {children}
      <div style={badgeStyle} {...props}>
        {badgeContent}
      </div>
    </div>
  );
};

Badge.propTypes = {
  children: PropTypes.node,
  variant: PropTypes.oneOf(['flat', 'pressed', 'concave', 'convex']),
  color: PropTypes.string,
  size: PropTypes.oneOf(['small', 'medium', 'large']),
  content: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  max: PropTypes.number,
  showZero: PropTypes.bool,
  overlap: PropTypes.bool,
  style: PropTypes.object
};

export default Badge;