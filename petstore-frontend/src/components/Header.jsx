import React from 'react'
import { AppBar, Toolbar, IconButton, Typography, Badge, Box, Button } from '@mui/material'
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart'
import FavoriteIcon from '@mui/icons-material/Favorite'
import Brightness4Icon from '@mui/icons-material/Brightness4'
import Brightness7Icon from '@mui/icons-material/Brightness7'
import { useCart } from './CartContext'

export default function Header({ onOpenCart, onOpenWishlist, dark, onToggleDark }) {
  const items = useCart() || []
  const total = items.reduce((s, i) => s + (i.qty || 0), 0)

  return (
    <AppBar position="sticky" color="default" elevation={1} sx={{ mb: 4 }}>
      <Toolbar>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mr: 2 }}>
          <Box sx={{ width: 40, height: 40, bgcolor: 'primary.main', borderRadius: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 800 }}>P</Box>
          <Typography variant="h6" component="div">Petstore</Typography>
        </Box>
        <Box sx={{ flexGrow: 1, display: { xs: 'none', sm: 'block' } }}>
          <Typography variant="caption" color="text.secondary">Press <strong>F</strong> to focus search</Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <IconButton aria-label="toggle theme" onClick={onToggleDark}>
            {dark ? <Brightness7Icon /> : <Brightness4Icon />}
          </IconButton>
          <IconButton aria-label="wishlist" onClick={onOpenWishlist}>
            <FavoriteIcon />
          </IconButton>
          <Button variant="text" size="small">Get Started</Button>
          <IconButton aria-label={`Cart with ${total} items`} color="inherit" onClick={onOpenCart}>
            <Badge badgeContent={total} color="primary">
              <ShoppingCartIcon />
            </Badge>
          </IconButton>
        </Box>
      </Toolbar>
    </AppBar>
  )
}
