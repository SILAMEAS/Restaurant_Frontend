import React, {useState} from "react"
import {Button} from "@/components/ui/button"
import {Input} from "@/components/ui/input"
import {Label} from "@/components/ui/label"
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card"
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table"
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
import {Edit, MoreVertical, Plus, Search, Trash2} from "lucide-react"
import {
  useAddCategoryMutation,
  useDeleteCategoriesMutation,
  useGetCategoriesQuery,
  useUpdateCategoryMutation
} from "@/lib/redux/api";
import {useForm} from "react-hook-form";
import {categoryFormData, categorySchema} from "@/lib/redux/type";
import {zodResolver} from "@hookform/resolvers/zod";
import {handleApiCall} from "@/lib/handleApiCall";
import {Slide, toast} from "react-toastify";
import {ImageDropzone} from "@/app/(main)/profile/(component)/ImageDropzone";
import useDropzoneCustom from "@/app/(main)/profile/(component)/useDropzoneCustom";
import SkeletonTable from "@/components/skeleton/SkeletonTable";
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
    const [deleteCategory,resultDeleteCategory]=useDeleteCategoriesMutation();
    const [addCategory,resultAddCategory]=useAddCategoryMutation();
    const [updateCategory,resultUpdateCategory] = useUpdateCategoryMutation()
    const getCategories= useGetCategoriesQuery();
    const [searchQuery, setSearchQuery] = useState("")
    const [isAddingCategory, setIsAddingCategory] = useState(false)
    const [editingCategory, setEditingCategory] = useState<number | null>(null)
    const dropzoneCustom=useDropzoneCustom();
    const categories = getCategories?.currentData?.contents
    const {
      register,
      handleSubmit,
      reset,
      formState: { errors },
    } = useForm<categoryFormData>({
      resolver: zodResolver(categorySchema),
    });
    const onSubmit = async (data: categoryFormData) => {
      if (!dropzoneCustom.imageFile&&!editingCategory) {
        toast.error("Please upload a category image.");
        return;
      }

      const formData = new FormData();
      formData.append("name", data.name);
      if (dropzoneCustom.imageFile) {
        formData.append("image", dropzoneCustom.imageFile); // 👈 correct typing
      }

      await handleApiCall({
        apiFn: () =>editingCategory?updateCategory({body:formData,categoryId:editingCategory}).unwrap(): addCategory(formData).unwrap(),
        onSuccess: () => {
          reset();
          dropzoneCustom.setImageFile(null);
          dropzoneCustom.setImagePreviewUrl(null);
          toast.success("Category added successfully!", {
            theme: "dark",
            transition: Slide,
          });
          setIsAddingCategory(false);
        },
        onError:(e)=>{
          toast.error(`${e.data.message}`, {
            theme: "dark",
            transition: Slide,
          });
        }
      });
    };
    const handleDeleteCategory =async (categoryId:string|number)=>{
      await handleApiCall({
        apiFn: () => deleteCategory({categoryId}).unwrap(),
        onSuccess: () => {
          toast.success("Category delete successfully!", {
            theme: "dark",
            transition: Slide,
          });
        },
        onError:(e)=>{
          toast.error(`${e.data.message}`, {
            theme: "dark",
            transition: Slide,
          });
        }
      });

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
                        reset();
                        dropzoneCustom.setImagePreviewUrl(null);
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
                      <form onSubmit={handleSubmit(onSubmit)}>
                        <div className="space-y-2">
                          <Label>Category Image</Label>
                          <ImageDropzone dropzoneCustom={dropzoneCustom} />
                        </div>
                        <div className="space-y-4 py-4">
                          <div className="space-y-2">
                            <Label htmlFor="categoryName">Category Name</Label>
                            <Input
                              id="categoryName"
                              {...register("name")}
                              placeholder="e.g., Pizza, Burgers, Sushi"
                              defaultValue={
                                editingCategory !== null ? categories?.find((c) => c.id === editingCategory)?.name : ""
                              }
                              required
                            />
                            {errors.name && <p className="text-sm text-red-500">{errors.name.message}</p>}
                          </div>
                        </div>
                        <DialogFooter>
                          <Button type="submit">{
                            resultAddCategory.isLoading?"loading...":
                                editingCategory !== null ? "Update Category" : "Add Category"} </Button>
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
                    <TableHead>Restaurants</TableHead>
                    <TableHead>Items</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {!categories?<SkeletonTable column={4} />:
                    categories?.filter(
                      (c) =>
                        c.name.toLowerCase().includes(searchQuery.toLowerCase())
                    // ||
                    //     category.slug.toLowerCase().includes(searchQuery.toLowerCase()),
                    )
                    .map((c) => (
                      <TableRow key={c.id}>
                        <TableCell  className="font-medium">{c.id}</TableCell>
                        <TableCell >{c.name}</TableCell>
                        <TableCell>{c.restaurant}</TableCell>
                        <TableCell>{c.items}</TableCell>
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
                              <DropdownMenuItem onClick={() => {
                                setEditingCategory(c.id);
                                dropzoneCustom.setImagePreviewUrl({url:c.url})
                              }}>
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

export default AdminCategory;