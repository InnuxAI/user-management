'use client';

import { DashboardLayout } from "@/components/dashboard-layout"
import { RFPProgressChart, RFPResponseChart, RFPValueChart, RFPSubmissionValueChart } from "@/components/rfp-charts"
import { RFPDataTable } from "@/components/rfp-data-table"
import { SectionCards } from "@/components/section-cards"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { useState } from "react"

import data from "./data.json"

function DashboardContent() {
  const [selectedChart, setSelectedChart] = useState("progress")

  const chartOptions = [
    {
      value: "progress",
      title: "RFPs from Hospitals in Progress",
      description: "Track RFPs currently in progress from hospitals over time"
    },
    {
      value: "response", 
      title: "RFPs Responded",
      description: "Monitor RFP response rates and completion over time"
    },
    {
      value: "value",
      title: "Total RFP Value by Hospital", 
      description: "Track total value of RFPs received from hospitals"
    },
    {
      value: "submission",
      title: "Total Value RFPs Submitted",
      description: "Monitor the total value of RFPs submitted over time"
    }
  ]

  const selectedOption = chartOptions.find(option => option.value === selectedChart)

  const renderChart = () => {
    switch (selectedChart) {
      case "progress":
        return <RFPProgressChart selectedChart={selectedChart} onChartChange={setSelectedChart} />
      case "response":
        return <RFPResponseChart selectedChart={selectedChart} onChartChange={setSelectedChart} />
      case "value":
        return <RFPValueChart selectedChart={selectedChart} onChartChange={setSelectedChart} />
      case "submission":
        return <RFPSubmissionValueChart selectedChart={selectedChart} onChartChange={setSelectedChart} />
      default:
        return <RFPProgressChart selectedChart={selectedChart} onChartChange={setSelectedChart} />
    }
  }

  return (
    <div className="@container/main flex flex-1 flex-col gap-2">
      <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
        <SectionCards />
        <div className="px-4 lg:px-6">
          {renderChart()}
        </div>
        <RFPDataTable data={data} />
      </div>
    </div>
  )
}

export default function Page() {
  return (
    <DashboardLayout>
      <DashboardContent />
    </DashboardLayout>
  )
}
