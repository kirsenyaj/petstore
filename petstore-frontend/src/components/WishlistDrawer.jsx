import React from 'react'
import { Drawer, Box, Typography, IconButton, List, ListItem, ListItemText, Button } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import { useWishlist, useWishlistDispatch } from './WishlistContext'

export default function WishlistDrawer({ open, onClose }) {
  const items = useWishlist() || []
  const dispatch = useWishlistDispatch()

  return (
    <Drawer anchor="right" open={open} onClose={onClose}>
      <Box sx={{ width: 420, p: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6">Saved Pets</Typography>
          <IconButton onClick={onClose}><CloseIcon /></IconButton>
        </Box>
        <List>
          {items.map(it => (
            <ListItem key={it.id} secondaryAction={<Button onClick={() => dispatch({ type: 'remove', id: it.id })}>Remove</Button>}>
              {/* prefer a remote imageUrl when available */}
              <Box component="img" src={it.imageUrl || `${import.meta.env.BASE_URL || '/'}images/${(it.name||'').toLowerCase()}.jpg`} alt={it.name} sx={{ width: 64, height: 48, objectFit: 'cover', borderRadius: 1, mr: 2 }}
                onLoad={(e) => { try { console.debug('[wish img load]', e?.target?.src) } catch {} }}
                onError={(e) => { try { console.error('[wish img error]', e?.target?.src, e?.type) } catch {} }} />
              <ListItemText primary={it.name} secondary={`${it.type} — ${it.breed}`} />
            </ListItem>
          ))}
        </List>
        <Box sx={{ mt: 2 }}>
          <Button variant="contained" fullWidth onClick={() => { dispatch({ type: 'clear' }); onClose() }}>Clear Saved</Button>
        </Box>
      </Box>
    </Drawer>
  )
}
