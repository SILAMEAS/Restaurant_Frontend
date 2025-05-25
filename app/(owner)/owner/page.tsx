"use client"

import type React from "react"
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs"
import { useDashboardQuery} from "@/lib/redux/api"
import {ICurrentData} from "@/lib/generic/ICurrentData"

import {IDashboard} from "@/lib/redux/type";
import CartDashboard from "@/app/(admin)/(components)/CartDashboard";
import AdminUser from "@/app/(admin)/(components)/(tab)/AdminUser";
import AdminOrder from "@/app/(admin)/(components)/(tab)/AdminOrder";
import AdminCategory from "@/app/(admin)/(components)/(tab)/AdminCategory";


export default function OwnerDashboardPage() {
    const dashboard = useDashboardQuery()
    return (
        <div className="container py-10">
            <h1 className="text-3xl font-bold mb-8">Owner Dashboard</h1>
            <CartDashboard dashboard={dashboard as ICurrentData<IDashboard>}/>

            <Tabs defaultValue="users">
                <TabsList className="grid w-full grid-cols-3">
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
            </Tabs>
        </div>
    )
}
