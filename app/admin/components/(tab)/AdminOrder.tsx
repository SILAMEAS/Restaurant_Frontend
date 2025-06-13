import React, {useState, useEffect} from "react"
import {Button} from "@/components/ui/button"
import {Input} from "@/components/ui/input"
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card"
import {Badge} from "@/components/ui/badge"
import {Edit, Eye, MoreVertical, Search, Trash2} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel, DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {useDeleteOrderMutation, useGetOrdersQuery} from "@/lib/redux/services/api";
import {enumStatus} from "@/lib/redux/services/type";
import {handleApiCall} from "@/lib/handleApiCall";
import {Slide, toast} from "react-toastify";
import { PaginatedTable, type Column } from "@/components/ui/paginated-table"
import { usePagination } from "@/lib/hooks/usePagination"

const AdminOrder = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const pagination = usePagination();
    const { data: ordersData, isLoading } = useGetOrdersQuery();
    const [deleteOrder, resultDeleteOrder] = useDeleteOrderMutation()

    useEffect(() => {
        if (ordersData?.contents) {
            // Log the first order to check its structure
            if (ordersData.contents.length > 0) {
                console.log('First order structure:', ordersData.contents[0]);
            }
        }
    }, [ordersData]);

    // Filter and paginate data on the client side
    const filteredData = ordersData?.contents?.filter(
        (order) =>
            order.id.toString().includes(searchQuery.toLowerCase()) ||
            order.user.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            order.restaurant.name.toLowerCase().includes(searchQuery.toLowerCase())
    ) || [];

    const paginatedData = {
        contents: filteredData.slice(
            (pagination.currentPage - 1) * pagination.itemsPerPage,
            pagination.currentPage * pagination.itemsPerPage
        ),
        total: filteredData.length
    };

    const handleDeleteOrder = async (orderId: string | number) => {
        await handleApiCall({
            apiFn: () => deleteOrder({ orderId }).unwrap(),
            onSuccess: () => {
                toast.success("Order deleted successfully!", {
                    theme: "dark",
                    transition: Slide,
                });
            },
            onError: (e) => {
                e.data.message && toast.error(`${e.data.message}`, {
                    theme: "dark",
                    transition: Slide,
                });
            }
        });
    }

    const columns: Column[] = [
        {
            header: "Order ID",
            accessorKey: "id",
        },
        {
            header: "Customer",
            accessorKey: "user.fullName",
            cell: (row) => {
                return row.user?.fullName || 'N/A';
            }
        },
        {
            header: "Restaurant",
            accessorKey: "restaurant.name",
            cell: (row) => {
                return row.restaurant?.name || 'N/A';
            }
        },
        {
            header: "Total",
            accessorKey: "totalAmount",
            cell: (row) => `$${row.totalAmount}`,
        },
        {
            header: "Items",
            accessorKey: "items",
            cell: (row) => row.items?.length ?? 0,
        },
        {
            header: "Status",
            accessorKey: "status",
            cell: (row) => (
                <Badge
                    variant={
                        row.status === enumStatus.DELIVERED
                            ? "outline"
                            : row.status === enumStatus.PENDING
                                ? "secondary"
                                : "default"
                    }
                >
                    {row.status}
                </Badge>
            ),
        },
        {
            header: "Date",
            accessorKey: "createdAt",
            cell: (row) => new Date(row.createdAt).toLocaleDateString(),
        },
        {
            header: "",
            accessorKey: "actions",
            cell: (row) => (
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
                            <DropdownMenuItem>
                                <Eye className="h-4 w-4 mr-2" />
                                View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                                <Edit className="h-4 w-4 mr-2" />
                                Update Status
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                                className="text-destructive"
                                onClick={() => handleDeleteOrder(row.id)}
                            >
                                <Trash2 className="h-4 w-4 mr-2" />
                                Delete Order
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            ),
        },
    ];

    return (
        <Card>
            <CardHeader>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <CardTitle>Orders</CardTitle>
                        <CardDescription>
                            View and manage all customer orders ({ordersData?.total || 0} total orders)
                            {searchQuery && ` • ${paginatedData.total} matching results`}
                        </CardDescription>
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
                <PaginatedTable
                    columns={columns}
                    data={paginatedData.contents}
                    totalItems={paginatedData.total}
                    currentPage={pagination.currentPage}
                    itemsPerPage={pagination.itemsPerPage}
                    isLoading={isLoading}
                    onPageChange={pagination.setCurrentPage}
                    onItemsPerPageChange={pagination.setItemsPerPage}
                    skeletonColumns={8}
                />
            </CardContent>
        </Card>
    );
}

export default AdminOrder;