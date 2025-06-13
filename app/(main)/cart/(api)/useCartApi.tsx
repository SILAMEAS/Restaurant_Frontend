import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { handleApiCall } from "@/lib/handleApiCall"
import { useGetCartQuery, useRemoveCartMutation, useRemoveItemFromCartMutation, useUpdateCartItemInCartMutation } from "@/lib/redux/api"
import React, { useState } from "react"
import { Slide, toast } from "react-toastify"

const paymentMethods = [
  { id: "card", name: "Credit Card", description: "Pay with your saved card" },
  { id: "cash", name: "Cash on Delivery", description: "Pay when your order arrives" },
]

const useCartApi = () => {
    const [selectedPayment, setSelectedPayment] = useState(paymentMethods[0].id)
    const [notes, setNotes] = useState("")
    const getCartQuery = useGetCartQuery()
    const [removeItemFromCart, rsRemoveItem] = useRemoveItemFromCartMutation()
    const [removeCart, rsRemoveCart] = useRemoveCartMutation()
    const [updateCartItemInCart, rsUpCartItem] = useUpdateCartItemInCartMutation()
    const [selectedCartId, setSelectedCartId] = React.useState<number | null>(null)

    const cartItems = getCartQuery?.data ?? [];
  
    // Set initial selected cart if not set
    if (cartItems.length > 0 && !selectedCartId) {
      setSelectedCartId(cartItems[0].id)
    }
  
    const selectedCart = cartItems.find(cart => cart.id === selectedCartId);
    const carts = cartItems.map(cart => cart.id);
    const updateQuantity = async (cartId: number,cartItemId: number, quantity: number) => {
        if (quantity < 1) return
        await handleApiCall({
          apiFn: () => updateCartItemInCart({cartId, cartItemId, quantity }).unwrap(),
          onSuccess: () => {
            toast.success("Quantity updated successfully!", {
              theme: "dark",
              transition: Slide,
            })
          },
          onError: (e) => {
            toast.error(`${e.data.message}`, {
              theme: "dark",
              transition: Slide,
            })
          }
        })
      }
    
      const removeItem = async (cartId: number,cartItemId:number) => {
        await handleApiCall({
          apiFn: () => removeItemFromCart({ cartId,cartItemId }).unwrap(),
          onSuccess: () => {
            toast.success("Item removed successfully!", {
              theme: "dark",
              transition: Slide,
            })
          },
          onError: (e) => {
            toast.error(`${e.data.message}`, {
              theme: "dark",
              transition: Slide,
            })
          }
        })
      }
    
      const $removeCart = async (cartId: number) => {
        await handleApiCall({
          apiFn: () => removeCart({ cartId }).unwrap(),
          onSuccess: () => {
            toast.success("Cart removed successfully!", {
              theme: "dark",
              transition: Slide,
            })
            if (selectedCartId === cartId) {
              setSelectedCartId(null)
            }
          },
          onError: (e) => {
            toast.error(`${e.data.message}`, {
              theme: "dark",
              transition: Slide,
            })
          }
        })
      }
    
    
      const isLoadingProcess = rsUpCartItem.isLoading || rsRemoveItem.isLoading;

      React.useEffect(() => {
        if (rsRemoveCart.isSuccess) {
          window.location.reload();
        }
      }, [rsRemoveCart.isSuccess])
    
    

      return {
        $removeCart,
        isLoadingProcess,
        getCartQuery,
        rsRemoveCart,
        rsRemoveItem,
        rsUpCartItem,
        selectedCartId,
        selectedCart,
        cartItems,
        setSelectedCartId,
        removeItem,
        updateQuantity,
        notes,
        setNotes,
        selectedPayment,
        setSelectedPayment,
        carts
    }
}

export default useCartApi;