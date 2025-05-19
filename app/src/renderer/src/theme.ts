import { createTheme } from '@mui/material/styles'

export const theme = createTheme({
  palette: {
    mode: 'dark',
    background: {
      default: 'rgb(33,33,33)',
      paper: 'rgb(48,48,48)'
    },
    text: {
      primary: '#ffffff',
      secondary: 'rgba(255, 255, 255, 0.7)'
    }
  },
  typography: {
    fontSize: 16, // Base font size
    h1: {
      fontSize: '2.5rem'
    },
    h2: {
      fontSize: '2rem'
    },
    h3: {
      fontSize: '1.75rem'
    },
    h4: {
      fontSize: '1.5rem'
    },
    h5: {
      fontSize: '1.25rem'
    },
    h6: {
      fontSize: '1rem'
    },
    body1: {
      fontSize: '1.125rem', // 18px - Similar to ChatGPT's main text
      lineHeight: 1.6,
      color: '#ffffff'
    },
    body2: {
      fontSize: '1rem', // 16px
      lineHeight: 1.6,
      color: '#ffffff'
    }
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          fontSize: '1.125rem', // 18px base font size
          backgroundColor: 'rgb(33,33,33)',
          color: '#ffffff'
        },
        '@keyframes pulse': {
          '0%': {
            opacity: 1
          },
          '50%': {
            opacity: 0.3
          },
          '100%': {
            opacity: 1
          }
        }
      }
    }
  }
})
