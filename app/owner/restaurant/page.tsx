"use client"

import React, {useState} from "react"
import {Controller, useForm} from "react-hook-form"
import {Button} from "@/components/ui/button"
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card"
import {Input} from "@/components/ui/input"
import {Label} from "@/components/ui/label"
import {Textarea} from "@/components/ui/textarea"
import {Switch} from "@/components/ui/switch"
import {Badge} from "@/components/ui/badge"
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select"
import {Calendar, Clock, Edit, Mail, MapPin, Phone, Save, Star, User, X} from "lucide-react"
import {RestaurantFormData, RestaurantResponse} from "@/lib/redux/services/type";
import {useGetRestaurantOwnerQuery, useUpdateRestaurantMutation} from "@/lib/redux/services/api";
import {ImageDropzone} from "@/app/(main)/profile/(component)/ImageDropzone";
import useDropzoneCustom from "@/app/(main)/profile/(component)/useDropzoneCustom";
import {useGlobalState} from "@/hooks/useGlobalState";
import {useAppDispatch} from "@/lib/redux/hooks";
import {setRestaurant} from "@/lib/redux/counterSlice";


const cuisineTypes = [
    "Cambodia",
    "Italian",
    "Chinese",
    "Japanese",
    "Mexican",
    "Indian",
    "French",
    "Thai",
    "American",
    "Mediterranean",
    "Other",
]

const addressNames = ["HOME", "WORK", "OTHER"]

export default function RestaurantViewEdit() {
    const getRestaurantOwnerQuery = useGetRestaurantOwnerQuery({});
    const {restaurant}=useGlobalState();
    const dispatch = useAppDispatch();
    const [isEditing, setIsEditing] = useState(false)
    const [updateRestaurant] = useUpdateRestaurantMutation();
    const dropzoneCustom=useDropzoneCustom();

    const {
        control,
        handleSubmit,
        formState: { errors, isSubmitting },
        reset,
        setValue,
    } = useForm<RestaurantFormData>({
        defaultValues: {
            ownerName: restaurant.ownerName,
            name: restaurant.name,
            description: restaurant.description,
            cuisineType: restaurant.cuisineType,
            address: restaurant.address,
            contactInformation: restaurant.contactInformation,
            openingHours: restaurant.openingHours,
            open: restaurant.open,
            discount: restaurant.discount,
            deliveryFee: restaurant.deliveryFee
        },
        mode: "onChange",
    })
    React.useEffect(()=>{
        if(getRestaurantOwnerQuery.currentData){
            const rest = getRestaurantOwnerQuery.currentData;
            dispatch(setRestaurant(rest))
            if(rest){
                const {ownerName,name,description,cuisineType,address,contactInformation,open,imageUrls,openingHours,discount,deliveryFee}=rest;


                setValue('ownerName',ownerName);
                setValue('name',name);
                setValue('description',description);
                setValue('cuisineType',cuisineType);
                setValue('address',address);
                setValue('contactInformation',contactInformation);
                setValue('open',open);
                setValue('openingHours',`${openingHours}`);
                setValue('discount',discount);
                setValue('deliveryFee',deliveryFee);
                dropzoneCustom.setImagePreviewUrls(imageUrls);

            }

        }
    },[getRestaurantOwnerQuery.currentData])
    // const watchedImages = watch("imageUrls")

    const onSubmit = async (data: RestaurantFormData) => {
        try {
            const body = new FormData();
            /** Information */
            body.append("ownerName",data.ownerName);
            body.append("name",data.name);
            body.append("description",data.description);
            body.append("open",`${data.open}`);
            body.append("cuisineType",`${data.cuisineType}`);
            body.append("openingHours",data.openingHours);
            body.append("discount",`${data.discount}`);
            body.append("deliveryFee",`${data.deliveryFee}`);

            /** Address  **/
            body.append("address.name",data.address.name);
            body.append("address.street",data.address.street);
            body.append("address.state",data.address.state);
            body.append("address.zip",data.address.zip);
            body.append("address.country",data.address.country);
            body.append("address.city",data.address.city);

            /** Contact  **/
            body.append("contactInformation.email",data.contactInformation.email);
            body.append("contactInformation.phone",data.contactInformation.phone);

            /** Image */
            if(dropzoneCustom.imageFiles){
                dropzoneCustom.imageFiles.forEach(f=>
                    body.append("images", f)
                )
            }

            const res = await updateRestaurant({restaurantId:restaurant.id,body}).unwrap();
            if(res){
                dispatch(setRestaurant(res))
                setIsEditing(false)

            }
        } catch (error) {
            console.error("Error updating restaurant:", error)
        }
    }

    const handleCancel = () => {
        reset({
            ownerName: restaurant.ownerName,
            name: restaurant.name,
            description: restaurant.description,
            cuisineType: restaurant.cuisineType,
            address: restaurant.address,
            contactInformation: restaurant.contactInformation,
            openingHours: restaurant.openingHours,
            open: restaurant.open,
            discount: restaurant.discount,
            deliveryFee: restaurant.deliveryFee
        })
        setIsEditing(false)
    }

    const removeImage = (publicId: number|string|null) => {

    }

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
        })
    }

    const renderStars = (rating: number) => {
        return Array.from({ length: 5 }, (_, i) => (
            <Star key={i} className={`w-4 h-4 ${i < rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`} />
        ))
    }

    if (isEditing) {
        return (
            <div className="max-w-4xl mx-auto p-6 space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold">Edit Restaurant</h1>
                        <p className="text-muted-foreground">Update restaurant information</p>
                    </div>
                    <div className="flex gap-2">
                        <Button onClick={handleSubmit(onSubmit)} className="flex items-center gap-2" disabled={isSubmitting}>
                            <Save className="w-4 h-4" />
                            {isSubmitting ? "Saving..." : "Save Changes"}
                        </Button>
                        <Button variant="outline" onClick={handleCancel} className="flex items-center gap-2">
                            <X className="w-4 h-4" />
                            Cancel
                        </Button>
                    </div>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="grid gap-6">
                    {/* Basic Information */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Basic Information</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="name">Restaurant Name *</Label>
                                    <Controller
                                        name="name"
                                        control={control}
                                        rules={{
                                            required: "Name is required",
                                            minLength: { value: 1, message: "Name cannot be empty" },
                                        }}
                                        render={({ field }) => (
                                            <Input {...field} id="name" className={errors.name ? "border-red-500" : ""} />
                                        )}
                                    />
                                    {errors.name && <p className="text-sm text-red-500">{errors.name.message}</p>}
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="ownerName">Owner Name *</Label>
                                    <Controller
                                        name="ownerName"
                                        control={control}
                                        rules={{
                                            required: "Owner name is required",
                                            minLength: { value: 1, message: "Owner name cannot be empty" },
                                        }}
                                        render={({ field }) => (
                                            <Input {...field} id="ownerName" className={errors.ownerName ? "border-red-500" : ""} />
                                        )}
                                    />
                                    {errors.ownerName && <p className="text-sm text-red-500">{errors.ownerName.message}</p>}
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="cuisineType">Cuisine Type</Label>
                                <Controller
                                    name="cuisineType"
                                    control={control}
                                    render={({ field }) => (
                                        <Select value={field.value} onValueChange={field.onChange}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select cuisine type" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {cuisineTypes.map((type) => (
                                                    <SelectItem key={type} value={type}>
                                                        {type}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    )}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="description">Description *</Label>
                                <Controller
                                    name="description"
                                    control={control}
                                    rules={{
                                        required: "Description is required",
                                        minLength: { value: 1, message: "Description cannot be empty" },
                                    }}
                                    render={({ field }) => (
                                        <Textarea
                                            {...field}
                                            id="description"
                                            className={`min-h-[100px] ${errors.description ? "border-red-500" : ""}`}
                                        />
                                    )}
                                />
                                {errors.description && <p className="text-sm text-red-500">{errors.description.message}</p>}
                            </div>
                            <div className="flex items-center space-x-2">
                                <Controller
                                    name="open"
                                    control={control}
                                    render={({ field }) => <Switch id="open" checked={field.value} onCheckedChange={field.onChange} />}
                                />
                                <Label htmlFor="open">Currently Open</Label>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Address */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Address</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="addressName">Address Name</Label>
                                    <Controller
                                        name="address.name"
                                        control={control}
                                        render={({ field }) => (
                                            <Select value={field.value} onValueChange={field.onChange}>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select address type" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {addressNames.map((name) => (
                                                        <SelectItem key={name} value={name}>
                                                            {name}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        )}
                                    />
                                </div>
                                <div className="flex items-center space-x-2 pt-6">
                                    <Controller
                                        name="address.currentUsage"
                                        control={control}
                                        render={({ field }) => (
                                            <Switch id="currentUsage" checked={field.value} onCheckedChange={field.onChange} />
                                        )}
                                    />
                                    <Label htmlFor="currentUsage">Current Usage</Label>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="street">Street Address *</Label>
                                <Controller
                                    name="address.street"
                                    control={control}
                                    rules={{
                                        required: "Street address is required",
                                        minLength: { value: 1, message: "Street address cannot be empty" },
                                    }}
                                    render={({ field }) => (
                                        <Input {...field} id="street" className={errors.address?.street ? "border-red-500" : ""} />
                                    )}
                                />
                                {errors.address?.street && <p className="text-sm text-red-500">{errors.address.street.message}</p>}
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="city">City *</Label>
                                    <Controller
                                        name="address.city"
                                        control={control}
                                        rules={{
                                            required: "City is required",
                                            minLength: { value: 1, message: "City cannot be empty" },
                                        }}
                                        render={({ field }) => (
                                            <Input {...field} id="city" className={errors.address?.city ? "border-red-500" : ""} />
                                        )}
                                    />
                                    {errors.address?.city && <p className="text-sm text-red-500">{errors.address.city.message}</p>}
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="state">State *</Label>
                                    <Controller
                                        name="address.state"
                                        control={control}
                                        rules={{
                                            required: "State is required",
                                            minLength: { value: 1, message: "State cannot be empty" },
                                        }}
                                        render={({ field }) => (
                                            <Input {...field} id="state" className={errors.address?.state ? "border-red-500" : ""} />
                                        )}
                                    />
                                    {errors.address?.state && <p className="text-sm text-red-500">{errors.address.state.message}</p>}
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="zip">Zip Code *</Label>
                                    <Controller
                                        name="address.zip"
                                        control={control}
                                        rules={{
                                            required: "Zip code is required",
                                            minLength: { value: 1, message: "Zip code cannot be empty" },
                                        }}
                                        render={({ field }) => (
                                            <Input {...field} id="zip" className={errors.address?.zip ? "border-red-500" : ""} />
                                        )}
                                    />
                                    {errors.address?.zip && <p className="text-sm text-red-500">{errors.address.zip.message}</p>}
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="country">Country</Label>
                                <Controller
                                    name="address.country"
                                    control={control}
                                    render={({ field }) => <Input {...field} id="country" />}
                                />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Contact Information */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Contact Information</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="phone">Phone *</Label>
                                    <Controller
                                        name="contactInformation.phone"
                                        control={control}
                                        rules={{
                                            required: "Phone is required",
                                            minLength: { value: 1, message: "Phone cannot be empty" },
                                        }}
                                        render={({ field }) => (
                                            <Input
                                                {...field}
                                                id="phone"
                                                className={errors.contactInformation?.phone ? "border-red-500" : ""}
                                            />
                                        )}
                                    />
                                    {errors.contactInformation?.phone && (
                                        <p className="text-sm text-red-500">{errors.contactInformation.phone.message}</p>
                                    )}
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="email">Email *</Label>
                                    <Controller
                                        name="contactInformation.email"
                                        control={control}
                                        rules={{
                                            required: "Email is required",
                                            pattern: {
                                                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                                message: "Invalid email address",
                                            },
                                        }}
                                        render={({ field }) => (
                                            <Input
                                                {...field}
                                                id="email"
                                                type="email"
                                                className={errors.contactInformation?.email ? "border-red-500" : ""}
                                            />
                                        )}
                                    />
                                    {errors.contactInformation?.email && (
                                        <p className="text-sm text-red-500">{errors.contactInformation.email.message}</p>
                                    )}
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Opening Hours */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Detail Information</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-2">
                                <Label htmlFor="openingHours">Opening Hours *</Label>
                                <Controller
                                    name="openingHours"
                                    control={control}
                                    rules={{
                                        required: "Opening hours is required",
                                        minLength: { value: 1, message: "Opening hours cannot be empty" },
                                    }}
                                    render={({ field }) => (
                                        <Textarea
                                            {...field}
                                            id="openingHours"
                                            placeholder="e.g., Mon-Thu: 11:00 AM - 10:00 PM, Fri-Sat: 11:00 AM - 11:00 PM"
                                            className={errors.openingHours ? "border-red-500" : ""}
                                        />
                                    )}
                                />
                                {errors.openingHours && <p className="text-sm text-red-500">{errors.openingHours.message}</p>}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="Discount">Discount (%)</Label>
                                <Controller
                                    name="discount"
                                    control={control}
                                    rules={{
                                        required: "Opening hours is required",
                                        minLength: { value: 1, message: "Opening hours cannot be empty" },
                                    }}
                                    render={({ field }) => (
                                        <Input
                                            {...field}
                                            id="discount"
                                            placeholder="e.g., Mon-Thu: 11:00 AM - 10:00 PM, Fri-Sat: 11:00 AM - 11:00 PM"
                                            className={errors.discount ? "border-red-500" : ""}
                                        />
                                    )}
                                />
                                {errors.discount && <p className="text-sm text-red-500">{errors.discount.message}</p>}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="DeliveryFee">DeliveryFee ($)</Label>
                                <Controller
                                    name="deliveryFee"
                                    control={control}
                                    rules={{
                                        required: "Opening hours is required",
                                        minLength: { value: 1, message: "Opening hours cannot be empty" },
                                    }}
                                    render={({ field }) => (
                                        <Input
                                            {...field}
                                            id="deliveryFee"
                                            placeholder="e.g., Mon-Thu: 11:00 AM - 10:00 PM, Fri-Sat: 11:00 AM - 11:00 PM"
                                            className={errors.deliveryFee ? "border-red-500" : ""}
                                        />
                                    )}
                                />
                                {errors.deliveryFee && <p className="text-sm text-red-500">{errors.deliveryFee.message}</p>}
                            </div>
                        </CardContent>
                    </Card>


                    {/* Images */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Images</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                {dropzoneCustom.imagePreviewUrls?.map((image) => (
                                    <div key={image.publicId} className="relative group">
                                        <img
                                            src={image.url || "/placeholder.svg"}
                                            alt={`Restaurant image ${image.publicId}`}
                                            className="w-full h-48 object-contain rounded-lg "
                                        />
                                        <div className="absolute bottom-2 left-2 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded">
                                            ID: {image.publicId}
                                        </div>
                                        <Button
                                            type="button"
                                            variant="destructive"
                                            size="sm"
                                            className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                                            onClick={() => image.publicId&&removeImage(image.publicId)}
                                        >
                                            <X className="w-4 h-4" />
                                        </Button>
                                    </div>
                                ))}
                                <div className="space-y-2">
                                    <Label>Restaurant's image</Label>
                                    <ImageDropzone dropzoneCustom={dropzoneCustom} multiple />
                                </div>

                            </div>
                        </CardContent>
                    </Card>
                </form>
            </div>
        )
    }

    return (
        <div className="max-w-4xl mx-auto p-6 space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold">{restaurant.name}</h1>
                    <div className="flex items-center gap-4 mt-2">
                        <Badge variant={restaurant.open ? "default" : "secondary"}>{restaurant.open ? "Open" : "Closed"}</Badge>
                        {restaurant.cuisineType && <Badge variant="outline">{restaurant.cuisineType}</Badge>}
                        <div className="flex items-center gap-1">
                            {renderStars(restaurant.rating)}
                            <span className="text-sm text-muted-foreground ml-1">({restaurant.rating}/5)</span>
                        </div>
                    </div>
                </div>
                <Button onClick={() => setIsEditing(true)} className="flex items-center gap-2">
                    <Edit className="w-4 h-4" />
                    Edit Restaurant
                </Button>
            </div>

            <div className="grid gap-6">
                {/* Restaurant Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <User className="w-5 h-5" />
                                Owner Information
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="font-medium">{restaurant.ownerName}</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Calendar className="w-5 h-5" />
                                Registration Date
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p>{formatDate(restaurant.registrationDate)}</p>
                        </CardContent>
                    </Card>
                </div>

                {/* Images */}
                {restaurant.imageUrls.length > 0 && (
                    <Card>
                        <CardContent className="p-6">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                {restaurant.imageUrls.map((image, index) => (
                                    <div key={index} className="relative">
                                        <img
                                            src={image.url || "/placeholder.svg"}
                                            alt={`${restaurant.name} image ${index + 1}`}
                                            className="w-full h-48 object-contain rounded-lg"
                                        />
                                        <div className="absolute bottom-2 left-2 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded">
                                            ID: {image.publicId}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Description */}
                <Card>
                    <CardHeader>
                        <CardTitle>About</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-muted-foreground leading-relaxed">{restaurant.description}</p>
                    </CardContent>
                </Card>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Address */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <MapPin className="w-5 h-5" />
                                Address ({restaurant.address.name})
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-1">
                                <p>{restaurant.address.street}</p>
                                <p>
                                    {restaurant.address.city}, {restaurant.address.state} {restaurant.address.zip}
                                </p>
                                <p>{restaurant.address.country}</p>
                                {restaurant.address.currentUsage && (
                                    <Badge variant="secondary" className="mt-2">
                                        Current Usage
                                    </Badge>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Contact Information */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Contact Information</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <div className="flex items-center gap-2">
                                <Phone className="w-4 h-4 text-muted-foreground" />
                                <span>{restaurant.contactInformation.phone}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Mail className="w-4 h-4 text-muted-foreground" />
                                <span>{restaurant.contactInformation.email}</span>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Opening Hours */}
                <Card className="bg-background text-foreground shadow-md rounded-2xl">
                    <CardContent className="p-6 space-y-4">
                        <div className="flex items-center space-x-3">
                            <Clock className="w-5 h-5 text-muted-foreground" />
                            <h3 className="text-lg font-semibold">Detail Information</h3>
                        </div>
                        <p className="text-sm text-muted-foreground">
                            <span className="block">{restaurant.openingHours}</span>
                        </p>
                        <div className="space-y-1 text-sm">
                            <p className="text-muted-foreground">{`discount = ${restaurant.discount} (%)`}</p>
                            <p className="text-muted-foreground">{`deliveryFee = ${restaurant.deliveryFee} ($)`}</p>
                        </div>
                    </CardContent>
                </Card>

            </div>
        </div>
    )
}
