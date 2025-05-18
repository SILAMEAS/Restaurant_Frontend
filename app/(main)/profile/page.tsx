"use client"

import React, { useState } from "react"
import Image from "next/image"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { MapPin, Heart, Plus, Pencil, Trash2, Loader } from "lucide-react"
import { IAddress, IFavorite, useDeleteAddressMutation, useFavUnFavMutation, useProfileQuery, useUpdateAddressMutation } from "@/lib/redux/api"
import { useAppSelector } from "@/lib/redux/hooks"
import { skip } from "node:test"
import { useGlobalState } from "@/hooks/useGlobalState"
import { Slide, toast } from "react-toastify"
import { useEndpointProfile } from "./useEndpointProfile"
import {useRouter} from "next/navigation";

export default function ProfilePage() {
  const {method:{onDeleteAddress,onUnFavorite,onUpdateCurrentUsageAddress},trigger:{resultDeleteAddress}}=useEndpointProfile();
  const getProfile = useProfileQuery();
  const router = useRouter();


  const [addresses, setAddresses] = useState<IAddress[]|[]>([]);

  const [favorites, setFavorites] = useState<IFavorite[]|[]>([]);

  const [isEditing, setIsEditing] = useState(false);
  const [isAddingAddress, setIsAddingAddress] = useState(false);
  const [editingAddress, setEditingAddress] = useState<number | null>(null);

  React.useEffect(()=>{
    if(getProfile?.currentData){
      setAddresses(getProfile?.currentData?.addresses);
      setFavorites(getProfile?.currentData?.favourites);
    }
    if(getProfile.isError){
      router.push('/auth/login')
    }
  },[getProfile.currentData,getProfile.isError]);

  const profile = getProfile?.currentData;
  
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
              <CardTitle>{profile?.fullName}</CardTitle>
              <CardDescription>{profile?.email}</CardDescription>
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
                        <Input id="fullName" defaultValue={profile?.fullName} />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" type="email" defaultValue={profile?.email} />
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
                        <p className="text-muted-foreground">{profile?.fullName}</p>
                      </div>
                      <div>
                        <h3 className="font-medium">Email</h3>
                        <p className="text-muted-foreground">{profile?.email}</p>
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
                              src={ "/placeholder.svg"}
                              alt={favorite.name}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-medium">{favorite.name}</h3>
                            {/* <p className="text-sm text-muted-foreground">{favorite.cuisine}</p> */}
                          </div>
                          <Button variant="ghost" size="icon" onClick={()=>onUnFavorite(favorite.restaurantId)}>
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
                            editingAddress !== null ? addresses?.find((a) => a.id === editingAddress)?.name : "HOME"
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="fullAddress">Full Address</Label>
                        <Textarea
                          id="fullAddress"
                          placeholder="Street, City, State, Zip"
                          defaultValue={
                            editingAddress !== null ? addresses?.find((a) => a.id === editingAddress)?.street : ""
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
                  ) : addresses?.length > 0 ? (
                    <div className="space-y-4">
                      {addresses?.map((address) => (
                        <div key={address.id} className="flex items-start gap-4 p-4 border rounded-lg">
                          <MapPin className="h-5 w-5 mt-1 flex-shrink-0" />
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <h3 className="font-medium">{address.street}</h3>
                              { (
                                <span className="bg-primary/10 text-primary text-xs px-2 py-0.5 rounded-full">
                                  {address.name}
                                </span>
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground mt-1">{address.state}</p>
                          </div>
                          <div className="flex gap-1">
                            <Button variant="ghost" size="icon" onClick={() => setEditingAddress(address.id)}>
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" onClick={()=>onDeleteAddress(address.id)} >
                              {
                                resultDeleteAddress?.isLoading?
                                <Loader />:
                                <Trash2 className="h-4 w-4" />
                              }
                      
                            </Button>
                              <div className={`flex items-center gap- ${address.currentUsage?'cursor-not-allowed':"cursor-pointer"}`} 
                              onClick={()=>{
                                if(!address.currentUsage){
                                  onUpdateCurrentUsageAddress(address.id)
                                }
                              }}
                              >
                                <div className="flex items-center gap-1 bg-primary/10 text-primary text-xs px-2 py-0.5 rounded-full">
                                  <div
                                    className={`w-[5px] h-[5px] rounded-full ${
                                      address.currentUsage ? 'bg-green-400' : 'bg-red-400'
                                    }`}
                                  />
                                  <span>{address.currentUsage ? 'Active' : 'Inactive'}</span>
                                </div>
                              </div>
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
