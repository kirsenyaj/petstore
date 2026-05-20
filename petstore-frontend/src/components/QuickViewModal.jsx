import React, { useState, useRef, useEffect } from 'react'
import { Dialog, DialogContent, DialogTitle, Box, Typography, IconButton, Button, TextField } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import { motion } from 'framer-motion'
import { useSnackbar } from './SnackbarProvider'

export default function QuickViewModal({ open, product, onClose, onAdd }) {
  const [qty, setQty] = useState(1)
  const triggerRef = useRef(null)
  const snack = useSnackbar()
  const show = snack && snack.show ? snack.show : () => {}
  // Always call hooks in the same order — prepare effect here and guard inside
  useEffect(() => {
    if (open) {
      // remember active element to restore focus on close
      triggerRef.current = document.activeElement
    }
    // when product changes, reset qty
    if (product) setQty(1)
  }, [open, product])

  if (!product) return null

  const baseUrl = import.meta.env.BASE_URL || '/'
  const localImage = `${baseUrl}images/${(product.name || '').toLowerCase()}.svg`
  const imgSrc = product.imageUrl || localImage

  function handleClose() {
    onClose && onClose()
    try { triggerRef.current && triggerRef.current.focus() } catch (e) { /* ignore */ }
  }

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="md" aria-labelledby="quick-view-title">
      <DialogTitle id="quick-view-title" sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span>{product.name}</span>
        <IconButton onClick={handleClose} aria-label="close"><CloseIcon /></IconButton>
      </DialogTitle>
      <DialogContent>
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.36 }}>
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 2 }}>
            <Box>
              <Box component="img" src={imgSrc} alt={product.name} sx={{ width: '100%', height: 360, objectFit: 'cover', borderRadius: 2 }}
                onLoad={(e) => { try { console.debug('[quickview img load]', imgSrc, e?.target?.naturalWidth) } catch {} }}
                onError={(e) => { try { console.error('[quickview img error]', imgSrc, e?.type) } catch {} }} />
            </Box>
            <Box>
              <Typography variant="subtitle1" color="text.secondary">{product.type} — {product.breed}</Typography>
              <Typography sx={{ mt: 2, fontWeight: 700, fontSize: 20 }}>${product.price}</Typography>
              <Typography sx={{ mt: 2 }}>{product.description || 'No description available.'}</Typography>
                <Box sx={{ display: 'flex', gap: 1, mt: 3 }}>
                <TextField type="number" size="small" value={qty} inputProps={{ min: 1 }} onChange={e => setQty(Math.max(1, Number(e.target.value || 1)))} sx={{ width: 120 }} aria-label="Quantity" />
                <Button variant="contained" onClick={() => { onAdd(product, qty); try { show && show(`Added ${product.name} x${qty}`, 'success') } catch(e){}; handleClose() }}>Add {qty}</Button>
              </Box>
            </Box>
          </Box>
        </motion.div>
      </DialogContent>
    </Dialog>
  )
}
