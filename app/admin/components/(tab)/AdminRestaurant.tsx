import {useState} from "react"
import {Button} from "@/components/ui/button"
import {Input} from "@/components/ui/input"
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card"
import {Badge} from "@/components/ui/badge"
import {Edit, Eye, MoreVertical, Search, Trash2} from "lucide-react"
import {useGetRestaurantsQuery} from "@/lib/redux/services/api"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { PaginatedTable, type Column } from "@/components/ui/paginated-table"
import { usePagination } from "@/lib/hooks/usePagination"

const AdminRestaurant = () => {
    const [searchQuery, setSearchQuery] = useState("")
    const pagination = usePagination()
    const { data: restaurantsData, isLoading } = useGetRestaurantsQuery({
        ...pagination.getPaginationParams(),
        search: searchQuery,
    })

    const columns: Column[] = [
        {
            header: "Name",
            accessorKey: "name",
        },
        {
            header: "Rating",
            accessorKey: "rating",
        },
        {
            header: "Status",
            accessorKey: "open",
            cell: (row) => (
                <Badge variant="outline">{row.open ? "OPEN" : "CLOSE"}</Badge>
            ),
        },
        {
            header: "Cuisine Type",
            accessorKey: "cuisineType",
        },
        {
            header: "Actions",
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
                                Edit Restaurant
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-destructive">
                                <Trash2 className="h-4 w-4 mr-2" />
                                Delete Restaurant
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            ),
        },
    ]

    return (
        <Card>
            <CardHeader>
                <CardTitle>Restaurants</CardTitle>
                <CardDescription>
                    Manage your restaurant listings here.
                </CardDescription>
                <div className="flex items-center py-4">
                    <Input
                        placeholder="Search restaurants..."
                        value={searchQuery}
                        onChange={(event) => setSearchQuery(event.target.value)}
                        className="max-w-sm"
                    />
                </div>
            </CardHeader>
            <CardContent>
                <PaginatedTable
                    columns={columns}
                    data={restaurantsData?.contents}
                    totalItems={restaurantsData?.total || 0}
                    currentPage={pagination.currentPage}
                    itemsPerPage={pagination.itemsPerPage}
                    isLoading={isLoading}
                    onPageChange={pagination.setCurrentPage}
                    onItemsPerPageChange={pagination.setItemsPerPage}
                    skeletonColumns={5}
                />
            </CardContent>
        </Card>
    )
}

export default AdminRestaurant