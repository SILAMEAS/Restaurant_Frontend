"use client"

import React, {useState} from "react"
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs"
import {Button} from "@/components/ui/button"
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card"
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar"
import {useProfileQuery} from "@/lib/redux/api"
import {useRouter} from "next/navigation"
import MainProfile from "./(tab)/MainProfile"
import MainFavorite from "./(tab)/MainFavorite"
import MainAddresses from "./(tab)/MainAddresses"
import { toast } from "react-toastify"

export default function ProfilePage() {
  const getProfile = useProfileQuery();
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);

  React.useEffect(()=>{
    if(getProfile.isError){
      router.push('/auth/login')
    }
  },[getProfile.currentData,getProfile.isError]);

  const profile = getProfile?.currentData;

  const handleUpdateProfile = async (formData: FormData) => {
    try {
      // You can handle the form data submission here
      // This is where you'll make your API call
      console.log('Form data to submit:', Object.fromEntries(formData.entries()));
      
      // Example success notification
      toast.success("Profile updated successfully!", {
        theme: "dark",
      });
    } catch (error) {
      toast.error("Failed to update profile. Please try again.", {
        theme: "dark",
      });
    }
  };
  
  return (
    <div className="container py-10">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Profile Sidebar */}
        <div className="w-full md:w-1/3">
          <Card>
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                <Avatar className="h-24 w-24">
                  <AvatarImage 
                    src={profile?.profileImage || "/placeholder.svg?height=96&width=96"} 
                    alt={profile?.fullName || "User"} 
                  />
                  <AvatarFallback>{profile?.fullName?.charAt(0) || "U"}</AvatarFallback>
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
          <Tabs defaultValue="profile" className="space-y-4">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="profile">My Profile</TabsTrigger>
              <TabsTrigger value="favorites">My Favorites</TabsTrigger>
              <TabsTrigger value="addresses">My Addresses</TabsTrigger>
            </TabsList>

            {/* Profile Tab */}
            <TabsContent value="profile">
              <MainProfile 
                profile={profile} 
                setIsEditing={setIsEditing} 
                isEditing={isEditing}
                onUpdateProfile={handleUpdateProfile}
              />
            </TabsContent>

            {/* Favorites Tab */}
            <TabsContent value="favorites">
              <MainFavorite/>
            </TabsContent>

            {/* Addresses Tab */}
            <TabsContent value="addresses">
              <MainAddresses/>
            </TabsContent>

          </Tabs>
        </div>
      </div>
    </div>
  )
}
