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
import {foodFormData, foodSchema} from "@/lib/redux/type";
import {zodResolver} from "@hookform/resolvers/zod";
import useDropzoneCustom from "@/app/(main)/profile/(component)/useDropzoneCustom";
import {Slide, toast} from "react-toastify";
import {handleApiCall} from "@/lib/handleApiCall";
import {ImageDropzone} from "@/app/(main)/profile/(component)/ImageDropzone";
import SkeletonTable from "@/components/skeleton/SkeletonTable";
import useParamQuery from "@/hooks/useParamQuery";
import {foodTypes} from "@/constant/FoodType";

const AdminFood=()=>{
    const {paramQuery,setParamQuery} =useParamQuery();
    const getFoodsQuery= useGetFoodsQuery({params:paramQuery,caseIgnoreFilter:paramQuery.filterBy==="All"},{refetchOnMountOrArgChange:true});
    const getRestaurantOwnerQuery= useGetRestaurantOwnerQuery({});
    const getCategoriesQuery= useGetCategoriesQuery();
    const [searchQuery, setSearchQuery] = useState("")
    const [isAddingFood, setIsAddingFood] = useState(false)
    const [editingFood, setEditingFood] = useState<number | null>(null);
    const [addFood,resultAddFood]=useAddFoodMutation();
    const [updateFood,resultUpdateFood]=useUpdateFoodMutation();
    const [deleteFood,resultDeleteFood]=useDeleteFoodMutation();

    const categories = getCategoriesQuery?.currentData?.contents;
    const foods = getFoodsQuery?.currentData?.contents;
    const ownerRestaurant= getRestaurantOwnerQuery?.currentData;
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

    if(ownerRestaurant){
      setValue('restaurantId',`${ownerRestaurant.id}`)
    }

    const closePopUp=()=>{
      reset();
      dropzoneCustom.setImageFile(null);
      dropzoneCustom.setImagePreviewUrl(null)
      setIsAddingFood(false);
      setEditingFood(null);
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
      formData.append("discount", data.discount);
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


    const handleDeleteCategory =async (foodId:string|number)=>{
      await handleApiCall({
        apiFn: () => deleteFood({foodId}).unwrap(),
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
                                  editingFood !== null ? foods?.find((c) => c.id === editingFood)?.name : ""
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
                                    ? foods?.find((c) => c.id === editingFood)?.price ?? 0
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
                                    ? foods?.find((c) => c.id === editingFood)?.discount.food ?? 0
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
                                    ? foods?.find((c) => c.id === editingFood)?.discount.restaurant ?? 0
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
                                    ? foods?.find((c) => c.id === editingFood)?.discount.total ?? 0
                                    : ""
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
                                    ? foods?.find((c) => c.id === editingFood)?.priceDiscount ?? 0
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
                                  editingFood !== null ? foods?.find((c) => c.id === editingFood)?.description : ""
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
                                        ? foods?.find((c) => c.id === editingFood)?.available
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
                                      ? foods?.find((f) => f.id === editingFood)?.foodType??"NONE"
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
                                      ? foods?.find((f) => f.id === editingFood)?.category.id
                                      : categories?categories[categories.length-1].id:NaN
                                }
                                className="w-full border rounded-md px-3 py-2"
                            >
                              <option value="" disabled>
                                Select a category
                              </option>
                              {categories?.map((c) => {
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
                          <Button type="submit">{(resultAddFood.isLoading||resultUpdateFood.isLoading)?"loading ...":  editingFood !== null ? "Update Food" : "Add Food"}</Button>
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
                    <TableHead>Restaurants</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Food Discount (%)</TableHead>
                    <TableHead>Restaurant Discount (%) </TableHead>
                    <TableHead>Total Discount (%)</TableHead>
                    
                   
                    <TableHead>Available</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {!foods?<SkeletonTable column={5} />:
                    foods?.filter(
                      (c) =>
                        c.name.toLowerCase().includes(searchQuery.toLowerCase())
                    )
                    .map((f) => (
                      <TableRow key={f.id}>
                        <TableCell  className="font-medium">{f.id}</TableCell>
                        <TableCell >{f.name}</TableCell>
                        <TableCell>{f.restaurantName}</TableCell>
                        <TableCell>{f.category.name}</TableCell>
                        
                        <TableCell >
                              <p  className={'line-through'}>{f.price}$</p>
                              <p >{f.priceDiscount}$</p>
                          </TableCell>
                          <TableCell >{f.discount.food}%</TableCell>
                        <TableCell >{f.discount.restaurant}%</TableCell>
                        <TableCell >{f.discount.total}%</TableCell>
                      
                      
                      
                        <TableCell> <Badge
                            variant={
                              !f.available
                                  ? "outline"
                                      : "default"
                            }
                        >
                          {f.available?"In Stock":"Out of Stock"}
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
                              <DropdownMenuItem onClick={() => {
                                setEditingFood(f.id);
                                dropzoneCustom.setImagePreviewUrl({url: f.images[0]})
                              }}>
                                <Edit className="h-4 w-4 mr-2" />
                                Edit Food
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                className="text-destructive"
                                onClick={() => handleDeleteCategory(f.id)}
                              >
                                <Trash2 className="h-4 w-4 mr-2" />
                                Delete Food
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