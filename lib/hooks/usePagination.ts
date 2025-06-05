import { useState } from 'react'

interface PaginationState {
    currentPage: number
    itemsPerPage: number
}

interface UsePaginationProps {
    initialPage?: number
    initialItemsPerPage?: number
}

export function usePagination({
    initialPage = 1,
    initialItemsPerPage = 10,
}: UsePaginationProps = {}) {
    const [paginationState, setPaginationState] = useState<PaginationState>({
        currentPage: initialPage,
        itemsPerPage: initialItemsPerPage,
    })

    const setCurrentPage = (page: number) => {
        setPaginationState((prev) => ({
            ...prev,
            currentPage: page,
        }))
    }

    const setItemsPerPage = (itemsPerPage: number) => {
        setPaginationState((prev) => ({
            ...prev,
            itemsPerPage,
            currentPage: 1, // Reset to first page when changing items per page
        }))
    }

    // Calculate pagination parameters for API calls
    const getPaginationParams = () => {
        const offset = (paginationState.currentPage - 1) * paginationState.itemsPerPage
        return {
            offset,
            limit: paginationState.itemsPerPage,
        }
    }

    return {
        ...paginationState,
        setCurrentPage,
        setItemsPerPage,
        getPaginationParams,
    }
} 