import { cartReducer } from '../../src/components/CartContext'

describe('cartReducer', () => {
  test('adds new item', () => {
    const initial = []
    const item = { id: 1, name: 'Buddy', price: 10 }
    const next = cartReducer(initial, { type: 'add', item })
    expect(next).toHaveLength(1)
    expect(next[0].qty).toBe(1)
  })

  test('increments existing item qty', () => {
    const initial = [{ id: 1, name: 'Buddy', price: 10, qty: 1 }]
    const item = { id: 1, name: 'Buddy', price: 10 }
    const next = cartReducer(initial, { type: 'add', item })
    expect(next).toHaveLength(1)
    expect(next[0].qty).toBe(2)
  })

  test('removes item', () => {
    const initial = [{ id: 1, name: 'Buddy', price: 10, qty: 2 }]
    const next = cartReducer(initial, { type: 'remove', id: 1 })
    expect(next).toHaveLength(0)
  })

  test('clears cart', () => {
    const initial = [{ id: 1, name: 'Buddy', price: 10, qty: 2 }]
    const next = cartReducer(initial, { type: 'clear' })
    expect(next).toHaveLength(0)
  })
})
