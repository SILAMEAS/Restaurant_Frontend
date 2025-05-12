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
import { useDashboardQuery } from "@/lib/redux/api"

// Sample users data
const usersData = [
  {
    id: 1,
    name: "John Doe",
    email: "john.doe@example.com",
    role: "Customer",
    orders: 5,
    joined: "2023-01-15T10:30:00Z",
  },
  {
    id: 2,
    name: "Jane Smith",
    email: "jane.smith@example.com",
    role: "Restaurant Owner",
    orders: 0,
    joined: "2023-02-20T14:45:00Z",
  },
  {
    id: 3,
    name: "Bob Johnson",
    email: "bob.johnson@example.com",
    role: "Customer",
    orders: 12,
    joined: "2023-01-05T09:15:00Z",
  },
  {
    id: 4,
    name: "Alice Williams",
    email: "alice.williams@example.com",
    role: "Admin",
    orders: 0,
    joined: "2022-12-10T11:20:00Z",
  },
  {
    id: 5,
    name: "Charlie Brown",
    email: "charlie.brown@example.com",
    role: "Customer",
    orders: 8,
    joined: "2023-03-01T16:30:00Z",
  },
]

// Sample orders data
const ordersData = [
  {
    id: "ORD-001",
    customer: "John Doe",
    restaurant: "Pizza Palace",
    total: 18.98,
    status: "Delivered",
    date: "2023-04-10T14:30:00Z",
  },
  {
    id: "ORD-002",
    customer: "Jane Smith",
    restaurant: "Burger Joint",
    total: 29.98,
    status: "In Progress",
    date: "2023-04-10T15:45:00Z",
  },
  {
    id: "ORD-003",
    customer: "Bob Johnson",
    restaurant: "Sushi Spot",
    total: 21.98,
    status: "Pending",
    date: "2023-04-10T16:15:00Z",
  },
  {
    id: "ORD-004",
    customer: "Charlie Brown",
    restaurant: "Pizza Palace",
    total: 24.99,
    status: "Delivered",
    date: "2023-04-09T12:30:00Z",
  },
  {
    id: "ORD-005",
    customer: "John Doe",
    restaurant: "Green Eats",
    total: 15.5,
    status: "Delivered",
    date: "2023-04-08T13:45:00Z",
  },
]

// Sample categories data
const categoriesData = [
  {
    id: 1,
    name: "Pizza",
    slug: "pizza",
    restaurants: 12,
    items: 48,
  },
  {
    id: 2,
    name: "Burgers",
    slug: "burgers",
    restaurants: 8,
    items: 32,
  },
  {
    id: 3,
    name: "Sushi",
    slug: "sushi",
    restaurants: 6,
    items: 45,
  },
  {
    id: 4,
    name: "Salads",
    slug: "salads",
    restaurants: 5,
    items: 20,
  },
  {
    id: 5,
    name: "Desserts",
    slug: "desserts",
    restaurants: 10,
    items: 40,
  },
  {
    id: 6,
    name: "Drinks",
    slug: "drinks",
    restaurants: 15,
    items: 60,
  },
]

export default function AdminDashboardPage() {
  const dashboard=useDashboardQuery();
  const [users, setUsers] = useState(usersData)
  const [orders, setOrders] = useState(ordersData)
  const [categories, setCategories] = useState(categoriesData)
  const [searchQuery, setSearchQuery] = useState("")
  const [isAddingCategory, setIsAddingCategory] = useState(false)
  const [editingCategory, setEditingCategory] = useState<number | null>(null)
  const { toast } = useToast()

  const handleDeleteCategory = (id: number) => {
    setCategories(categories.filter((category) => category.id !== id))

    toast({
      title: "Category Deleted",
      description: "The category has been successfully deleted.",
    })
  }

  const handleSaveCategory = (e: React.FormEvent) => {
    e.preventDefault()

    if (editingCategory !== null) {
      toast({
        title: "Category Updated",
        description: "The category has been successfully updated.",
      })
    } else {
      toast({
        title: "Category Added",
        description: "The new category has been successfully added.",
      })
    }

    setIsAddingCategory(false)
    setEditingCategory(null)
  }

  return (
    <div className="container py-10">
      <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboard?.currentData?.total_users??0}</div>
            <p className="text-xs text-muted-foreground">+2 from last week</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{ dashboard?.currentData?.total_orders??0}</div>
            <p className="text-xs text-muted-foreground">+12 from last week</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Categories</CardTitle>
            <Tag className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboard?.currentData?.total_categories??0}</div>
            <p className="text-xs text-muted-foreground">+1 from last week</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="users">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="orders">Orders</TabsTrigger>
          <TabsTrigger value="categories">Categories</TabsTrigger>
        </TabsList>

        {/* Users Tab */}
        <TabsContent value="users">
          <Card>
            <CardHeader>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <CardTitle>Users</CardTitle>
                  <CardDescription>Manage user accounts and permissions</CardDescription>
                </div>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Search users..."
                    className="pl-10 w-full sm:w-[250px]"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Orders</TableHead>
                    <TableHead>Joined</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users
                    .filter(
                      (user) =>
                        user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        user.email.toLowerCase().includes(searchQuery.toLowerCase()),
                    )
                    .map((user) => (
                      <TableRow key={user.id}>
                        <TableCell className="font-medium">{user.name}</TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{user.role}</Badge>
                        </TableCell>
                        <TableCell>{user.orders}</TableCell>
                        <TableCell>{new Date(user.joined).toLocaleDateString()}</TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreVertical className="h-4 w-4" />
                                <span className="sr-only">Open menu</span>
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuItem>
                                <Eye className="h-4 w-4 mr-2" />
                                View Details
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Edit className="h-4 w-4 mr-2" />
                                Edit User
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem className="text-destructive">
                                <Trash2 className="h-4 w-4 mr-2" />
                                Delete User
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Orders Tab */}
        <TabsContent value="orders">
          <Card>
            <CardHeader>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <CardTitle>Orders</CardTitle>
                  <CardDescription>View and manage all customer orders</CardDescription>
                </div>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Search orders..."
                    className="pl-10 w-full sm:w-[250px]"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Order ID</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Restaurant</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {orders
                    .filter(
                      (order) =>
                        order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        order.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        order.restaurant.toLowerCase().includes(searchQuery.toLowerCase()),
                    )
                    .map((order) => (
                      <TableRow key={order.id}>
                        <TableCell className="font-medium">{order.id}</TableCell>
                        <TableCell>{order.customer}</TableCell>
                        <TableCell>{order.restaurant}</TableCell>
                        <TableCell>${order.total.toFixed(2)}</TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              order.status === "Delivered"
                                ? "outline"
                                : order.status === "In Progress"
                                  ? "secondary"
                                  : "default"
                            }
                          >
                            {order.status}
                          </Badge>
                        </TableCell>
                        <TableCell>{new Date(order.date).toLocaleDateString()}</TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreVertical className="h-4 w-4" />
                                <span className="sr-only">Open menu</span>
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuItem>
                                <Eye className="h-4 w-4 mr-2" />
                                View Details
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Edit className="h-4 w-4 mr-2" />
                                Update Status
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Categories Tab */}
        <TabsContent value="categories">
          <Card>
            <CardHeader>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <CardTitle>Categories</CardTitle>
                  <CardDescription>Manage food categories for the platform</CardDescription>
                </div>
                <div className="flex gap-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      placeholder="Search categories..."
                      className="pl-10 w-full sm:w-[250px]"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  <Dialog
                    open={isAddingCategory || editingCategory !== null}
                    onOpenChange={(open) => {
                      if (!open) {
                        setIsAddingCategory(false)
                        setEditingCategory(null)
                      }
                    }}
                  >
                    <DialogTrigger asChild>
                      <Button onClick={() => setIsAddingCategory(true)}>
                        <Plus className="h-4 w-4 mr-2" />
                        Add Category
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>{editingCategory !== null ? "Edit Category" : "Add New Category"}</DialogTitle>
                        <DialogDescription>
                          {editingCategory !== null
                            ? "Update the details of this category"
                            : "Add a new food category to the platform"}
                        </DialogDescription>
                      </DialogHeader>
                      <form onSubmit={handleSaveCategory}>
                        <div className="space-y-4 py-4">
                          <div className="space-y-2">
                            <Label htmlFor="categoryName">Category Name</Label>
                            <Input
                              id="categoryName"
                              placeholder="e.g., Pizza, Burgers, Sushi"
                              defaultValue={
                                editingCategory !== null ? categories.find((c) => c.id === editingCategory)?.name : ""
                              }
                              required
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="categorySlug">Slug</Label>
                            <Input
                              id="categorySlug"
                              placeholder="e.g., pizza, burgers, sushi"
                              defaultValue={
                                editingCategory !== null ? categories.find((c) => c.id === editingCategory)?.slug : ""
                              }
                              required
                            />
                            <p className="text-xs text-muted-foreground">
                              Used in URLs. Use lowercase letters, numbers, and hyphens only.
                            </p>
                          </div>
                        </div>
                        <DialogFooter>
                          <Button type="submit">{editingCategory !== null ? "Update Category" : "Add Category"}</Button>
                        </DialogFooter>
                      </form>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Slug</TableHead>
                    <TableHead>Restaurants</TableHead>
                    <TableHead>Items</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {categories
                    .filter(
                      (category) =>
                        category.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        category.slug.toLowerCase().includes(searchQuery.toLowerCase()),
                    )
                    .map((category) => (
                      <TableRow key={category.id}>
                        <TableCell className="font-medium">{category.name}</TableCell>
                        <TableCell>{category.slug}</TableCell>
                        <TableCell>{category.restaurants}</TableCell>
                        <TableCell>{category.items}</TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreVertical className="h-4 w-4" />
                                <span className="sr-only">Open menu</span>
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuItem onClick={() => setEditingCategory(category.id)}>
                                <Edit className="h-4 w-4 mr-2" />
                                Edit Category
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                className="text-destructive"
                                onClick={() => handleDeleteCategory(category.id)}
                              >
                                <Trash2 className="h-4 w-4 mr-2" />
                                Delete Category
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
