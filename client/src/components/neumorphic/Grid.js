import React from 'react';
import PropTypes from 'prop-types';

/**
 * Neumorphic Grid Component
 * A flexible grid layout system with neumorphic styling options
 */
const Grid = ({
  container = false,
  item = false,
  spacing = 0,
  justifyContent = 'flex-start',
  alignItems = 'stretch',
  direction = 'row',
  wrap = 'wrap',
  xs,
  sm,
  md,
  lg,
  xl,
  children,
  style,
  className,
  ...props
}) => {
  // Calculate grid template columns for container
  const getGridTemplateColumns = () => {
    if (!container) return undefined;
    return 'repeat(12, 1fr)';
  };

  // Calculate grid column span for item
  const getGridColumn = () => {
    if (!item) return undefined;
    
    // Responsive column spans
    const getSpan = (value) => {
      if (typeof value === 'number') {
        return `span ${value}`;
      }
      if (value === 'auto') {
        return 'auto';
      }
      return undefined;
    };

    // Get the appropriate span based on viewport size
    // This is a simplified version - in a real app, you'd use media queries
    if (xl !== undefined) return getSpan(xl);
    if (lg !== undefined) return getSpan(lg);
    if (md !== undefined) return getSpan(md);
    if (sm !== undefined) return getSpan(sm);
    if (xs !== undefined) return getSpan(xs);
    
    return undefined;
  };

  // Calculate gap for container
  const getGap = () => {
    if (!container) return undefined;
    return `${spacing * 8}px`;
  };

  // Base grid styles
  const baseStyles = {
    // Container styles
    ...(container && {
      display: 'grid',
      gridTemplateColumns: getGridTemplateColumns(),
      gap: getGap(),
      justifyContent,
      alignItems,
      flexDirection: direction,
      flexWrap: wrap,
    }),
    
    // Item styles
    ...(item && {
      gridColumn: getGridColumn(),
    }),
  };

  return (
    <div
      style={{ ...baseStyles, ...style }}
      className={className}
      {...props}
    >
      {children}
    </div>
  );
};

Grid.propTypes = {
  container: PropTypes.bool,
  item: PropTypes.bool,
  spacing: PropTypes.number,
  justifyContent: PropTypes.oneOf(['flex-start', 'center', 'flex-end', 'space-between', 'space-around', 'space-evenly']),
  alignItems: PropTypes.oneOf(['flex-start', 'center', 'flex-end', 'stretch', 'baseline']),
  direction: PropTypes.oneOf(['row', 'row-reverse', 'column', 'column-reverse']),
  wrap: PropTypes.oneOf(['nowrap', 'wrap', 'wrap-reverse']),
  xs: PropTypes.oneOfType([PropTypes.number, PropTypes.oneOf(['auto'])]),
  sm: PropTypes.oneOfType([PropTypes.number, PropTypes.oneOf(['auto'])]),
  md: PropTypes.oneOfType([PropTypes.number, PropTypes.oneOf(['auto'])]),
  lg: PropTypes.oneOfType([PropTypes.number, PropTypes.oneOf(['auto'])]),
  xl: PropTypes.oneOfType([PropTypes.number, PropTypes.oneOf(['auto'])]),
  children: PropTypes.node,
  style: PropTypes.object,
  className: PropTypes.string,
};

export default Grid;