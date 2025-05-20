import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { colors, spacing, borderRadius, createNeumorphicStyle } from './theme';

// Import Material UI icons
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';

/**
 * Neumorphic Navbar Component
 * A soft, extruded navigation bar with subtle shadows and monochromatic styling
 */
const Navbar = ({
  logo,
  links = [],
  actions = [],
  position = 'fixed',
  style,
  className,
  ...props
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const containerStyles = {
    position,
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
    padding: `${spacing.md}px ${spacing.lg}px`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    ...createNeumorphicStyle('flat'),
    ...style,
  };

  const logoStyles = {
    display: 'flex',
    alignItems: 'center',
    textDecoration: 'none',
    color: colors.text.primary,
    fontWeight: 'bold',
    fontSize: '1.25rem',
  };

  const navLinksStyles = {
    display: 'flex',
    alignItems: 'center',
    listStyle: 'none',
    margin: 0,
    padding: 0,
    '@media (max-width: 768px)': {
      display: 'none',
    },
  };

  const navLinkStyles = {
    margin: `0 ${spacing.md}px`,
    padding: `${spacing.sm}px ${spacing.md}px`,
    borderRadius: borderRadius.medium,
    textDecoration: 'none',
    color: colors.text.secondary,
    transition: 'all 0.3s ease',
    '&:hover': {
      color: colors.primary.main,
      ...createNeumorphicStyle('pressed'),
    },
  };

  const activeLinkStyles = {
    ...navLinkStyles,
    color: colors.primary.main,
    ...createNeumorphicStyle('pressed'),
  };

  const actionsContainerStyles = {
    display: 'flex',
    alignItems: 'center',
    '@media (max-width: 768px)': {
      display: 'none',
    },
  };

  const actionButtonStyles = {
    marginLeft: spacing.md,
  };

  const mobileMenuButtonStyles = {
    display: 'none',
    background: 'transparent',
    border: 'none',
    cursor: 'pointer',
    color: colors.text.primary,
    padding: spacing.sm,
    borderRadius: borderRadius.medium,
    ...createNeumorphicStyle('flat'),
    '@media (max-width: 768px)': {
      display: 'block',
    },
  };

  const mobileMenuStyles = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: colors.background,
    zIndex: 1001,
    display: mobileMenuOpen ? 'flex' : 'none',
    flexDirection: 'column',
    padding: spacing.lg,
  };

  const mobileMenuCloseButtonStyles = {
    position: 'absolute',
    top: spacing.md,
    right: spacing.md,
    background: 'transparent',
    border: 'none',
    cursor: 'pointer',
    color: colors.text.primary,
    padding: spacing.sm,
    borderRadius: borderRadius.medium,
    ...createNeumorphicStyle('flat'),
  };

  const mobileLinkStyles = {
    margin: `${spacing.md}px 0`,
    padding: `${spacing.md}px`,
    borderRadius: borderRadius.medium,
    textDecoration: 'none',
    color: colors.text.primary,
    fontSize: '1.25rem',
    textAlign: 'center',
    ...createNeumorphicStyle('flat'),
    '&:hover': {
      ...createNeumorphicStyle('pressed'),
    },
  };

  const mobileActionsStyles = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    marginTop: spacing.xl,
  };

  const mobileActionButtonStyles = {
    margin: `${spacing.sm}px 0`,
    width: '100%',
  };

  return (
    <>
      <nav 
        style={containerStyles} 
        className={`neumorphic-navbar ${className || ''}`}
        {...props}
      >
        <Link to="/" style={logoStyles}>
          {logo}
        </Link>

        <ul style={navLinksStyles}>
          {links.map((link, index) => (
            <li key={index}>
              <Link 
                to={link.to} 
                style={link.active ? activeLinkStyles : navLinkStyles}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        <div style={actionsContainerStyles}>
          {actions.map((action, index) => (
            <div key={index} style={actionButtonStyles}>
              {action}
            </div>
          ))}
        </div>

        <button 
          style={mobileMenuButtonStyles} 
          onClick={toggleMobileMenu}
          aria-label="Open menu"
        >
          <MenuIcon />
        </button>
      </nav>

      <div style={mobileMenuStyles}>
        <button 
          style={mobileMenuCloseButtonStyles} 
          onClick={toggleMobileMenu}
          aria-label="Close menu"
        >
          <CloseIcon />
        </button>

        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          {links.map((link, index) => (
            <Link 
              key={index} 
              to={link.to} 
              style={mobileLinkStyles}
              onClick={toggleMobileMenu}
            >
              {link.label}
            </Link>
          ))}

          <div style={mobileActionsStyles}>
            {actions.map((action, index) => (
              <div key={index} style={mobileActionButtonStyles}>
                {action}
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

Navbar.propTypes = {
  logo: PropTypes.node,
  links: PropTypes.arrayOf(
    PropTypes.shape({
      to: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      active: PropTypes.bool,
    })
  ),
  actions: PropTypes.arrayOf(PropTypes.node),
  position: PropTypes.oneOf(['fixed', 'absolute', 'relative', 'static', 'sticky']),
  style: PropTypes.object,
  className: PropTypes.string,
};

export default Navbar;