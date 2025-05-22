import { Dialog, DialogTitle, DialogContent, Typography, Box, styled, IconButton } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import type { PlayerState } from '../../store/playerSlice'

interface PlayerInfoModalProps {
  open: boolean
  onClose: () => void
  player: PlayerState
}

const StatBox = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2),
  backgroundColor: 'rgba(0, 0, 0, 0.1)',
  borderRadius: theme.spacing(1),
  marginBottom: theme.spacing(2)
}))

const TraitChip = styled(Box)(({ theme }) => ({
  display: 'inline-block',
  padding: theme.spacing(0.5, 1),
  backgroundColor: 'rgba(0, 0, 0, 0.2)',
  borderRadius: theme.spacing(1),
  marginRight: theme.spacing(1),
  marginBottom: theme.spacing(1)
}))

export const PlayerInfoModal = ({
  open,
  onClose,
  player
}: PlayerInfoModalProps): React.JSX.Element => {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography variant="h5" component="div">
            {player.name}
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            Level {player.level}
          </Typography>
        </Box>
        <IconButton onClick={onClose} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <StatBox>
          <Typography variant="h6" gutterBottom>
            Experience
          </Typography>
          <Typography variant="body2">{player.experience} / 100 XP</Typography>
        </StatBox>

        <StatBox>
          <Typography variant="h6" gutterBottom>
            Reputation
          </Typography>
          <Typography variant="body2">{player.reputation || 'Unknown'}</Typography>
        </StatBox>

        <StatBox>
          <Typography variant="h6" gutterBottom>
            Traits
          </Typography>
          <Box>
            {player.traits.map((trait, index) => (
              <TraitChip key={index}>
                <Typography variant="body2">{trait}</Typography>
              </TraitChip>
            ))}
          </Box>
        </StatBox>

        <StatBox>
          <Typography variant="h6" gutterBottom>
            Inventory
          </Typography>
          <Box>
            {player.inventory.length > 0 ? (
              player.inventory.map((item, index) => (
                <TraitChip key={index}>
                  <Typography variant="body2">{item}</Typography>
                </TraitChip>
              ))
            ) : (
              <Typography variant="body2" color="text.secondary">
                No items in inventory
              </Typography>
            )}
          </Box>
        </StatBox>
      </DialogContent>
    </Dialog>
  )
}
