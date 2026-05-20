import React from 'react'
import { AppBar, Toolbar, IconButton, Typography, Badge, Box } from '@mui/material'

export default function Header({ onOpenCart }) {
  const items = []
  const total = items.reduce((s, i) => s + (i.qty || 0), 0)

  return (
    <AppBar position="sticky" color="default" elevation={1} sx={{ mb: 4 }}>
      <Toolbar>
        <IconButton edge="start" color="inherit" aria-label="menu" sx={{ mr: 2 }}>
          <span aria-hidden>☰</span>
        </IconButton>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>Petstore</Typography>
        <Box>
          <IconButton aria-label={`Cart with ${total} items`} color="inherit" onClick={onOpenCart}>
            <Badge badgeContent={total} color="primary">
              <span aria-hidden>🛒</span>
            </Badge>
          </IconButton>
        </Box>
      </Toolbar>
    </AppBar>
  )
}
