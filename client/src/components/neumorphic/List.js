import React from 'react';
import PropTypes from 'prop-types';
import theme from './theme';

const { createNeumorphicStyle, colors, spacing } = theme;


/**
 * Neumorphic List Component
 * Displays data in a soft, extruded list format with subtle shadows
 */
const List = ({ 
  children, 
  variant = 'flat', 
  spacing = 'md',
  dividers = false,
  backgroundColor = colors.background,
  style,
  ...props 
}) => {
  const spacingValues = {
    xs: '4px',
    sm: '8px',
    md: '12px',
    lg: '16px',
    xl: '24px'
  };

  const baseStyle = {
    ...createNeumorphicStyle(variant),
    backgroundColor,
    borderRadius: '12px',
    padding: '8px 0',
    overflow: 'hidden',
    ...style
  };

  return (
    <ul
      style={baseStyle}
      {...props}
    >
      {React.Children.map(children, (child, index) => (
        <li
          style={{
            padding: `${spacingValues[spacing]} ${spacingValues.md}`,
            borderBottom: dividers && index < React.Children.count(children) - 1 
              ? `1px solid ${colors.divider}` 
              : 'none',
            transition: 'background-color 0.2s ease',
            ':hover': {
              backgroundColor: colors.hover
            }
          }}
        >
          {child}
        </li>
      ))}
    </ul>
  );
};

const ListItem = ({ children, style, ...props }) => {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        ...style
      }}
      {...props}
    >
      {children}
    </div>
  );
};

const ListItemText = ({ primary, secondary, style, ...props }) => {
  return (
    <div
      style={{
        flex: 1,
        ...style
      }}
      {...props}
    >
      <div style={{ fontWeight: 500, color: colors.text.primary }}>{primary}</div>
      {secondary && (
        <div style={{ fontSize: '0.875rem', color: colors.text.secondary }}>
          {secondary}
        </div>
      )}
    </div>
  );
};

const ListItemIcon = ({ children, style, ...props }) => {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        marginRight: spacing.md,
        ...style
      }}
      {...props}
    >
      {children}
    </div>
  );
};

List.propTypes = {
  children: PropTypes.node,
  variant: PropTypes.oneOf(['flat', 'pressed', 'concave', 'convex']),
  spacing: PropTypes.oneOf(['xs', 'sm', 'md', 'lg', 'xl']),
  dividers: PropTypes.bool,
  backgroundColor: PropTypes.string,
  style: PropTypes.object
};

ListItem.propTypes = {
  children: PropTypes.node,
  style: PropTypes.object
};

ListItemText.propTypes = {
  primary: PropTypes.node,
  secondary: PropTypes.node,
  style: PropTypes.object
};

ListItemIcon.propTypes = {
  children: PropTypes.node,
  style: PropTypes.object
};

List.Item = ListItem;
List.ItemText = ListItemText;
List.ItemIcon = ListItemIcon;

export default List;