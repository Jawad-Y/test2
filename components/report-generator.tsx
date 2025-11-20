"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { BarChart3, Download, RefreshCw } from "lucide-react"

interface ReportData {
  type: string
  data: any[]
}

export function ReportGenerator() {
  const [reportType, setReportType] = useState("attendance")
  const [report, setReport] = useState<ReportData | null>(null)
  const [loading, setLoading] = useState(false)
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")

  const generateReport = async () => {
    setLoading(true)
    try {
      const queryParams = new URLSearchParams()
      queryParams.append("type", reportType)
      if (startDate) queryParams.append("startDate", startDate)
      if (endDate) queryParams.append("endDate", endDate)

      const response = await fetch(`/api/reports?${queryParams}`)
      const data = await response.json()
      if (data.success) {
        setReport(data.data)
      }
    } catch (error) {
      console.error("Failed to generate report", error)
    } finally {
      setLoading(false)
    }
  }

  const downloadReport = () => {
    if (!report) return
    const dataStr = JSON.stringify(report, null, 2)
    const dataUri = "data:application/json;charset=utf-8," + encodeURIComponent(dataStr)
    const exportFileDefaultName = `${reportType}_report.json`
    const linkElement = document.createElement("a")
    linkElement.setAttribute("href", dataUri)
    linkElement.setAttribute("download", exportFileDefaultName)
    linkElement.click()
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart3 size={24} />
          Report Generator
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Report Type Selection */}
          <div>
            <label className="text-sm font-medium">Report Type</label>
            <select
              value={reportType}
              onChange={(e) => setReportType(e.target.value)}
              className="w-full px-3 py-2 border border-border rounded-lg bg-background"
            >
              <option value="attendance">Attendance Report</option>
              <option value="performance">Performance Report</option>
              <option value="enrollment">Enrollment Report</option>
            </select>
          </div>

          {/* Date Range */}
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-sm font-medium">Start Date</label>
              <Input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
            </div>
            <div>
              <label className="text-sm font-medium">End Date</label>
              <Input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-2">
            <Button onClick={generateReport} disabled={loading} className="flex-1">
              <RefreshCw size={16} className="mr-2" />
              {loading ? "Generating..." : "Generate Report"}
            </Button>
            {report && (
              <Button variant="outline" onClick={downloadReport}>
                <Download size={16} className="mr-2" />
                Download
              </Button>
            )}
          </div>

          {/* Report Display */}
          {report && (
            <div className="border-t pt-4">
              <h3 className="font-semibold mb-3 capitalize">{report.type} Report</h3>
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {report.data.map((item, idx) => (
                  <div key={idx} className="p-3 bg-gray-50 rounded-lg text-sm">
                    <div className="grid grid-cols-2 gap-2">
                      {Object.entries(item).map(([key, value]) => (
                        <div key={key}>
                          <p className="text-xs text-muted-foreground capitalize">{key}</p>
                          <p className="font-medium">{String(value)}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
