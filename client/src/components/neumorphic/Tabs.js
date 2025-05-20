import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { colors, borderRadius, spacing, createNeumorphicStyle } from './theme';

/**
 * Neumorphic Tabs Component
 * A soft, extruded tab navigation with subtle shadows for content organization
 */
const Tabs = ({
  value,
  onChange,
  children,
  variant = 'standard',
  orientation = 'horizontal',
  centered = false,
  scrollable = false,
  style,
  className,
  ...props
}) => {
  // Container styles
  const containerStyles = {
    display: 'flex',
    flexDirection: orientation === 'vertical' ? 'column' : 'row',
    ...createNeumorphicStyle('pressed'),
    borderRadius: borderRadius.medium,
    padding: spacing.xs,
    overflow: scrollable ? 'auto' : 'visible',
    justifyContent: centered ? 'center' : 'flex-start',
  };

  // Render the tabs
  return (
    <div style={{ ...containerStyles, ...style }} className={className} {...props}>
      {React.Children.map(children, (child) => {
        if (!React.isValidElement(child)) return null;
        
        return React.cloneElement(child, {
          isActive: child.props.value === value,
          onClick: () => onChange(child.props.value),
          variant,
          orientation,
        });
      })}
    </div>
  );
};

/**
 * Neumorphic Tab Component
 * Individual tab item with neumorphic styling
 */
const Tab = ({
  label,
  icon,
  value,
  disabled = false,
  isActive = false,
  onClick,
  variant = 'standard',
  orientation = 'horizontal',
  style,
  className,
  ...props
}) => {
  // Tab styles
  const tabStyles = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: `${spacing.sm} ${spacing.md}`,
    cursor: disabled ? 'not-allowed' : 'pointer',
    opacity: disabled ? 0.5 : 1,
    transition: 'all 0.3s ease',
    position: 'relative',
    flexDirection: orientation === 'vertical' ? 'column' : 'row',
    margin: spacing.xs,
    minWidth: orientation === 'vertical' ? 'auto' : '90px',
    minHeight: orientation === 'vertical' ? '48px' : 'auto',
    borderRadius: borderRadius.medium,
    fontWeight: isActive ? 500 : 400,
    color: isActive ? colors.primary.main : colors.text.primary,
    ...createNeumorphicStyle(isActive ? 'flat' : 'pressed'),
    ...(isActive && variant === 'filled' && {
      backgroundColor: colors.primary.main,
      color: '#fff',
    }),
  };

  // Icon styles
  const iconStyles = {
    marginRight: orientation === 'horizontal' ? spacing.sm : 0,
    marginBottom: orientation === 'vertical' ? spacing.xs : 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  };

  const handleClick = () => {
    if (!disabled && onClick) {
      onClick(value);
    }
  };

  return (
    <div
      style={{ ...tabStyles, ...style }}
      className={className}
      onClick={handleClick}
      {...props}
    >
      {icon && <span style={iconStyles}>{icon}</span>}
      {label}
    </div>
  );
};

Tabs.propTypes = {
  value: PropTypes.any.isRequired,
  onChange: PropTypes.func.isRequired,
  children: PropTypes.node.isRequired,
  variant: PropTypes.oneOf(['standard', 'filled']),
  orientation: PropTypes.oneOf(['horizontal', 'vertical']),
  centered: PropTypes.bool,
  scrollable: PropTypes.bool,
  style: PropTypes.object,
  className: PropTypes.string,
};

Tab.propTypes = {
  label: PropTypes.node.isRequired,
  value: PropTypes.any.isRequired,
  icon: PropTypes.node,
  disabled: PropTypes.bool,
  isActive: PropTypes.bool,
  onClick: PropTypes.func,
  variant: PropTypes.oneOf(['standard', 'filled']),
  orientation: PropTypes.oneOf(['horizontal', 'vertical']),
  style: PropTypes.object,
  className: PropTypes.string,
};

// Export both components
Tabs.Tab = Tab;
export { Tab };
export default Tabs;