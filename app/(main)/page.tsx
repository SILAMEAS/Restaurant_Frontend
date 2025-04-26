"use client"
import Link from "next/link"
import Image from "next/image"
import { ArrowRight } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {useAppDispatch, useAppSelector} from "@/lib/redux/hooks";
import {decrement, increment} from "@/lib/redux/counterSlice";

export default function Home() {
  const counter = useAppSelector((state) => state.counter.value);
  const dispatch = useAppDispatch();
  return (
    <div className="container ">
      <div className="p-4 bg-red-700">
        <h1 className="text-2xl font-bold">Counter: {counter}</h1>
        <button
            onClick={() => dispatch(increment())}
            className="px-4 py-2 mr-2 bg-blue-500 text-white rounded"
        >
          Increment
        </button>
        <button
            onClick={() => dispatch(decrement())}
            className="px-4 py-2 bg-red-500 text-white rounded"
        >
          Decrement
        </button>
      </div>
      {/* Hero Section */}
      <section className="container py-12 md:py-24 lg:py-32 flex-col items-center justify-center">
        <div className=" px-4 md:px-6 ">
          <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
            <div className="flex flex-col justify-center space-y-4">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                  Delicious Food Delivered to Your Door
                </h1>
                <p className="max-w-[600px] text-muted-foreground md:text-xl">
                  Order from your favorite restaurants and enjoy a seamless delivery experience.
                </p>
              </div>
              <div className="flex flex-col gap-2 min-[400px]:flex-row">
                <Link href="/menu">
                  <Button size="lg">
                    Browse Menu
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/auth/register">
                  <Button size="lg" variant="outline">
                    Sign Up
                  </Button>
                </Link>
              </div>
            </div>
            <div className="mx-auto lg:ml-auto">
              <Image
                alt="Hero Image"
                className="mx-auto aspect-video overflow-hidden rounded-xl object-cover sm:w-full lg:order-last"
                height={550}
                width={550}
                src="/placeholder.svg?height=550&width=550"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Featured Restaurants */}
      <section className="container px-4 md:px-6 py-8">
        <h2 className="text-3xl font-bold tracking-tight mb-6">Featured Restaurants</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="overflow-hidden">
              <div className="relative h-48">
                <Image
                  src={`/placeholder.svg?height=200&width=300`}
                  alt={`Restaurant ${i}`}
                  fill
                  className="object-cover"
                />
              </div>
              <CardContent className="p-4">
                <h3 className="font-semibold text-lg mb-1">Restaurant {i}</h3>
                <p className="text-sm text-muted-foreground mb-2">Italian • $$</p>
                <div className="flex items-center text-sm">
                  <span className="bg-primary/10 text-primary px-2 py-0.5 rounded-full text-xs">4.8 ★</span>
                  <span className="ml-2 text-muted-foreground">30-45 min</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Categories */}
      <section className="container px-4 md:px-6 py-8 bg-muted">
        <h2 className="text-3xl font-bold tracking-tight mb-6">Browse by Category</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {["Pizza", "Burgers", "Sushi", "Salads", "Desserts", "Drinks"].map((category) => (
            <Card key={category} className="overflow-hidden">
              <Link href={`/menu?category=${category.toLowerCase()}`}>
                <div className="relative h-24 sm:h-32">
                  <Image src={`/placeholder.svg?height=150&width=150`} alt={category} fill className="object-cover" />
                </div>
                <CardContent className="p-2 text-center">
                  <h3 className="font-medium">{category}</h3>
                </CardContent>
              </Link>
            </Card>
          ))}
        </div>
      </section>
    </div>
  )
}
