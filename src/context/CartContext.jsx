import { createContext, useContext, useState } from 'react'

const CartContext = createContext(null)

export function CartProvider({ children }) {
  const [cart, setCart] = useState([])
  const [cookInfo, setCookInfo] = useState(null)

  const addItem = (item, cook) => {
    if (cookInfo && cookInfo.id !== cook.id) {
      if (!window.confirm('Adding from a different cook will clear your cart. Continue?')) return
      setCart([])
    }
    setCookInfo(cook)
    setCart((prev) => {
      const existing = prev.find((i) => i.id === item.id)
      if (existing) return prev.map((i) => i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i)
      return [...prev, { ...item, quantity: 1 }]
    })
  }

  const removeItem = (itemId) => setCart((prev) => prev.filter((i) => i.id !== itemId))

  const updateQty = (itemId, qty) => {
    if (qty <= 0) return removeItem(itemId)
    setCart((prev) => prev.map((i) => i.id === itemId ? { ...i, quantity: qty } : i))
  }

  const clearCart = () => { setCart([]); setCookInfo(null) }

  const total = cart.reduce((sum, i) => sum + i.price * i.quantity, 0)

  return (
    <CartContext.Provider value={{ cart, cookInfo, addItem, removeItem, updateQty, clearCart, total }}>
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => useContext(CartContext)
