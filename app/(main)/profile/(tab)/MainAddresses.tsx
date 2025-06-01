import React, {useState} from 'react';
import {TabsContent} from "@/components/ui/tabs";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import {Button} from "@/components/ui/button";
import {Loader, MapPin, Pencil, Plus, Trash2} from "lucide-react";
import {Label} from "@/components/ui/label";
import {Input} from "@/components/ui/input";
import {useEndpointProfile} from "@/app/(main)/profile/useEndpointProfile";
import {useAddAddressMutation, useMyAddressQuery, useUpdateAddressMutation} from "@/lib/redux/api";
import {useForm} from "react-hook-form";
import {addressFormData, addressSchema} from "@/lib/redux/type";
import {zodResolver} from "@hookform/resolvers/zod";
import {handleApiCall} from "@/lib/handleApiCall";
import {Slide, toast} from "react-toastify";

const MainAddresses = () => {
    const {method:{onDeleteAddress,onUpdateCurrentUsageAddress},trigger:{resultDeleteAddress}}=useEndpointProfile();
    const [isAddingAddress, setIsAddingAddress] = useState(false);
    const [editingAddress, setEditingAddress] = useState<number | null>(null);
    const getAddress = useMyAddressQuery();
    const addresses =getAddress?.currentData;
    const [addAddress]=useAddAddressMutation();
    const [updateAddress]=useUpdateAddressMutation();
    const {
        register,
        handleSubmit,
        reset,
        setValue,
        formState: { errors },
    } = useForm<addressFormData>({
        resolver: zodResolver(addressSchema),
    });
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
                toast.success("create address success!", {
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
                setValue('country',addressSelected.zip);
            }
        }

    },[editingAddress])
    return <Card>

            <CardHeader className="flex flex-row items-center justify-between">
                <div>
                    <CardTitle>My Addresses</CardTitle>
                    <CardDescription>Manage your delivery addresses</CardDescription>
                </div>
                <Button
                    size="sm"
                    onClick={() => {
                        setIsAddingAddress(true)
                        setEditingAddress(null)
                    }}
                >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Address
                </Button>
            </CardHeader>
            <CardContent>
                {isAddingAddress || editingAddress !== null ? (

                    <form className="space-y-4 border rounded-lg p-4"  onSubmit={handleSubmit(onSubmit)}>
                        <div className="space-y-2">
                            <Label htmlFor="addressName">Address Name</Label>
                            <Input
                                id="addressName"
                                placeholder="Home, Work, etc."
                                {...register("name")}
                                defaultValue={
                                    editingAddress !== null ? addresses?.find((a) => a.id === editingAddress)?.name : "HOME"
                                }
                            />
                            {errors.name && <p className="text-sm text-red-500">{errors.name.message}</p>}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="fullAddress">Country</Label>
                            <Input
                                id="country"
                                type="text"
                                placeholder="country"
                                {...register("country")}
                            />
                            {errors.country && <p className="text-sm text-red-500">{errors.country.message}</p>}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="fullAddress">City</Label>
                            <Input
                                id="city"
                                type="text"
                                placeholder="city"
                                {...register("city")}
                            />
                            {errors.city && <p className="text-sm text-red-500">{errors.city.message}</p>}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="fullAddress">State</Label>
                            <Input
                                id="state"
                                type="text"
                                placeholder="state"
                                {...register("state")}
                            />
                            {errors.state && <p className="text-sm text-red-500">{errors.state.message}</p>}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="fullAddress">Zip</Label>
                            <Input
                                id="zip"
                                type="text"
                                placeholder="zip"
                                {...register("zip")}
                            />
                            {errors.zip && <p className="text-sm text-red-500">{errors.zip.message}</p>}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="fullAddress">Street</Label>
                            <Input
                                id="street"
                                type="text"
                                placeholder="street"
                                {...register("street")}
                            />
                            {errors.street && <p className="text-sm text-red-500">{errors.street.message}</p>}
                        </div>
                        <div className="flex items-center space-x-2">
                            <input type="checkbox" id="defaultAddress"  {...register("currentUsage")}/>
                            <Label htmlFor="defaultAddress">Current Usage</Label>
                            {errors.currentUsage && <p className="text-sm text-red-500">{errors.currentUsage.message}</p>}
                        </div>
                        <div className="flex gap-2">
                            <Button type="submit">{editingAddress !== null ? "Update" : "Add"} Address</Button>
                            <Button
                                variant="outline"
                                onClick={() => {
                                    setIsAddingAddress(false)
                                    setEditingAddress(null)
                                }}
                            >
                                Cancel
                            </Button>
                        </div>
                    </form>
                ) : (addresses&&addresses?.length > 0) ? (
                    <div className="space-y-4">
                        {addresses?.map((address) => (
                            <div key={address.id} className="flex items-start gap-4 p-4 border rounded-lg">
                                <MapPin className="h-5 w-5 mt-1 flex-shrink-0" />
                                <div className="flex-1">
                                    <div className="flex items-center gap-2">
                                        <h3 className="font-medium">{address.street}</h3>
                                        { (
                                            <span className="bg-primary/10 text-primary text-xs px-2 py-0.5 rounded-full">
                                  {address.name}
                                </span>
                                        )}
                                    </div>
                                    <p className="text-sm text-muted-foreground mt-1">{address.state}</p>
                                </div>
                                <div className="flex gap-1">
                                    <Button variant="ghost" size="icon" onClick={() => setEditingAddress(address.id)}>
                                        <Pencil className="h-4 w-4" />
                                    </Button>
                                    <Button variant="ghost" size="icon" onClick={()=>onDeleteAddress(address.id)} >
                                        {
                                            resultDeleteAddress?.isLoading?
                                                <Loader />:
                                                <Trash2 className="h-4 w-4" />
                                        }

                                    </Button>
                                    <div className={`flex items-center gap- ${address.currentUsage?'cursor-not-allowed':"cursor-pointer"}`}
                                         onClick={()=>{
                                             if(!address.currentUsage){
                                                 onUpdateCurrentUsageAddress(address.id)
                                             }
                                         }}
                                    >
                                        <div className="flex items-center gap-1 bg-primary/10 text-primary text-xs px-2 py-0.5 rounded-full">
                                            <div
                                                className={`w-[5px] h-[5px] rounded-full ${
                                                    address.currentUsage ? 'bg-green-400' : 'bg-red-400'
                                                }`}
                                            />
                                            <span>{address.currentUsage ? 'Active' : 'Inactive'}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-8">
                        <MapPin className="mx-auto h-12 w-12 text-muted-foreground mb-2" />
                        <h3 className="font-medium text-lg">No addresses yet</h3>
                        <p className="text-muted-foreground">Add an address to make checkout faster</p>
                    </div>
                )}
            </CardContent>
        </Card>
};

export default MainAddresses;
