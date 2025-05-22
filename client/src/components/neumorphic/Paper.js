import React from 'react';
import PropTypes from 'prop-types';
import theme from './theme';

/**
 * Neumorphic Paper Component
 * A basic surface-level component that provides depth through soft shadows
 */
const Paper = ({
  children,
  variant = 'flat',
  elevation = 'medium',
  backgroundColor = theme.colors.background,
  padding = theme.spacing.md,
  style,
  className,
  ...props
}) => {
  // Calculate shadow intensity based on elevation
  const getShadowStyle = () => {
    switch (elevation) {
      case 'small':
        return {
          boxShadow: '3px 3px 6px rgba(174, 174, 192, 0.2), -3px -3px 6px rgba(255, 255, 255, 0.7)'
        };
      case 'large':
        return {
          boxShadow: '8px 8px 16px rgba(174, 174, 192, 0.4), -8px -8px 16px rgba(255, 255, 255, 0.8)'
        };
      case 'medium':
      default:
        return {
          boxShadow: '5px 5px 10px rgba(174, 174, 192, 0.3), -5px -5px 10px rgba(255, 255, 255, 0.75)'
        };
    }
  };

  // Base paper styles
  const baseStyles = {
    backgroundColor,
    borderRadius: theme.borderRadius.medium,
    padding,
    transition: 'all 0.3s ease-in-out',
    ...getShadowStyle(),
  };

  // Apply neumorphic styles based on variant
  const neumorphicStyles = {
    ...baseStyles,
    ...theme.createNeumorphicStyle(variant, backgroundColor),
    ...style,
  };

  return (
    <div style={neumorphicStyles} className={className} {...props}>
      {children}
    </div>
  );
};

Paper.propTypes = {
  children: PropTypes.node,
  variant: PropTypes.oneOf(['flat', 'pressed', 'concave', 'convex']),
  elevation: PropTypes.oneOf(['small', 'medium', 'large']),
  backgroundColor: PropTypes.string,
  padding: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  style: PropTypes.object,
  className: PropTypes.string,
};

export default Paper;
