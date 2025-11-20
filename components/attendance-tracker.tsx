"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface AttendanceRecord {
  id: string
  sessionId: string
  traineeId: string
  status: "present" | "absent" | "late"
  confirmation: "accepted" | "declined" | "pending"
}

export function AttendanceTracker() {
  const [attendance, setAttendance] = useState<AttendanceRecord[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchAttendance()
  }, [])

  const fetchAttendance = async () => {
    try {
      const response = await fetch("/api/attendance")
      const data = await response.json()
      if (data.success) {
        setAttendance(data.data)
      }
    } catch (error) {
      console.error("Failed to fetch attendance", error)
    } finally {
      setLoading(false)
    }
  }

  const updateAttendance = async (id: string, status: string, confirmation: string) => {
    try {
      const response = await fetch("/api/attendance", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status, confirmation }),
      })

      if (response.ok) {
        fetchAttendance()
      }
    } catch (error) {
      console.error("Failed to update attendance", error)
    }
  }

  if (loading) {
    return <div className="text-center py-8">Loading attendance...</div>
  }

  // Mock attendance records for display
  const mockAttendanceRecords = [
    { id: "1", sessionId: "1", traineeName: "Jane Trainee", status: "present", confirmation: "accepted" },
    { id: "2", sessionId: "1", traineeName: "John Doe", status: "late", confirmation: "pending" },
    { id: "3", sessionId: "1", traineeName: "Alice Smith", status: "absent", confirmation: "pending" },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Session Attendance</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {mockAttendanceRecords.map((record) => (
            <div key={record.id} className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center gap-3">
                <div>
                  <p className="font-medium text-sm">{record.traineeName}</p>
                  <p className="text-xs text-muted-foreground">Session {record.sessionId}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <select
                  value={record.status}
                  onChange={(e) => updateAttendance(record.id, e.target.value, record.confirmation)}
                  className="px-2 py-1 text-sm border border-border rounded-lg bg-background"
                >
                  <option value="present">Present</option>
                  <option value="absent">Absent</option>
                  <option value="late">Late</option>
                </select>
                <span
                  className={`px-2 py-1 text-xs rounded-full ${
                    record.status === "present"
                      ? "bg-green-100 text-green-800"
                      : record.status === "late"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-red-100 text-red-800"
                  }`}
                >
                  {record.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
