import React from 'react'
import { Grid, Card, CardContent, Typography, Button } from '@mui/material'
import { useCartDispatch } from './CartContext'

export default function ProductGrid({ items }) {
  const dispatch = useCartDispatch()

  function add(item) { dispatch({ type: 'add', item }) }

  return (
    <Grid container spacing={3}>
      {items.map(p => (
        <Grid item key={p.id} xs={12} sm={6} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6">{p.name}</Typography>
              <Typography color="text.secondary">{p.type} — {p.breed}</Typography>
              <Typography>${p.price}</Typography>
              <Button size="small" sx={{ mt: 1 }} onClick={() => add(p)}>Add to Cart</Button>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  )
}
