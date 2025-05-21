import React from 'react';
import PropTypes from 'prop-types';
import theme from './theme';

const { colors, borderRadius, spacing, createNeumorphicStyle } = theme;

/**
 * Neumorphic InputAdornment Component
 * A soft, styled addon component for input fields
 */
const InputAdornment = ({
  children,
  position = 'start',
  variant = 'flat',
  style,
  className,
  ...props
}) => {
  const baseStyles = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: colors.text.secondary,
    whiteSpace: 'nowrap',
    padding: `${spacing.xs}px ${spacing.sm}px`,
    position: position === 'start' ? 'left' : 'right',
  };

  const neumorphicStyles = {
    ...baseStyles,
    ...createNeumorphicStyle(variant),
    ...style,
  };

  return (
    <div
      style={neumorphicStyles}
      className={`neumorphic-input-adornment ${className || ''}`}
      {...props}
    >
      {children}
    </div>
  );
};

InputAdornment.propTypes = {
  children: PropTypes.node.isRequired,
  position: PropTypes.oneOf(['start', 'end']),
  variant: PropTypes.oneOf(['flat', 'pressed', 'concave', 'convex']),
  style: PropTypes.object,
  className: PropTypes.string,
};

export default InputAdornment;
