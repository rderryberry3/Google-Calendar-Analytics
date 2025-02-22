import { useGoogleLogin } from '@react-oauth/google';
import { Button, Box, Typography, Paper } from '@mui/material';
import { Google as GoogleIcon } from '@mui/icons-material';

interface AuthProps {
  onAuthSuccess: () => void;
}

const Auth = ({ onAuthSuccess }: AuthProps) => {
  const login = useGoogleLogin({
    scope: 'https://www.googleapis.com/auth/calendar.readonly',
    onSuccess: (response) => {
      // Store the access token
      localStorage.setItem('googleAccessToken', response.access_token);
      onAuthSuccess();
    },
    onError: () => {
      console.error('Login Failed');
    }
  });

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '60vh',
      }}
    >
      <Paper
        elevation={3}
        sx={{
          p: 4,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          maxWidth: 400,
          width: '100%',
        }}
      >
        <Typography variant="h4" component="h1" gutterBottom>
          Calendar Analytics
        </Typography>
        <Typography variant="body1" sx={{ mb: 3, textAlign: 'center' }}>
          Sign in with Google to analyze your calendar usage
        </Typography>
        <Button
          variant="contained"
          startIcon={<GoogleIcon />}
          onClick={() => login()}
          size="large"
          sx={{ mt: 2 }}
        >
          Sign in with Google
        </Button>
      </Paper>
    </Box>
  );
};

export default Auth; 