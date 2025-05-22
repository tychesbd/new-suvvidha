import React, { useState } from 'react';
import PropTypes from 'prop-types';
import theme from './theme';

const {  colors, borderRadius, spacing, createNeumorphicStyle } = theme;

/**
 * Neumorphic Tooltip Component
 * A soft, extruded tooltip that appears on hover
 */
const Tooltip = ({
  children,
  title,
  placement = 'top',
  arrow = true,
  enterDelay = 200,
  leaveDelay = 0,
  style,
  className,
  ...props
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0 });

  // Calculate tooltip position based on placement
  const calculatePosition = (targetRect) => {
    const tooltipRect = document.getElementById('tooltip')?.getBoundingClientRect();
    if (!tooltipRect) return {};

    switch (placement) {
      case 'top':
        return {
          top: targetRect.top - tooltipRect.height - 8,
          left: targetRect.left + (targetRect.width - tooltipRect.width) / 2,
        };
      case 'bottom':
        return {
          top: targetRect.bottom + 8,
          left: targetRect.left + (targetRect.width - tooltipRect.width) / 2,
        };
      case 'left':
        return {
          top: targetRect.top + (targetRect.height - tooltipRect.height) / 2,
          left: targetRect.left - tooltipRect.width - 8,
        };
      case 'right':
        return {
          top: targetRect.top + (targetRect.height - tooltipRect.height) / 2,
          left: targetRect.right + 8,
        };
      default:
        return {
          top: targetRect.top - tooltipRect.height - 8,
          left: targetRect.left + (targetRect.width - tooltipRect.width) / 2,
        };
    }
  };

  // Handle mouse enter
  const handleMouseEnter = (e) => {
    const targetRect = e.currentTarget.getBoundingClientRect();
    setTimeout(() => {
      setPosition(calculatePosition(targetRect));
      setIsVisible(true);
    }, enterDelay);
  };

  // Handle mouse leave
  const handleMouseLeave = () => {
    setTimeout(() => {
      setIsVisible(false);
    }, leaveDelay);
  };

  // Tooltip container styles
  const tooltipContainerStyles = {
    position: 'relative',
    display: 'inline-block',
  };

  // Tooltip content styles
  const tooltipContentStyles = {
    position: 'fixed',
    top: position.top,
    left: position.left,
    padding: `${spacing.xs} ${spacing.sm}`,
    backgroundColor: colors.background,
    color: colors.text.primary,
    borderRadius: borderRadius.medium,
    fontSize: '0.875rem',
    maxWidth: '300px',
    zIndex: 1500,
    pointerEvents: 'none',
    opacity: isVisible ? 1 : 0,
    visibility: isVisible ? 'visible' : 'hidden',
    transition: 'all 0.2s ease-in-out',
    ...createNeumorphicStyle('flat', colors.background),
    ...style,
  };

  // Arrow styles
  const arrowStyles = {
    position: 'absolute',
    width: '8px',
    height: '8px',
    backgroundColor: colors.background,
    transform: 'rotate(45deg)',
    ...createNeumorphicStyle('flat', colors.background),
  };

  // Calculate arrow position
  const getArrowStyles = () => {
    switch (placement) {
      case 'top':
        return {
          bottom: '-4px',
          left: 'calc(50% - 4px)',
        };
      case 'bottom':
        return {
          top: '-4px',
          left: 'calc(50% - 4px)',
        };
      case 'left':
        return {
          right: '-4px',
          top: 'calc(50% - 4px)',
        };
      case 'right':
        return {
          left: '-4px',
          top: 'calc(50% - 4px)',
        };
      default:
        return {
          bottom: '-4px',
          left: 'calc(50% - 4px)',
        };
    }
  };

  return (
    <div 
      style={tooltipContainerStyles}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={className}
      {...props}
    >
      {children}
      <div id="tooltip" style={tooltipContentStyles}>
        {arrow && <div style={{ ...arrowStyles, ...getArrowStyles() }} />}
        {title}
      </div>
    </div>
  );
};

Tooltip.propTypes = {
  children: PropTypes.node.isRequired,
  title: PropTypes.node.isRequired,
  placement: PropTypes.oneOf(['top', 'bottom', 'left', 'right']),
  arrow: PropTypes.bool,
  enterDelay: PropTypes.number,
  leaveDelay: PropTypes.number,
  style: PropTypes.object,
  className: PropTypes.string,
};

export default Tooltip;
