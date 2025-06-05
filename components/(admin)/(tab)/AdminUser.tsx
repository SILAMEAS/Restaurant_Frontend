import {useState} from "react"
import {Button} from "@/components/ui/button"
import {Input} from "@/components/ui/input"
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card"
import {Badge} from "@/components/ui/badge"
import {Edit, Eye, MoreVertical, Search, Trash2} from "lucide-react"
import {useGetUsersQuery} from "@/lib/redux/api"
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
import { PaginationRequestDefault } from "@/lib/redux/type"

const AdminUser = () => {
    const [searchQuery, setSearchQuery] = useState("")
    const pagination = usePagination()
    const { data: usersData, isLoading } = useGetUsersQuery({
        ...pagination.getPaginationParams(),
        search: searchQuery,
    })

    const columns: Column[] = [
        {
            header: "Name",
            accessorKey: "fullName",
        },
        {
            header: "Email",
            accessorKey: "email",
        },
        {
            header: "Role",
            accessorKey: "role",
            cell: (row) => (
                <Badge variant="outline">{row.role}</Badge>
            ),
        },
        {
            header: "Orders",
            accessorKey: "orders",
        },
        {
            header: "Joined",
            accessorKey: "createdAt",
            cell: (row) => new Date(row.createdAt).toLocaleDateString(),
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
                                Edit User
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-destructive">
                                <Trash2 className="h-4 w-4 mr-2" />
                                Delete User
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
                <CardTitle>Users</CardTitle>
                <CardDescription>
                    Manage your user accounts and permissions.
                </CardDescription>
                <div className="flex items-center py-4">
                    <Input
                        placeholder="Search users..."
                        value={searchQuery}
                        onChange={(event) => setSearchQuery(event.target.value)}
                        className="max-w-sm"
                    />
                </div>
            </CardHeader>
            <CardContent>
                <PaginatedTable
                    columns={columns}
                    data={usersData?.contents}
                    totalItems={usersData?.total || 0}
                    currentPage={pagination.currentPage}
                    itemsPerPage={pagination.itemsPerPage}
                    isLoading={isLoading}
                    onPageChange={pagination.setCurrentPage}
                    onItemsPerPageChange={pagination.setItemsPerPage}
                    skeletonColumns={6}
                />
            </CardContent>
        </Card>
    )
}

export default AdminUser