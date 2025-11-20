"use client"

import { useState } from "react"
import { useAuth } from "@/hooks/use-auth"
import { Sidebar } from "@/components/sidebar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Legend,
} from "recharts"
import { Download, Filter, TrendingUp, Users, Calendar, Award } from "lucide-react"

interface AttendanceRecord {
  id: string
  name: string
  className: string
  date: string
  status: "present" | "absent" | "late"
}

export default function ReportsPage() {
  const { user, isLoading } = useAuth()
  const [filterType, setFilterType] = useState("all")
  const [selectedClass, setSelectedClass] = useState("all")
  const [dateRange, setDateRange] = useState({ start: "", end: "" })

  const [attendanceRecords] = useState<AttendanceRecord[]>([
    { id: "1", name: "Jane Trainee", className: "Piano Basics", date: "2025-11-24", status: "present" },
    { id: "2", name: "John Doe", className: "Piano Basics", date: "2025-11-24", status: "present" },
    { id: "3", name: "Alice Smith", className: "Guitar Intermediate", date: "2025-11-24", status: "late" },
    { id: "4", name: "Bob Miller", className: "Violin Advanced", date: "2025-11-24", status: "absent" },
    { id: "5", name: "Jane Trainee", className: "Piano Basics", date: "2025-11-25", status: "present" },
    { id: "6", name: "John Doe", className: "Piano Basics", date: "2025-11-25", status: "present" },
    { id: "7", name: "Alice Smith", className: "Guitar Intermediate", date: "2025-11-25", status: "present" },
    { id: "8", name: "Bob Miller", className: "Violin Advanced", date: "2025-11-25", status: "late" },
    { id: "9", name: "Jane Trainee", className: "Piano Basics", date: "2025-11-26", status: "present" },
    { id: "10", name: "John Doe", className: "Piano Basics", date: "2025-11-26", status: "absent" },
  ])

  const attendanceByClass = [
    { class: "Piano Basics", present: 28, absent: 2, late: 1 },
    { class: "Guitar Intermediate", present: 24, absent: 1, late: 2 },
    { class: "Violin Advanced", present: 15, absent: 3, late: 1 },
    { class: "Drums Basic", present: 18, absent: 2, late: 0 },
  ]

  const attendanceOverTime = [
    { date: "Nov 24", attendance: 82, goal: 90 },
    { date: "Nov 25", attendance: 85, goal: 90 },
    { date: "Nov 26", attendance: 88, goal: 90 },
    { date: "Nov 27", attendance: 84, goal: 90 },
    { date: "Nov 28", attendance: 89, goal: 90 },
  ]

  const statusData = [
    { name: "Present", value: 85 },
    { name: "Absent", value: 8 },
    { name: "Late", value: 7 },
  ]

  const colors = ["#10b981", "#ef4444", "#f59e0b"]

  const performanceData = [
    { name: "Jane Trainee", score: 92, progress: 85 },
    { name: "John Doe", score: 88, progress: 80 },
    { name: "Alice Smith", score: 95, progress: 92 },
    { name: "Bob Miller", score: 78, progress: 72 },
  ]

  if (isLoading || !user) return null

  const canViewReports = ["club-leader", "department-leader", "member-manager", "inventory-manager"].includes(user.role)

  if (!canViewReports) {
    return (
      <div className="flex h-screen bg-background">
        <Sidebar />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold">Access Denied</h1>
            <p className="text-muted-foreground">Only managers can access reports</p>
          </div>
        </main>
      </div>
    )
  }

  // Calculate statistics
  const totalRecords = attendanceRecords.length
  const presentCount = attendanceRecords.filter((r) => r.status === "present").length
  const absentCount = attendanceRecords.filter((r) => r.status === "absent").length
  const lateCount = attendanceRecords.filter((r) => r.status === "late").length
  const attendanceRate = Math.round((presentCount / totalRecords) * 100)

  const filteredRecords = attendanceRecords.filter((record) => {
    let matches = true
    if (filterType !== "all") matches = matches && record.status === filterType
    if (selectedClass !== "all") matches = matches && record.className === selectedClass
    return matches
  })

  const classes = [...new Set(attendanceRecords.map((r) => r.className))]

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <main className="flex-1 overflow-auto md:pt-0 pt-16">
        <div className="p-4 md:p-6 max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold">Reports & Analytics</h1>
            <Button className="gap-2">
              <Download size={16} />
              Export Report
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Attendance Rate</p>
                    <p className="text-3xl font-bold text-green-600">{attendanceRate}%</p>
                  </div>
                  <div className="p-3 bg-green-100 rounded-lg">
                    <TrendingUp className="text-green-600" size={24} />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Present This Week</p>
                    <p className="text-3xl font-bold">{presentCount}</p>
                  </div>
                  <div className="p-3 bg-blue-100 rounded-lg">
                    <Users className="text-blue-600" size={24} />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Absences</p>
                    <p className="text-3xl font-bold text-red-600">{absentCount}</p>
                  </div>
                  <div className="p-3 bg-red-100 rounded-lg">
                    <Calendar className="text-red-600" size={24} />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Late Arrivals</p>
                    <p className="text-3xl font-bold text-orange-600">{lateCount}</p>
                  </div>
                  <div className="p-3 bg-orange-100 rounded-lg">
                    <Award className="text-orange-600" size={24} />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Attendance Over Time */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Attendance Trend</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={attendanceOverTime}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="attendance"
                    stroke="#3b82f6"
                    name="Actual Attendance %"
                    strokeWidth={2}
                  />
                  <Line
                    type="monotone"
                    dataKey="goal"
                    stroke="#10b981"
                    name="Target %"
                    strokeDasharray="5 5"
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Charts Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {/* Attendance by Class */}
            <Card>
              <CardHeader>
                <CardTitle>Attendance by Class</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={attendanceByClass}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="class" fontSize={12} />
                    <YAxis fontSize={12} />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="present" fill="#10b981" name="Present" />
                    <Bar dataKey="absent" fill="#ef4444" name="Absent" />
                    <Bar dataKey="late" fill="#f59e0b" name="Late" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Overall Status */}
            <Card>
              <CardHeader>
                <CardTitle>Overall Status Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={statusData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {statusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={colors[index]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
                <div className="mt-4 flex flex-col gap-2 text-sm">
                  {statusData.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: colors[idx] }} />
                      <span>
                        {item.name}: {item.value}%
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Performance Metrics */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Performance Metrics</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={performanceData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" fontSize={12} />
                  <YAxis fontSize={12} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="score" fill="#8b5cf6" name="Test Score" />
                  <Bar dataKey="progress" fill="#06b6d4" name="Progress %" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Attendance Records</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Filters */}
              <div className="flex gap-3 flex-wrap items-center pb-4 border-b">
                <div className="flex items-center gap-2">
                  <Filter size={16} className="text-muted-foreground" />
                  <span className="text-sm font-medium">Filter:</span>
                </div>

                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="px-3 py-1 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="all">All Status</option>
                  <option value="present">Present</option>
                  <option value="absent">Absent</option>
                  <option value="late">Late</option>
                </select>

                <select
                  value={selectedClass}
                  onChange={(e) => setSelectedClass(e.target.value)}
                  className="px-3 py-1 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="all">All Classes</option>
                  {classes.map((cls) => (
                    <option key={cls} value={cls}>
                      {cls}
                    </option>
                  ))}
                </select>
              </div>

              {/* Records Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b bg-muted/50">
                      <th className="px-3 py-2 text-left font-semibold">Name</th>
                      <th className="px-3 py-2 text-left font-semibold">Class</th>
                      <th className="px-3 py-2 text-left font-semibold">Date</th>
                      <th className="px-3 py-2 text-left font-semibold">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredRecords.map((record) => (
                      <tr key={record.id} className="border-b hover:bg-muted/30 transition">
                        <td className="px-3 py-2">{record.name}</td>
                        <td className="px-3 py-2">{record.className}</td>
                        <td className="px-3 py-2">{record.date}</td>
                        <td className="px-3 py-2">
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-semibold ${
                              record.status === "present"
                                ? "bg-green-100 text-green-800"
                                : record.status === "absent"
                                  ? "bg-red-100 text-red-800"
                                  : "bg-orange-100 text-orange-800"
                            }`}
                          >
                            {record.status.charAt(0).toUpperCase() + record.status.slice(1)}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="pt-3 text-xs text-muted-foreground">
                Showing {filteredRecords.length} of {totalRecords} records
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
