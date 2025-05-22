import React from 'react';
import PropTypes from 'prop-types';
import theme from './theme';

/**
 * Neumorphic Container Component
 * A container with neumorphic styling options
 */
const Container = ({
  children,
  maxWidth = 'lg',
  fixed = false,
  style,
  className,
  ...props
}) => {
  // Get max width based on size
  const getMaxWidth = () => {
    switch (maxWidth) {
      case 'xs':
        return '444px';
      case 'sm':
        return '600px';
      case 'md':
        return '900px';
      case 'lg':
        return '1200px';
      case 'xl':
        return '1536px';
      default:
        return maxWidth;
    }
  };

  // Base container styles
  const containerStyles = {
    width: '100%',
    marginLeft: 'auto',
    marginRight: 'auto',
    boxSizing: 'border-box',
    padding: theme.spacing.md,
    ...(fixed ? { maxWidth: getMaxWidth() } : {
      maxWidth: {
        xs: '100%',
        sm: '600px',
        md: '900px',
        lg: '1200px',
        xl: '1536px',
      }[maxWidth],
    }),
    ...style,
  };

  return (
    <div style={containerStyles} className={className} {...props}>
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