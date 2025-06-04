"use client"
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card"
import {ICurrentData} from "@/lib/generic/ICurrentData";
import {Package, Tag, Users} from "lucide-react"
import {IDashboard} from "@/lib/redux/type";
import {useRouter} from "next/navigation";


const CartDashboardOwner=({dashboard}:{dashboard:ICurrentData<IDashboard>})=>{
    const route= useRouter();
    return   <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
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

        <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Foods</CardTitle>
                <Tag className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{dashboard?.currentData?.total_foods??0}</div>
                <p className="text-xs text-muted-foreground">+1 from last week</p>
            </CardContent>
        </Card>
        <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Foods</CardTitle>
                <Tag className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{dashboard?.currentData?.total_foods??0}</div>
                <p className="text-xs text-muted-foreground">+1 from last week</p>
            </CardContent>
        </Card>
    <Card onClick={()=>route.push('/owner/restaurant')} className={'cursor-pointer flex justify-center items-center'}>
        <CardTitle className="text-sm font-medium">View My Restaurant</CardTitle>
    </Card>
      </div>
}


export default CartDashboardOwner;