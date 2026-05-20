import React from 'react'
import { Box, Typography, Button, Container } from '@mui/material'

export default function Hero() {
  return (
    <Box component="section" sx={{ py: 6 }}>
      <Container>
        <Typography variant="h3" component="h2" gutterBottom>
          Welcome to Petstore
        </Typography>
        <Typography variant="subtitle1" sx={{ mb: 3, color: 'text.secondary' }}>
          Find a new friend — thoughtfully curated, healthy, and ready for adoption.
        </Typography>
        <Button variant="contained" color="primary">Browse Pets</Button>
      </Container>
    </Box>
  )
}
