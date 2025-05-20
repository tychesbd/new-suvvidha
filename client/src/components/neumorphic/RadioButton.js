import React from 'react';
import PropTypes from 'prop-types';
import { colors, borderRadius, createNeumorphicStyle } from './theme';

/**
 * Neumorphic Radio Button Component
 * A soft, interactive radio button with neumorphic styling.
 */
const RadioButton = ({
  label,
  name,
  value,
  checked,
  onChange,
  disabled = false,
  size = 'medium',
  color = colors.primary.main,
  style,
  className,
  ...props
}) => {

  const handleChange = (event) => {
    if (disabled) return;
    if (onChange) {
      onChange(event.target.value, event);
    }
  };

  const getSizeStyles = () => {
    switch (size) {
      case 'small':
        return { wrapperSize: '16px', dotSize: '8px' };
      case 'large':
        return { wrapperSize: '24px', dotSize: '12px' };
      case 'medium':
      default:
        return { wrapperSize: '20px', dotSize: '10px' };
    }
  };

  const { wrapperSize, dotSize } = getSizeStyles();

  const radioBaseStyle = {
    display: 'inline-flex',
    alignItems: 'center',
    cursor: disabled ? 'not-allowed' : 'pointer',
    opacity: disabled ? 0.6 : 1,
    ...style,
  };

  const inputStyle = {
    position: 'absolute',
    opacity: 0,
    cursor: 'pointer',
    height: 0,
    width: 0,
  };

  const neumorphicCircleStyle = createNeumorphicStyle({
    width: wrapperSize,
    height: wrapperSize,
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: label ? '8px' : '0',
    backgroundColor: colors.background,
    transition: 'all 0.2s ease-in-out',
    ...(checked && {
      boxShadow: `inset 2px 2px 4px ${colors.shadowDark}, inset -2px -2px 4px ${colors.shadowLight}`,
    }),
  });

  const innerDotStyle = {
    width: dotSize,
    height: dotSize,
    borderRadius: '50%',
    backgroundColor: checked ? color : 'transparent',
    transition: 'background-color 0.2s ease-in-out',
  };

  const labelStyle = {
    fontSize: size === 'small' ? '0.8rem' : (size === 'large' ? '1.1rem' : '0.9rem'),
    color: colors.text.primary,
  };

  return (
    <label 
      style={radioBaseStyle} 
      className={`neumorphic-radio ${className || ''}`}
    >
      <input
        type="radio"
        name={name}
        value={value}
        checked={checked}
        onChange={handleChange}
        disabled={disabled}
        style={inputStyle}
        {...props}
      />
      <div style={neumorphicCircleStyle}>
        <div style={innerDotStyle}></div>
      </div>
      {label && <span style={labelStyle}>{label}</span>}
    </label>
  );
};

RadioButton.propTypes = {
  label: PropTypes.string,
  name: PropTypes.string.isRequired,
  value: PropTypes.any.isRequired,
  checked: PropTypes.bool,
  onChange: PropTypes.func,
  disabled: PropTypes.bool,
  size: PropTypes.oneOf(['small', 'medium', 'large']),
  color: PropTypes.string,
  style: PropTypes.object,
  className: PropTypes.string,
};

export default RadioButton;