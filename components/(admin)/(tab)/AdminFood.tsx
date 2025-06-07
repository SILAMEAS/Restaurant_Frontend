import React, {useState} from "react"
import {Button} from "@/components/ui/button"
import {Input} from "@/components/ui/input"
import {Label} from "@/components/ui/label"
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card"
import {Badge} from "@/components/ui/badge"
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
  useAddFoodMutation,
  useDeleteFoodMutation,
  useGetCategoriesQuery,
  useGetFoodsQuery,
  useGetRestaurantOwnerQuery,
  useUpdateFoodMutation
} from "@/lib/redux/api";
import {useForm} from "react-hook-form";
import {foodFormData, foodSchema, type FoodResponse, type ImageUrl} from "@/lib/redux/type";
import {zodResolver} from "@hookform/resolvers/zod";
import useDropzoneCustom from "@/app/(main)/profile/(component)/useDropzoneCustom";
import {Slide, toast} from "react-toastify";
import {handleApiCall} from "@/lib/handleApiCall";
import {ImageDropzone} from "@/app/(main)/profile/(component)/ImageDropzone";
import SkeletonTable from "@/components/skeleton/SkeletonTable";
import useParamQuery from "@/hooks/useParamQuery";
import {foodTypes} from "@/constant/FoodType";
import { PaginatedTable, type Column } from "@/components/ui/paginated-table"
import { usePagination } from "@/lib/hooks/usePagination"
import { PaginationRequestDefault } from "@/lib/redux/type"

const AdminFood=()=>{
    const {paramQuery,setParamQuery} =useParamQuery();
    const [searchQuery, setSearchQuery] = useState("")
    const [isAddingFood, setIsAddingFood] = useState(false)
    const [editingFood, setEditingFood] = useState<number | null>(null)
    const pagination = usePagination()
    
    const { data: foodsData, isLoading } = useGetFoodsQuery({
        params: {
            ...PaginationRequestDefault,
            pageNo: pagination.currentPage,
            pageSize: pagination.itemsPerPage,
            search: searchQuery,
        },
        caseIgnoreFilter: true,
    })

    const getCategoriesQuery = useGetCategoriesQuery()
    const getRestaurantOwnerQuery = useGetRestaurantOwnerQuery({})
    const [addFood, { isLoading: isAddingFoodLoading }] = useAddFoodMutation()
    const [updateFood, { isLoading: isUpdatingFoodLoading }] = useUpdateFoodMutation()
    const [deleteFood] = useDeleteFoodMutation()
    const dropzoneCustom=useDropzoneCustom();
    const {
      register,
      handleSubmit,
      reset,
      setValue,
      watch,
      formState: { errors },
    } = useForm<foodFormData>({
      resolver: zodResolver(foodSchema),
    });

    // Watch price and discount_food for auto-calculation
    const price = watch('price');
    const discount_food = watch('discount_food');

    // Calculate price with discount whenever price or discount_food changes
    React.useEffect(() => {
      if (price && discount_food) {
        const basePrice = parseFloat(price);
        const discountPercent = parseFloat(discount_food);
        const priceWithDiscount = basePrice - (basePrice * discountPercent / 100);
        setValue('price_with_discount', priceWithDiscount.toFixed(2));
      }
    }, [price, discount_food, setValue]);

    if(getRestaurantOwnerQuery?.currentData){
      setValue('restaurantId',`${getRestaurantOwnerQuery.currentData.id}`)
    }

    const closePopUp=()=>{
      reset();
      dropzoneCustom.setImageFile(null);
      dropzoneCustom.setImagePreviewUrl(null)
      setIsAddingFood(false);
      setEditingFood(null);
    }

    const handleEditFood = (food: FoodResponse) => {
        setEditingFood(food.id)
        if (food.images && food.images.length > 0) {
            dropzoneCustom.setImagePreviewUrl({ url: food.images[0], publicId: null })
        }
    }

    const handleDeleteFood = async (foodId: number) => {
        await handleApiCall({
            apiFn: () => deleteFood({ foodId }).unwrap(),
            onSuccess: () => {
                toast.success("Food item deleted successfully", {
                    theme: "dark",
                    transition: Slide,
                })
            },
        })
    }

    const onSubmit = async (data: foodFormData) => {



      if (!dropzoneCustom.imageFile && editingFood==null) {
        toast.error("Please upload a Food image.");
        return;
      }

      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("description", data.description);
      formData.append("categoryId", data.categoryId);
      formData.append("foodType", `${data.foodType}`);
      formData.append("price", data.price);
      formData.append("discount", "0");
      formData.append("available", `${data.available}`);
      formData.append("restaurantId", data.restaurantId);
     if(dropzoneCustom.imageFile){
       formData.append("images", dropzoneCustom.imageFile); // 👈 correct typing
     }


      await handleApiCall({
        apiFn: () =>editingFood?updateFood({foodId:editingFood, body:formData}).unwrap(): addFood(formData).unwrap(),
        onSuccess: () => {
          closePopUp()
          toast.success(`Food ${editingFood?"added":"updated"} successfully!`, {
            theme: "dark",
            transition: Slide,
          });
        },
      });
    };

    const columns: Column[] = [
        {
            header: "Name",
            accessorKey: "name",
        },
        {
            header: "Price",
            accessorKey: "price",
            cell: (row: FoodResponse) => (
                <div>
                    <p className="line-through">${row.price.toFixed(2)}</p>
                    <p>${row.priceDiscount.toFixed(2)}</p>
                </div>
            ),
        },
        {
            header: "Type",
            accessorKey: "foodType",
            cell: (row: FoodResponse) => (
                <Badge variant="outline">{row.foodType}</Badge>
            ),
        },
        {
            header: "Restaurant",
            accessorKey: "restaurantName",
        },
        {
            header: "Category",
            accessorKey: "category",
            cell: (row: FoodResponse) => row.category.name,
        },
        {
            header: "Discounts",
            accessorKey: "discount",
            cell: (row: FoodResponse) => (
                <div className="text-sm">
                    <div>Food: {row.discount.food}%</div>
                    <div>Restaurant: {row.discount.restaurant}%</div>
                    <div>Total: {row.discount.total}%</div>
                </div>
            ),
        },
        {
            header: "Status",
            accessorKey: "available",
            cell: (row: FoodResponse) => (
                <Badge variant={row.available ? "default" : "outline"}>
                    {row.available ? "In Stock" : "Out of Stock"}
                </Badge>
            ),
        },
        {
            header: "Actions",
            accessorKey: "actions",
            cell: (row: FoodResponse) => (
                <div className="text-right">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                                <MoreVertical className="h-4 w-4" />
                                <span className="sr-only">Open menu</span>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem onClick={() => handleEditFood(row)}>
                                <Edit className="h-4 w-4 mr-2" />
                                Edit Food Item
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                                className="text-destructive"
                                onClick={() => handleDeleteFood(row.id)}
                            >
                                <Trash2 className="h-4 w-4 mr-2" />
                                Delete Food Item
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            ),
        },
    ]

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
                    open={isAddingFood || editingFood !== null}
                    onOpenChange={(open) => {
                      if (!open) {
                       closePopUp();
                      }
                    }}
                  >
                    <DialogTrigger asChild>
                      <Button onClick={() => setIsAddingFood(true)}>
                        <Plus className="h-4 w-4 mr-2" />
                        Add Food
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>{editingFood !== null ? "Edit Food" : "Add New Food"}</DialogTitle>
                        <DialogDescription>
                          {editingFood !== null
                            ? "Update the details of this food"
                            : "Add a new food to the platform"}
                        </DialogDescription>
                      </DialogHeader>
                      <form onSubmit={handleSubmit(onSubmit)}>
                        <div className="space-y-2">
                          <Label>Food Image</Label>
                          <ImageDropzone dropzoneCustom={dropzoneCustom} />
                        </div>
                        {/** Name **/}
                        <div className="space-y-4 py-4">
                          <div className="space-y-2">
                            <Label htmlFor="categoryName">Food Name</Label>
                            <Input
                                {...register("name")}
                                placeholder="e.g., ice coffeee, black coffeee"
                                defaultValue={
                                  editingFood !== null ? foodsData?.contents?.find((c) => c.id === editingFood)?.name : ""
                                }
                                required
                            />
                            {errors.name && <p className="text-sm text-red-500">{errors.name.message}</p>}
                          </div>
                        </div>
                        {/** Price Field */}
                        <div className="space-y-4 py-4">
                          <Label htmlFor="price">Price</Label>
                          <input
                              type="number"
                              step="0.01"
                              id="price"
                              {...register("price", { required: "Price is required", min: 0 })}
                              className="w-full border rounded-md px-3 py-2"
                              defaultValue={
                                editingFood !== null
                                    ? foodsData?.contents?.find((c) => c.id === editingFood)?.price ?? 0
                                    : ""
                              }
                              onChange={(e) => {
                                register("price").onChange(e);
                                const newPrice = e.target.value;
                                setValue('price', newPrice);
                              }}
                          />
                          {errors.price && (
                              <p className="text-sm text-red-500">{errors.price.message}</p>
                          )}
                        </div>
                         {/** Discount Food Field */}
                         <div className="space-y-4 py-4">
                          <Label htmlFor="discount_food">Discount Food (%)</Label>
                          <input
                              type="number"
                              step="0.01"
                              id="discount_food"
                              min="0"
                              max="100"
                              {...register("discount_food", { 
                                required: "Discount is required",
                                min: 0,
                                max: 100
                              })}
                              className="w-full border rounded-md px-3 py-2"
                              defaultValue={
                                editingFood !== null
                                    ? foodsData?.contents?.find((c) => c.id === editingFood)?.discount.food ?? 0
                                    : "0"
                              }
                              onChange={(e) => {
                                register("discount_food").onChange(e);
                                const newDiscount = e.target.value;
                                setValue('discount_food', newDiscount);
                              }}
                          />
                          {errors.discount_food && (
                              <p className="text-sm text-red-500">{errors.discount_food.message}</p>
                          )}
                        </div>
                        {/** Discount Restaurant Field */}
                        <div className="space-y-4 py-4">
                          <Label htmlFor="price_with_discount">Discount Restaurant (%)</Label>
                          <input
                              type="number"
                              step="0.01"
                              id="discount_restaurant"
                              {...register("discount_restaurant")}
                              className="w-full border rounded-md px-3 py-2 bg-muted text-muted-foreground cursor-not-allowed"
                              disabled
                              defaultValue={
                                editingFood !== null
                                    ? foodsData?.contents?.find((c) => c.id === editingFood)?.discount.restaurant ?? 0
                                    : ""
                              }
                          />
                        </div>
                       
                         {/** Discount Field */}
                         <div className="space-y-4 py-4">
                          <Label htmlFor="discount_total">Discount (%)</Label>
                          <input
                              type="number"
                              step="0.01"
                              id="discount_total"
                              {...register("discount")}
                              className="w-full border rounded-md px-3 py-2 bg-muted text-muted-foreground cursor-not-allowed"
                              disabled
                              defaultValue={
                                editingFood !== null
                                    ? foodsData?.contents?.find((c) => c.id === editingFood)?.discount.total ?? 0
                                    : 0
                              }
                          />
                        </div>
                        
                        {/** Price With Discount Field */}
                        <div className="space-y-4 py-4">
                          <Label htmlFor="price_with_discount">Price With Discount</Label>
                          <input
                              type="number"
                              step="0.01"
                              id="price_with_discount"
                              {...register("price_with_discount")}
                              className="w-full border rounded-md px-3 py-2 bg-muted text-muted-foreground cursor-not-allowed"
                              disabled
                              defaultValue={
                                editingFood !== null
                                    ? foodsData?.contents?.find((c) => c.id === editingFood)?.priceDiscount ?? 0
                                    : ""
                              }
                          />
                        </div>
                        {/** Description **/}
                        <div className="space-y-4 py-4">
                          <div className="space-y-2">
                            <Label htmlFor="categoryName">Food Description</Label>
                            <Input
                                {...register("description")}
                                placeholder="e.g., COFFEE, CAKE"
                                defaultValue={
                                  editingFood !== null ? foodsData?.contents?.find((c) => c.id === editingFood)?.description : ""
                                }
                                required
                            />
                            {errors.description && <p className="text-sm text-red-500">{errors.description.message}</p>}
                          </div>
                        </div>
                        {/** Available **/}
                        <div className="space-y-4 py-4">
                          <div className="space-y-2">
                            <Label htmlFor="available">Available</Label>
                            <div className="flex items-center space-x-2">
                              <input
                                  type="checkbox"
                                  id="available"
                                  {...register("available")}
                                  defaultChecked={
                                    editingFood !== null
                                        ? foodsData?.contents?.find((c) => c.id === editingFood)?.available
                                        : false
                                  }
                              />
                              <span className="text-sm">Is this food currently available?</span>
                            </div>
                            {errors.available && (
                                <p className="text-sm text-red-500">{errors.available.message}</p>
                            )}
                          </div>
                        </div>
                        {/** FoodType **/}
                        <div className="space-y-4 py-4">
                          <div className="space-y-2">
                            <Label htmlFor="foodType">FoodType</Label>
                            <select
                                id="foodType"
                                {...register("foodType", { required: "Category is required" })}
                                defaultValue={
                                  (editingFood !== null)
                                      ? foodsData?.contents?.find((f) => f.id === editingFood)?.foodType??"NONE"
                                      : "NONE"
                                }
                                className="w-full border rounded-md px-3 py-2"
                            >
                              <option value="" disabled>
                                  Please select food type
                              </option>
                              {foodTypes?.map((f) => {
                                return <option key={f} value={f}>
                                  {f}
                                </option>
                              })}
                            </select>
                            {errors.foodType && (
                                <p className="text-sm text-red-500">{errors.foodType.message}</p>
                            )}
                          </div>
                        </div>
                        {/** Category **/}
                        <div className="space-y-4 py-4">
                          <div className="space-y-2">
                            <Label htmlFor="categoryId">Category</Label>
                            <select
                                id="categoryId"
                                {...register("categoryId", { required: "Category is required" })}
                                defaultValue={
                                  (editingFood !== null)
                                      ? foodsData?.contents?.find((f) => f.id === editingFood)?.category.id
                                      : getCategoriesQuery?.currentData?.contents[getCategoriesQuery?.currentData?.contents.length-1].id
                                }
                                className="w-full border rounded-md px-3 py-2"
                            >
                              <option value="" disabled>
                                Select a category
                              </option>
                              {getCategoriesQuery?.currentData?.contents.map((c) => {
                                return <option key={c.id} value={c.id}>
                                  {c.name}
                                </option>
                              })}
                            </select>
                            {errors.categoryId && (
                                <p className="text-sm text-red-500">{errors.categoryId.message}</p>
                            )}
                          </div>
                        </div>
                        <DialogFooter>
                          <Button type="submit">{(isAddingFoodLoading||isUpdatingFoodLoading)?"loading ...":  editingFood !== null ? "Update Food" : "Add Food"}</Button>
                        </DialogFooter>
                      </form>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <PaginatedTable
                columns={columns}
                data={foodsData?.contents}
                totalItems={foodsData?.total || 0}
                currentPage={pagination.currentPage}
                itemsPerPage={pagination.itemsPerPage}
                isLoading={isLoading}
                onPageChange={pagination.setCurrentPage}
                onItemsPerPageChange={pagination.setItemsPerPage}
                skeletonColumns={7}
              />
            </CardContent>
          </Card>
}

export default AdminFood;