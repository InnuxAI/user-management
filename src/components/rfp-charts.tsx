"use client"

import * as React from "react"
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"

import { useIsMobile } from "@/hooks/use-mobile"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@/components/ui/toggle-group"

// Chart 1: RFPs from Hospitals in Progress
const rfpProgressData = [
  { date: "2024-04-01", count: 15 },
  { date: "2024-04-02", count: 18 },
  { date: "2024-04-03", count: 12 },
  { date: "2024-04-04", count: 22 },
  { date: "2024-04-05", count: 25 },
  { date: "2024-04-06", count: 19 },
  { date: "2024-04-07", count: 16 },
  { date: "2024-04-08", count: 28 },
  { date: "2024-04-09", count: 14 },
  { date: "2024-04-10", count: 21 },
  { date: "2024-04-11", count: 24 },
  { date: "2024-04-12", count: 17 },
  { date: "2024-04-13", count: 26 },
  { date: "2024-04-14", count: 13 },
  { date: "2024-04-15", count: 20 },
  { date: "2024-04-16", count: 23 },
  { date: "2024-04-17", count: 31 },
  { date: "2024-04-18", count: 29 },
  { date: "2024-04-19", count: 18 },
  { date: "2024-04-20", count: 15 },
  { date: "2024-04-21", count: 22 },
  { date: "2024-04-22", count: 25 },
  { date: "2024-04-23", count: 19 },
  { date: "2024-04-24", count: 27 },
  { date: "2024-04-25", count: 24 },
  { date: "2024-04-26", count: 16 },
  { date: "2024-04-27", count: 30 },
  { date: "2024-04-28", count: 21 },
  { date: "2024-04-29", count: 26 },
  { date: "2024-04-30", count: 33 },
  { date: "2024-05-01", count: 20 },
  { date: "2024-05-02", count: 28 },
  { date: "2024-05-03", count: 24 },
  { date: "2024-05-04", count: 35 },
  { date: "2024-05-05", count: 38 },
  { date: "2024-05-06", count: 32 },
  { date: "2024-05-07", count: 29 },
  { date: "2024-05-08", count: 22 },
  { date: "2024-05-09", count: 25 },
  { date: "2024-05-10", count: 31 },
  { date: "2024-05-11", count: 27 },
  { date: "2024-05-12", count: 24 },
  { date: "2024-05-13", count: 21 },
  { date: "2024-05-14", count: 36 },
  { date: "2024-05-15", count: 34 },
  { date: "2024-05-16", count: 30 },
  { date: "2024-05-17", count: 39 },
  { date: "2024-05-18", count: 33 },
  { date: "2024-05-19", count: 26 },
  { date: "2024-05-20", count: 23 },
  { date: "2024-05-21", count: 19 },
  { date: "2024-05-22", count: 18 },
  { date: "2024-05-23", count: 28 },
  { date: "2024-05-24", count: 32 },
  { date: "2024-05-25", count: 29 },
  { date: "2024-05-26", count: 25 },
  { date: "2024-05-27", count: 37 },
  { date: "2024-05-28", count: 31 },
  { date: "2024-05-29", count: 20 },
  { date: "2024-05-30", count: 35 },
  { date: "2024-05-31", count: 28 },
  { date: "2024-06-01", count: 26 },
  { date: "2024-06-02", count: 40 },
  { date: "2024-06-03", count: 22 },
  { date: "2024-06-04", count: 36 },
  { date: "2024-06-05", count: 19 },
  { date: "2024-06-06", count: 32 },
  { date: "2024-06-07", count: 34 },
  { date: "2024-06-08", count: 37 },
  { date: "2024-06-09", count: 41 },
  { date: "2024-06-10", count: 24 },
  { date: "2024-06-11", count: 21 },
  { date: "2024-06-12", count: 43 },
  { date: "2024-06-13", count: 18 },
  { date: "2024-06-14", count: 38 },
  { date: "2024-06-15", count: 35 },
  { date: "2024-06-16", count: 33 },
  { date: "2024-06-17", count: 45 },
  { date: "2024-06-18", count: 23 },
  { date: "2024-06-19", count: 36 },
  { date: "2024-06-20", count: 39 },
  { date: "2024-06-21", count: 27 },
  { date: "2024-06-22", count: 34 },
  { date: "2024-06-23", count: 47 },
  { date: "2024-06-24", count: 25 },
  { date: "2024-06-25", count: 28 },
  { date: "2024-06-26", count: 42 },
  { date: "2024-06-27", count: 44 },
  { date: "2024-06-28", count: 30 },
  { date: "2024-06-29", count: 22 },
  { date: "2024-06-30", count: 41 },
]

// Chart 2: RFPs Responded Data
const rfpResponseData = [
  { date: "2024-04-01", count: 12 },
  { date: "2024-04-02", count: 14 },
  { date: "2024-04-03", count: 9 },
  { date: "2024-04-04", count: 18 },
  { date: "2024-04-05", count: 20 },
  { date: "2024-04-06", count: 15 },
  { date: "2024-04-07", count: 13 },
  { date: "2024-04-08", count: 22 },
  { date: "2024-04-09", count: 10 },
  { date: "2024-04-10", count: 16 },
  { date: "2024-04-11", count: 19 },
  { date: "2024-04-12", count: 14 },
  { date: "2024-04-13", count: 21 },
  { date: "2024-04-14", count: 11 },
  { date: "2024-04-15", count: 17 },
  { date: "2024-04-16", count: 18 },
  { date: "2024-04-17", count: 25 },
  { date: "2024-04-18", count: 23 },
  { date: "2024-04-19", count: 15 },
  { date: "2024-04-20", count: 12 },
  { date: "2024-04-21", count: 17 },
  { date: "2024-04-22", count: 20 },
  { date: "2024-04-23", count: 16 },
  { date: "2024-04-24", count: 22 },
  { date: "2024-04-25", count: 19 },
  { date: "2024-04-26", count: 13 },
  { date: "2024-04-27", count: 24 },
  { date: "2024-04-28", count: 17 },
  { date: "2024-04-29", count: 21 },
  { date: "2024-04-30", count: 26 },
  { date: "2024-05-01", count: 16 },
  { date: "2024-05-02", count: 23 },
  { date: "2024-05-03", count: 19 },
  { date: "2024-05-04", count: 28 },
  { date: "2024-05-05", count: 30 },
  { date: "2024-05-06", count: 25 },
  { date: "2024-05-07", count: 22 },
  { date: "2024-05-08", count: 18 },
  { date: "2024-05-09", count: 20 },
  { date: "2024-05-10", count: 24 },
  { date: "2024-05-11", count: 21 },
  { date: "2024-05-12", count: 19 },
  { date: "2024-05-13", count: 17 },
  { date: "2024-05-14", count: 29 },
  { date: "2024-05-15", count: 27 },
  { date: "2024-05-16", count: 23 },
  { date: "2024-05-17", count: 31 },
  { date: "2024-05-18", count: 26 },
  { date: "2024-05-19", count: 20 },
  { date: "2024-05-20", count: 18 },
  { date: "2024-05-21", count: 15 },
  { date: "2024-05-22", count: 14 },
  { date: "2024-05-23", count: 22 },
  { date: "2024-05-24", count: 25 },
  { date: "2024-05-25", count: 23 },
  { date: "2024-05-26", count: 20 },
  { date: "2024-05-27", count: 29 },
  { date: "2024-05-28", count: 24 },
  { date: "2024-05-29", count: 16 },
  { date: "2024-05-30", count: 28 },
  { date: "2024-05-31", count: 22 },
  { date: "2024-06-01", count: 20 },
  { date: "2024-06-02", count: 32 },
  { date: "2024-06-03", count: 17 },
  { date: "2024-06-04", count: 29 },
  { date: "2024-06-05", count: 15 },
  { date: "2024-06-06", count: 25 },
  { date: "2024-06-07", count: 27 },
  { date: "2024-06-08", count: 30 },
  { date: "2024-06-09", count: 33 },
  { date: "2024-06-10", count: 19 },
  { date: "2024-06-11", count: 17 },
  { date: "2024-06-12", count: 35 },
  { date: "2024-06-13", count: 14 },
  { date: "2024-06-14", count: 31 },
  { date: "2024-06-15", count: 28 },
  { date: "2024-06-16", count: 26 },
  { date: "2024-06-17", count: 37 },
  { date: "2024-06-18", count: 18 },
  { date: "2024-06-19", count: 29 },
  { date: "2024-06-20", count: 32 },
  { date: "2024-06-21", count: 21 },
  { date: "2024-06-22", count: 27 },
  { date: "2024-06-23", count: 39 },
  { date: "2024-06-24", count: 20 },
  { date: "2024-06-25", count: 22 },
  { date: "2024-06-26", count: 34 },
  { date: "2024-06-27", count: 36 },
  { date: "2024-06-28", count: 24 },
  { date: "2024-06-29", count: 18 },
  { date: "2024-06-30", count: 33 },
]

// Chart 3: Total RFP Value by Hospital
const rfpValueData = [
  { date: "2024-04-01", value: 85000 },
  { date: "2024-04-02", value: 92000 },
  { date: "2024-04-03", value: 78000 },
  { date: "2024-04-04", value: 105000 },
  { date: "2024-04-05", value: 118000 },
  { date: "2024-04-06", value: 95000 },
  { date: "2024-04-07", value: 88000 },
  { date: "2024-04-08", value: 132000 },
  { date: "2024-04-09", value: 67000 },
  { date: "2024-04-10", value: 98000 },
  { date: "2024-04-11", value: 115000 },
  { date: "2024-04-12", value: 89000 },
  { date: "2024-04-13", value: 125000 },
  { date: "2024-04-14", value: 78000 },
  { date: "2024-04-15", value: 85000 },
  { date: "2024-04-16", value: 92000 },
  { date: "2024-04-17", value: 145000 },
  { date: "2024-04-18", value: 138000 },
  { date: "2024-04-19", value: 96000 },
  { date: "2024-04-20", value: 72000 },
  { date: "2024-04-21", value: 88000 },
  { date: "2024-04-22", value: 102000 },
  { date: "2024-04-23", value: 95000 },
  { date: "2024-04-24", value: 128000 },
  { date: "2024-04-25", value: 112000 },
  { date: "2024-04-26", value: 68000 },
  { date: "2024-04-27", value: 142000 },
  { date: "2024-04-28", value: 89000 },
  { date: "2024-04-29", value: 118000 },
  { date: "2024-04-30", value: 155000 },
  { date: "2024-05-01", value: 98000 },
  { date: "2024-05-02", value: 125000 },
  { date: "2024-05-03", value: 108000 },
  { date: "2024-05-04", value: 162000 },
  { date: "2024-05-05", value: 178000 },
  { date: "2024-05-06", value: 185000 },
  { date: "2024-05-07", value: 148000 },
  { date: "2024-05-08", value: 92000 },
  { date: "2024-05-09", value: 105000 },
  { date: "2024-05-10", value: 132000 },
  { date: "2024-05-11", value: 128000 },
  { date: "2024-05-12", value: 115000 },
  { date: "2024-05-13", value: 98000 },
  { date: "2024-05-14", value: 168000 },
  { date: "2024-05-15", value: 172000 },
  { date: "2024-05-16", value: 145000 },
  { date: "2024-05-17", value: 185000 },
  { date: "2024-05-18", value: 138000 },
  { date: "2024-05-19", value: 108000 },
  { date: "2024-05-20", value: 95000 },
  { date: "2024-05-21", value: 72000 },
  { date: "2024-05-22", value: 68000 },
  { date: "2024-05-23", value: 122000 },
  { date: "2024-05-24", value: 135000 },
  { date: "2024-05-25", value: 118000 },
  { date: "2024-05-26", value: 102000 },
  { date: "2024-05-27", value: 175000 },
  { date: "2024-05-28", value: 125000 },
  { date: "2024-05-29", value: 78000 },
  { date: "2024-05-30", value: 148000 },
  { date: "2024-05-31", value: 112000 },
  { date: "2024-06-01", value: 105000 },
  { date: "2024-06-02", value: 182000 },
  { date: "2024-06-03", value: 85000 },
  { date: "2024-06-04", value: 168000 },
  { date: "2024-06-05", value: 78000 },
  { date: "2024-06-06", value: 135000 },
  { date: "2024-06-07", value: 152000 },
  { date: "2024-06-08", value: 158000 },
  { date: "2024-06-09", value: 178000 },
  { date: "2024-06-10", value: 98000 },
  { date: "2024-06-11", value: 82000 },
  { date: "2024-06-12", value: 195000 },
  { date: "2024-06-13", value: 75000 },
  { date: "2024-06-14", value: 172000 },
  { date: "2024-06-15", value: 148000 },
  { date: "2024-06-16", value: 162000 },
  { date: "2024-06-17", value: 205000 },
  { date: "2024-06-18", value: 92000 },
  { date: "2024-06-19", value: 145000 },
  { date: "2024-06-20", value: 175000 },
  { date: "2024-06-21", value: 108000 },
  { date: "2024-06-22", value: 138000 },
  { date: "2024-06-23", value: 218000 },
  { date: "2024-06-24", value: 95000 },
  { date: "2024-06-25", value: 102000 },
  { date: "2024-06-26", value: 185000 },
  { date: "2024-06-27", value: 198000 },
  { date: "2024-06-28", value: 112000 },
  { date: "2024-06-29", value: 88000 },
  { date: "2024-06-30", value: 192000 },
]

// Chart 4: Total Value RFPs Submitted
const rfpSubmissionValueData = [
  { date: "2024-04-01", value: 45000 },
  { date: "2024-04-02", value: 52000 },
  { date: "2024-04-03", value: 41000 },
  { date: "2024-04-04", value: 63000 },
  { date: "2024-04-05", value: 72000 },
  { date: "2024-04-06", value: 58000 },
  { date: "2024-04-07", value: 49000 },
  { date: "2024-04-08", value: 78000 },
  { date: "2024-04-09", value: 38000 },
  { date: "2024-04-10", value: 55000 },
  { date: "2024-04-11", value: 68000 },
  { date: "2024-04-12", value: 52000 },
  { date: "2024-04-13", value: 74000 },
  { date: "2024-04-14", value: 43000 },
  { date: "2024-04-15", value: 48000 },
  { date: "2024-04-16", value: 54000 },
  { date: "2024-04-17", value: 85000 },
  { date: "2024-04-18", value: 82000 },
  { date: "2024-04-19", value: 56000 },
  { date: "2024-04-20", value: 41000 },
  { date: "2024-04-21", value: 49000 },
  { date: "2024-04-22", value: 61000 },
  { date: "2024-04-23", value: 55000 },
  { date: "2024-04-24", value: 76000 },
  { date: "2024-04-25", value: 65000 },
  { date: "2024-04-26", value: 39000 },
  { date: "2024-04-27", value: 84000 },
  { date: "2024-04-28", value: 51000 },
  { date: "2024-04-29", value: 69000 },
  { date: "2024-04-30", value: 92000 },
  { date: "2024-05-01", value: 57000 },
  { date: "2024-05-02", value: 73000 },
  { date: "2024-05-03", value: 63000 },
  { date: "2024-05-04", value: 95000 },
  { date: "2024-05-05", value: 105000 },
  { date: "2024-05-06", value: 110000 },
  { date: "2024-05-07", value: 87000 },
  { date: "2024-05-08", value: 54000 },
  { date: "2024-05-09", value: 62000 },
  { date: "2024-05-10", value: 78000 },
  { date: "2024-05-11", value: 75000 },
  { date: "2024-05-12", value: 68000 },
  { date: "2024-05-13", value: 58000 },
  { date: "2024-05-14", value: 99000 },
  { date: "2024-05-15", value: 102000 },
  { date: "2024-05-16", value: 85000 },
  { date: "2024-05-17", value: 109000 },
  { date: "2024-05-18", value: 81000 },
  { date: "2024-05-19", value: 63000 },
  { date: "2024-05-20", value: 56000 },
  { date: "2024-05-21", value: 42000 },
  { date: "2024-05-22", value: 40000 },
  { date: "2024-05-23", value: 72000 },
  { date: "2024-05-24", value: 79000 },
  { date: "2024-05-25", value: 69000 },
  { date: "2024-05-26", value: 60000 },
  { date: "2024-05-27", value: 103000 },
  { date: "2024-05-28", value: 73000 },
  { date: "2024-05-29", value: 46000 },
  { date: "2024-05-30", value: 87000 },
  { date: "2024-05-31", value: 66000 },
  { date: "2024-06-01", value: 62000 },
  { date: "2024-06-02", value: 107000 },
  { date: "2024-06-03", value: 50000 },
  { date: "2024-06-04", value: 99000 },
  { date: "2024-06-05", value: 46000 },
  { date: "2024-06-06", value: 79000 },
  { date: "2024-06-07", value: 89000 },
  { date: "2024-06-08", value: 93000 },
  { date: "2024-06-09", value: 105000 },
  { date: "2024-06-10", value: 58000 },
  { date: "2024-06-11", value: 48000 },
  { date: "2024-06-12", value: 115000 },
  { date: "2024-06-13", value: 44000 },
  { date: "2024-06-14", value: 101000 },
  { date: "2024-06-15", value: 87000 },
  { date: "2024-06-16", value: 95000 },
  { date: "2024-06-17", value: 121000 },
  { date: "2024-06-18", value: 54000 },
  { date: "2024-06-19", value: 85000 },
  { date: "2024-06-20", value: 103000 },
  { date: "2024-06-21", value: 63000 },
  { date: "2024-06-22", value: 81000 },
  { date: "2024-06-23", value: 128000 },
  { date: "2024-06-24", value: 56000 },
  { date: "2024-06-25", value: 60000 },
  { date: "2024-06-26", value: 109000 },
  { date: "2024-06-27", value: 117000 },
  { date: "2024-06-28", value: 66000 },
  { date: "2024-06-29", value: 52000 },
  { date: "2024-06-30", value: 113000 },
]

const chartConfig = {
  count: {
    label: "Count",
    color: "var(--primary)",
  },
  value: {
    label: "Value",
    color: "var(--primary)",
  },
} satisfies ChartConfig

interface ChartProps {
  title: string
  description: string
  data: Array<{ date: string; count?: number; value?: number }>
  dataKey: "count" | "value"
  valuePrefix?: string
  selectedChart: string
  onChartChange: (value: string) => void
}

function RFPChart({ title, description, data, dataKey, valuePrefix = "", selectedChart, onChartChange }: ChartProps) {
  const isMobile = useIsMobile()
  const [timeRange, setTimeRange] = React.useState("90d")

  React.useEffect(() => {
    if (isMobile) {
      setTimeRange("7d")
    }
  }, [isMobile])

  const filteredData = data.filter((item) => {
    const date = new Date(item.date)
    const referenceDate = new Date("2024-06-30")
    let daysToSubtract = 90
    if (timeRange === "60d") {
      daysToSubtract = 60
    } else if (timeRange === "30d") {
      daysToSubtract = 30
    } else if (timeRange === "7d") {
      daysToSubtract = 7
    }
    const startDate = new Date(referenceDate)
    startDate.setDate(startDate.getDate() - daysToSubtract)
    return date >= startDate
  })

  return (
    <Card className="@container/card">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>
          <span className="hidden @[540px]/card:block">
            {description}
          </span>
          <span className="@[540px]/card:hidden">Trend analysis</span>
        </CardDescription>
        <CardAction>
          <div className="flex items-center gap-2">
            <Select value={selectedChart} onValueChange={onChartChange}>
              <SelectTrigger className="w-64">
                <SelectValue placeholder="Select chart type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="progress">RFPs from Hospitals in Progress</SelectItem>
                <SelectItem value="response">RFPs Responded</SelectItem>
                <SelectItem value="value">Total RFP Value by Hospital</SelectItem>
                <SelectItem value="submission">Total Value RFPs Submitted</SelectItem>
              </SelectContent>
            </Select>
            <ToggleGroup
              type="single"
              value={timeRange}
              onValueChange={setTimeRange}
              variant="outline"
              className="hidden *:data-[slot=toggle-group-item]:!px-4 @[767px]/card:flex"
            >
              <ToggleGroupItem value="90d">90 days</ToggleGroupItem>
              <ToggleGroupItem value="60d">60 days</ToggleGroupItem>
              <ToggleGroupItem value="30d">30 days</ToggleGroupItem>
            </ToggleGroup>
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger
                className="flex w-32 **:data-[slot=select-value]:block **:data-[slot=select-value]:truncate @[767px]/card:hidden"
                size="sm"
                aria-label="Select a value"
              >
                <SelectValue placeholder="90 days" />
              </SelectTrigger>
              <SelectContent className="rounded-xl">
                <SelectItem value="90d" className="rounded-lg">
                  90 days
                </SelectItem>
                <SelectItem value="60d" className="rounded-lg">
                  60 days
                </SelectItem>
                <SelectItem value="30d" className="rounded-lg">
                  30 days
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardAction>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          <AreaChart data={filteredData}>
            <defs>
              <linearGradient id={`fill${dataKey}`} x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor={`var(--color-${dataKey})`}
                  stopOpacity={1.0}
                />
                <stop
                  offset="95%"
                  stopColor={`var(--color-${dataKey})`}
                  stopOpacity={0.1}
                />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => {
                const date = new Date(value)
                return date.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })
              }}
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  labelFormatter={(value) => {
                    return new Date(value).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })
                  }}
                  formatter={(value) => [`${valuePrefix}${value.toLocaleString()}`, dataKey === "value" ? "Value" : "Count"]}
                  indicator="dot"
                />
              }
            />
            <Area
              dataKey={dataKey}
              type="natural"
              fill={`url(#fill${dataKey})`}
              stroke={`var(--color-${dataKey})`}
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}

export function RFPProgressChart({ selectedChart, onChartChange }: { selectedChart: string; onChartChange: (value: string) => void }) {
  return (
    <RFPChart
      title="RFPs from Hospitals in Progress"
      description="Track RFPs currently in progress from hospitals over time"
      data={rfpProgressData}
      dataKey="count"
      selectedChart={selectedChart}
      onChartChange={onChartChange}
    />
  )
}

export function RFPResponseChart({ selectedChart, onChartChange }: { selectedChart: string; onChartChange: (value: string) => void }) {
  return (
    <RFPChart
      title="RFPs Responded"
      description="Monitor RFP response rates and completion over time"
      data={rfpResponseData}
      dataKey="count"
      selectedChart={selectedChart}
      onChartChange={onChartChange}
    />
  )
}

export function RFPValueChart({ selectedChart, onChartChange }: { selectedChart: string; onChartChange: (value: string) => void }) {
  return (
    <RFPChart
      title="Total RFP Value by Hospital"
      description="Track total value of RFPs received from hospitals"
      data={rfpValueData}
      dataKey="value"
      valuePrefix="$"
      selectedChart={selectedChart}
      onChartChange={onChartChange}
    />
  )
}

export function RFPSubmissionValueChart({ selectedChart, onChartChange }: { selectedChart: string; onChartChange: (value: string) => void }) {
  return (
    <RFPChart
      title="Total Value RFPs Submitted"
      description="Monitor the total value of RFPs submitted over time"
      data={rfpSubmissionValueData}
      dataKey="value"
      valuePrefix="$"
      selectedChart={selectedChart}
      onChartChange={onChartChange}
    />
  )
}
