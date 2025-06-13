"use client"

import type React from "react"
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs"
import { useDashboardQuery} from "@/lib/redux/api"
import CartDashboard from "./components/CartDashboard"
import {ICurrentData} from "@/lib/generic/ICurrentData"
import AdminUser from "@/app/admin/components/(tab)/AdminUser"
import AdminOrder from "@/app/admin/components/(tab)/AdminOrder"
import AdminCategory from "@/app/admin/components/(tab)/AdminCategory"
import {IDashboard} from "@/lib/redux/type";
import AdminRestaurant from "@/app/admin/components/(tab)/AdminRestaurant";


export default function AdminDashboardPage() {
  const dashboard = useDashboardQuery()
  return (
    <div className="container py-10">
      <CartDashboard dashboard={dashboard as ICurrentData<IDashboard>}/>

      <Tabs defaultValue="users">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="restaurant">Restaurant</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="orders">Orders</TabsTrigger>
          <TabsTrigger value="categories">Categories</TabsTrigger>
        </TabsList>

        {/* Users Tab */}
        <TabsContent value="users">
          <AdminUser/>
        </TabsContent>

        {/* Orders Tab */}
        <TabsContent value="orders">
          <AdminOrder/>
        </TabsContent>

        {/* Categories Tab */}
        <TabsContent value="categories">
          <AdminCategory/>
        </TabsContent>

        {/* Categories Tab */}
        <TabsContent value="restaurant">
          <AdminRestaurant/>
        </TabsContent>


      </Tabs>
    </div>
  )
}
