import React, { useEffect, useState, Suspense } from 'react'
import axios from 'axios'
import Container from '@mui/material/Container'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import SearchBar from './components/SearchBar'
import useDebouncedValue from './hooks/useDebouncedValue'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import CartProvider from './components/CartContext'
import WishlistProvider from './components/WishlistContext'
import Header from './components/Header'
import Hero from './components/Hero'
import ProductGrid from './components/ProductGrid'
const FloatingCart = React.lazy(() => import('./components/FloatingCart'))
import SnackbarProvider from './components/SnackbarProvider'
import WishlistDrawer from './components/WishlistDrawer'

const API = import.meta.env.VITE_API_BASE || 'http://localhost:8080/villanueva/api/v1'

export default function App() {
  const [pets, setPets] = useState([])
  const [loading, setLoading] = useState(true)
  const [query, setQuery] = useState('')
  const debounced = useDebouncedValue(query, 280)
  const [cartOpen, setCartOpen] = useState(false)
  const [wishOpen, setWishOpen] = useState(false)
  const [dark, setDark] = useState(() => {
    try { return JSON.parse(localStorage.getItem('dark') || 'false') } catch (e) { return false }
  })

  // keyboard shortcut: press 'f' to focus search
  useEffect(() => {
    function onKey(e) {
      if (e.key === 'f' && !e.metaKey && !e.ctrlKey && !e.altKey) {
        const el = document.querySelector('input[placeholder*="Search pets"]')
        if (el) { el.focus(); e.preventDefault() }
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  useEffect(() => {
    fetchPets()
  }, [])

  async function fetchPets() {
    setLoading(true)
    try {
      const res = await axios.get(`${API}/pets`)
      // Coerce to an array in case the API wraps the list or returns a single object
      const data = res.data
      const IMAGE_MAP = {
        Buddy: 'https://www.bil-jac.com/wp-content/uploads/2024/12/labrador-962177576.webp',
        Mittens: 'https://www.cozycatfurniture.com/image/cache/siamese-cat-cover-1054x791.jpg',
        Polly: 'https://cdn.prod.website-files.com/623236d8ac23bb57bd352b40/628ddfb2e3f1734be5f86253_ilona-frey-0UKyrKCoutM-unsplash.jpg',
        Slinky: 'https://ca-times.brightspotcdn.com/dims4/default/fc45ccc/2147483647/strip/true/crop/1366x911+0+0/resize/1200x800!/quality/75/?url=https%3A%2F%2Fcalifornia-times-brightspot.s3.amazonaws.com%2Fd8%2Fd8%2F9a56642b4a09a3b7784152b4595e%2Fbearded-dragon-happy-cage.jpg',
        Goldie: 'https://www.thesprucepets.com/thmb/VTMd2H_oaAWkZ6GD5G4tHVKHJYI=/2121x0/filters:no_upscale():strip_icc()/GettyImages-1370690855-691460005dd7426d9d716ed9c2b6ad8f.jpg'
      }

      const arr = Array.isArray(data) ? data : (data && Array.isArray(data.pets) ? data.pets : [])
      const mapped = arr.map(p => ({ ...p, imageUrl: p.imageUrl || IMAGE_MAP[p.name] || p.imageUrl }))
      setPets(mapped)
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { try { localStorage.setItem('dark', JSON.stringify(dark)) } catch (e) {} }, [dark])

  // apply a body class for additional CSS tweaks that depend on dark mode
  useEffect(() => {
    try {
      if (dark) document.body.classList.add('dark-mode')
      else document.body.classList.remove('dark-mode')
    } catch (e) {}
  }, [dark])

  const appliedTheme = React.useMemo(() => createTheme({
    palette: dark ? { mode: 'dark', primary: { main: '#FF7A59' }, secondary: { main: '#7AD3A6' } } : { primary: { main: '#FF7A59' }, secondary: { main: '#7AD3A6' }, background: { default: '#FBFBFD' }, text: { primary: '#0f172a' } },
    shape: { borderRadius: 12 },
    typography: { fontFamily: 'Inter, Poppins, Roboto, Arial, sans-serif' }
  }), [dark])

  return (
    <ThemeProvider theme={appliedTheme}>
      <CssBaseline />
      <CartProvider>
        <WishlistProvider>
        <SnackbarProvider>
          <Header onOpenCart={() => setCartOpen(true)} onOpenWishlist={() => setWishOpen(true)} dark={dark} onToggleDark={() => setDark(d => !d)} />
          <Hero />
          <Container sx={{ py: 4 }}>
            <Box sx={{ mb: 2 }}>
              <SearchBar value={query} onChange={setQuery} onClear={() => setQuery('')} />
            </Box>
            <Typography variant="h5" component="h2" gutterBottom>Available Pets</Typography>
            <ProductGrid items={pets} loading={loading} search={debounced} openCart={() => setCartOpen(true)} />
          </Container>
        </SnackbarProvider>
        <WishlistDrawer open={wishOpen} onClose={() => setWishOpen(false)} />
        </WishlistProvider>
      </CartProvider>
      <Suspense fallback={null}>
        <FloatingCart open={cartOpen} onClose={() => setCartOpen(false)} />
      </Suspense>
    </ThemeProvider>
  )
}

const theme = createTheme({
  palette: { primary: { main: '#FF7A59' }, secondary: { main: '#7AD3A6' }, background: { default: '#FBFBFD' }, text: { primary: '#0f172a' } },
  shape: { borderRadius: 12 },
  typography: { fontFamily: 'Inter, Poppins, Roboto, Arial, sans-serif' }
})
