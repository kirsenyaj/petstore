import React from 'react'
import { Drawer, Box, Typography, IconButton } from '@mui/material'

export default function CartDrawer({ open, onClose }) {
  return (
    <Drawer anchor="right" open={open} onClose={onClose}>
      <Box sx={{ width: 320, p: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6">Your Cart</Typography>
          <IconButton onClick={onClose}>✖</IconButton>
        </Box>
      </Box>
    </Drawer>
  )
}
