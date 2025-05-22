import React, { useState, useCallback, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import theme from './theme';

const {  colors, borderRadius, spacing, createNeumorphicStyle } = theme;

/**
 * Neumorphic Slider Component
 * A soft, interactive slider control with neumorphic styling.
 */
const Slider = ({
  min = 0,
  max = 100,
  step = 1,
  defaultValue,
  value,
  onChange,
  disabled = false,
  showValue = true,
  trackColor = colors.primary.light,
  thumbColor = colors.primary.main,
  railColor = colors.background,
  style,
  className,
  ...props
}) => {
  const [internalValue, setInternalValue] = useState(defaultValue !== undefined ? defaultValue : min);
  const sliderRef = useRef(null);
  const thumbRef = useRef(null);
  const isControlled = value !== undefined;

  const currentValue = isControlled ? value : internalValue;

  const getPercentage = (val) => ((val - min) / (max - min)) * 100;

  const handleChange = (newValue) => {
    if (!isControlled) {
      setInternalValue(newValue);
    }
    if (onChange) {
      onChange(newValue);
    }
  };

  const handleMouseMove = useCallback((event) => {
    if (!sliderRef.current || disabled) return;
    const rect = sliderRef.current.getBoundingClientRect();
    let newValue = ((event.clientX - rect.left) / rect.width) * (max - min) + min;
    newValue = Math.max(min, Math.min(max, newValue));
    newValue = Math.round(newValue / step) * step;
    handleChange(newValue);
  }, [min, max, step, disabled, handleChange]);

  const handleMouseUp = useCallback(() => {
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleMouseUp);
  }, [handleMouseMove]);

  const handleMouseDown = (event) => {
    if (disabled) return;
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    // Initial click position update
    const rect = sliderRef.current.getBoundingClientRect();
    let newValue = ((event.clientX - rect.left) / rect.width) * (max - min) + min;
    newValue = Math.max(min, Math.min(max, newValue));
    newValue = Math.round(newValue / step) * step;
    handleChange(newValue);
  };
  
  const baseStyle = {
    position: 'relative',
    width: '100%',
    height: '20px',
    display: 'flex',
    alignItems: 'center',
    cursor: disabled ? 'not-allowed' : 'pointer',
    userSelect: 'none',
    opacity: disabled ? 0.6 : 1,
    ...style,
  };

  const railStyle = createNeumorphicStyle({
    backgroundColor: railColor,
    borderRadius: borderRadius.lg,
    height: '8px',
    width: '100%',
    boxShadow: `inset 2px 2px 4px ${colors.shadowDark}, inset -2px -2px 4px ${colors.shadowLight}`,
  });

  const trackStyle = {
    position: 'absolute',
    height: '8px',
    backgroundColor: trackColor,
    borderRadius: borderRadius.lg,
    width: `${getPercentage(currentValue)}%`,
  };

  const thumbStyle = {
    position: 'absolute',
    width: '20px',
    height: '20px',
    backgroundColor: thumbColor,
    borderRadius: '50%',
    left: `calc(${getPercentage(currentValue)}% - 10px)`,
    boxShadow: `3px 3px 6px ${colors.shadowDark}, -3px -3px 6px ${colors.shadowLight}`,
    transition: 'transform 0.1s ease-out',
    zIndex: 1,
  };
  
  const valueLabelStyle = {
    position: 'absolute',
    top: '-25px',
    left: `calc(${getPercentage(currentValue)}% - 10px)`,
    transform: 'translateX(-50%)',
    fontSize: '0.75rem',
    color: colors.text.secondary,
    padding: '2px 5px',
    backgroundColor: colors.background,
    borderRadius: borderRadius.sm,
    boxShadow: `1px 1px 2px ${colors.shadowDark}, -1px -1px 2px ${colors.shadowLight}`,
    whiteSpace: 'nowrap',
  };

  return (
    <div 
      style={baseStyle} 
      className={`neumorphic-slider ${className || ''}`}
      onMouseDown={handleMouseDown}
      ref={sliderRef}
      {...props}
    >
      <div style={railStyle}></div>
      <div style={trackStyle}></div>
      <div style={thumbStyle} ref={thumbRef}></div>
      {showValue && (
        <div style={valueLabelStyle}>
          {currentValue}
        </div>
      )}
    </div>
  );
};

Slider.propTypes = {
  min: PropTypes.number,
  max: PropTypes.number,
  step: PropTypes.number,
  defaultValue: PropTypes.number,
  value: PropTypes.number,
  onChange: PropTypes.func,
  disabled: PropTypes.bool,
  showValue: PropTypes.bool,
  trackColor: PropTypes.string,
  thumbColor: PropTypes.string,
  railColor: PropTypes.string,
  style: PropTypes.object,
  className: PropTypes.string,
};

export default Slider;