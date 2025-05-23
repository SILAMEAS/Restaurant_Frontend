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
import MainProfile from "@/app/(main)/profile/(tab)/MainProfile";
import MainFavorite from "@/app/(main)/profile/(tab)/MainFavorite";
import MainAddresses from "@/app/(main)/profile/(tab)/MainAddresses";

export default function ProfilePage() {
  const getProfile = useProfileQuery();
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);

  const [addresses, setAddresses] = useState<IAddress[]|[]>([]);

  const [favorites, setFavorites] = useState<IFavorite[]|[]>([]);




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
            <MainProfile profile={profile} setIsEditing={setIsEditing} isEditing={isEditing}/>

            {/* Favorites Tab */}
            <MainFavorite favorites={favorites}/>

            {/* Addresses Tab */}
            <MainAddresses addresses={addresses}/>

          </Tabs>
        </div>
      </div>
    </div>
  )
}
