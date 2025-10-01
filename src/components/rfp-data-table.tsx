"use client"

import * as React from "react"
import { toast } from "sonner"
import { z } from "zod"
import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
  VisibilityState,
} from "@tanstack/react-table"
import {
  IconChevronDown,
  IconChevronLeft,
  IconChevronRight,
  IconChevronsLeft,
  IconChevronsRight,
  IconLayoutColumns,
  IconExternalLink,
} from "@tabler/icons-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts"
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

export const rfpSchema = z.object({
  id: z.string(),
  hospital: z.string(),
  rfpTitle: z.string(),
  status: z.string(),
  value: z.string(),
  submissionDate: z.string(),
  responseDate: z.string(),
})

type RFPData = z.infer<typeof rfpSchema>

function getStatusVariant(status: string): "default" | "secondary" | "destructive" | "outline" {
  switch (status) {
    case "Responded":
      return "default"
    case "In Progress":
      return "secondary"
    case "Submitted":
      return "outline"
    default:
      return "outline"
  }
}

function RFPDetailModal({ rfp, children }: { rfp: RFPData; children: React.ReactNode }) {
  // Dummy chart data for RFP progress tracking
  const chartData = [
    { month: "Jan", progress: 20 },
    { month: "Feb", progress: 35 },
    { month: "Mar", progress: 45 },
    { month: "Apr", progress: 60 },
    { month: "May", progress: 75 },
    { month: "Jun", progress: 85 },
  ]

  const chartConfig = {
    progress: {
      label: "Progress %",
      color: "hsl(var(--chart-1))",
    },
  } satisfies ChartConfig

  return (
    <Sheet>
      <SheetTrigger asChild>
        {children}
      </SheetTrigger>
      <SheetContent 
        side="right"
        className="!w-[800px] !max-w-[800px] !min-w-[800px] overflow-x-hidden overflow-y-auto p-0 sm:!max-w-[800px]"
        style={{ width: '800px', maxWidth: '800px', minWidth: '800px' }}
      >
        <SheetHeader className="px-6 pt-4 pb-2">
          <SheetTitle>{rfp.rfpTitle}</SheetTitle>
          <SheetDescription>
            RFP Details for {rfp.hospital}
          </SheetDescription>
        </SheetHeader>
        
        <div className="px-6 pb-4 space-y-3">
          <div className="grid gap-2">
            <div className="grid grid-cols-2 gap-2">
              <Card className="min-w-0">
                <CardHeader className="pb-1 px-3 pt-3">
                  <CardTitle className="text-xs font-medium text-muted-foreground">RFP ID</CardTitle>
                </CardHeader>
                <CardContent className="pt-0 px-3 pb-3">
                  <p className="text-base font-semibold">{rfp.id}</p>
                </CardContent>
              </Card>
              <Card className="min-w-0">
                <CardHeader className="pb-1 px-3 pt-3">
                  <CardTitle className="text-xs font-medium text-muted-foreground">Hospital</CardTitle>
                </CardHeader>
                <CardContent className="pt-0 px-3 pb-3">
                  <p className="text-base font-semibold">{rfp.hospital}</p>
                </CardContent>
              </Card>
            </div>
            
            <Card className="min-w-0">
              <CardHeader className="pb-1 px-3 pt-3">
                <CardTitle className="text-xs font-medium text-muted-foreground">Project Value</CardTitle>
              </CardHeader>
              <CardContent className="pt-0 px-3 pb-3">
                <p className="text-xl font-bold text-green-600">{rfp.value}</p>
              </CardContent>
            </Card>

            <div className="grid grid-cols-2 gap-2">
              <Card className="min-w-0">
                <CardHeader className="pb-1 px-3 pt-3">
                  <CardTitle className="text-xs font-medium text-muted-foreground">Submission Date</CardTitle>
                </CardHeader>
                <CardContent className="pt-0 px-3 pb-3">
                  <p className="text-base font-semibold">{new Date(rfp.submissionDate).toLocaleDateString()}</p>
                </CardContent>
              </Card>
              <Card className="min-w-0">
                <CardHeader className="pb-1 px-3 pt-3">
                  <CardTitle className="text-xs font-medium text-muted-foreground">Response Date</CardTitle>
                </CardHeader>
                <CardContent className="pt-0 px-3 pb-3">
                  <p className="text-base font-semibold">{new Date(rfp.responseDate).toLocaleDateString()}</p>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <Card className="min-w-0">
                <CardHeader className="pb-1 px-3 pt-3">
                  <CardTitle className="text-xs font-medium text-muted-foreground">Current Status</CardTitle>
                </CardHeader>
                <CardContent className="pt-0 px-3 pb-3">
                  <Badge variant={getStatusVariant(rfp.status)} className="text-xs">
                    {rfp.status}
                  </Badge>
                </CardContent>
              </Card>
              <Card className="min-w-0">
                <CardHeader className="pb-1 px-3 pt-3">
                  <CardTitle className="text-xs font-medium text-muted-foreground">Days Since Submission</CardTitle>
                </CardHeader>
                <CardContent className="pt-0 px-3 pb-3">
                  <p className="text-base font-semibold">
                    {Math.floor((new Date().getTime() - new Date(rfp.submissionDate).getTime()) / (1000 * 60 * 60 * 24))} days
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Progress Chart */}
            <Card className="min-w-0">
              <CardHeader className="pb-1 px-3 pt-3">
                <CardTitle className="text-sm font-medium">RFP Progress Timeline</CardTitle>
                <CardDescription className="text-xs">Monthly progress tracking</CardDescription>
              </CardHeader>
              <CardContent className="pt-0 px-3 pb-3">
                <div className="w-full overflow-hidden">
                  <ChartContainer config={chartConfig} className="h-[180px] w-full">
                    <AreaChart
                      accessibilityLayer
                      data={chartData}
                      margin={{
                        left: 0,
                        right: 0,
                        top: 10,
                        bottom: 10,
                      }}
                      width={720}
                      height={160}
                    >
                      <CartesianGrid vertical={false} />
                      <XAxis
                        dataKey="month"
                        tickLine={false}
                        axisLine={false}
                        tickMargin={8}
                        tickFormatter={(value) => value.slice(0, 3)}
                      />
                      <YAxis
                        tickLine={false}
                        axisLine={false}
                        tickMargin={8}
                        tickFormatter={(value) => `${value}%`}
                      />
                      <ChartTooltip
                        cursor={false}
                        content={<ChartTooltipContent indicator="line" />}
                      />
                      <Area
                        dataKey="progress"
                        type="natural"
                        fill="var(--color-progress)"
                        fillOpacity={0.4}
                        stroke="var(--color-progress)"
                      />
                    </AreaChart>
                  </ChartContainer>
                </div>
              </CardContent>
            </Card>

            <Card className="min-w-0">
              <CardHeader className="pb-1 px-3 pt-3">
                <CardTitle className="text-sm font-medium">Additional Information</CardTitle>
              </CardHeader>
              <CardContent className="pt-0 px-3 pb-3">
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Response timeframe:</span>
                    <span className="font-medium">
                      {Math.floor((new Date(rfp.responseDate).getTime() - new Date(rfp.submissionDate).getTime()) / (1000 * 60 * 60 * 24))} days
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Priority Level:</span>
                    <span className="font-medium">High</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Department:</span>
                    <span className="font-medium">IT Healthcare</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}

const columns: ColumnDef<RFPData>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <div className="flex items-center justify-center">
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      </div>
    ),
    cell: ({ row }) => (
      <div className="flex items-center justify-center">
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      </div>
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "id",
    header: "RFP ID",
    cell: ({ row }) => (
      <div className="font-medium">
        {row.getValue("id")}
      </div>
    ),
  },
  {
    accessorKey: "hospital",
    header: "Hospital",
    cell: ({ row }) => (
      <div className="font-medium">
        {row.getValue("hospital")}
      </div>
    ),
  },
  {
    accessorKey: "rfpTitle",
    header: "RFP Title",
    cell: ({ row }) => (
      <RFPDetailModal rfp={row.original}>
        <Button variant="ghost" className="h-auto p-0 text-left justify-start w-full">
          <div className="flex items-center gap-2">
            <span className="truncate">{row.getValue("rfpTitle")}</span>
            <IconExternalLink className="h-3 w-3 opacity-50" />
          </div>
        </Button>
      </RFPDetailModal>
    ),
    enableHiding: false,
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as string
      return (
        <Badge variant={getStatusVariant(status)}>
          {status}
        </Badge>
      )
    },
  },
  {
    accessorKey: "value",
    header: () => <div className="text-right">Value</div>,
    cell: ({ row }) => (
      <div className="text-right font-medium text-green-600">
        {row.getValue("value")}
      </div>
    ),
  },
  {
    accessorKey: "submissionDate",
    header: "Submission Date",
    cell: ({ row }) => (
      <div>
        {new Date(row.getValue("submissionDate")).toLocaleDateString()}
      </div>
    ),
  },
  {
    accessorKey: "responseDate",
    header: "Response Date",
    cell: ({ row }) => (
      <div>
        {new Date(row.getValue("responseDate")).toLocaleDateString()}
      </div>
    ),
  },
]

export function RFPDataTable({
  data,
}: {
  data: RFPData[]
}) {
  const [rowSelection, setRowSelection] = React.useState({})
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [pagination, setPagination] = React.useState({
    pageIndex: 0,
    pageSize: 10,
  })

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnVisibility,
      rowSelection,
      columnFilters,
      pagination,
    },
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
  })

  return (
    <div className="w-full">
      <div className="flex items-center justify-between py-4 px-4 lg:px-6">
        <div className="flex items-center gap-2">
          <Input
            placeholder="Filter hospitals..."
            value={(table.getColumn("hospital")?.getFilterValue() as string) ?? ""}
            onChange={(event) =>
              table.getColumn("hospital")?.setFilterValue(event.target.value)
            }
            className="max-w-sm"
          />
          <Select
            value={(table.getColumn("status")?.getFilterValue() as string) ?? ""}
            onValueChange={(value) =>
              table.getColumn("status")?.setFilterValue(value === "all" ? "" : value)
            }
          >
            <SelectTrigger className="w-40">
              <SelectValue placeholder="All Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="In Progress">In Progress</SelectItem>
              <SelectItem value="Responded">Responded</SelectItem>
              <SelectItem value="Submitted">Submitted</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm">
              <IconLayoutColumns className="h-4 w-4" />
              <span className="hidden lg:inline ml-2">Columns</span>
              <IconChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            {table
              .getAllColumns()
              .filter(
                (column) =>
                  typeof column.accessorFn !== "undefined" && column.getCanHide()
              )
              .map((column) => {
                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) => column.toggleVisibility(!!value)}
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                )
              })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="rounded-md border mx-4 lg:mx-6">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <RFPDetailModal key={row.id} rfp={row.original}>
                  <TableRow
                    data-state={row.getIsSelected() && "selected"}
                    className="cursor-pointer hover:bg-muted/50"
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    ))}
                  </TableRow>
                </RFPDetailModal>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between px-4 lg:px-6 py-4">
        <div className="text-muted-foreground hidden flex-1 text-sm lg:flex">
          {table.getFilteredSelectedRowModel().rows.length} of{" "}
          {table.getFilteredRowModel().rows.length} row(s) selected.
        </div>
        <div className="flex w-full items-center gap-8 lg:w-fit">
          <div className="hidden items-center gap-2 lg:flex">
            <Label htmlFor="rows-per-page" className="text-sm font-medium">
              Rows per page
            </Label>
            <Select
              value={`${table.getState().pagination.pageSize}`}
              onValueChange={(value) => {
                table.setPageSize(Number(value))
              }}
            >
              <SelectTrigger size="sm" className="w-20" id="rows-per-page">
                <SelectValue placeholder={table.getState().pagination.pageSize} />
              </SelectTrigger>
              <SelectContent side="top">
                {[10, 20, 30, 40, 50].map((pageSize) => (
                  <SelectItem key={pageSize} value={`${pageSize}`}>
                    {pageSize}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex w-fit items-center justify-center text-sm font-medium">
            Page {table.getState().pagination.pageIndex + 1} of{" "}
            {table.getPageCount()}
          </div>
          <div className="ml-auto flex items-center gap-2 lg:ml-0">
            <Button
              variant="outline"
              className="hidden h-8 w-8 p-0 lg:flex"
              onClick={() => table.setPageIndex(0)}
              disabled={!table.getCanPreviousPage()}
            >
              <span className="sr-only">Go to first page</span>
              <IconChevronsLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              className="h-8 w-8 p-0"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              <span className="sr-only">Go to previous page</span>
              <IconChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              className="h-8 w-8 p-0"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              <span className="sr-only">Go to next page</span>
              <IconChevronRight className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              className="hidden h-8 w-8 p-0 lg:flex"
              onClick={() => table.setPageIndex(table.getPageCount() - 1)}
              disabled={!table.getCanNextPage()}
            >
              <span className="sr-only">Go to last page</span>
              <IconChevronsRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
