"use client"

import React, {useState} from 'react';
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import {Button} from "@/components/ui/button";
import {Badge} from "@/components/ui/badge";
import {Loader, MapPin, Pencil, Plus, Trash2} from "lucide-react";
import {Label} from "@/components/ui/label";
import {Input} from "@/components/ui/input";
import {useEndpointProfile} from "@/app/(main)/profile/useEndpointProfile";
import {useAddAddressMutation, useMyAddressQuery, useUpdateAddressMutation} from "@/lib/redux/services/api";
import {useForm} from "react-hook-form";
import {addressFormData, addressSchema} from "@/lib/redux/services/type";
import {zodResolver} from "@hookform/resolvers/zod";
import {handleApiCall} from "@/lib/handleApiCall";
import {Slide, toast} from "react-toastify";
import {cn} from "@/lib/utils";

const MainAddresses = () => {
    const {method:{onDeleteAddress,onUpdateCurrentUsageAddress},trigger:{resultDeleteAddress,resultUpdateAddress}}=useEndpointProfile();
    const [isAddingAddress, setIsAddingAddress] = useState(false);
    const [editingAddress, setEditingAddress] = useState<number | null>(null);
    const getAddress = useMyAddressQuery();
    const addresses =getAddress?.currentData;
    const [addAddress]=useAddAddressMutation();
    const [updateAddress]=useUpdateAddressMutation();
    const [updatingUsageId, setUpdatingUsageId] = useState<number | null>(null);
    const {
        register,
        handleSubmit,
        reset,
        setValue,
        formState: { errors },
    } = useForm<addressFormData>({
        resolver: zodResolver(addressSchema),
    });

    const handleUpdateCurrentUsage = async (addressId: number) => {
        if (updatingUsageId) return; // Prevent multiple simultaneous updates
        setUpdatingUsageId(addressId);
        await onUpdateCurrentUsageAddress(addressId);
        setUpdatingUsageId(null);
    };

    const onSubmit = async (data: addressFormData) => {
        const formData = new FormData();
        formData.append("name", data.name);
        formData.append("country", data.country);
        formData.append("city", data.city);
        formData.append("state", data.state);
        formData.append("zip", data.zip);
        formData.append("street", data.street);
        formData.append("currentUsage", data.currentUsage.toString());
        await handleApiCall({
            apiFn: () => editingAddress? updateAddress({addressId:editingAddress,body:formData}).unwrap():addAddress(formData).unwrap(),
            onSuccess: (res) => {
                reset();
                setIsAddingAddress(false)
                setEditingAddress(null)
                toast.success(editingAddress ? "Address updated successfully!" : "Address added successfully!", {
                    theme: "dark",
                    transition: Slide,
                });
            }
        });
    };

    React.useEffect(()=>{
        if(editingAddress){
            const addressSelected = addresses?.find((a) => a.id === editingAddress);
            if(addressSelected){
                setValue('zip',addressSelected.zip);
                setValue('city',addressSelected.city);
                setValue('street',addressSelected.street);
                setValue('name',addressSelected.name);
                setValue('currentUsage',addressSelected.currentUsage);
                setValue('state',addressSelected.state);
                setValue('country',addressSelected.country);
            }
        }
    },[editingAddress, addresses, setValue])

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between px-6">
                <div>
                    <CardTitle>My Addresses</CardTitle>
                    <CardDescription>Manage your delivery addresses</CardDescription>
                </div>
                {!isAddingAddress && editingAddress === null && (
                    <Button
                        size="sm"
                        onClick={() => {
                            setIsAddingAddress(true)
                            setEditingAddress(null)
                        }}
                        className="bg-primary hover:bg-primary/90"
                    >
                        <Plus className="h-4 w-4 mr-2" />
                        Add Address
                    </Button>
                )}
            </CardHeader>
            <CardContent className="px-6">
                {isAddingAddress || editingAddress !== null ? (
                    <form className="space-y-4 border rounded-lg p-6 bg-card" onSubmit={handleSubmit(onSubmit)}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="addressName">Address Name</Label>
                                <Input
                                    id="addressName"
                                    placeholder="Home, Work, etc."
                                    {...register("name")}
                                />
                                {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="country">Country</Label>
                                <Input
                                    id="country"
                                    type="text"
                                    placeholder="Enter country"
                                    {...register("country")}
                                />
                                {errors.country && <p className="text-sm text-destructive">{errors.country.message}</p>}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="city">City</Label>
                                <Input
                                    id="city"
                                    type="text"
                                    placeholder="Enter city"
                                    {...register("city")}
                                />
                                {errors.city && <p className="text-sm text-destructive">{errors.city.message}</p>}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="state">State</Label>
                                <Input
                                    id="state"
                                    type="text"
                                    placeholder="Enter state"
                                    {...register("state")}
                                />
                                {errors.state && <p className="text-sm text-destructive">{errors.state.message}</p>}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="zip">ZIP Code</Label>
                                <Input
                                    id="zip"
                                    type="text"
                                    placeholder="Enter ZIP code"
                                    {...register("zip")}
                                />
                                {errors.zip && <p className="text-sm text-destructive">{errors.zip.message}</p>}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="street">Street Address</Label>
                                <Input
                                    id="street"
                                    type="text"
                                    placeholder="Enter street address"
                                    {...register("street")}
                                />
                                {errors.street && <p className="text-sm text-destructive">{errors.street.message}</p>}
                            </div>
                        </div>
                        <div className="flex items-center space-x-2">
                            <input 
                                type="checkbox" 
                                id="defaultAddress"  
                                {...register("currentUsage")}
                                className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                            />
                            <Label htmlFor="defaultAddress">Set as default address</Label>
                            {errors.currentUsage && <p className="text-sm text-destructive">{errors.currentUsage.message}</p>}
                        </div>
                        <div className="flex gap-2">
                            <Button type="submit" className="bg-primary hover:bg-primary/90">
                                {editingAddress !== null ? "Update" : "Add"} Address
                            </Button>
                            <Button
                                variant="outline"
                                onClick={() => {
                                    setIsAddingAddress(false)
                                    setEditingAddress(null)
                                    reset()
                                }}
                            >
                                Cancel
                            </Button>
                        </div>
                    </form>
                ) : addresses && addresses?.length > 0 ? (
                    <div className="grid gap-4">
                        {addresses?.map((address) => (
                            <div 
                                key={address.id} 
                                className={cn(
                                    "flex items-start justify-between p-4 border rounded-lg transition-colors cursor-pointer select-none",
                                    address.currentUsage && "bg-primary/5 border-primary/20",
                                    !address.currentUsage && "hover:bg-accent/50",
                                    updatingUsageId === address.id && "opacity-70"
                                )}
                                onClick={() => {
                                    if (!address.currentUsage) {
                                        handleUpdateCurrentUsage(address.id);
                                    }
                                }}
                            >
                                <div className="flex items-start gap-4">
                                    <MapPin className={cn(
                                        "h-5 w-5 mt-1 flex-shrink-0",
                                        address.currentUsage && "text-primary"
                                    )} />
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <h3 className="font-medium">{address.name}</h3>
                                            {address.currentUsage ? (
                                                <Badge variant="default" className="text-xs">
                                                    Default
                                                </Badge>
                                            ) : updatingUsageId === address.id ? (
                                                <Badge variant="outline" className="text-xs">
                                                    <Loader className="h-3 w-3 animate-spin mr-1" />
                                                    Setting as default...
                                                </Badge>
                                            ) : (
                                                <Badge variant="outline" className="text-xs text-muted-foreground">
                                                    Click to set as default
                                                </Badge>
                                            )}
                                        </div>
                                        <p className="text-sm text-muted-foreground mt-1">
                                            {address.street}
                                        </p>
                                        <p className="text-sm text-muted-foreground">
                                            {[address.city, address.state, address.zip].filter(Boolean).join(", ")}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-2">
                                    <Button 
                                        variant="ghost" 
                                        size="icon" 
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setEditingAddress(address.id);
                                        }}
                                        className="hover:bg-primary/10"
                                    >
                                        <Pencil className="h-4 w-4" />
                                    </Button>
                                    <Button 
                                        variant="ghost" 
                                        size="icon" 
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            onDeleteAddress(address.id);
                                        }}
                                        className="hover:bg-destructive/10"
                                        disabled={address.currentUsage}
                                    >
                                        {resultDeleteAddress?.isLoading ? (
                                            <Loader className="h-4 w-4 animate-spin" />
                                        ) : (
                                            <Trash2 className="h-4 w-4" />
                                        )}
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-6">
                        <p className="text-muted-foreground">No addresses added yet</p>
                    </div>
                )}
            </CardContent>
        </Card>
    );
};

export default MainAddresses;
