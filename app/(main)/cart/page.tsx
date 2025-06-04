"use client"

import Image from "next/image"
import Link from "next/link"
import {useRouter} from "next/navigation"
import {Minus, Plus, ShoppingBag, Trash2, Store} from "lucide-react"
import { useState } from "react"

import {Button} from "@/components/ui/button"
import {Card, CardContent, CardFooter, CardHeader, CardTitle} from "@/components/ui/card"
import {Separator} from "@/components/ui/separator"
import {useGetCartQuery, useRemoveCartMutation, useRemoveItemFromCartMutation, useUpdateCartItemInCartMutation} from "@/lib/redux/api"
import {handleApiCall} from "@/lib/handleApiCall"
import {Slide, toast} from "react-toastify"
import MainAddresses from "@/app/(main)/profile/(tab)/MainAddresses"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Skeleton } from "@/components/ui/skeleton"
import OrderSummary from "@/components/(user)/cart/OrderSummary"
import useCartApi from "../../../components/(user)/cart/(api)/useCartApi"
import OrderNotes from "@/components/(user)/cart/OrderNotes"
import PaymentMethod from "@/components/(user)/cart/PaymentMethod"


export default function CartPage() {
  const{
    $removeCart,
    isLoadingProcess,
    getCartQuery,
    rsRemoveCart,
    removeItem,
    selectedCartId,
    selectedCart,
    cartItems,
    setSelectedCartId,
    updateQuantity,
    notes,
    setNotes,
    selectedPayment,
    setSelectedPayment,
    carts
  }=useCartApi();

  if (getCartQuery.isLoading) {
    return (
      <div className="container py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Skeleton className="h-[200px] w-full mb-4" />
            <Skeleton className="h-[400px] w-full" />
          </div>
          <div className="lg:col-span-1">
            <Skeleton className="h-[600px] w-full" />
          </div>
        </div>
      </div>
    )
  }

  if (getCartQuery.isError) {
    return (
      <div className="container min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 mb-4">
            <svg className="w-16 h-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-2xl font-medium mb-2">Failed to load cart</h2>
          <p className="text-muted-foreground mb-6">There was an error loading your cart data. Please try again.</p>
          <Button onClick={() => window.location.reload()}>Retry</Button>
        </div>
      </div>
    )
  }





  return (
    <div className="container py-6 md:py-10 ">
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="flex-1 space-y-6">
            {/* Payment Method */}
            {
              selectedCart&&
               <PaymentMethod
            selectedPayment={selectedPayment}
            onPaymentChange={setSelectedPayment}
          />
            }
           
          {cartItems?.length > 0 ? (
            <>
              {cartItems.length > 1 && (
                <Card className="p-4 shadow-md hover:shadow-lg transition-shadow">
                  <CardTitle className="flex items-center gap-2 mb-4">
                    <Store className="h-5 w-5" />
                    <span>Select Restaurant</span>
                  </CardTitle>
                  <RadioGroup 
                    value={selectedCartId?.toString()} 
                    onValueChange={(value) => setSelectedCartId(Number(value))}
                    className="space-y-2"
                  >
                    {cartItems.map(({id: CartId, restaurantName, totalItems}) => (
                      <div key={CartId} className="flex items-center space-x-2 p-2 rounded-lg hover:bg-accent">
                        <RadioGroupItem value={CartId.toString()} id={`restaurant-${CartId}`} />
                        <Label 
                          htmlFor={`restaurant-${CartId}`}
                          className="flex-1 cursor-pointer"
                        >
                          <span className="font-medium">{restaurantName}</span>
                          <span className="text-muted-foreground ml-2">({totalItems} items)</span>
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                </Card>
              )}
              
              {selectedCart && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <h2 className="text-2xl font-semibold">{selectedCart.restaurantName}</h2>
                      <span className="text-muted-foreground">({selectedCart.totalItems} items)</span>
                    </div>
                    <Button 
                      variant="destructive" 
                      size="sm"
                      onClick={() =>{
                        if(carts.length > 1){
                        setSelectedCartId(carts.filter(cart => cart !== selectedCart.id)[0]);
                        $removeCart(selectedCart.id)
                        }else{
                          $removeCart(selectedCart.id)
                        }
                      
                      }}
                      disabled={rsRemoveCart.isLoading}
                      className="hover:scale-105 transition-transform"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      {rsRemoveCart.isLoading ? "Removing..." : "Clear Cart"}
                    </Button>
                  </div>
                  
                  <Card className="shadow-md">
                    <CardContent className="divide-y">
                      {selectedCart.items.map(({food:{images,name,price,id:foodId},quantity,id:CartItemId}) => (
                        <div key={CartItemId} className="flex flex-col sm:flex-row items-start gap-4 py-6 first:pt-6 last:pb-6 group">
                          <div className="relative h-24 w-24 rounded-xl overflow-hidden flex-shrink-0 group-hover:shadow-md transition-shadow">
                            <Image 
                              src={images[0]??"/placeholder.svg"} 
                              alt={name} 
                              fill 
                              className="object-cover transition-transform group-hover:scale-110" 
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-medium text-lg truncate">{name}</h3>
                            <p className="text-sm text-muted-foreground mb-2">{selectedCart.restaurantName}</p>
                            <div className="text-lg font-semibold">${price.toFixed(2)}</div>
                          </div>
                          <div className="flex flex-row sm:flex-col items-center sm:items-end gap-4 sm:gap-2 w-full sm:w-auto">
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => removeItem(selectedCart.id,CartItemId)}
                              className="text-red-500 hover:text-red-600 hover:bg-red-50"
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Remove
                            </Button>
                            <div className="flex items-center border rounded-lg shadow-sm">
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 rounded-l-lg hover:bg-primary hover:text-primary-foreground"
                                onClick={() => updateQuantity(selectedCart.id,CartItemId, quantity - 1)}
                                disabled={quantity <= 1 || isLoadingProcess}
                              >
                                <Minus className="h-3 w-3" />
                              </Button>
                              <span className="w-12 text-center font-medium">{quantity}</span>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 rounded-r-lg hover:bg-primary hover:text-primary-foreground"
                                onClick={() => updateQuantity(selectedCart.id,CartItemId, quantity + 1)}
                                disabled={isLoadingProcess}
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
              )}
            </>
          ) : (
            <div className="min-h-[60vh] flex items-center justify-center">
              <div className="text-center max-w-md mx-auto p-6">
                <div className="bg-primary/5 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <ShoppingBag className="h-10 w-10 text-primary" />
                </div>
                <h2 className="text-2xl font-semibold mb-2">Your cart is empty</h2>
                <p className="text-muted-foreground mb-8">
                  Looks like you haven't added any items to your cart yet. 
                  Start exploring our delicious menu!
                </p>
                <Link href="/menu">
                  <Button size="lg" className="hover:scale-105 transition-transform">
                    Browse Menu
                  </Button>
                </Link>
              </div>
            </div>
          )}
            {/* Order Notes */}
            {
              selectedCart&&
              <OrderNotes
              notes={notes}
              onNotesChange={setNotes}
            />
            }
           
        </div>

        {/* Order Summary */}
        {selectedCart && (
          <div className="w-full lg:w-[400px]">
            <div className="lg:sticky lg:top-6 space-y-6">
              <MainAddresses/>
              <OrderSummary 
               selectedCartId={selectedCartId}
               selectedCart={selectedCart}
               isLoadingProcess={isLoadingProcess}
               notes={notes}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
