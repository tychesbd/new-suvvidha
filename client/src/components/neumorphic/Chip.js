import React from 'react';
import PropTypes from 'prop-types';
import theme from './theme';

const { colors, borderRadius, spacing, createNeumorphicStyle } = theme;


/**
 * Neumorphic Chip Component
 * A soft, extruded chip with subtle shadows for status indicators and tags
 */
const Chip = ({
  label,
  variant = 'default',
  size = 'medium',
  onDelete,
  icon,
  style,
  className,
  ...props
}) => {
  // Determine color based on variant
  const getColor = () => {
    switch (variant) {
      case 'primary':
        return colors.primary.main;
      case 'secondary':
        return colors.secondary.main;
      case 'success':
        return colors.success.main;
      case 'error':
        return colors.error.main;
      case 'warning':
        return colors.warning.main;
      case 'info':
        return colors.info.main;
      default:
        return colors.background;
    }
  };

  // Determine size styles
  const getSizeStyles = () => {
    switch (size) {
      case 'small':
        return {
          height: '24px',
          fontSize: '0.75rem',
          padding: `0 ${spacing.sm}`,
        };
      case 'large':
        return {
          height: '32px',
          fontSize: '0.875rem',
          padding: `0 ${spacing.md}`,
        };
      case 'medium':
      default:
        return {
          height: '28px',
          fontSize: '0.8125rem',
          padding: `0 ${spacing.sm}`,
        };
    }
  };

  // Base chip styles
  const baseStyles = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: borderRadius.round,
    transition: 'all 0.2s ease',
    fontWeight: 500,
    color: variant === 'default' ? colors.text.primary : '#fff',
    ...getSizeStyles(),
  };

  // Apply neumorphic styles
  const neumorphicStyles = {
    ...baseStyles,
    ...createNeumorphicStyle('flat', getColor()),
    ...style,
  };

  return (
    <div style={neumorphicStyles} className={className} {...props}>
      {icon && <span style={{ marginRight: spacing.xs }}>{icon}</span>}
      {label}
      {onDelete && (
        <span
          style={{
            marginLeft: spacing.xs,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
          }}
          onClick={onDelete}
        >
          ✕
        </span>
      )}
    </div>
  );
};

Chip.propTypes = {
  label: PropTypes.node.isRequired,
  variant: PropTypes.oneOf(['default', 'primary', 'secondary', 'success', 'error', 'warning', 'info']),
  size: PropTypes.oneOf(['small', 'medium', 'large']),
  onDelete: PropTypes.func,
  icon: PropTypes.node,
  style: PropTypes.object,
  className: PropTypes.string,
};

export default Chip;