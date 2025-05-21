"use client"

import type React from "react"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Search, Plus, MoreVertical, Edit, Trash2, Eye, Package, Users, Tag } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { IDashboard, useDashboardQuery } from "@/lib/redux/api"
import CartDashboard from "../(components)/CartDashboard"
import { ICurrentData } from "@/lib/generic/ICurrentData"
import UserTab from "../(components)/(tab)/UserTab"
import OrderTab from "../(components)/(tab)/OrderTab"
import CategoryTab from "../(components)/(tab)/CategoryTab"




export default function AdminDashboardPage() {
  const dashboard = useDashboardQuery()
  return (
    <div className="container py-10">
      <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>
      <CartDashboard dashboard={dashboard as ICurrentData<IDashboard>}/>

      <Tabs defaultValue="users">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="orders">Orders</TabsTrigger>
          <TabsTrigger value="categories">Categories</TabsTrigger>
        </TabsList>

        {/* Users Tab */}
        <TabsContent value="users">
          <UserTab/>
        </TabsContent>

        {/* Orders Tab */}
        <TabsContent value="orders">
          <OrderTab/>
        </TabsContent>

        {/* Categories Tab */}
        <TabsContent value="categories">
          <CategoryTab/>
        </TabsContent>
      </Tabs>
    </div>
  )
}
