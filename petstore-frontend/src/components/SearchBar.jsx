import React from 'react'
import { TextField, InputAdornment, IconButton } from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'

export default function SearchBar({ value, onChange, onClear }) {
  return (
    <TextField
      variant="outlined"
      placeholder="Search pets, breeds, types..."
      value={value}
      onChange={e => onChange(e.target.value)}
      fullWidth
      size="small"
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <SearchIcon />
          </InputAdornment>
        ),
        endAdornment: (
          <InputAdornment position="end">
            <IconButton onClick={onClear} aria-label="clear search">✖</IconButton>
          </InputAdornment>
        )
      }}
    />
  )
}
