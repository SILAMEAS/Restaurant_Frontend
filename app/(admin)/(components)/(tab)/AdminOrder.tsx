import {useState} from "react"
import {Button} from "@/components/ui/button"
import {Input} from "@/components/ui/input"
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card"
import {Badge} from "@/components/ui/badge"
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {Edit, Eye, MoreVertical, Search} from "lucide-react"
import {useGetOrdersQuery} from "@/lib/redux/api";
import {enumStatus} from "@/lib/redux/type";
import SkeletonTable from "@/components/skeleton/SkeletonTable";
// Sample orders data
const ordersData = [
  {
    id: "ORD-001",
    customer: "John Doe",
    restaurant: "Pizza Palace",
    total: 18.98,
    status: "Delivered",
    date: "2023-04-10T14:30:00Z",
  },
  {
    id: "ORD-002",
    customer: "Jane Smith",
    restaurant: "Burger Joint",
    total: 29.98,
    status: "In Progress",
    date: "2023-04-10T15:45:00Z",
  },
  {
    id: "ORD-003",
    customer: "Bob Johnson",
    restaurant: "Sushi Spot",
    total: 21.98,
    status: "Pending",
    date: "2023-04-10T16:15:00Z",
  },
  {
    id: "ORD-004",
    customer: "Charlie Brown",
    restaurant: "Pizza Palace",
    total: 24.99,
    status: "Delivered",
    date: "2023-04-09T12:30:00Z",
  },
  {
    id: "ORD-005",
    customer: "John Doe",
    restaurant: "Green Eats",
    total: 15.5,
    status: "Delivered",
    date: "2023-04-08T13:45:00Z",
  },
]

const AdminOrder=()=>{
    const getOrdersQuery=useGetOrdersQuery();
    const [searchQuery, setSearchQuery] = useState("")
    return  <Card>
            <CardHeader>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <CardTitle>Orders</CardTitle>
                  <CardDescription>View and manage all customer orders</CardDescription>
                </div>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Search orders..."
                    className="pl-10 w-full sm:w-[250px]"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Order ID</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Restaurant</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead>Items</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {!getOrdersQuery?.currentData?.contents?<SkeletonTable column={7}/>:
                    getOrdersQuery?.currentData?.contents?.filter(
                      (order) =>
                        order.id.toString().includes(searchQuery.toLowerCase()) ||
                        order.user.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        order.restaurant.name.toLowerCase().includes(searchQuery.toLowerCase()),
                    )
                    .map((order) => (
                      <TableRow key={order.id}>
                        <TableCell className="font-medium">{order.id}</TableCell>
                        <TableCell>{order.user.fullName}</TableCell>
                        <TableCell>{order.restaurant.name}</TableCell>
                        <TableCell>${order.totalAmount}</TableCell>
                        <TableCell>{order.items?.length??0}</TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              order.status === enumStatus.DELIVERED
                                ? "outline"
                                : order.status === enumStatus.PENDING
                                  ? "secondary"
                                  : "default"
                            }
                          >
                            {order.status}
                          </Badge>
                        </TableCell>
                        <TableCell>{new Date(order.createdAt).toLocaleDateString()}</TableCell>
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
                              <DropdownMenuItem>
                                <Eye className="h-4 w-4 mr-2" />
                                View Details
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Edit className="h-4 w-4 mr-2" />
                                Update Status
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
export default AdminOrder;