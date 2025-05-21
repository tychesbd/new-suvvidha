import React from 'react';
import PropTypes from 'prop-types';
import theme from './theme';

const {  colors, borderRadius, createNeumorphicStyle } = theme;

/**
 * Neumorphic Progress Bar Component
 * A soft, visual indicator of progress with neumorphic styling.
 */
const ProgressBar = ({
  value = 0, // Percentage value from 0 to 100
  height = '10px',
  color = colors.primary.main,
  backgroundColor = colors.background,
  showLabel = false,
  labelPosition = 'right', // 'right', 'center', 'inside'
  labelColor = colors.text.primary,
  variant = 'flat', // 'flat', 'inset'
  style,
  className,
  ...props
}) => {
  const progress = Math.max(0, Math.min(100, value)); // Ensure value is between 0 and 100

  const barBaseStyle = {
    width: '100%',
    height,
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
    position: 'relative',
    ...style,
  };

  const barOuterStyle = createNeumorphicStyle({
    width: '100%',
    height: '100%',
    backgroundColor,
    ...(variant === 'inset' && {
      boxShadow: `inset 2px 2px 4px ${colors.shadowDark}, inset -2px -2px 4px ${colors.shadowLight}`,
    }),
    ...(variant === 'flat' && {
        boxShadow: `2px 2px 4px ${colors.shadowDark}, -2px -2px 4px ${colors.shadowLight}`,
      }),
  });

  const barInnerStyle = {
    height: '100%',
    width: `${progress}%`,
    backgroundColor: color,
    borderRadius: borderRadius.lg, // Ensure inner bar also has rounded corners if it's not full
    transition: 'width 0.3s ease-in-out',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  };

  const labelBaseStyle = {
    fontSize: '0.75rem',
    fontWeight: '500',
    color: labelColor,
    whiteSpace: 'nowrap',
  };

  const labelStyle = () => {
    switch (labelPosition) {
      case 'inside':
        return {
          ...labelBaseStyle,
          color: colors.white, // Assuming a contrasting color for inside label
        };
      case 'center':
        return {
          ...labelBaseStyle,
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
        };
      case 'right':
      default:
        return {
          ...labelBaseStyle,
          marginLeft: '8px',
        };
    }
  };

  return (
    <div 
      style={{ display: 'flex', alignItems: 'center' }} 
      className={`neumorphic-progressbar-wrapper ${className || ''}`}
      {...props}
    >
      <div style={barBaseStyle} className="neumorphic-progressbar">
        <div style={barOuterStyle}>
          <div style={barInnerStyle}>
            {showLabel && labelPosition === 'inside' && (
              <span style={labelStyle()}>{`${progress}%`}</span>
            )}
          </div>
        </div>
        {showLabel && labelPosition === 'center' && (
          <span style={labelStyle()}>{`${progress}%`}</span>
        )}
      </div>
      {showLabel && labelPosition === 'right' && (
        <span style={labelStyle()}>{`${progress}%`}</span>
      )}
    </div>
  );
};

ProgressBar.propTypes = {
  value: PropTypes.number,
  height: PropTypes.string,
  color: PropTypes.string,
  backgroundColor: PropTypes.string,
  showLabel: PropTypes.bool,
  labelPosition: PropTypes.oneOf(['right', 'center', 'inside']),
  labelColor: PropTypes.string,
  variant: PropTypes.oneOf(['flat', 'inset']),
  style: PropTypes.object,
  className: PropTypes.string,
};

export default ProgressBar;