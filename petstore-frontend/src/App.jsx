import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { Container, Grid, Card, CardContent, Typography, Button } from '@mui/material'

const API = import.meta.env.VITE_API_BASE || 'http://localhost:8080/villanueva/api/v1'

export default function App() {
  const [pets, setPets] = useState([])

  useEffect(() => {
    fetchPets()
  }, [])

  async function fetchPets() {
    try {
      const res = await axios.get(`${API}/pets`)
      setPets(res.data)
    } catch (e) {
      console.error(e)
    }
  }

  return (
    <Container className="mt-6">
      <Typography variant="h3" component="h1" gutterBottom>Petstore</Typography>
      <Grid container spacing={2}>
        {pets.map(p => (
          <Grid item key={p.id} xs={12} sm={6} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h6">{p.name}</Typography>
                <Typography color="text.secondary">{p.type} — {p.breed}</Typography>
                <Typography>${p.price}</Typography>
                <Button size="small" sx={{ mt: 1 }}>Add to Cart</Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  )
}
