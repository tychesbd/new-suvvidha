import React from 'react';
import PropTypes from 'prop-types';
import theme from './theme';

/**
 * Neumorphic Box Component
 * A versatile container with neumorphic styling options
 */
const Box = ({
  children,
  variant = 'flat',
  display,
  flexDirection,
  alignItems,
  justifyContent,
  gap,
  p,
  px,
  py,
  m,
  mx,
  my,
  width,
  height,
  minWidth,
  minHeight,
  bgcolor = theme.colors.background,
  color,
  borderRadius,
  neumorphic = true,
  style,
  className,
  ...props
}) => {
  // Base styles
  const baseStyles = {
    display,
    flexDirection,
    alignItems,
    justifyContent,
    gap,
    padding: p,
    paddingLeft: px,
    paddingRight: px,
    paddingTop: py,
    paddingBottom: py,
    margin: m,
    marginLeft: mx,
    marginRight: mx,
    marginTop: my,
    marginBottom: my,
    width,
    height,
    minWidth,
    minHeight,
    backgroundColor: bgcolor,
    color: color || theme.colors.text.primary,
    borderRadius: borderRadius || theme.borderRadius.medium,
  };

  // Apply neumorphic effect if enabled
  const combinedStyles = {
    ...baseStyles,
    ...(neumorphic ? theme.createNeumorphicStyle(variant, bgcolor) : {}),
    ...style,
  };

  return (
    <div style={combinedStyles} className={className} {...props}>
      {children}
    </div>
  );
};

Box.propTypes = {
  children: PropTypes.node,
  display: PropTypes.string,
  flexDirection: PropTypes.string,
  alignItems: PropTypes.string,
  justifyContent: PropTypes.string,
  gap: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  p: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  px: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  py: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  m: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  mx: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  my: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  width: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  height: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  minWidth: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  minHeight: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  bgcolor: PropTypes.string,
  color: PropTypes.string,
  borderRadius: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  neumorphic: PropTypes.bool,
  variant: PropTypes.oneOf(['flat', 'pressed', 'concave', 'convex']),
  style: PropTypes.object,
  className: PropTypes.string,
};

export default Box;