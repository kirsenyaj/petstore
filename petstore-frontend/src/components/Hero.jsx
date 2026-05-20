import React from 'react'
import { Box, Typography, Button, Container } from '@mui/material'

export default function Hero() {
  return (
    <Box component="section" sx={{ py: 8, background: 'linear-gradient(90deg, rgba(255,122,89,0.06), rgba(122,211,166,0.02))' }}>
      <Container>
        <Typography variant="h3" component="h2" gutterBottom sx={{ fontWeight: 800 }}>
          Find your new best friend
        </Typography>
        <Typography variant="subtitle1" sx={{ mb: 3, color: 'text.secondary', maxWidth: 680 }}>
          Thoughtfully curated pets — healthy, vet-checked, and ready to join your family. Browse by type, breed, or personality.
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          <Button variant="contained" color="primary" size="large">Browse Pets</Button>
          <Button variant="outlined" color="primary">Learn More</Button>
        </Box>
      </Container>
      <Box sx={{ height: 8, background: 'linear-gradient(90deg,#FF7A59,#7AD3A6)', mt: 6 }} />
    </Box>
  )
}
