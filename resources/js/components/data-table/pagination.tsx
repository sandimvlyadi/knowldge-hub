import { Table } from '@tanstack/react-table';
import {
    ChevronLeft,
    ChevronRight,
    ChevronsLeft,
    ChevronsRight,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';

interface DataTablePaginationProps<TData> {
    table: Table<TData>;
    totalCount?: number;
    startAt?: number;
    maxResults?: number;
    onPageChange?: (pageIndex: number) => void;
    onPageSizeChange?: (pageSize: number) => void;
}

export function DataTablePagination<TData>({
    table,
    totalCount,
    startAt = 0,
    maxResults = 10,
    onPageChange,
    onPageSizeChange,
}: DataTablePaginationProps<TData>) {
    return (
        <div className="flex items-center justify-between px-2">
            <div className="flex flex-1 items-center space-x-2">
                <p className="hidden text-sm font-medium md:block">
                    Rows per page
                </p>
                <Select
                    value={`${table.getState().pagination.pageSize}`}
                    onValueChange={(value) => {
                        const newPageSize = Number(value);
                        table.setPageSize(newPageSize);
                        table.setPageIndex(0); // Reset to first page
                        onPageSizeChange?.(newPageSize);
                    }}
                >
                    <SelectTrigger className="h-8 w-[70px]">
                        <SelectValue
                            placeholder={table.getState().pagination.pageSize}
                        />
                    </SelectTrigger>
                    <SelectContent side="top">
                        {[10, 25, 50, 100].map((pageSize) => (
                            <SelectItem key={pageSize} value={`${pageSize}`}>
                                {pageSize}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
            <div className="flex items-center space-x-2 md:space-x-6">
                <div className="text-sm text-muted-foreground">
                    {table.getRowModel().rows.length === 0
                        ? '0 of 0'
                        : totalCount !== undefined
                          ? `${startAt + 1} - ${Math.min(startAt + maxResults, totalCount)} of ${totalCount}`
                          : `${table.getState().pagination.pageIndex * table.getState().pagination.pageSize + 1} - ${Math.min(
                                (table.getState().pagination.pageIndex + 1) *
                                    table.getState().pagination.pageSize,
                                table.getFilteredRowModel().rows.length,
                            )} of ${table.getFilteredRowModel().rows.length}`}
                </div>
                <div className="flex items-center space-x-2">
                    <Button
                        variant="outline"
                        size="icon"
                        className="hidden size-8 lg:flex"
                        onClick={() => {
                            table.setPageIndex(0);
                            onPageChange?.(0);
                        }}
                        disabled={!table.getCanPreviousPage()}
                    >
                        <span className="sr-only">Go to first page</span>
                        <ChevronsLeft />
                    </Button>
                    <Button
                        variant="outline"
                        size="icon"
                        className="size-8"
                        onClick={() => {
                            const newPageIndex =
                                table.getState().pagination.pageIndex - 1;
                            table.previousPage();
                            onPageChange?.(newPageIndex);
                        }}
                        disabled={!table.getCanPreviousPage()}
                    >
                        <span className="sr-only">Go to previous page</span>
                        <ChevronLeft />
                    </Button>
                    <Button
                        variant="outline"
                        size="icon"
                        className="size-8"
                        onClick={() => {
                            const newPageIndex =
                                table.getState().pagination.pageIndex + 1;
                            table.nextPage();
                            onPageChange?.(newPageIndex);
                        }}
                        disabled={!table.getCanNextPage()}
                    >
                        <span className="sr-only">Go to next page</span>
                        <ChevronRight />
                    </Button>
                    <Button
                        variant="outline"
                        size="icon"
                        className="hidden size-8 lg:flex"
                        onClick={() => {
                            const lastPageIndex = table.getPageCount() - 1;
                            table.setPageIndex(lastPageIndex);
                            onPageChange?.(lastPageIndex);
                        }}
                        disabled={!table.getCanNextPage()}
                    >
                        <span className="sr-only">Go to last page</span>
                        <ChevronsRight />
                    </Button>
                </div>
            </div>
        </div>
    );
}
