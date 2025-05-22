import React from 'react';
import PropTypes from 'prop-types';
import { colors, borderRadius, spacing, createNeumorphicStyle } from './theme';
import Box from './Box';

const Dialog = ({
  open,
  onClose,
  title,
  children,
  maxWidth = 'sm',
  fullWidth = false,
  style,
  className,
  ...props
}) => {
  if (!open) return null;

  // Calculate max width based on size
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
        return maxWidth;
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
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1300,
  };

  // Dialog styles with neumorphic effect
  const dialogStyles = {
    backgroundColor: colors.background,
    borderRadius: borderRadius.large,
    padding: spacing.lg,
    width: fullWidth ? '90%' : 'auto',
    maxWidth: getMaxWidth(),
    maxHeight: '90vh',
    overflowY: 'auto',
    position: 'relative',
    ...createNeumorphicStyle('flat', colors.background),
    ...style,
  };

  return (
    <div style={backdropStyles} onClick={onClose}>
      <Box 
        style={dialogStyles} 
        className={className} 
        onClick={(e) => e.stopPropagation()}
        variant="flat"
        {...props}
      >
        {children}
      </Box>
    </div>
  );
};

Dialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  title: PropTypes.node,
  children: PropTypes.node,
  maxWidth: PropTypes.oneOf(['xs', 'sm', 'md', 'lg', 'xl']),
  fullWidth: PropTypes.bool,
  style: PropTypes.object,
  className: PropTypes.string,
};

export default Dialog;
