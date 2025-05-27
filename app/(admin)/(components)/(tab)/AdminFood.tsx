

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
import { useToast } from "@/hooks/use-toast"
import {useGetCategoriesQuery, useGetFoodsQuery} from "@/lib/redux/api";
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
const AdminFood=()=>{
    const getFoods= useGetFoodsQuery();
    const [searchQuery, setSearchQuery] = useState("")
    const [isAddingCategory, setIsAddingCategory] = useState(false)
    const [editingCategory, setEditingCategory] = useState<number | null>(null)
    const { toast } = useToast();
    const categories = getFoods?.currentData?.contents
        
  const handleDeleteCategory = (id: number) => {
    // setCategories(categories.filter((category) => category.id !== id))

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
    return  <Card>
            <CardHeader>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <CardTitle>Foods</CardTitle>
                  <CardDescription>Manage foods for the platform</CardDescription>
                </div>
                <div className="flex gap-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      placeholder="Search foods..."
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
                        Add Food
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>{editingCategory !== null ? "Edit Food" : "Add New Food"}</DialogTitle>
                        <DialogDescription>
                          {editingCategory !== null
                            ? "Update the details of this food"
                            : "Add a new food to the platform"}
                        </DialogDescription>
                      </DialogHeader>
                      <form onSubmit={handleSaveCategory}>
                        <div className="space-y-4 py-4">
                          <div className="space-y-2">
                            <Label htmlFor="foodName">Food Name</Label>
                            <Input
                              id="foodName"
                              placeholder="e.g., Coca, Pessi"
                              defaultValue={
                                editingCategory !== null ? categories?.find((c) => c.id === editingCategory)?.name : ""
                              }
                              required
                            />
                          </div>
                          {/*<div className="space-y-2">*/}
                          {/*  <Label htmlFor="categorySlug">Slug</Label>*/}
                          {/*  <Input*/}
                          {/*    id="categorySlug"*/}
                          {/*    placeholder="e.g., pizza, burgers, sushi"*/}
                          {/*    defaultValue={*/}
                          {/*      editingCategory !== null ? categories?.find((c) => c.id === editingCategory)?.slug : ""*/}
                          {/*    }*/}
                          {/*    required*/}
                          {/*  />*/}
                          {/*  <p className="text-xs text-muted-foreground">*/}
                          {/*    Used in URLs. Use lowercase letters, numbers, and hyphens only.*/}
                          {/*  </p>*/}
                          {/*</div>*/}
                        </div>
                        <DialogFooter>
                          <Button type="submit">{editingCategory !== null ? "Update Food" : "Add Food"}</Button>
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
                    <TableHead>#ID</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Restaurants</TableHead>
                    <TableHead>Available</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {categories?.filter(
                      (c) =>
                        c.name.toLowerCase().includes(searchQuery.toLowerCase())
                    // ||
                    //     category.slug.toLowerCase().includes(searchQuery.toLowerCase()),
                    )
                    .map((c) => (
                      <TableRow key={c.id}>
                        <TableCell  className="font-medium">{c.id}</TableCell>
                        <TableCell >{c.name}</TableCell>
                        <TableCell>{c.category.name}</TableCell>
                        <TableCell>{c.restaurantName}</TableCell>
                        <TableCell> <Badge
                            variant={
                              !c.available
                                  ? "outline"
                                      : "default"
                            }
                        >
                          {c.available?"In Stock":"Out of Stock"}
                        </Badge></TableCell>

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
                              <DropdownMenuItem onClick={() => setEditingCategory(c.id)}>
                                <Edit className="h-4 w-4 mr-2" />
                                Edit Category
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                className="text-destructive"
                                onClick={() => handleDeleteCategory(c.id)}
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
}

export default AdminFood;