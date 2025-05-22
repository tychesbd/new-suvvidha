import React from 'react';
import PropTypes from 'prop-types';
import Card from './Card';
import Typography from './Typography';
import Box from './Box';
import theme from './theme';

const { colors, spacing } = theme;


/**
 * Neumorphic Dashboard Tile Component
 * A versatile tile for dashboards, using neumorphic Card as a base.
 */
const DashboardTile = ({
  title,
  icon,
  children,
  variant = 'convex',
  onClick,
  style,
  className,
  headerContent, // Allows for custom content in the header beside the title
  footerContent, // Allows for custom content in the footer
  ...props
}) => {
  const tileStyle = {
    display: 'flex',
    flexDirection: 'column',
    height: '100%', // Make tile take full height of its container if needed
    ...(onClick && { cursor: 'pointer' }),
    ...style,
  };

  const headerStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: `${spacing.sm} ${spacing.md}`,
    borderBottom: `1px solid ${colors.backgroundLight}`,
  };

  const titleStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: spacing.sm,
  };

  const contentStyle = {
    padding: spacing.md,
    flexGrow: 1, // Allows content to fill available space
    overflowY: 'auto', // Add scroll for overflowing content
  };

  const footerStyle = {
    padding: `${spacing.sm} ${spacing.md}`,
    borderTop: `1px solid ${colors.backgroundLight}`,
    marginTop: 'auto', // Pushes footer to the bottom
  };

  return (
    <Card 
      variant={variant} 
      style={tileStyle}
      className={`neumorphic-dashboardtile ${className || ''}`}
      onClick={onClick}
      {...props}
    >
      {(title || icon || headerContent) && (
        <Box style={headerStyle}>
          <Box style={titleStyle}>
            {icon && React.cloneElement(icon, { style: { fontSize: '1.2rem', color: colors.text.secondary } })}
            {title && (
              <Typography variant="subtitle1" component="h3" color={colors.text.primary}>
                {title}
              </Typography>
            )}
          </Box>
          {headerContent}
        </Box>
      )}
      
      <Box style={contentStyle}>
        {children}
      </Box>

      {footerContent && (
        <Box style={footerStyle}>
          {footerContent}
        </Box>
      )}
    </Card>
  );
};

DashboardTile.propTypes = {
  title: PropTypes.string,
  icon: PropTypes.element, // Expect a React element for the icon, e.g., <i className="fas fa-chart-line"></i>
  children: PropTypes.node.isRequired,
  variant: PropTypes.oneOf(['flat', 'convex', 'concave', 'inset']),
  onClick: PropTypes.func,
  style: PropTypes.object,
  className: PropTypes.string,
  headerContent: PropTypes.node,
  footerContent: PropTypes.node,
};

export default DashboardTile;