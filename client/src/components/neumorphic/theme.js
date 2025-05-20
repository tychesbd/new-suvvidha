/**
 * Neumorphic UI Theme
 * A soft, extruded UI design system with subtle shadows and monochromatic colors
 */

// Base colors
export const colors = {
  background: '#e0e0e0', // Light gray background
  text: {
    primary: '#333333',
    secondary: '#666666',
    disabled: '#999999',
  },
  primary: {
    main: '#5a77e6',
    light: '#7b93eb',
    dark: '#4a61c9',
  },
  secondary: {
    main: '#e65a77',
    light: '#eb7b93',
    dark: '#c94a61',
  },
  success: {
    main: '#4caf50',
    light: '#81c784',
    dark: '#388e3c',
  },
  error: {
    main: '#f44336',
    light: '#e57373',
    dark: '#d32f2f',
  },
  warning: {
    main: '#ff9800',
    light: '#ffb74d',
    dark: '#f57c00',
  },
  info: {
    main: '#2196f3',
    light: '#64b5f6',
    dark: '#1976d2',
  },
};

// Shadow configurations
export const shadows = {
  small: {
    light: '3px 3px 6px rgba(0, 0, 0, 0.1)',
    dark: '-3px -3px 6px rgba(255, 255, 255, 0.8)',
  },
  medium: {
    light: '5px 5px 10px rgba(0, 0, 0, 0.1)',
    dark: '-5px -5px 10px rgba(255, 255, 255, 0.8)',
  },
  large: {
    light: '10px 10px 20px rgba(0, 0, 0, 0.1)',
    dark: '-10px -10px 20px rgba(255, 255, 255, 0.8)',
  },
  inset: {
    light: 'inset 2px 2px 5px rgba(0, 0, 0, 0.15)',
    dark: 'inset -2px -2px 5px rgba(255, 255, 255, 0.7)',
  },
};

// Border radius
export const borderRadius = {
  small: '8px',
  medium: '12px',
  large: '16px',
  round: '50%',
};

// Spacing
export const spacing = {
  xs: '4px',
  sm: '8px',
  md: '16px',
  lg: '24px',
  xl: '32px',
  xxl: '48px',
};

// Typography
export const typography = {
  fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
  fontWeightLight: 300,
  fontWeightRegular: 400,
  fontWeightMedium: 500,
  fontWeightBold: 700,
  h1: {
    fontSize: '2.5rem',
    fontWeight: 500,
  },
  h2: {
    fontSize: '2rem',
    fontWeight: 500,
  },
  h3: {
    fontSize: '1.75rem',
    fontWeight: 500,
  },
  h4: {
    fontSize: '1.5rem',
    fontWeight: 500,
  },
  h5: {
    fontSize: '1.25rem',
    fontWeight: 500,
  },
  h6: {
    fontSize: '1rem',
    fontWeight: 500,
  },
  body1: {
    fontSize: '1rem',
  },
  body2: {
    fontSize: '0.875rem',
  },
  button: {
    fontSize: '0.875rem',
    textTransform: 'none',
    fontWeight: 500,
  },
};

// Helper functions
export const createNeumorphicStyle = (type = 'flat', color = colors.background) => {
  switch (type) {
    case 'flat':
      return {
        backgroundColor: color,
        boxShadow: `${shadows.medium.light}, ${shadows.medium.dark}`,
      };
    case 'pressed':
    case 'inset':
      return {
        backgroundColor: color,
        boxShadow: `${shadows.inset.light}, ${shadows.inset.dark}`,
      };
    case 'concave':
      return {
        backgroundColor: color,
        boxShadow: `${shadows.medium.light}, ${shadows.medium.dark}`,
        background: `linear-gradient(145deg, ${adjustColor(color, -10)}, ${adjustColor(color, 10)})`,
      };
    case 'convex':
      return {
        backgroundColor: color,
        boxShadow: `${shadows.medium.light}, ${shadows.medium.dark}`,
        background: `linear-gradient(145deg, ${adjustColor(color, 10)}, ${adjustColor(color, -10)})`,
      };
    default:
      return {
        backgroundColor: color,
        boxShadow: `${shadows.medium.light}, ${shadows.medium.dark}`,
      };
  }
};

// Helper function to adjust color brightness
function adjustColor(color, amount) {
  // Convert hex to RGB
  let r, g, b;
  if (color.startsWith('#')) {
    r = parseInt(color.slice(1, 3), 16);
    g = parseInt(color.slice(3, 5), 16);
    b = parseInt(color.slice(5, 7), 16);
  } else {
    // Default to background color if invalid
    r = parseInt(colors.background.slice(1, 3), 16);
    g = parseInt(colors.background.slice(3, 5), 16);
    b = parseInt(colors.background.slice(5, 7), 16);
  }

  // Adjust brightness
  r = Math.max(0, Math.min(255, r + amount));
  g = Math.max(0, Math.min(255, g + amount));
  b = Math.max(0, Math.min(255, b + amount));

  // Convert back to hex
  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
}

export default {
  colors,
  shadows,
  borderRadius,
  spacing,
  typography,
  createNeumorphicStyle,
};