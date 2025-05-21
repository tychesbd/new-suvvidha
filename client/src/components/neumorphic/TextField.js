import React from 'react';
import PropTypes from 'prop-types';
import theme from './theme';

const {  colors, borderRadius, spacing, createNeumorphicStyle } = theme;

/**
 * Neumorphic TextField Component
 * A soft, inset text input with subtle shadows that appears carved into the surface
 */
const TextField = ({
  label,
  value,
  onChange,
  placeholder,
  type = 'text',
  disabled = false,
  fullWidth = false,
  error = false,
  helperText,
  style,
  className,
  ...props
}) => {
  // Container styles
  const containerStyles = {
    display: 'flex',
    flexDirection: 'column',
    width: fullWidth ? '100%' : 'auto',
    marginBottom: spacing.md,
  };

  // Label styles
  const labelStyles = {
    marginBottom: spacing.xs,
    fontSize: '0.875rem',
    fontWeight: 500,
    color: error ? colors.error.main : colors.text.primary,
  };

  // Input wrapper styles with neumorphic effect
  const inputWrapperStyles = {
    ...createNeumorphicStyle('pressed', colors.background),
    borderRadius: borderRadius.medium,
    padding: `${spacing.xs} ${spacing.sm}`,
    transition: 'all 0.3s ease',
    border: error ? `1px solid ${colors.error.main}` : 'none',
  };

  // Input field styles
  const inputStyles = {
    width: '100%',
    background: 'transparent',
    border: 'none',
    outline: 'none',
    fontSize: '1rem',
    color: disabled ? colors.text.disabled : colors.text.primary,
    padding: spacing.sm,
    '&:focus': {
      outline: 'none',
    },
  };

  // Helper text styles
  const helperTextStyles = {
    fontSize: '0.75rem',
    marginTop: spacing.xs,
    color: error ? colors.error.main : colors.text.secondary,
  };

  return (
    <div style={{ ...containerStyles, ...style }} className={className}>
      {label && <label style={labelStyles}>{label}</label>}
      <div style={inputWrapperStyles}>
        <input
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          style={inputStyles}
          {...props}
        />
      </div>
      {helperText && <div style={helperTextStyles}>{helperText}</div>}
    </div>
  );
};

TextField.propTypes = {
  label: PropTypes.string,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onChange: PropTypes.func,
  placeholder: PropTypes.string,
  type: PropTypes.string,
  disabled: PropTypes.bool,
  fullWidth: PropTypes.bool,
  error: PropTypes.bool,
  helperText: PropTypes.string,
  style: PropTypes.object,
  className: PropTypes.string,
};

export default TextField;