import React from 'react';
import PropTypes from 'prop-types';
import theme from './theme';

/**
 * Neumorphic Typography Component
 * Text component with neumorphic styling options
 */
const Typography = ({
  variant = 'body1',
  color = 'primary',
  align = 'left',
  children,
  style,
  className,
  ...props
}) => {
  // Get variant styles from theme
  const getVariantStyles = () => {
    switch (variant) {
      case 'h1':
        return theme.typography.h1;
      case 'h2':
        return theme.typography.h2;
      case 'h3':
        return theme.typography.h3;
      case 'h4':
        return theme.typography.h4;
      case 'h5':
        return theme.typography.h5;
      case 'h6':
        return theme.typography.h6;
      case 'subtitle1':
        return theme.typography.subtitle1;
      case 'subtitle2':
        return theme.typography.subtitle2;
      case 'body1':
        return theme.typography.body1;
      case 'body2':
        return theme.typography.body2;
      case 'button':
        return theme.typography.button;
      case 'caption':
        return theme.typography.caption;
      case 'overline':
        return theme.typography.overline;
      default:
        return theme.typography.body1;
    }
  };

  // Get color from theme
  const getColor = () => {
    switch (color) {
      case 'primary':
        return theme.colors.text.primary;
      case 'secondary':
        return theme.colors.text.secondary;
      case 'disabled':
        return theme.colors.text.disabled;
      case 'error':
        return theme.colors.error.main;
      case 'warning':
        return theme.colors.warning.main;
      case 'info':
        return theme.colors.info.main;
      case 'success':
        return theme.colors.success.main;
      default:
        return color;
    }
  };

  // Base styles
  const baseStyles = {
    margin: 0,
    fontFamily: theme.typography.fontFamily,
    textAlign: align,
    color: getColor(),
    ...getVariantStyles(),
  };

  // Determine which HTML element to use
  const Component = (() => {
    if (['h1', 'h2', 'h3', 'h4', 'h5', 'h6'].includes(variant)) {
      return variant;
    }
    return 'p';
  })();

  return (
    <Component
      style={{ ...baseStyles, ...style }}
      className={className}
      {...props}
    >
      {children}
    </Component>
  );
};

Typography.propTypes = {
  variant: PropTypes.oneOf([
    'h1',
    'h2',
    'h3',
    'h4',
    'h5',
    'h6',
    'subtitle1',
    'subtitle2',
    'body1',
    'body2',
    'caption',
    'button',
    'overline',
  ]),
  color: PropTypes.string,
  align: PropTypes.oneOf(['left', 'center', 'right', 'justify']),
  children: PropTypes.node,
  style: PropTypes.object,
  className: PropTypes.string,
};

export default Typography;