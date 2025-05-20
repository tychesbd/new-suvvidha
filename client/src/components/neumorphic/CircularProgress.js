import React from 'react';
import PropTypes from 'prop-types';
import { colors, createNeumorphicStyle } from './theme';

/**
 * Neumorphic CircularProgress Component
 * A soft, extruded circular progress indicator with subtle shadows
 */
const CircularProgress = ({
  size = 40,
  thickness = 3.6,
  value = 0,
  variant = 'indeterminate',
  color = 'primary',
  style,
  className,
  ...props
}) => {
  // Determine color based on prop
  const getColor = () => {
    if (color === 'primary') return colors.primary.main;
    if (color === 'secondary') return colors.secondary.main;
    if (color === 'success') return colors.success.main;
    if (color === 'error') return colors.error.main;
    if (color === 'warning') return colors.warning.main;
    if (color === 'info') return colors.info.main;
    return color; // Allow custom color strings
  };

  // Calculate SVG parameters
  const radius = (size - thickness) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = variant === 'determinate' 
    ? circumference - (value / 100) * circumference 
    : 0;

  // Animation for indeterminate variant
  const keyframes = `
    @keyframes neumorphic-circular-rotate {
      0% {
        transform: rotate(0deg);
      }
      100% {
        transform: rotate(360deg);
      }
    }

    @keyframes neumorphic-circular-dash {
      0% {
        stroke-dasharray: ${circumference * 0.1} ${circumference};
        stroke-dashoffset: 0;
      }
      50% {
        stroke-dasharray: ${circumference * 0.5} ${circumference};
        stroke-dashoffset: -${circumference * 0.25};
      }
      100% {
        stroke-dasharray: ${circumference * 0.1} ${circumference};
        stroke-dashoffset: -${circumference};
      }
    }
  `;

  // Container styles
  const containerStyles = {
    display: 'inline-block',
    width: size,
    height: size,
    ...createNeumorphicStyle('flat'),
    borderRadius: '50%',
    padding: thickness,
  };

  // SVG styles
  const svgStyles = {
    animation: variant === 'indeterminate' ? 'neumorphic-circular-rotate 1.4s linear infinite' : 'none',
    height: '100%',
    width: '100%',
    transform: 'rotate(-90deg)',
  };

  // Circle styles
  const circleStyles = {
    stroke: getColor(),
    strokeDasharray: variant === 'indeterminate' ? `${circumference * 0.1} ${circumference}` : circumference,
    strokeDashoffset: strokeDashoffset,
    strokeLinecap: 'round',
    animation: variant === 'indeterminate' ? 'neumorphic-circular-dash 1.4s ease-in-out infinite' : 'none',
    transition: 'stroke-dashoffset 0.3s ease',
    fill: 'none',
  };

  return (
    <div style={{ ...containerStyles, ...style }} className={className} {...props}>
      <style>{keyframes}</style>
      <svg style={svgStyles} viewBox={`${size / 2 - radius} ${size / 2 - radius} ${size} ${size}`}>
        <circle
          style={circleStyles}
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={thickness}
        />
      </svg>
    </div>
  );
};

CircularProgress.propTypes = {
  size: PropTypes.number,
  thickness: PropTypes.number,
  value: PropTypes.number,
  variant: PropTypes.oneOf(['determinate', 'indeterminate']),
  color: PropTypes.string,
  style: PropTypes.object,
  className: PropTypes.string,
};

export default CircularProgress;