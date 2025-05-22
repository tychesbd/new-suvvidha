import React from 'react';
import PropTypes from 'prop-types';
import theme from './theme';

const { colors, borderRadius, spacing, createNeumorphicStyle } = theme;


/**
 * Neumorphic Avatar Component
 * A soft, extruded avatar with subtle shadows that appears to push through the surface
 */
const Avatar = ({
  src,
  alt,
  size = 'medium',
  variant = 'circular',
  style,
  className,
  ...props
}) => {
  // Determine size in pixels
  const getSize = () => {
    switch (size) {
      case 'small':
        return '32px';
      case 'large':
        return '64px';
      case 'medium':
      default:
        return '48px';
    }
  };

  // Base avatar styles
  const baseStyles = {
    width: getSize(),
    height: getSize(),
    borderRadius: variant === 'circular' ? '50%' : borderRadius.medium,
    overflow: 'hidden',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background,
    color: colors.text.primary,
    fontSize: size === 'small' ? '1rem' : size === 'medium' ? '1.25rem' : '1.5rem',
    fontWeight: 500,
    ...createNeumorphicStyle('flat'),
  };

  // Image styles
  const imgStyles = {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  };

  // Get initials from alt text
  const getInitials = () => {
    if (!alt) return '';
    return alt
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <div style={{ ...baseStyles, ...style }} className={className} {...props}>
      {src ? (
        <img src={src} alt={alt} style={imgStyles} />
      ) : (
        <span>{getInitials()}</span>
      )}
    </div>
  );
};

Avatar.propTypes = {
  src: PropTypes.string,
  alt: PropTypes.string,
  size: PropTypes.oneOf(['small', 'medium', 'large']),
  variant: PropTypes.oneOf(['circular', 'rounded']),
  style: PropTypes.object,
  className: PropTypes.string,
};

export default Avatar;