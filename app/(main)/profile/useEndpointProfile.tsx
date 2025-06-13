import { useDeleteAddressMutation, useFavUnFavMutation, useUpdateAddressMutation } from "@/lib/redux/services/api";
import { Slide, toast } from "react-toastify";


export const useEndpointProfile=()=>{
    
      const [deleteAddress,resultDeleteAddress]=useDeleteAddressMutation();
      const [updateAddress,resultUpdateAddress]=useUpdateAddressMutation();
      const [favUnFavMutation,resultFavUnFavMutation]=useFavUnFavMutation();
    
      
    
    
      const onDeleteAddress = async(addressId:number)=>{
        try{
          await deleteAddress({addressId}).unwrap();
          toast.success("delete success !", 
                  {
                  theme: "dark",
                  transition: Slide,
                  }
                );
        
        }catch(e:any){
          return toast.error(e?.data?.message, 
            {
            theme: "dark",
            transition: Slide,
            }
          );
        }
        
      }
      const onUpdateCurrentUsageAddress = async(addressId:number)=>{
        try{
          const formData=new FormData();
          formData.append('currentUsage',"true");
          await updateAddress({addressId,body:formData}).unwrap();
          toast.success("action complete!", 
                  {
                  theme: "dark",
                  transition: Slide,
                  }
                );
        
        }catch(e:any){
          return toast.error(e?.data?.message, 
            {
            theme: "dark",
            transition: Slide,
            }
          );
        }
        
      }
    
      const onUnFavorite = async(restaurantId:number)=>{
        try{
          await favUnFavMutation({restaurantId}).unwrap();
          toast.success("action complete!", 
                  {
                  theme: "dark",
                  transition: Slide,
                  }
                );
        
        }catch(e:any){
          return toast.error(e?.data?.message, 
            {
            theme: "dark",
            transition: Slide,
            }
          );
        }
        
      }

      return {method:{onDeleteAddress,onUnFavorite,onUpdateCurrentUsageAddress},trigger:{resultDeleteAddress,resultFavUnFavMutation,resultUpdateAddress}}

}