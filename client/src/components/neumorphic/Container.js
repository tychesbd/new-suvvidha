import React from 'react';
import PropTypes from 'prop-types';
import { colors, borderRadius, spacing } from './theme';

/**
 * Neumorphic Container Component
 * A container with neumorphic styling options
 */
const Container = ({
  maxWidth = 'lg',
  children,
  style,
  className,
  ...props
}) => {
  // Determine max width based on size
  const getMaxWidth = () => {
    switch (maxWidth) {
      case 'xs':
        return '600px';
      case 'sm':
        return '960px';
      case 'md':
        return '1280px';
      case 'lg':
        return '1440px';
      case 'xl':
        return '1920px';
      default:
        return maxWidth; // Allow custom width strings
    }
  };

  // Base container styles
  const baseStyles = {
    width: '100%',
    maxWidth: getMaxWidth(),
    marginLeft: 'auto',
    marginRight: 'auto',
    padding: spacing.md,
    boxSizing: 'border-box',
    backgroundColor: 'transparent',
  };

  return (
    <div
      style={{ ...baseStyles, ...style }}
      className={className}
      {...props}
    >
      {children}
    </div>
  );
};

Container.propTypes = {
  maxWidth: PropTypes.oneOfType([PropTypes.string, PropTypes.oneOf(['xs', 'sm', 'md', 'lg', 'xl'])]),
  children: PropTypes.node,
  style: PropTypes.object,
  className: PropTypes.string,
};

export default Container;