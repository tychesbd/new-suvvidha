import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import theme from './theme';

const { colors, borderRadius, createNeumorphicStyle } = theme;


/**
 * Neumorphic Checkbox Component
 * A soft, interactive checkbox with neumorphic styling.
 */
const Checkbox = ({
  label,
  checked: controlledChecked,
  defaultChecked = false,
  onChange,
  disabled = false,
  size = 'medium',
  color = colors.primary.main,
  style,
  className,
  ...props
}) => {
  const [isChecked, setIsChecked] = useState(defaultChecked);

  const isControlled = controlledChecked !== undefined;
  const currentChecked = isControlled ? controlledChecked : isChecked;

  useEffect(() => {
    if (isControlled) {
      setIsChecked(controlledChecked);
    }
  }, [controlledChecked, isControlled]);

  const handleChange = (event) => {
    if (disabled) return;
    const newChecked = event.target.checked;
    if (!isControlled) {
      setIsChecked(newChecked);
    }
    if (onChange) {
      onChange(newChecked, event);
    }
  };

  const getSizeStyles = () => {
    switch (size) {
      case 'small':
        return { width: '16px', height: '16px', iconSize: '10px' };
      case 'large':
        return { width: '24px', height: '24px', iconSize: '16px' };
      case 'medium':
      default:
        return { width: '20px', height: '20px', iconSize: '12px' };
    }
  };

  const { width, height, iconSize } = getSizeStyles();

  const checkboxBaseStyle = {
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

  const neumorphicBoxStyle = createNeumorphicStyle({
    width,
    height,
    borderRadius: borderRadius.sm,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: label ? '8px' : '0',
    backgroundColor: colors.background,
    transition: 'all 0.2s ease-in-out',
    ...(currentChecked && {
      boxShadow: `inset 2px 2px 4px ${colors.shadowDark}, inset -2px -2px 4px ${colors.shadowLight}`,
    }),
  });

  const checkmarkStyle = {
    fontSize: iconSize,
    color: currentChecked ? color : 'transparent',
    transition: 'color 0.2s ease-in-out',
  };

  const labelStyle = {
    fontSize: size === 'small' ? '0.8rem' : (size === 'large' ? '1.1rem' : '0.9rem'),
    color: colors.text.primary,
  };

  return (
    <label 
      style={checkboxBaseStyle} 
      className={`neumorphic-checkbox ${className || ''}`}
    >
      <input
        type="checkbox"
        checked={currentChecked}
        onChange={handleChange}
        disabled={disabled}
        style={inputStyle}
        {...props}
      />
      <div style={neumorphicBoxStyle}>
        <span style={checkmarkStyle}>
          {/* Using a simple checkmark character, could be replaced with an SVG icon */}
          ✓
        </span>
      </div>
      {label && <span style={labelStyle}>{label}</span>}
    </label>
  );
};

Checkbox.propTypes = {
  label: PropTypes.string,
  checked: PropTypes.bool,
  defaultChecked: PropTypes.bool,
  onChange: PropTypes.func,
  disabled: PropTypes.bool,
  size: PropTypes.oneOf(['small', 'medium', 'large']),
  color: PropTypes.string,
  style: PropTypes.object,
  className: PropTypes.string,
};

export default Checkbox;