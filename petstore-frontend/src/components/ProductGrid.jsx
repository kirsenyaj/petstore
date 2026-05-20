import React, { useState, Suspense } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Box, Grid, Typography, IconButton, Drawer, Button } from '@mui/material'
import MenuIcon from '@mui/icons-material/Menu'
import ProductCard from './ProductCard'
const QuickViewModal = React.lazy(() => import('./QuickViewModal'))
const FloatingCart = React.lazy(() => import('./FloatingCart'))
import SkeletonCard from './SkeletonCard'
import { useCartDispatch } from './CartContext'

export default function ProductGrid({ items, loading, search }) {
  const [filtersOpen, setFiltersOpen] = useState(false)
  const [quickView, setQuickView] = useState(null)
  const [cartOpen, setCartOpen] = useState(false)
  const dispatch = useCartDispatch()

  function handleAdd(product, qty = 1) {
    for (let i = 0; i < qty; i++) dispatch({ type: 'add', item: product })
    if (typeof openCart === 'function') openCart()
    else setCartOpen(true)
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6">Products</Typography>
        <IconButton sx={{ display: { xs: 'block', md: 'none' } }} onClick={() => setFiltersOpen(true)}><MenuIcon /></IconButton>
      </Box>

      {loading ? (
        <Grid container spacing={3}>
          {Array.from({ length: 8 }).map((_, i) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={i}><SkeletonCard /></Grid>
          ))}
        </Grid>
      ) : (
        <Grid container spacing={3} sx={{ gridTemplateColumns: { xs: 'repeat(1,1fr)', sm: 'repeat(2,1fr)', md: 'repeat(3,1fr)', lg: 'repeat(4,1fr)' } }}>
          <AnimatePresence>
            {(
              search && search.trim() ? items.filter(p => {
                const q = search.toLowerCase()
                return (p.name || '').toLowerCase().includes(q) || (p.breed||'').toLowerCase().includes(q) || (p.type||'').toLowerCase().includes(q)
              }) : items
            ).map((p, i) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={p.id}>
                <motion.div layout key={p.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0, transition: { delay: i * 0.04, duration: 0.42 } }} exit={{ opacity: 0, y: -8 }}>
                  <ProductCard product={p} onQuickView={setQuickView} onAdd={handleAdd} />
                </motion.div>
              </Grid>
            ))}
          </AnimatePresence>
        </Grid>
      )}

      <Suspense fallback={null}>
        <QuickViewModal open={!!quickView} product={quickView} onClose={() => setQuickView(null)} onAdd={handleAdd} />
        <FloatingCart open={cartOpen} onClose={() => setCartOpen(false)} />
      </Suspense>

      <Drawer anchor="left" open={filtersOpen} onClose={() => setFiltersOpen(false)}>
        <Box sx={{ width: 300, p: 2 }}>
          <Typography variant="h6">Filters</Typography>
          <Button onClick={() => setFiltersOpen(false)} sx={{ mt: 2 }}>Close</Button>
        </Box>
      </Drawer>
    </Box>
  )
}
