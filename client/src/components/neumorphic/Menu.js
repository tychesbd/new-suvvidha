import React, { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import { colors, borderRadius, spacing, createNeumorphicStyle } from './theme';

/**
 * Neumorphic Menu Component
 * A soft, extruded dropdown menu with subtle shadows for navigation and actions
 */
const Menu = ({
  open,
  onClose,
  anchorEl,
  children,
  style,
  className,
  ...props
}) => {
  const menuRef = useRef(null);

  // Calculate position based on anchor element
  const getMenuPosition = () => {
    if (!anchorEl) return {};

    const rect = anchorEl.getBoundingClientRect();
    return {
      top: `${rect.bottom + window.scrollY}px`,
      left: `${rect.left + window.scrollX}px`,
      minWidth: `${rect.width}px`,
    };
  };

  // Handle click outside to close menu
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target) &&
        anchorEl &&
        !anchorEl.contains(event.target) &&
        open
      ) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose, anchorEl, open]);

  // Menu container styles with neumorphic effect
  const menuStyles = {
    position: 'absolute',
    zIndex: 1300,
    ...getMenuPosition(),
    ...createNeumorphicStyle('flat'),
    borderRadius: borderRadius.medium,
    padding: `${spacing.xs} 0`,
    display: open ? 'block' : 'none',
    maxHeight: '300px',
    overflowY: 'auto',
  };

  if (!open) return null;

  return (
    <div
      ref={menuRef}
      style={{ ...menuStyles, ...style }}
      className={className}
      {...props}
    >
      {children}
    </div>
  );
};

/**
 * Neumorphic MenuItem Component
 * Individual menu item with neumorphic styling
 */
const MenuItem = ({
  children,
  onClick,
  disabled = false,
  selected = false,
  style,
  className,
  ...props
}) => {
  const [isHovered, setIsHovered] = useState(false);

  // MenuItem styles
  const menuItemStyles = {
    padding: `${spacing.sm} ${spacing.md}`,
    cursor: disabled ? 'not-allowed' : 'pointer',
    opacity: disabled ? 0.5 : 1,
    backgroundColor: selected
      ? colors.primary.light
      : isHovered
      ? colors.background
      : 'transparent',
    color: selected ? '#fff' : colors.text.primary,
    transition: 'background-color 0.2s ease',
    display: 'flex',
    alignItems: 'center',
    whiteSpace: 'nowrap',
    minHeight: '36px',
  };

  const handleClick = (event) => {
    if (!disabled && onClick) {
      onClick(event);
    }
  };

  return (
    <div
      style={{ ...menuItemStyles, ...style }}
      className={className}
      onClick={handleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      {...props}
    >
      {children}
    </div>
  );
};

Menu.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  anchorEl: PropTypes.object,
  children: PropTypes.node,
  style: PropTypes.object,
  className: PropTypes.string,
};

MenuItem.propTypes = {
  children: PropTypes.node,
  onClick: PropTypes.func,
  disabled: PropTypes.bool,
  selected: PropTypes.bool,
  style: PropTypes.object,
  className: PropTypes.string,
};

// Export both components
Menu.Item = MenuItem;
export { MenuItem };
export default Menu;