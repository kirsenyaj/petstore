import React from 'react'
import { Box } from '@mui/material'

export default function SkeletonCard() {
  return (
    <Box sx={{ borderRadius: 2, overflow: 'hidden', bgcolor: '#fff', p: 2, boxShadow: '0 8px 18px rgba(2,6,23,0.04)' }}>
      <Box sx={{ width: '100%', height: 180, bgcolor: '#f1f5f9', borderRadius: 1, mb: 2, animation: 'pulse 1.4s ease-in-out infinite' }} />
      <Box sx={{ width: '60%', height: 18, bgcolor: '#f1f5f9', borderRadius: 1, mb: 1, animation: 'pulse 1.4s ease-in-out infinite' }} />
      <Box sx={{ width: '40%', height: 18, bgcolor: '#f1f5f9', borderRadius: 1, animation: 'pulse 1.4s ease-in-out infinite' }} />
      <style>{`@keyframes pulse { 0% { opacity: 1 } 50% { opacity: 0.6 } 100% { opacity: 1 } }`}</style>
    </Box>
  )
}
