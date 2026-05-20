import React, { useState, useRef } from 'react'
import { Card, CardActionArea, CardContent, Typography, Box, Button, Chip, Rating, IconButton } from '@mui/material'
import { motion } from 'framer-motion'
import { useSnackbar } from './SnackbarProvider'
import FavoriteIcon from '@mui/icons-material/Favorite'
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder'
import { useWishlist, useWishlistDispatch } from './WishlistContext'

export default function ProductCard({ product, onQuickView, onAdd }) {
  // respect Vite's BASE_URL (important when the app is served from a subpath)
  const baseUrl = import.meta.env.BASE_URL || '/'
  const base = `${baseUrl}images/${(product.name || '').toLowerCase()}`
  const localJpg = `${base}.jpg`
  const localPng = `${base}.png`
  const localSvg = `${base}.svg`
  const preferred = product.imageUrl || localJpg || localPng || localSvg
  const [src, setSrc] = useState(preferred)
  const [loaded, setLoaded] = useState(false)
  const imgRef = useRef()
  const { show } = useSnackbar() || { show: () => {} }
  const wishlist = useWishlist() || []
  const wishlistDispatch = useWishlistDispatch()
  const saved = !!wishlist.find(i => i.id === product.id)

  const handleKey = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      onQuickView(product)
    }
  }

  // deterministic placeholder rating if not provided
  const rating = product.rating || Math.min(5, 3.5 + ((product.id || 1) % 15) / 10)
  const badges = []
  if (product.veteranChecked) badges.push('Veteran Checked')
  if (product.goodWithKids) badges.push('Good with kids')
  if (product.tags && Array.isArray(product.tags)) badges.push(...product.tags.slice(0, 2))
  if (badges.length === 0) badges.push('Healthy')

  function handleAddClick() {
    onAdd(product)
    try { show(`Added ${product.name} to cart`, 'success') } catch (e) { /* ignore */ }
  }

  function toggleSave(e) {
    e.stopPropagation()
    if (saved) wishlistDispatch({ type: 'remove', id: product.id })
    else wishlistDispatch({ type: 'add', item: product })
    try { show(saved ? `Removed ${product.name} from saved` : `Saved ${product.name}`, 'info') } catch (e) {}
  }

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} whileHover={{ y: -6 }} whileTap={{ scale: 0.98 }} style={{ borderRadius: 16 }}>
      <Card tabIndex={-1} className="card-elevate" sx={{ borderRadius: '16px', overflow: 'hidden', position: 'relative' }} role="article" aria-label={`${product.name} card`}>
        <CardActionArea onClick={() => onQuickView(product)} sx={{ display: 'block' }} onKeyDown={handleKey}>
          <Box sx={{ position: 'relative', height: 260, overflow: 'hidden', bg: 'background.paper' }}>
              <Box component="img" ref={imgRef} src={src} loading="lazy" alt={product.name}
                onLoad={(e) => { setLoaded(true); try { console.debug('[img load]', src, e?.target?.naturalWidth, e?.target?.naturalHeight) } catch {} }}
                onError={(e) => {
                  try { console.error('[img error]', src, e?.type || e) } catch {}
                  if (src !== localSvg) setSrc(localSvg)
                  else {
                    const seed = encodeURIComponent((product.name||'pet').toLowerCase())
                    setSrc(`https://picsum.photos/seed/${seed}/800/600`)
                  }
                }}
                className={loaded ? 'img-loaded' : 'img-loading img-placeholder'}
                sx={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform .45s ease' }} />

            {/* overlay badges and actions */}
            <Box sx={{ position: 'absolute', top: 8, left: 8, display: 'flex', gap: 1 }}>
              {badges.map((b, i) => <Chip key={i} label={b} size="small" color="secondary" />)}
            </Box>
            <Box sx={{ position: 'absolute', top: 8, right: 8 }}>
              <IconButton onClick={toggleSave} aria-label={saved ? 'Remove saved' : 'Save'} sx={{ bgcolor: 'rgba(255,255,255,0.9)' }}>
                {saved ? <FavoriteIcon color="error" /> : <FavoriteBorderIcon />}
              </IconButton>
            </Box>
            <Box sx={{ position: 'absolute', left: 0, right: 0, bottom: 0, p: 2, background: 'linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(2,6,23,0.6) 60%)', color: 'white' }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>{product.name}</Typography>
              <Typography variant="body2" sx={{ opacity: 0.9 }}>${product.price} • {product.type}</Typography>
            </Box>
          </Box>
        </CardActionArea>

        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
            <Rating value={Math.round(rating * 2) / 2} precision={0.5} size="small" readOnly />
            <Typography variant="caption" color="text.secondary">{rating.toFixed(1)}</Typography>
          </Box>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>{product.breed}</Typography>
          <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', justifyContent: 'space-between' }}>
            <Typography sx={{ fontWeight: 800, fontSize: 18 }}>${product.price}</Typography>
            <Box>
              <Button size="small" variant="outlined" onClick={() => onQuickView(product)} sx={{ mr: 1 }}>Quick View</Button>
              <Button size="small" variant="contained" onClick={handleAddClick}>Add</Button>
            </Box>
          </Box>
        </CardContent>
      </Card>
    </motion.div>
  )
}
