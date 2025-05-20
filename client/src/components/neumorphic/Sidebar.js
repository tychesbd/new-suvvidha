import React from 'react';
import PropTypes from 'prop-types';
import { Link, useLocation } from 'react-router-dom';
import { colors, spacing, borderRadius, createNeumorphicStyle } from './theme';

/**
 * Neumorphic Sidebar Component
 * A soft, extruded sidebar with subtle shadows and monochromatic styling
 */
const Sidebar = ({
  menuItems = [],
  logo,
  title,
  width = 280,
  collapsed = false,
  onToggleCollapse,
  style,
  className,
  ...props
}) => {
  const location = useLocation();
  const currentPath = location.pathname;

  const containerStyles = {
    width: collapsed ? 80 : width,
    height: '100vh',
    position: 'fixed',
    top: 0,
    left: 0,
    zIndex: 100,
    transition: 'width 0.3s ease',
    overflowX: 'hidden',
    overflowY: 'auto',
    ...createNeumorphicStyle('flat'),
    ...style,
  };

  const headerStyles = {
    padding: spacing.md,
    display: 'flex',
    alignItems: 'center',
    justifyContent: collapsed ? 'center' : 'flex-start',
    borderBottom: `1px solid ${colors.divider}`,
  };

  const logoStyles = {
    marginRight: collapsed ? 0 : spacing.md,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  };

  const titleStyles = {
    display: collapsed ? 'none' : 'block',
    fontSize: '1.25rem',
    fontWeight: 'bold',
    color: colors.text.primary,
    margin: 0,
  };

  const menuStyles = {
    listStyle: 'none',
    padding: 0,
    margin: 0,
    marginTop: spacing.md,
  };

  const menuItemStyles = (isActive) => ({
    margin: `${spacing.sm}px ${spacing.md}px`,
    borderRadius: borderRadius.medium,
    overflow: 'hidden',
    ...createNeumorphicStyle(isActive ? 'pressed' : 'flat'),
  });

  const linkStyles = (isActive) => ({
    display: 'flex',
    alignItems: 'center',
    padding: spacing.md,
    textDecoration: 'none',
    color: isActive ? colors.primary.main : colors.text.secondary,
    transition: 'all 0.3s ease',
    '&:hover': {
      color: colors.primary.main,
    },
  });

  const iconStyles = {
    marginRight: collapsed ? 0 : spacing.md,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '1.5rem',
  };

  const textStyles = {
    display: collapsed ? 'none' : 'block',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  };

  const collapseButtonStyles = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.md,
    margin: `${spacing.lg}px ${spacing.md}px`,
    borderRadius: borderRadius.medium,
    border: 'none',
    background: 'transparent',
    cursor: 'pointer',
    color: colors.text.secondary,
    transition: 'all 0.3s ease',
    ...createNeumorphicStyle('flat'),
    '&:hover': {
      color: colors.primary.main,
    },
  };

  return (
    <aside 
      style={containerStyles} 
      className={`neumorphic-sidebar ${className || ''}`}
      {...props}
    >
      <div style={headerStyles}>
        <div style={logoStyles}>
          {logo}
        </div>
        <h1 style={titleStyles}>{title}</h1>
      </div>

      <ul style={menuStyles}>
        {menuItems.map((item, index) => {
          const isActive = currentPath === item.path || currentPath.startsWith(`${item.path}/`);
          
          return (
            <li key={index} style={menuItemStyles(isActive)}>
              <Link to={item.path} style={linkStyles(isActive)}>
                <span style={iconStyles}>{item.icon}</span>
                <span style={textStyles}>{item.name}</span>
              </Link>
            </li>
          );
        })}
      </ul>

      {onToggleCollapse && (
        <button 
          style={collapseButtonStyles}
          onClick={onToggleCollapse}
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? '→' : '←'}
        </button>
      )}
    </aside>
  );
};

Sidebar.propTypes = {
  menuItems: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      path: PropTypes.string.isRequired,
      icon: PropTypes.node,
    })
  ),
  logo: PropTypes.node,
  title: PropTypes.string,
  width: PropTypes.number,
  collapsed: PropTypes.bool,
  onToggleCollapse: PropTypes.func,
  style: PropTypes.object,
  className: PropTypes.string,
};

export default Sidebar;