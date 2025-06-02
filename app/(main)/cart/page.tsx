"use client"

import Image from "next/image"
import Link from "next/link"
import {useRouter} from "next/navigation"
import {Minus, Plus, ShoppingBag, Trash2} from "lucide-react"

import {Button} from "@/components/ui/button"
import {Card, CardContent, CardFooter, CardHeader, CardTitle} from "@/components/ui/card"
import {Separator} from "@/components/ui/separator"
import {useGetCartQuery, useRemoveItemFromCartMutation, useUpdateCartItemInCartMutation} from "@/lib/redux/api"
import {handleApiCall} from "@/lib/handleApiCall"
import {Slide, toast} from "react-toastify"
import MainAddresses from "@/app/(main)/profile/(tab)/MainAddresses"

export default function CartPage() {
  const router = useRouter()
  const { data, isLoading, isError } = useGetCartQuery()
  const [removeItemFromCart, rsRemoveItem] = useRemoveItemFromCartMutation()
  const [updateCartItemInCart, rsUpCartItem] = useUpdateCartItemInCartMutation()

  const cartItems=data??[];

  // Updated to support response as an array of cart objects
  // const cartItems = useMemo(() => {
  //   if (!Array.isArray(data)) return []
  //   return data.flatMap((cart) =>
  //       cart.items.map((item: any) => ({
  //         id: item.id,
  //         quantity: item.quantity,
  //         name: item.food.name,
  //         price: item.food.price,
  //         image: item.food.images[0] || "/placeholder.svg",
  //         restaurant: item.food.restaurantName,
  //         foodId: item.food.id,
  //         tax: item.food.tax,
  //         deliveryFee: item.food.deliveryFee,
  //         priceDiscount: item.food.priceDiscount
  //       }))
  //   )
  // }, [data])

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
        console.log(e)
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

  // const subtotal = cartItems?.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const subtotal = 10
  // const subtotalDiscount = cartItems?.reduce((sum, item) => sum + item.priceDiscount * item.quantity, 0)
  const subtotalDiscount = 5
  // const deliveryFee = cartItems[0]?.deliveryFee ?? 0
  const deliveryFee =  0
  // const tax = cartItems?.reduce((sum, item) => sum + item.tax * item.quantity, 0)
  const tax = 0
  const total = subtotalDiscount + deliveryFee + tax
  const isLoadingProcess = rsUpCartItem.isLoading || rsRemoveItem.isLoading

  if (isLoading) {
    return <div className="text-center py-10">Loading cart...</div>
  }

  if (isError) {
    return <div className="text-center py-10 text-red-500">Failed to load cart data.</div>
  }

  return (
      <div className="container py-10 flex">
        <div className={'flex flex-col space-y-1'}>
          {cartItems.length > 0 ? (
              cartItems.map(({id:CartId,totalItems,restaurantName,items})=><div className="grid grid-cols-1 lg:grid-cols-3 gap-8" key={CartId}>
                {/* Cart Items */}
                <div className="lg:col-span-2 pb-2.5">
                  <div className="text-xl font-semibold">
                    <div className="text-base font-normal">Cart Items ({totalItems}) : from {restaurantName} </div>
                  </div>
                  <Card>
                    <CardContent className="space-y-4">
                      {items.map(({food:{images,name,price,id:foodId},quantity,id:CartItemId}) => (
                          <div key={CartItemId} className="flex items-start gap-4 py-4">
                            <div className="relative h-20 w-20 rounded-md overflow-hidden flex-shrink-0">
                              <Image src={images[0]??"/placeholder.svg"} alt={name} fill className="object-cover" />
                            </div>
                            <div className="flex-1">
                              <h3 className="font-medium">{name}</h3>
                              <p className="text-sm text-muted-foreground">{restaurantName}</p>
                              <div className="mt-2 font-medium">${price.toFixed(2)}</div>
                            </div>
                            <div className="flex flex-col items-end gap-2">
                              <Button variant="ghost" size="icon" onClick={() => removeItem(CartId,CartItemId)}>
                                <Trash2 className="h-4 w-4" />
                              </Button>
                              <div className="flex items-center border rounded-md">
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8 rounded-none"
                                    onClick={() => updateQuantity(CartId,CartItemId, quantity - 1)}
                                >
                                  <Minus className="h-3 w-3" />
                                </Button>
                                <span className="w-8 text-center">{quantity}</span>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8 rounded-none"
                                    onClick={() => updateQuantity(CartId,CartItemId, quantity + 1)}
                                >
                                  <Plus className="h-3 w-3" />
                                </Button>
                              </div>
                            </div>
                          </div>
                      ))}
                    </CardContent>
                  </Card>
                </div>

              </div>)
          ) : (
              <div className="text-center py-16">
                <ShoppingBag className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
                <h2 className="text-2xl font-medium mb-2">Your cart is empty</h2>
                <p className="text-muted-foreground mb-6">Looks like you haven't added any items to your cart yet.</p>
                <Link href="/menu">
                  <Button size="lg">Browse Menu</Button>
                </Link>
              </div>
          )}
        </div>

        {/* Order Summary */}
        <div>
          <MainAddresses />
          <Card>
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="line-through">${subtotal.toFixed(2)}</span>
                <span>${subtotalDiscount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Delivery Fee</span>
                <span>${deliveryFee.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Tax</span>
                <span>${tax.toFixed(2)}</span>
              </div>
              <Separator />
              <div className="flex justify-between font-medium text-lg">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </CardContent>
            <CardFooter>
              <Button
                  disabled={isLoadingProcess}
                  className="w-full"
                  size="lg"
                  onClick={() => router.push("/checkout")}
              >
                {isLoadingProcess ? "Loading ..." : "Place order"}
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
  )
}
