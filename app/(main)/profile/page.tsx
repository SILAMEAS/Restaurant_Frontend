"use client"

import { useState } from "react"
import Image from "next/image"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { MapPin, Heart, Plus, Pencil, Trash2 } from "lucide-react"
import { useProfileQuery } from "@/lib/redux/api"
import { useAppSelector } from "@/lib/redux/hooks"

export default function ProfilePage() {
  const getProfile = useProfileQuery();
  const [addresses, setAddresses] = useState([
    { id: 1, name: "Home", address: "123 Main St, Anytown, USA", default: true },
    { id: 2, name: "Work", address: "456 Office Blvd, Workville, USA", default: false },
  ])

  const [favorites, setFavorites] = useState([
    { id: 1, name: "Pizza Palace", image: "/placeholder.svg?height=100&width=100", cuisine: "Italian" },
    { id: 2, name: "Burger Joint", image: "/placeholder.svg?height=100&width=100", cuisine: "American" },
    { id: 3, name: "Sushi Spot", image: "/placeholder.svg?height=100&width=100", cuisine: "Japanese" },
  ])

  const [isEditing, setIsEditing] = useState(false)
  const [isAddingAddress, setIsAddingAddress] = useState(false)
  const [editingAddress, setEditingAddress] = useState<number | null>(null)

  return (
    <div className="container py-10">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Profile Sidebar */}
        <div className="w-full md:w-1/3">
          <Card>
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                <Avatar className="h-24 w-24">
                  <AvatarImage src="/placeholder.svg?height=96&width=96" alt="User" />
                  <AvatarFallback>JD</AvatarFallback>
                </Avatar>
              </div>
              <CardTitle>John Doe</CardTitle>
              <CardDescription>john.doe@example.com</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex justify-center">
                <Button variant="outline" onClick={() => setIsEditing(true)}>
                  Edit Profile
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Profile Content */}
        <div className="w-full md:w-2/3">
          <Tabs defaultValue="profile">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="profile">Profile</TabsTrigger>
              <TabsTrigger value="favorites">My Favorites</TabsTrigger>
              <TabsTrigger value="addresses">My Addresses</TabsTrigger>
            </TabsList>

            {/* Profile Tab */}
            <TabsContent value="profile">
              <Card>
                <CardHeader>
                  <CardTitle>Profile Information</CardTitle>
                  <CardDescription>Update your personal information</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {isEditing ? (
                    <form className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="fullName">Full Name</Label>
                        <Input id="fullName" defaultValue="John Doe" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" type="email" defaultValue="john.doe@example.com" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="profilePicture">Profile Picture</Label>
                        <Input id="profilePicture" type="file" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="bio">Bio</Label>
                        <Textarea id="bio" placeholder="Tell us about yourself" />
                      </div>
                      <div className="flex gap-2">
                        <Button type="submit">Save Changes</Button>
                        <Button variant="outline" onClick={() => setIsEditing(false)}>
                          Cancel
                        </Button>
                      </div>
                    </form>
                  ) : (
                    <div className="space-y-4">
                      <div>
                        <h3 className="font-medium">Full Name</h3>
                        <p className="text-muted-foreground">John Doe</p>
                      </div>
                      <div>
                        <h3 className="font-medium">Email</h3>
                        <p className="text-muted-foreground">john.doe@example.com</p>
                      </div>
                      <div>
                        <h3 className="font-medium">Bio</h3>
                        <p className="text-muted-foreground">No bio provided</p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Favorites Tab */}
            <TabsContent value="favorites">
              <Card>
                <CardHeader>
                  <CardTitle>My Favorite Restaurants</CardTitle>
                  <CardDescription>Restaurants you've marked as favorites</CardDescription>
                </CardHeader>
                <CardContent>
                  {favorites.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {favorites.map((favorite) => (
                        <div key={favorite.id} className="flex items-center gap-4 p-3 border rounded-lg">
                          <div className="relative h-16 w-16 rounded-md overflow-hidden">
                            <Image
                              src={favorite.image || "/placeholder.svg"}
                              alt={favorite.name}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-medium">{favorite.name}</h3>
                            <p className="text-sm text-muted-foreground">{favorite.cuisine}</p>
                          </div>
                          <Button variant="ghost" size="icon">
                            <Heart className="h-5 w-5 fill-primary text-primary" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Heart className="mx-auto h-12 w-12 text-muted-foreground mb-2" />
                      <h3 className="font-medium text-lg">No favorites yet</h3>
                      <p className="text-muted-foreground">
                        Browse restaurants and click the heart icon to add favorites
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Addresses Tab */}
            <TabsContent value="addresses">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>My Addresses</CardTitle>
                    <CardDescription>Manage your delivery addresses</CardDescription>
                  </div>
                  <Button
                    size="sm"
                    onClick={() => {
                      setIsAddingAddress(true)
                      setEditingAddress(null)
                    }}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Address
                  </Button>
                </CardHeader>
                <CardContent>
                  {isAddingAddress || editingAddress !== null ? (
                    <form className="space-y-4 border rounded-lg p-4">
                      <div className="space-y-2">
                        <Label htmlFor="addressName">Address Name</Label>
                        <Input
                          id="addressName"
                          placeholder="Home, Work, etc."
                          defaultValue={
                            editingAddress !== null ? addresses.find((a) => a.id === editingAddress)?.name : ""
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="fullAddress">Full Address</Label>
                        <Textarea
                          id="fullAddress"
                          placeholder="Street, City, State, Zip"
                          defaultValue={
                            editingAddress !== null ? addresses.find((a) => a.id === editingAddress)?.address : ""
                          }
                        />
                      </div>
                      <div className="flex items-center space-x-2">
                        <input type="checkbox" id="defaultAddress" />
                        <Label htmlFor="defaultAddress">Set as default address</Label>
                      </div>
                      <div className="flex gap-2">
                        <Button type="submit">{editingAddress !== null ? "Update" : "Add"} Address</Button>
                        <Button
                          variant="outline"
                          onClick={() => {
                            setIsAddingAddress(false)
                            setEditingAddress(null)
                          }}
                        >
                          Cancel
                        </Button>
                      </div>
                    </form>
                  ) : addresses.length > 0 ? (
                    <div className="space-y-4">
                      {addresses.map((address) => (
                        <div key={address.id} className="flex items-start gap-4 p-4 border rounded-lg">
                          <MapPin className="h-5 w-5 mt-1 flex-shrink-0" />
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <h3 className="font-medium">{address.name}</h3>
                              {address.default && (
                                <span className="bg-primary/10 text-primary text-xs px-2 py-0.5 rounded-full">
                                  Default
                                </span>
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground mt-1">{address.address}</p>
                          </div>
                          <div className="flex gap-1">
                            <Button variant="ghost" size="icon" onClick={() => setEditingAddress(address.id)}>
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <MapPin className="mx-auto h-12 w-12 text-muted-foreground mb-2" />
                      <h3 className="font-medium text-lg">No addresses yet</h3>
                      <p className="text-muted-foreground">Add an address to make checkout faster</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
