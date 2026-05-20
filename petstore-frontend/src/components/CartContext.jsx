import React, { createContext, useContext, useReducer } from 'react'

const CartStateContext = createContext()
const CartDispatchContext = createContext()

function cartReducer(state, action) {
  switch (action.type) {
    case 'add': {
      const existing = state.find(i => i.id === action.item.id)
      if (existing) {
        return state.map(i => i.id === action.item.id ? { ...i, qty: i.qty + 1 } : i)
      }
      return [...state, { ...action.item, qty: 1 }]
    }
    case 'remove':
      return state.filter(i => i.id !== action.id)
    case 'clear':
      return []
    default:
      throw new Error('Unknown action: ' + action.type)
  }
}

export function CartProvider({ children }) {
  const [state, dispatch] = useReducer(cartReducer, [])
  return (
    <CartDispatchContext.Provider value={dispatch}>
      <CartStateContext.Provider value={state}>{children}</CartStateContext.Provider>
    </CartDispatchContext.Provider>
  )
}

export function useCart() {
  return useContext(CartStateContext)
}

export function useCartDispatch() {
  return useContext(CartDispatchContext)
}

export default CartProvider
