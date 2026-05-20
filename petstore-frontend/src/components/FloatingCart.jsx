import React from 'react'
import { Drawer, Box, Typography, IconButton, List, ListItem, ListItemText, Button, Badge } from '@mui/material'
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart'
import CloseIcon from '@mui/icons-material/Close'
import { useCart, useCartDispatch } from './CartContext'

export default function FloatingCart({ open, onClose }) {
  const items = useCart() || []
  const dispatch = useCartDispatch()
  const subtotal = items.reduce((s, i) => s + (i.price || 0) * i.qty, 0)

  return (
    <Drawer anchor="right" open={open} onClose={onClose}>
      <Box sx={{ width: 420, p: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6">Your Cart</Typography>
          <IconButton onClick={onClose}><CloseIcon /></IconButton>
        </Box>
        <List>
          {items.map(it => (
            <ListItem key={it.id} secondaryAction={<IconButton onClick={() => dispatch({ type: 'remove', id: it.id })}>✖</IconButton>}>
              <ListItemText primary={`${it.name} x${it.qty}`} secondary={`$${((it.price||0) * it.qty).toFixed(2)}`} />
            </ListItem>
          ))}
        </List>
        <Box sx={{ mt: 2 }}>
          <Typography sx={{ fontWeight: 700 }}>Subtotal: ${subtotal.toFixed(2)}</Typography>
          <Button variant="contained" fullWidth sx={{ mt: 1 }}>Checkout</Button>
        </Box>
      </Box>
    </Drawer>
  )
}
