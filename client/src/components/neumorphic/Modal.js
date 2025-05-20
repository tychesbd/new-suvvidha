import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { colors, borderRadius, spacing, createNeumorphicStyle } from './theme';

/**
 * Neumorphic Modal Component
 * A soft, extruded modal dialog with subtle shadows for displaying content in focus
 */
const Modal = ({
  open,
  onClose,
  children,
  title,
  maxWidth = 'sm',
  fullWidth = false,
  disableBackdropClick = false,
  style,
  className,
  ...props
}) => {
  const modalRef = useRef(null);

  // Handle click outside to close modal
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        !disableBackdropClick &&
        modalRef.current &&
        !modalRef.current.contains(event.target) &&
        open
      ) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose, disableBackdropClick, open]);

  // Handle escape key to close modal
  useEffect(() => {
    const handleEscKey = (event) => {
      if (event.key === 'Escape' && open) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscKey);
    return () => {
      document.removeEventListener('keydown', handleEscKey);
    };
  }, [onClose, open]);

  // Prevent body scrolling when modal is open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  // Get max width based on size
  const getMaxWidth = () => {
    switch (maxWidth) {
      case 'xs':
        return '444px';
      case 'sm':
        return '600px';
      case 'md':
        return '900px';
      case 'lg':
        return '1200px';
      case 'xl':
        return '1536px';
      default:
        return '600px';
    }
  };

  // Backdrop styles
  const backdropStyles = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: open ? 'flex' : 'none',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1300,
    backdropFilter: 'blur(2px)',
  };

  // Modal container styles with neumorphic effect
  const modalStyles = {
    ...createNeumorphicStyle('flat', colors.background),
    borderRadius: borderRadius.large,
    padding: spacing.lg,
    maxWidth: getMaxWidth(),
    width: fullWidth ? '100%' : 'auto',
    maxHeight: '90vh',
    overflowY: 'auto',
    margin: spacing.md,
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
  };

  // Header styles
  const headerStyles = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  };

  // Title styles
  const titleStyles = {
    margin: 0,
    fontSize: '1.25rem',
    fontWeight: 500,
    color: colors.text.primary,
  };

  // Close button styles
  const closeButtonStyles = {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    fontSize: '1.5rem',
    color: colors.text.secondary,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xs,
    borderRadius: borderRadius.round,
    ...createNeumorphicStyle('pressed'),
    width: '32px',
    height: '32px',
    lineHeight: 1,
  };

  // Content styles
  const contentStyles = {
    flex: 1,
  };

  if (!open) return null;

  return (
    <div style={backdropStyles}>
      <div
        ref={modalRef}
        style={{ ...modalStyles, ...style }}
        className={className}
        {...props}
      >
        {title && (
          <div style={headerStyles}>
            <h2 style={titleStyles}>{title}</h2>
            <button style={closeButtonStyles} onClick={onClose}>
              ×
            </button>
          </div>
        )}
        <div style={contentStyles}>{children}</div>
      </div>
    </div>
  );
};

Modal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  children: PropTypes.node,
  title: PropTypes.node,
  maxWidth: PropTypes.oneOf(['xs', 'sm', 'md', 'lg', 'xl']),
  fullWidth: PropTypes.bool,
  disableBackdropClick: PropTypes.bool,
  style: PropTypes.object,
  className: PropTypes.string,
};

export default Modal;