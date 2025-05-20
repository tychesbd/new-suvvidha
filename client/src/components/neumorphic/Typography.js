import React from 'react';
import PropTypes from 'prop-types';
import { colors, typography } from './theme';

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
  // Get variant styles
  const getVariantStyles = () => {
    switch (variant) {
      case 'h1':
        return typography.h1;
      case 'h2':
        return typography.h2;
      case 'h3':
        return typography.h3;
      case 'h4':
        return typography.h4;
      case 'h5':
        return typography.h5;
      case 'h6':
        return typography.h6;
      case 'subtitle1':
        return typography.subtitle1;
      case 'subtitle2':
        return typography.subtitle2;
      case 'body2':
        return typography.body2;
      case 'caption':
        return typography.caption;
      case 'button':
        return typography.button;
      case 'overline':
        return typography.overline;
      case 'body1':
      default:
        return typography.body1;
    }
  };

  // Get color based on prop
  const getColor = () => {
    switch (color) {
      case 'primary':
        return colors.text.primary;
      case 'secondary':
        return colors.text.secondary;
      case 'disabled':
        return colors.text.disabled;
      case 'error':
        return colors.error.main;
      case 'success':
        return colors.success.main;
      case 'warning':
        return colors.warning.main;
      case 'info':
        return colors.info.main;
      default:
        return color; // Allow custom color strings
    }
  };

  // Base typography styles
  const baseStyles = {
    margin: 0,
    fontFamily: typography.fontFamily,
    textAlign: align,
    color: getColor(),
    ...getVariantStyles(),
  };

  // Determine which HTML element to use based on variant
  const Component = (() => {
    if (variant.startsWith('h')) {
      return variant; // h1, h2, etc.
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