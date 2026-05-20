import React, { createContext, useContext, useEffect, useReducer } from 'react'

const WishlistStateContext = createContext()
const WishlistDispatchContext = createContext()

function wishlistReducer(state, action) {
  switch (action.type) {
    case 'add': {
      if (state.find(i => i.id === action.item.id)) return state
      return [...state, action.item]
    }
    case 'remove':
      return state.filter(i => i.id !== action.id)
    case 'clear':
      return []
    default:
      throw new Error('Unknown action: ' + action.type)
  }
}

export function WishlistProvider({ children }) {
  const [state, dispatch] = useReducer(wishlistReducer, [], initial => {
    try {
      const raw = localStorage.getItem('wishlist')
      return raw ? JSON.parse(raw) : initial
    } catch (e) { return initial }
  })

  useEffect(() => {
    try { localStorage.setItem('wishlist', JSON.stringify(state)) } catch (e) {}
  }, [state])

  return (
    <WishlistDispatchContext.Provider value={dispatch}>
      <WishlistStateContext.Provider value={state}>{children}</WishlistStateContext.Provider>
    </WishlistDispatchContext.Provider>
  )
}

export function useWishlist() { return useContext(WishlistStateContext) }
export function useWishlistDispatch() { return useContext(WishlistDispatchContext) }

export default WishlistProvider
