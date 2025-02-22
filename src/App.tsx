import { useState } from 'react'
import { GoogleOAuthProvider } from '@react-oauth/google'
import { ThemeProvider, CssBaseline, Container, Box } from '@mui/material'
import { createTheme } from '@mui/material/styles'
import Auth from './components/Auth'
import CalendarAnalytics from './components/CalendarAnalytics'
import './App.css'

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
})

// Replace with your Google OAuth Client ID
const GOOGLE_CLIENT_ID = '37470016365-u3io6m5mcrjr8vpju21f20j1de63ic1j.apps.googleusercontent.com'

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Container maxWidth="lg">
          <Box sx={{ my: 4 }}>
            {!isAuthenticated ? (
              <Auth onAuthSuccess={() => setIsAuthenticated(true)} />
            ) : (
              <CalendarAnalytics />
            )}
          </Box>
        </Container>
      </ThemeProvider>
    </GoogleOAuthProvider>
  )
}

export default App
