import React from 'react';
import PropTypes from 'prop-types';
import theme from './theme';

const { colors, borderRadius, spacing, createNeumorphicStyle } = theme;


/**
 * Neumorphic Card Component
 * A soft, extruded card with subtle shadows that appears to push through the surface
 */
const Card = ({
  children,
  variant = 'flat',
  elevation = 'medium',
  backgroundColor = colors.background,
  padding = spacing.md,
  style,
  className,
  ...props
}) => {
  // Base card styles
  const baseStyles = {
    borderRadius: borderRadius.medium,
    padding,
    backgroundColor,
    transition: 'all 0.3s ease',
  };

  // Apply neumorphic styles based on variant
  const neumorphicStyles = {
    ...baseStyles,
    ...createNeumorphicStyle(variant, backgroundColor),
    ...style,
  };

  return (
    <div
      style={neumorphicStyles}
      className={className}
      {...props}
    >
      {children}
    </div>
  );
};

Card.propTypes = {
  children: PropTypes.node,
  variant: PropTypes.oneOf(['flat', 'pressed', 'concave', 'convex']),
  elevation: PropTypes.oneOf(['small', 'medium', 'large']),
  backgroundColor: PropTypes.string,
  padding: PropTypes.string,
  style: PropTypes.object,
  className: PropTypes.string,
};

export default Card;