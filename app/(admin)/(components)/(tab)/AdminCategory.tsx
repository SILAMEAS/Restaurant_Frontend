

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
const AdminCategory=()=>{
    const [categories, setCategories] = useState(categoriesData);
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
    return  <Card>
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
}

export default AdminCategory;