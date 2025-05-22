import { Box, Typography } from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import { NavigationProps } from '../types'
import { StyledButton } from '../styles'

export const ModificationsScreen = ({ onNavigate }: NavigationProps): React.JSX.Element => (
  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      <Box>
        <Typography variant="h6" gutterBottom>
          Modifications
        </Typography>
        <Typography variant="body2" color="text.secondary">
          No modifications installed
        </Typography>
      </Box>
      <StyledButton
        variant="outlined"
        startIcon={<AddIcon />}
        onClick={() => onNavigate('add-modification')}
      >
        Add Modification
      </StyledButton>
    </Box>
  </Box>
)
