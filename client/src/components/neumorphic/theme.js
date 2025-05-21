/**
 * Neumorphic UI Theme
 * A soft, extruded UI design system with subtle shadows and monochromatic colors
 */

// Helper function to adjust color brightness
const adjustColor = (color, amount) => {
  const clamp = (num) => Math.min(255, Math.max(0, num));
  const hex = color.replace('#', '');
  const r = parseInt(hex.slice(0, 2), 16);
  const g = parseInt(hex.slice(2, 4), 16);
  const b = parseInt(hex.slice(4, 6), 16);
  
  const adjustedR = clamp(r + amount);
  const adjustedG = clamp(g + amount);
  const adjustedB = clamp(b + amount);
  
  return `#${adjustedR.toString(16).padStart(2, '0')}${adjustedG.toString(16).padStart(2, '0')}${adjustedB.toString(16).padStart(2, '0')}`;
};

// Create a single theme object that includes all our theme properties and functions
const theme = {
  colors: {
    background: '#e6e9ef',
    surface: '#e0e5ec',
    text: {
      primary: '#2d3436',
      secondary: '#636e72',
      disabled: '#b2bec3',
    },
    primary: {
      main: '#6c5ce7',
      light: '#a29bfe',
      dark: '#5641e5',
    },
    secondary: {
      main: '#00cec9',
      light: '#81ecec',
      dark: '#00b5b1',
    },
    success: {
      main: '#00b894',
      light: '#55efc4',
      dark: '#00a885',
    },
    error: {
      main: '#ff7675',
      light: '#fab1a0',
      dark: '#e66767',
    },
    warning: {
      main: '#ffeaa7',
      light: '#ffecc7',
      dark: '#fdcb6e',
    },
    info: {
      main: '#74b9ff',
      light: '#c7ecee',
      dark: '#0984e3',
    },
  },

  shadows: {
    small: {
      light: '3px 3px 6px rgba(174, 174, 192, 0.4)',
      dark: '-3px -3px 6px rgba(255, 255, 255, 0.7)',
    },
    medium: {
      light: '5px 5px 10px rgba(174, 174, 192, 0.4)',
      dark: '-5px -5px 10px rgba(255, 255, 255, 0.7)',
    },
    large: {
      light: '10px 10px 20px rgba(174, 174, 192, 0.4)',
      dark: '-10px -10px 20px rgba(255, 255, 255, 0.7)',
    },
    inner: {
      light: 'inset 2px 2px 5px rgba(174, 174, 192, 0.4)',
      dark: 'inset -2px -2px 5px rgba(255, 255, 255, 0.7)',
    },
  },

  borderRadius: {
    small: '8px',
    medium: '12px',
    large: '16px',
    full: '9999px',
  },

  spacing: {
    xs: '4px',
    sm: '8px',
    md: '16px',
    lg: '24px',
    xl: '32px',
    xxl: '48px',
  },

  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    fontWeightLight: 300,
    fontWeightRegular: 400,
    fontWeightMedium: 500,
    fontWeightBold: 700,
    h1: {
      fontSize: '2.5rem',
      fontWeight: 500,
      letterSpacing: '-0.01562em',
      lineHeight: 1.2,
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 500,
      letterSpacing: '-0.00833em',
      lineHeight: 1.3,
    },
    h3: {
      fontSize: '1.75rem',
      fontWeight: 500,
      letterSpacing: '0em',
      lineHeight: 1.4,
    },
    h4: {
      fontSize: '1.5rem',
      fontWeight: 500,
      letterSpacing: '0.00735em',
      lineHeight: 1.4,
    },
    h5: {
      fontSize: '1.25rem',
      fontWeight: 500,
      letterSpacing: '0em',
      lineHeight: 1.5,
    },
    h6: {
      fontSize: '1rem',
      fontWeight: 500,
      letterSpacing: '0.0075em',
      lineHeight: 1.6,
    },
    subtitle1: {
      fontSize: '1rem',
      fontWeight: 400,
      letterSpacing: '0.00938em',
      lineHeight: 1.75,
    },
    subtitle2: {
      fontSize: '0.875rem',
      fontWeight: 500,
      letterSpacing: '0.00714em',
      lineHeight: 1.57,
    },
    body1: {
      fontSize: '1rem',
      fontWeight: 400,
      letterSpacing: '0.00938em',
      lineHeight: 1.5,
    },
    body2: {
      fontSize: '0.875rem',
      fontWeight: 400,
      letterSpacing: '0.01071em',
      lineHeight: 1.43,
    },
    button: {
      fontSize: '0.875rem',
      fontWeight: 500,
      letterSpacing: '0.02857em',
      lineHeight: 1.75,
      textTransform: 'uppercase',
    },
    caption: {
      fontSize: '0.75rem',
      fontWeight: 400,
      letterSpacing: '0.03333em',
      lineHeight: 1.66,
    },
    overline: {
      fontSize: '0.75rem',
      fontWeight: 400,
      letterSpacing: '0.08333em',
      lineHeight: 2.66,
      textTransform: 'uppercase',
    },
  },

  // Helper function to create neumorphic styles
  createNeumorphicStyle: (variant, backgroundColor) => {
    switch (variant) {
      case 'pressed':
        return {
          backgroundColor,
          boxShadow: `inset 2px 2px 5px rgba(174, 174, 192, 0.4), inset -2px -2px 5px rgba(255, 255, 255, 0.7)`,
          transform: 'translateY(1px)',
        };
      case 'concave':
        return {
          backgroundColor,
          boxShadow: `inset 2px 2px 5px rgba(174, 174, 192, 0.4), 5px 5px 10px rgba(174, 174, 192, 0.4)`,
          background: `linear-gradient(145deg, ${adjustColor(backgroundColor, -10)}, ${adjustColor(backgroundColor, 10)})`,
        };
      case 'convex':
        return {
          backgroundColor,
          boxShadow: `5px 5px 10px rgba(174, 174, 192, 0.4), -5px -5px 10px rgba(255, 255, 255, 0.7)`,
          background: `linear-gradient(145deg, ${adjustColor(backgroundColor, 10)}, ${adjustColor(backgroundColor, -10)})`,
        };
      case 'flat':
      default:
        return {
          backgroundColor,
          boxShadow: `5px 5px 10px rgba(174, 174, 192, 0.4), -5px -5px 10px rgba(255, 255, 255, 0.7)`,
        };
    }
  },
};

export default theme;