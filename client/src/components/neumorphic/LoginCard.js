import React from 'react';
import PropTypes from 'prop-types';
import Card from './Card';
import TextField from './TextField';
import Button from './Button';
import Typography from './Typography';
import Box from './Box';
import theme from './theme';

const { colors } = theme;


/**
 * Neumorphic Login Card Component
 * A specialized card for login forms, with neumorphic styling.
 */
const LoginCard = ({
  title = 'Login',
  onLogin,
  usernameLabel = 'Username',
  passwordLabel = 'Password',
  buttonText = 'Sign In',
  isLoading = false,
  errorMessage,
  style,
  className,
  children,
  ...props
}) => {
  const [username, setUsername] = React.useState('');
  const [password, setPassword] = React.useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    if (onLogin) {
      onLogin({ username, password });
    }
  };

  return (
    <Card 
      variant="convex" 
      style={{
        padding: '30px',
        maxWidth: '400px',
        margin: 'auto',
        ...style
      }}
      className={`neumorphic-logincard ${className || ''}`}
      {...props}
    >
      <form onSubmit={handleSubmit}>
        <Box style={{ textAlign: 'center', marginBottom: '20px' }}>
          <Typography variant="h5" component="h2" color={colors.text.primary}>
            {title}
          </Typography>
        </Box>
        
        <TextField
          label={usernameLabel}
          fullWidth
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          style={{ marginBottom: '20px' }}
          disabled={isLoading}
        />
        
        <TextField
          label={passwordLabel}
          type="password"
          fullWidth
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{ marginBottom: '25px' }}
          disabled={isLoading}
        />
        
        {errorMessage && (
          <Box style={{ marginBottom: '15px', textAlign: 'center' }}>
            <Typography variant="caption" style={{ color: colors.error.main }}>
              {errorMessage}
            </Typography>
          </Box>
        )}
        
        <Button 
          type="submit" 
          variant="primary" 
          fullWidth 
          disabled={isLoading}
          style={{ minHeight: '44px' }}
        >
          {isLoading ? 'Signing In...' : buttonText}
        </Button>
        
        {children && (
          <Box style={{ marginTop: '20px', textAlign: 'center' }}>
            {children}
          </Box>
        )}
      </form>
    </Card>
  );
};

LoginCard.propTypes = {
  title: PropTypes.string,
  onLogin: PropTypes.func.isRequired,
  usernameLabel: PropTypes.string,
  passwordLabel: PropTypes.string,
  buttonText: PropTypes.string,
  isLoading: PropTypes.bool,
  errorMessage: PropTypes.string,
  style: PropTypes.object,
  className: PropTypes.string,
  children: PropTypes.node, // For additional links like 'Forgot Password?' or 'Sign Up'
};

export default LoginCard;