"use client"

import Image from "next/image"
import {Minus, Plus, Store, Trash2} from "lucide-react"

import {Button} from "@/components/ui/button"
import {Card, CardContent, CardTitle} from "@/components/ui/card"
import MainAddresses from "@/app/(main)/profile/(tab)/MainAddresses"
import {RadioGroup, RadioGroupItem} from "@/components/ui/radio-group"
import {Label} from "@/components/ui/label"
import OrderSummary from "@/app/(main)/cart/components/OrderSummary"
import useCartApi from "@/hooks/useCartApi"
import OrderNotes from "@/app/(main)/cart/components/OrderNotes"
import PaymentMethod from "@/app/(main)/cart/components/PaymentMethod"
import EmptyCart from "@/app/(main)/cart/EmptyCart";
import ErrorCart from "@/app/(main)/cart/ErrorCart";
import LoadingCart from "@/app/(main)/cart/LoadingCart";


export default function CartPage() {
    const {
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
    } = useCartApi();

    if (getCartQuery.isLoading) {
        return <LoadingCart/>
    }

    if (getCartQuery.isError) {
        return <ErrorCart/>
    }


    return (
        <div className="container py-6 md:py-10 ">
            <div className="flex flex-col lg:flex-row gap-8">
                <div className="flex-1 space-y-6">
                    {/* Payment Method */}
                    {
                        selectedCart &&
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
                                        <Store className="h-5 w-5"/>
                                        <span>Select Restaurant</span>
                                    </CardTitle>
                                    <RadioGroup
                                        value={selectedCartId?.toString()}
                                        onValueChange={(value) => setSelectedCartId(Number(value))}
                                        className="space-y-2"
                                    >
                                        {cartItems.map(({id: CartId, restaurantName, totalItems}) => (
                                            <div key={CartId}
                                                 className="flex items-center space-x-2 p-2 rounded-lg hover:bg-accent">
                                                <RadioGroupItem value={CartId.toString()} id={`restaurant-${CartId}`}/>
                                                <Label
                                                    htmlFor={`restaurant-${CartId}`}
                                                    className="flex-1 cursor-pointer"
                                                >
                                                    <span className="font-medium">{restaurantName}</span>
                                                    <span
                                                        className="text-muted-foreground ml-2">({totalItems} items)</span>
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
                                            <span
                                                className="text-muted-foreground">({selectedCart.totalItems} items)</span>
                                        </div>
                                        <Button
                                            variant="destructive"
                                            size="sm"
                                            onClick={() => {
                                                if (carts.length > 1) {
                                                    setSelectedCartId(carts.filter(cart => cart !== selectedCart.id)[0]);
                                                    $removeCart(selectedCart.id)
                                                } else {
                                                    $removeCart(selectedCart.id)
                                                }

                                            }}
                                            disabled={rsRemoveCart.isLoading}
                                            className="hover:scale-105 transition-transform"
                                        >
                                            <Trash2 className="h-4 w-4 mr-2"/>
                                            {rsRemoveCart.isLoading ? "Removing..." : "Clear Cart"}
                                        </Button>
                                    </div>

                                    <Card className="shadow-md">
                                        <CardContent className="divide-y">
                                            {selectedCart.items.map(({
                                                                         food: {images, name, price, id: foodId},
                                                                         quantity,
                                                                         id: CartItemId
                                                                     }) => (
                                                <div key={CartItemId}
                                                     className="flex flex-col sm:flex-row items-start gap-4 py-6 first:pt-6 last:pb-6 group">
                                                    <div
                                                        className="relative h-24 w-24 rounded-xl overflow-hidden flex-shrink-0 group-hover:shadow-md transition-shadow">
                                                        <Image
                                                            src={images[0] ?? "/placeholder.svg"}
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
                                                    <div
                                                        className="flex flex-row sm:flex-col items-center sm:items-end gap-4 sm:gap-2 w-full sm:w-auto">
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() => removeItem(selectedCart.id, CartItemId)}
                                                            className="text-red-500 hover:text-red-600 hover:bg-red-50"
                                                        >
                                                            <Trash2 className="h-4 w-4 mr-2"/>
                                                            Remove
                                                        </Button>
                                                        <div className="flex items-center border rounded-lg shadow-sm">
                                                            <Button
                                                                variant="ghost"
                                                                size="icon"
                                                                className="h-8 w-8 rounded-l-lg hover:bg-primary hover:text-primary-foreground"
                                                                onClick={() => updateQuantity(selectedCart.id, CartItemId, quantity - 1)}
                                                                disabled={quantity <= 1 || isLoadingProcess}
                                                            >
                                                                <Minus className="h-3 w-3"/>
                                                            </Button>
                                                            <span
                                                                className="w-12 text-center font-medium">{quantity}</span>
                                                            <Button
                                                                variant="ghost"
                                                                size="icon"
                                                                className="h-8 w-8 rounded-r-lg hover:bg-primary hover:text-primary-foreground"
                                                                onClick={() => updateQuantity(selectedCart.id, CartItemId, quantity + 1)}
                                                                disabled={isLoadingProcess}
                                                            >
                                                                <Plus className="h-3 w-3"/>
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
                        <EmptyCart/>
                    )}
                    {/* Order Notes */}
                    {
                        selectedCart &&
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
                                setSelectedCartId={setSelectedCartId}
                                carts={carts}
                            />
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
