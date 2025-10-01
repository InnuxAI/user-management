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

export const description = "RFP Response Value Trend Analysis"

const chartData = [
  { date: "2024-04-01", responseValue: 85000, submissions: 45000 },
  { date: "2024-04-02", responseValue: 92000, submissions: 52000 },
  { date: "2024-04-03", responseValue: 78000, submissions: 41000 },
  { date: "2024-04-04", responseValue: 105000, submissions: 63000 },
  { date: "2024-04-05", responseValue: 118000, submissions: 72000 },
  { date: "2024-04-06", responseValue: 95000, submissions: 58000 },
  { date: "2024-04-07", responseValue: 88000, submissions: 49000 },
  { date: "2024-04-08", responseValue: 132000, submissions: 78000 },
  { date: "2024-04-09", responseValue: 67000, submissions: 38000 },
  { date: "2024-04-10", responseValue: 98000, submissions: 55000 },
  { date: "2024-04-11", responseValue: 115000, submissions: 68000 },
  { date: "2024-04-12", responseValue: 89000, submissions: 52000 },
  { date: "2024-04-13", responseValue: 125000, submissions: 74000 },
  { date: "2024-04-14", responseValue: 78000, submissions: 43000 },
  { date: "2024-04-15", responseValue: 85000, submissions: 48000 },
  { date: "2024-04-16", responseValue: 92000, submissions: 54000 },
  { date: "2024-04-17", responseValue: 145000, submissions: 85000 },
  { date: "2024-04-18", responseValue: 138000, submissions: 82000 },
  { date: "2024-04-19", responseValue: 96000, submissions: 56000 },
  { date: "2024-04-20", responseValue: 72000, submissions: 41000 },
  { date: "2024-04-21", responseValue: 88000, submissions: 49000 },
  { date: "2024-04-22", responseValue: 102000, submissions: 61000 },
  { date: "2024-04-23", responseValue: 95000, submissions: 55000 },
  { date: "2024-04-24", responseValue: 128000, submissions: 76000 },
  { date: "2024-04-25", responseValue: 112000, submissions: 65000 },
  { date: "2024-04-26", responseValue: 68000, submissions: 39000 },
  { date: "2024-04-27", responseValue: 142000, submissions: 84000 },
  { date: "2024-04-28", responseValue: 89000, submissions: 51000 },
  { date: "2024-04-29", responseValue: 118000, submissions: 69000 },
  { date: "2024-04-30", responseValue: 155000, submissions: 92000 },
  { date: "2024-05-01", responseValue: 98000, submissions: 57000 },
  { date: "2024-05-02", responseValue: 125000, submissions: 73000 },
  { date: "2024-05-03", responseValue: 108000, submissions: 63000 },
  { date: "2024-05-04", responseValue: 162000, submissions: 95000 },
  { date: "2024-05-05", responseValue: 178000, submissions: 105000 },
  { date: "2024-05-06", responseValue: 185000, submissions: 110000 },
  { date: "2024-05-07", responseValue: 148000, submissions: 87000 },
  { date: "2024-05-08", responseValue: 92000, submissions: 54000 },
  { date: "2024-05-09", responseValue: 105000, submissions: 62000 },
  { date: "2024-05-10", responseValue: 132000, submissions: 78000 },
  { date: "2024-05-11", responseValue: 128000, submissions: 75000 },
  { date: "2024-05-12", responseValue: 115000, submissions: 68000 },
  { date: "2024-05-13", responseValue: 98000, submissions: 58000 },
  { date: "2024-05-14", responseValue: 168000, submissions: 99000 },
  { date: "2024-05-15", responseValue: 172000, submissions: 102000 },
  { date: "2024-05-16", responseValue: 145000, submissions: 85000 },
  { date: "2024-05-17", responseValue: 185000, submissions: 109000 },
  { date: "2024-05-18", responseValue: 138000, submissions: 81000 },
  { date: "2024-05-19", responseValue: 108000, submissions: 63000 },
  { date: "2024-05-20", responseValue: 95000, submissions: 56000 },
  { date: "2024-05-21", responseValue: 72000, submissions: 42000 },
  { date: "2024-05-22", responseValue: 68000, submissions: 40000 },
  { date: "2024-05-23", responseValue: 122000, submissions: 72000 },
  { date: "2024-05-24", responseValue: 135000, submissions: 79000 },
  { date: "2024-05-25", responseValue: 118000, submissions: 69000 },
  { date: "2024-05-26", responseValue: 102000, submissions: 60000 },
  { date: "2024-05-27", responseValue: 175000, submissions: 103000 },
  { date: "2024-05-28", responseValue: 125000, submissions: 73000 },
  { date: "2024-05-29", responseValue: 78000, submissions: 46000 },
  { date: "2024-05-30", responseValue: 148000, submissions: 87000 },
  { date: "2024-05-31", responseValue: 112000, submissions: 66000 },
  { date: "2024-06-01", responseValue: 105000, submissions: 62000 },
  { date: "2024-06-02", responseValue: 182000, submissions: 107000 },
  { date: "2024-06-03", responseValue: 85000, submissions: 50000 },
  { date: "2024-06-04", responseValue: 168000, submissions: 99000 },
  { date: "2024-06-05", responseValue: 78000, submissions: 46000 },
  { date: "2024-06-06", responseValue: 135000, submissions: 79000 },
  { date: "2024-06-07", responseValue: 152000, submissions: 89000 },
  { date: "2024-06-08", responseValue: 158000, submissions: 93000 },
  { date: "2024-06-09", responseValue: 178000, submissions: 105000 },
  { date: "2024-06-10", responseValue: 98000, submissions: 58000 },
  { date: "2024-06-11", responseValue: 82000, submissions: 48000 },
  { date: "2024-06-12", responseValue: 195000, submissions: 115000 },
  { date: "2024-06-13", responseValue: 75000, submissions: 44000 },
  { date: "2024-06-14", responseValue: 172000, submissions: 101000 },
  { date: "2024-06-15", responseValue: 148000, submissions: 87000 },
  { date: "2024-06-16", responseValue: 162000, submissions: 95000 },
  { date: "2024-06-17", responseValue: 205000, submissions: 121000 },
  { date: "2024-06-18", responseValue: 92000, submissions: 54000 },
  { date: "2024-06-19", responseValue: 145000, submissions: 85000 },
  { date: "2024-06-20", responseValue: 175000, submissions: 103000 },
  { date: "2024-06-21", responseValue: 108000, submissions: 63000 },
  { date: "2024-06-22", responseValue: 138000, submissions: 81000 },
  { date: "2024-06-23", responseValue: 218000, submissions: 128000 },
  { date: "2024-06-24", responseValue: 95000, submissions: 56000 },
  { date: "2024-06-25", responseValue: 102000, submissions: 60000 },
  { date: "2024-06-26", responseValue: 185000, submissions: 109000 },
  { date: "2024-06-27", responseValue: 198000, submissions: 117000 },
  { date: "2024-06-28", responseValue: 112000, submissions: 66000 },
  { date: "2024-06-29", responseValue: 88000, submissions: 52000 },
  { date: "2024-06-30", responseValue: 192000, submissions: 113000 },
]

const chartConfig = {
  rfpData: {
    label: "RFP Data",
  },
  responseValue: {
    label: "Response Value",
    color: "var(--primary)",
  },
  submissions: {
    label: "Submissions",
    color: "var(--primary)",
  },
} satisfies ChartConfig

export function ChartAreaInteractive() {
  const isMobile = useIsMobile()
  const [timeRange, setTimeRange] = React.useState("90d")

  React.useEffect(() => {
    if (isMobile) {
      setTimeRange("7d")
    }
  }, [isMobile])

  const filteredData = chartData.filter((item) => {
    const date = new Date(item.date)
    const referenceDate = new Date("2024-06-30")
    let daysToSubtract = 90
    if (timeRange === "30d") {
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
        <CardTitle>RFP Response Value Trend</CardTitle>
        <CardDescription>
          <span className="hidden @[540px]/card:block">
            Analysis of RFP response values over time to track trends
          </span>
          <span className="@[540px]/card:hidden">RFP value trends</span>
        </CardDescription>
        <CardAction>
          <ToggleGroup
            type="single"
            value={timeRange}
            onValueChange={setTimeRange}
            variant="outline"
            className="hidden *:data-[slot=toggle-group-item]:!px-4 @[767px]/card:flex"
          >
            <ToggleGroupItem value="90d">Last 3 months</ToggleGroupItem>
            <ToggleGroupItem value="30d">Last 30 days</ToggleGroupItem>
            <ToggleGroupItem value="7d">Last 7 days</ToggleGroupItem>
          </ToggleGroup>
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger
              className="flex w-40 **:data-[slot=select-value]:block **:data-[slot=select-value]:truncate @[767px]/card:hidden"
              size="sm"
              aria-label="Select a value"
            >
              <SelectValue placeholder="Last 3 months" />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              <SelectItem value="90d" className="rounded-lg">
                Last 3 months
              </SelectItem>
              <SelectItem value="30d" className="rounded-lg">
                Last 30 days
              </SelectItem>
              <SelectItem value="7d" className="rounded-lg">
                Last 7 days
              </SelectItem>
            </SelectContent>
          </Select>
        </CardAction>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          <AreaChart data={filteredData}>
            <defs>
              <linearGradient id="fillResponseValue" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-responseValue)"
                  stopOpacity={1.0}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-responseValue)"
                  stopOpacity={0.1}
                />
              </linearGradient>
              <linearGradient id="fillSubmissions" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-submissions)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-submissions)"
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
                  indicator="dot"
                />
              }
            />
            <Area
              dataKey="submissions"
              type="natural"
              fill="url(#fillSubmissions)"
              stroke="var(--color-submissions)"
              stackId="a"
            />
            <Area
              dataKey="responseValue"
              type="natural"
              fill="url(#fillResponseValue)"
              stroke="var(--color-responseValue)"
              stackId="a"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
