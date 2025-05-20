import React from 'react';
import PropTypes from 'prop-types';
import { colors, spacing } from './theme';

/**
 * Neumorphic Divider Component
 * A subtle divider with neumorphic styling
 */
const Divider = ({
  orientation = 'horizontal',
  variant = 'fullWidth',
  light = false,
  style,
  className,
  ...props
}) => {
  // Base divider styles
  const baseStyles = {
    border: 'none',
    margin: 0,
    flexShrink: 0,
    backgroundColor: light ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.05)',
    boxShadow: light ? 'none' : '0 1px 1px rgba(255, 255, 255, 0.5)',
  };

  // Orientation specific styles
  const orientationStyles = orientation === 'vertical'
    ? {
        height: 'auto',
        width: '1px',
        alignSelf: 'stretch',
        marginLeft: variant === 'inset' ? spacing.md : 0,
        marginRight: variant === 'inset' ? spacing.md : 0,
      }
    : {
        height: '1px',
        width: '100%',
        marginTop: spacing.md,
        marginBottom: spacing.md,
        marginLeft: variant === 'inset' ? spacing.md : 0,
        marginRight: variant === 'inset' ? spacing.md : 0,
        ...(variant === 'middle' && {
          marginLeft: 'auto',
          marginRight: 'auto',
          width: '80%',
        }),
      };

  return (
    <hr
      style={{ ...baseStyles, ...orientationStyles, ...style }}
      className={className}
      {...props}
    />
  );
};

Divider.propTypes = {
  orientation: PropTypes.oneOf(['horizontal', 'vertical']),
  variant: PropTypes.oneOf(['fullWidth', 'inset', 'middle']),
  light: PropTypes.bool,
  style: PropTypes.object,
  className: PropTypes.string,
};

export default Divider;