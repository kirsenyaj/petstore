import React, { createContext, useContext, useState, useCallback } from 'react'
import { Snackbar, Alert } from '@mui/material'

const SnackContext = createContext(null)

export function useSnackbar() {
  return useContext(SnackContext)
}

export default function SnackbarProvider({ children }) {
  const [open, setOpen] = useState(false)
  const [msg, setMsg] = useState('')
  const [severity, setSeverity] = useState('info')

  const show = useCallback((message, sev = 'info') => {
    setMsg(message)
    setSeverity(sev)
    setOpen(true)
  }, [])

  return (
    <SnackContext.Provider value={{ show }}>
      {children}
      <Snackbar open={open} autoHideDuration={3000} onClose={() => setOpen(false)} anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}>
        <Alert onClose={() => setOpen(false)} severity={severity} sx={{ width: '100%' }}>
          {msg}
        </Alert>
      </Snackbar>
    </SnackContext.Provider>
  )
}
