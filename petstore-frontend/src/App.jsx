import React, { useEffect, useMemo, useState } from 'react'
import axios from 'axios'
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  CardActions,
  Box,
  Chip,
  TextField,
  AppBar,
  Toolbar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Badge,
} from '@mui/material'

const API = import.meta.env.VITE_API_BASE || 'http://localhost:8080/villanueva/api/v1'

// Design tokens (neutral + warm primary + bright CTA)
const THEME = {
  bg: '#F7F7F6', // soft off-white
  surface: '#FFFFFF',
  text: '#0F1724',
  muted: '#6B7280',
  warm: '#B65A3A', // warm terracotta (brand)
  cta: '#0B69FF', // vivid CTA blue for high contrast
}

// ASSET_MAP: explicit mapping from pet type / keywords to precise assets.
// This mapping must never render a mismatched animal; reptile types map only to reptile assets.
const ASSET_MAP = {
  reptile: {
    primary: 'https://images.unsplash.com/photo-1501004318641-b39e6451bec6?q=80&w=1400&auto=format&fit=crop',
    fallbackSvg: 'reptile',
  },
  'bearded dragon': {
    primary: 'https://images.unsplash.com/photo-1558981403-c6e6f0f0ab3a?q=80&w=1400&auto=format&fit=crop',
    fallbackSvg: 'reptile',
  },
  dog: {
    primary: 'https://images.unsplash.com/photo-1517423440428-a5a00ad493e8?q=80&w=1400&auto=format&fit=crop',
    fallbackSvg: 'dog',
  },
  cat: {
    primary: 'https://images.unsplash.com/photo-1518791841217-8f162f1e1131?q=80&w=1400&auto=format&fit=crop',
    fallbackSvg: 'cat',
  },
  bird: {
    primary: 'https://images.unsplash.com/photo-1501700493788-fa1a3b7f9a0d?q=80&w=1400&auto=format&fit=crop',
    fallbackSvg: 'bird',
  },
  fish: {
    primary: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=1400&auto=format&fit=crop',
    fallbackSvg: 'fish',
  },
}

// Inline SVG placeholders keyed by type name. These are intentionally minimal,
// high-contrast, and type-appropriate to avoid mismatches.
const SvgPlaceholders = {
  reptile: () => (
    <svg viewBox="0 0 100 100" className="placeholder-svg" xmlns="http://www.w3.org/2000/svg" role="img" aria-hidden>
      <rect rx="12" width="100" height="100" fill="#E9F4EF" />
      <path d="M70 60c-6 6-18 8-26 5s-10-12-6-18" stroke="#1F5B28" strokeWidth="3" fill="none" strokeLinecap="round" />
    </svg>
  ),
  dog: () => (
    <svg viewBox="0 0 100 100" className="placeholder-svg" xmlns="http://www.w3.org/2000/svg" role="img" aria-hidden>
      <rect rx="12" width="100" height="100" fill="#FFF6EB" />
      <circle cx="60" cy="60" r="18" fill="#D6A17A" />
    </svg>
  ),
  cat: () => (
    <svg viewBox="0 0 100 100" className="placeholder-svg" xmlns="http://www.w3.org/2000/svg" role="img" aria-hidden>
      <rect rx="12" width="100" height="100" fill="#FEF7F2" />
      <path d="M22 58c6-6 32-6 40 0" stroke="#C48E6B" strokeWidth="4" fill="none" strokeLinecap="round" />
    </svg>
  ),
  bird: () => (
    <svg viewBox="0 0 100 100" className="placeholder-svg" xmlns="http://www.w3.org/2000/svg" role="img" aria-hidden>
      <rect rx="12" width="100" height="100" fill="#F3F8FF" />
      <path d="M30 40c6-10 28-10 36 0" stroke="#1E3A8A" strokeWidth="3" fill="none" />
    </svg>
  ),
  fish: () => (
    <svg viewBox="0 0 100 100" className="placeholder-svg" xmlns="http://www.w3.org/2000/svg" role="img" aria-hidden>
      <rect rx="12" width="100" height="100" fill="#EFF6FF" />
      <path d="M22 52c10-18 48-18 58 0" stroke="#0E7490" strokeWidth="3" fill="none" />
    </svg>
  ),
  generic: () => (
    <svg viewBox="0 0 100 100" className="placeholder-svg" xmlns="http://www.w3.org/2000/svg" role="img" aria-hidden>
      <rect rx="12" width="100" height="100" fill="#F3F4F6" />
      <circle cx="50" cy="50" r="18" fill="#E5E7EB" />
    </svg>
  ),
}

function resolveAssetForPet(p) {
  // 1) If backend provides an explicit image URL, always respect it.
  if (p.imageUrl) return { src: p.imageUrl, type: 'image' }

  // 2) Exact match on breed or type in ASSET_MAP (case-insensitive).
  const name = (p.breed || '').toLowerCase()
  const type = (p.type || '').toLowerCase()

  // prefer exact breed key like 'bearded dragon'
  if (ASSET_MAP[name]) return { src: ASSET_MAP[name].primary, type: 'image' }
  if (ASSET_MAP[type]) return { src: ASSET_MAP[type].primary, type: 'image' }

  // 3) Fallback to SVG placeholder keyed by type or generic
  if (ASSET_MAP[type] && ASSET_MAP[type].fallbackSvg) return { src: ASSET_MAP[type].fallbackSvg, type: 'svg' }
  if (type.includes('reptile') || name.includes('dragon')) return { src: 'reptile', type: 'svg' }
  if (type.includes('dog')) return { src: 'dog', type: 'svg' }
  if (type.includes('cat')) return { src: 'cat', type: 'svg' }
  if (type.includes('bird')) return { src: 'bird', type: 'svg' }
  if (type.includes('fish')) return { src: 'fish', type: 'svg' }
  return { src: 'generic', type: 'svg' }
}

function formatPrice(n) {
  if (n == null) return ''
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(n)
}

export default function App() {
  const [pets, setPets] = useState([])
  const [query, setQuery] = useState('')
  const [typeFilter, setTypeFilter] = useState('all')
  const [cart, setCart] = useState(() => {
    try { return JSON.parse(localStorage.getItem('cart') || '[]') } catch { return [] }
  })
  const [favorites, setFavorites] = useState(() => {
    try { return JSON.parse(localStorage.getItem('favorites') || '[]') } catch { return [] }
  })
  const [selectedPet, setSelectedPet] = useState(null)
  const [sortBy, setSortBy] = useState('featured')

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

  const types = useMemo(() => {
    const set = new Set(pets.map(p => p.type).filter(Boolean))
    return ['all', ...Array.from(set)]
  }, [pets])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return pets.filter(p => {
      if (typeFilter !== 'all' && p.type !== typeFilter) return false
      if (!q) return true
      return (
        (p.name || '').toLowerCase().includes(q) ||
        (p.breed || '').toLowerCase().includes(q) ||
        (p.type || '').toLowerCase().includes(q)
      )
    })
  }, [pets, query, typeFilter])

  const sorted = useMemo(() => {
    const arr = [...filtered]
    if (sortBy === 'price_asc') arr.sort((a,b)=> (a.price||0)-(b.price||0))
    if (sortBy === 'price_desc') arr.sort((a,b)=> (b.price||0)-(a.price||0))
    if (sortBy === 'name') arr.sort((a,b)=> (a.name||'').localeCompare(b.name||''))
    return arr
  }, [filtered, sortBy])

  useEffect(() => { localStorage.setItem('cart', JSON.stringify(cart)) }, [cart])
  useEffect(() => { localStorage.setItem('favorites', JSON.stringify(favorites)) }, [favorites])

  function addToCart(p) {
    if (!cart.find(x=>x.id===p.id)) setCart([...cart, p])
  }

  function removeFromCart(p) {
    setCart(cart.filter(x=>x.id!==p.id))
  }

  function toggleFavorite(p) {
    if (favorites.find(x=>x===p.id)) setFavorites(favorites.filter(id=>id!==p.id))
    else setFavorites([...favorites, p.id])
  }

  function openDetails(p) { setSelectedPet(p) }
  function closeDetails() { setSelectedPet(null) }

  // Image error fallback handler
  function handleImgError(e) {
    // hide the broken image; ImageWithFallback will show fallback SVG
    e.currentTarget.style.display = 'none'
  }

  // ImageWithFallback: handles loading / error states and aspect ratio to avoid CLS
  function ImageWithFallback({ pet, alt }) {
    const [loaded, setLoaded] = useState(false)
    const [failed, setFailed] = useState(false)
    const resolved = resolveAssetForPet(pet)
    const src = resolved.type === 'image' ? resolved.src : null
    const svgKey = resolved.type === 'svg' ? resolved.src : null

    // Determine which SVG placeholder to use for a missing or failed image
    const Placeholder = useMemo(() => {
      const key = svgKey || 'generic'
      return SvgPlaceholders[key] || SvgPlaceholders.generic
    }, [svgKey])

    return (
      <figure className="img-aspect" aria-hidden>
        {!loaded && !failed && <div className="skeleton img-skeleton" />}
        {src && !failed ? (
          <img
            src={src}
            alt={alt}
            className={`img-inner ${loaded ? 'img-visible' : 'img-hidden'}`}
            onLoad={() => setLoaded(true)}
            onError={() => setFailed(true)}
            style={{ objectFit: 'cover' }}
            width="100%"
            height="auto"
          />
        ) : (
          <div className="img-inner img-placeholder" role="img" aria-label={`${pet.type || 'pet'} placeholder`}>
            <Placeholder />
          </div>
        )}
      </figure>
    )
  }

  return (
    <div className="app-root" style={{ background: THEME.bg, minHeight: '100vh' }}>
      <AppBar position="sticky" color="transparent" elevation={0} sx={{ borderBottom: '1px solid #E6EEF6', background: 'transparent' }}>
        <Toolbar className="site-toolbar" sx={{ display: 'flex', justifyContent: 'space-between', gap: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box className="brand-mark" aria-hidden style={{ width: 44, height: 44, borderRadius: 10, background: THEME.warm }} />
            <Typography variant="h6" component="div" sx={{ fontWeight: 800, color: THEME.text }}>
              Petstore
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <FormControl size="small" sx={{ minWidth: 160 }}>
                <InputLabel id="sort-label">Sort</InputLabel>
                <Select labelId="sort-label" value={sortBy} label="Sort" onChange={e => setSortBy(e.target.value)}>
                  <MenuItem value="featured">Featured</MenuItem>
                  <MenuItem value="price_asc">Price: Low to High</MenuItem>
                  <MenuItem value="price_desc">Price: High to Low</MenuItem>
                  <MenuItem value="name">Name</MenuItem>
                </Select>
              </FormControl>

              <TextField
                size="small"
                placeholder="Search pets, breeds, types..."
                value={query}
                onChange={e => setQuery(e.target.value)}
                sx={{ width: 360, background: THEME.surface, borderRadius: 2 }}
                inputProps={{ 'aria-label': 'Search pets' }}
              />
              <Button variant="outlined" size="small" onClick={() => setQuery('')} sx={{ borderColor: '#E6EEF6' }}>
                Clear
              </Button>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Badge badgeContent={favorites.length} color="primary">
                <IconButton onClick={() => setTypeFilter('all')} aria-label="favorites" sx={{ color: THEME.muted }}>
                  ❤️
                </IconButton>
              </Badge>
              <Badge badgeContent={cart.length} color="secondary">
                <IconButton aria-label="cart" sx={{ color: THEME.muted }}>
                  🛒
                </IconButton>
              </Badge>
            </Box>
          </Box>
        </Toolbar>
      </AppBar>

      <div className="hero mt-6" role="region" aria-label="featured">
        <Container className="hero-inner" >
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={7}>
              <Typography variant="h3" sx={{ fontWeight: 800, color: THEME.text }} gutterBottom>
                Find your perfect companion
              </Typography>
              <Typography variant="body1" sx={{ color: THEME.muted, mb: 3 }}>
                Hand-selected pets from trusted breeders and caregivers. Browse by type, compare breeds, and reserve a visit.
              </Typography>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Button variant="contained" size="large" sx={{ backgroundColor: THEME.warm, color: '#fff', borderRadius: 2, px: 4 }}>
                  Browse pets
                </Button>
                <Button variant="outlined" size="large" sx={{ borderColor: '#E6EEF6', color: THEME.muted, px: 4 }}>
                  Our services
                </Button>
              </Box>
            </Grid>
            <Grid item xs={12} md={5}>
              <div className="hero-media" aria-hidden>
                <img src="https://images.unsplash.com/photo-1548199973-03cce0bbc87b?q=80&w=1200&auto=format&fit=crop&ixlib=rb-4.0.3&s=img" alt="happy pets" className="rounded-lg shadow-hero w-full" onError={handleImgError} />
              </div>
            </Grid>
          </Grid>
        </Container>
      </div>

      <Container className="mt-8" component="main">
        <Box className="mb-4">
          <Typography variant="h6" gutterBottom>
            Browse pets
          </Typography>
          <Box className="flex gap-2 flex-wrap">
            {types.map(t => (
              <Chip
                key={t}
                label={t === 'all' ? 'All' : t}
                color={t === typeFilter ? 'primary' : 'default'}
                onClick={() => setTypeFilter(t)}
                clickable
              />
            ))}
          </Box>
        </Box>

        <Grid container spacing={4}>
          {sorted.map(p => (
            <Grid item key={p.id} xs={12} sm={6} md={4}>
              <Card className="pet-card" sx={{ height: '100%', display: 'flex', flexDirection: 'column', overflow: 'hidden', borderRadius: 3, backgroundColor: THEME.surface, boxShadow: 'none', border: '1px solid #EEF2F6' }}>
                <Box sx={{ position: 'relative' }}>
                  <ImageWithFallback pet={p} alt={`${p.name} the ${p.type}`} />
                  <Box sx={{ position: 'absolute', top: 12, left: 12 }}>
                    <span className="meta-badge">{(p.type || '').toUpperCase()}</span>
                  </Box>
                  <div className="price-badge" aria-hidden>{formatPrice(p.price)}</div>
                  <Box sx={{ position: 'absolute', top: 12, right: 12 }}>
                    {p.inStock ? <span className="meta-badge" style={{ background: '#E8F7EF', color: '#0F5132' }}>In Stock</span> : <span className="meta-badge" style={{ background: '#FFF1F0', color: '#68271A' }}>Out of stock</span>}
                  </Box>
                </Box>
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography variant="h6" gutterBottom sx={{ fontWeight: 700, color: THEME.text }}>
                    {p.name}
                  </Typography>
                  <Typography color="text.secondary" sx={{ mb: 1 }}>
                    {p.breed}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {p.type} • {p.breed}
                  </Typography>
                </CardContent>
                <CardActions sx={{ px: 2, pb: 2, justifyContent: 'space-between' }}>
                  <Box>
                    <Button size="small" sx={{ color: THEME.muted }} onClick={() => openDetails(p)}>Details</Button>
                    <Button size="small" sx={{ color: THEME.muted, ml: 1 }} onClick={() => toggleFavorite(p)}>
                      {favorites.includes(p.id) ? 'Unfavorite' : 'Save'}
                    </Button>
                  </Box>
                  <Box>
                    <Button size="small" variant="contained" onClick={() => addToCart(p)} sx={{ background: THEME.cta, color: '#fff', borderRadius: 2 }}>
                      Add to cart
                    </Button>
                  </Box>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      <Dialog open={!!selectedPet} onClose={closeDetails} maxWidth="md" fullWidth>
        {selectedPet && (
          <>
            <DialogTitle>{selectedPet.name}</DialogTitle>
            <DialogContent>
                  <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <ImageWithFallback pet={selectedPet} alt={selectedPet.name} />
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="h6">{selectedPet.breed}</Typography>
                  <Typography color="text.secondary" sx={{ mb: 2 }}>{selectedPet.type}</Typography>
                  <Typography variant="h5" sx={{ fontWeight: 700 }}>{formatPrice(selectedPet.price)}</Typography>
                  <Box sx={{ mt: 3 }}>
                    <Button variant="contained" onClick={() => { addToCart(selectedPet); closeDetails()}}>Add to cart</Button>
                    <Button sx={{ ml: 2 }} onClick={() => toggleFavorite(selectedPet)}>
                      {favorites.includes(selectedPet.id) ? 'Unfavorite' : 'Favorite'}
                    </Button>
                  </Box>
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions>
              <Button onClick={closeDetails}>Close</Button>
            </DialogActions>
          </>
        )}
      </Dialog>

      <Box component="footer" sx={{ mt: 6, py: 4, bgcolor: 'background.paper' }}>
        <Container>
          <Typography variant="body2" color="text.secondary">
            © {new Date().getFullYear()} Petstore — a demo app
          </Typography>
        </Container>
      </Box>
    </div>
  )
}
