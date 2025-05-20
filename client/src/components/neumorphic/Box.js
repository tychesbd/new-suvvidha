import React from 'react';
import PropTypes from 'prop-types';
import { colors, spacing, createNeumorphicStyle } from './theme';

/**
 * Neumorphic Box Component
 * A versatile container with neumorphic styling options
 */
const Box = ({
  children,
  display = 'block',
  flexDirection,
  flexWrap,
  justifyContent,
  alignItems,
  alignContent,
  flexGrow,
  flexShrink,
  flexBasis,
  padding,
  margin,
  width,
  height,
  maxWidth,
  maxHeight,
  minWidth,
  minHeight,
  bgcolor = 'transparent',
  color,
  borderRadius,
  neumorphic = false,
  variant = 'flat',
  style,
  className,
  ...props
}) => {
  // Base box styles
  const baseStyles = {
    display,
    ...(flexDirection && { flexDirection }),
    ...(flexWrap && { flexWrap }),
    ...(justifyContent && { justifyContent }),
    ...(alignItems && { alignItems }),
    ...(alignContent && { alignContent }),
    ...(flexGrow !== undefined && { flexGrow }),
    ...(flexShrink !== undefined && { flexShrink }),
    ...(flexBasis !== undefined && { flexBasis }),
    ...(padding !== undefined && { padding }),
    ...(margin !== undefined && { margin }),
    ...(width !== undefined && { width }),
    ...(height !== undefined && { height }),
    ...(maxWidth !== undefined && { maxWidth }),
    ...(maxHeight !== undefined && { maxHeight }),
    ...(minWidth !== undefined && { minWidth }),
    ...(minHeight !== undefined && { minHeight }),
    ...(bgcolor && { backgroundColor: bgcolor }),
    ...(color && { color }),
    ...(borderRadius && { borderRadius }),
  };

  // Apply neumorphic styling if requested
  const neumorphicStyles = neumorphic
    ? createNeumorphicStyle(variant, bgcolor !== 'transparent' ? bgcolor : colors.background)
    : {};

  return (
    <div
      style={{ ...baseStyles, ...neumorphicStyles, ...style }}
      className={className}
      {...props}
    >
      {children}
    </div>
  );
};

Box.propTypes = {
  children: PropTypes.node,
  display: PropTypes.string,
  flexDirection: PropTypes.string,
  flexWrap: PropTypes.string,
  justifyContent: PropTypes.string,
  alignItems: PropTypes.string,
  alignContent: PropTypes.string,
  flexGrow: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  flexShrink: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  flexBasis: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  padding: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  margin: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  width: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  height: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  maxWidth: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  maxHeight: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
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