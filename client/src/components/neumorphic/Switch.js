import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { colors, borderRadius, spacing, createNeumorphicStyle } from './theme';

/**
 * Neumorphic Switch Component
 * A soft, extruded toggle switch with subtle shadows for boolean inputs
 */
const Switch = ({
  checked = false,
  onChange,
  disabled = false,
  color = 'primary',
  size = 'medium',
  label,
  labelPlacement = 'end',
  style,
  className,
  ...props
}) => {
  // Get color based on variant
  const getColor = () => {
    switch (color) {
      case 'primary':
        return colors.primary.main;
      case 'secondary':
        return colors.secondary.main;
      case 'success':
        return colors.success.main;
      case 'error':
        return colors.error.main;
      case 'warning':
        return colors.warning.main;
      case 'info':
        return colors.info.main;
      default:
        return colors.primary.main;
    }
  };

  // Get size dimensions
  const getSizeDimensions = () => {
    switch (size) {
      case 'small':
        return {
          width: 32,
          height: 16,
          thumbSize: 12,
        };
      case 'large':
        return {
          width: 58,
          height: 28,
          thumbSize: 22,
        };
      case 'medium':
      default:
        return {
          width: 44,
          height: 22,
          thumbSize: 16,
        };
    }
  };

  const { width, height, thumbSize } = getSizeDimensions();
  const activeColor = getColor();

  // Container styles
  const containerStyles = {
    display: 'inline-flex',
    alignItems: 'center',
    flexDirection: labelPlacement === 'start' ? 'row-reverse' : 'row',
    cursor: disabled ? 'not-allowed' : 'pointer',
    opacity: disabled ? 0.6 : 1,
  };

  // Track styles with neumorphic effect
  const trackStyles = {
    position: 'relative',
    width: width,
    height: height,
    borderRadius: height / 2,
    transition: 'all 0.3s ease',
    ...createNeumorphicStyle('pressed'),
    backgroundColor: checked ? activeColor : colors.background,
  };

  // Thumb styles with neumorphic effect
  const thumbStyles = {
    position: 'absolute',
    top: (height - thumbSize) / 2,
    left: checked ? width - thumbSize - (height - thumbSize) / 2 : (height - thumbSize) / 2,
    width: thumbSize,
    height: thumbSize,
    borderRadius: '50%',
    transition: 'all 0.3s ease',
    ...createNeumorphicStyle('flat', '#ffffff'),
  };

  // Label styles
  const labelStyles = {
    marginLeft: labelPlacement === 'end' ? spacing.sm : 0,
    marginRight: labelPlacement === 'start' ? spacing.sm : 0,
    fontSize: '0.875rem',
    color: disabled ? colors.text.disabled : colors.text.primary,
  };

  const handleChange = () => {
    if (!disabled && onChange) {
      onChange(!checked);
    }
  };

  return (
    <div
      style={{ ...containerStyles, ...style }}
      className={className}
      onClick={handleChange}
      {...props}
    >
      <div style={trackStyles}>
        <div style={thumbStyles} />
      </div>
      {label && <span style={labelStyles}>{label}</span>}
    </div>
  );
};

Switch.propTypes = {
  checked: PropTypes.bool,
  onChange: PropTypes.func,
  disabled: PropTypes.bool,
  color: PropTypes.oneOf(['primary', 'secondary', 'success', 'error', 'warning', 'info']),
  size: PropTypes.oneOf(['small', 'medium', 'large']),
  label: PropTypes.node,
  labelPlacement: PropTypes.oneOf(['start', 'end']),
  style: PropTypes.object,
  className: PropTypes.string,
};

export default Switch;