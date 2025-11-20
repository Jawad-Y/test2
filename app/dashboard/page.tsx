"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/hooks/use-auth"
import { Sidebar } from "@/components/sidebar"
import { DashboardHeader } from "@/components/dashboard-header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, Calendar, Music, Shirt, TrendingUp } from "lucide-react"

interface StatCard {
  label: string
  value: string | number
  icon: any
  color: string
}

interface WeeklySession {
  id: string
  date: string
  time: string
  className: string
  subject: string
}

interface AttendanceData {
  date: string
  presentCount: number
  totalCount: number
}

export default function DashboardPage() {
  const { user, isLoading } = useAuth()
  const [stats, setStats] = useState<StatCard[]>([])
  const [weeklySessions, setWeeklySessions] = useState<WeeklySession[]>([
    {
      id: "1",
      date: "2025-11-24",
      time: "10:00",
      className: "Piano Basics",
      subject: "Chord Theory",
    },
    {
      id: "2",
      date: "2025-11-25",
      time: "14:00",
      className: "Guitar Intermediate",
      subject: "Finger Techniques",
    },
    {
      id: "3",
      date: "2025-11-26",
      time: "16:00",
      className: "Violin Basics",
      subject: "Bow Control",
    },
  ])
  const [attendanceThisWeek, setAttendanceThisWeek] = useState<AttendanceData[]>([
    { date: "2025-11-24", presentCount: 25, totalCount: 28 },
    { date: "2025-11-25", presentCount: 27, totalCount: 28 },
    { date: "2025-11-26", presentCount: 26, totalCount: 28 },
  ])

  useEffect(() => {
    if (!isLoading && user) {
      const roleStats: Record<string, StatCard[]> = {
        "club-leader": [
          { label: "Total Members", value: 245, icon: Users, color: "bg-blue-100" },
          { label: "Active Classes", value: 12, icon: Calendar, color: "bg-green-100" },
          { label: "Instruments", value: 85, icon: Music, color: "bg-purple-100" },
          { label: "Clothing Items", value: 342, icon: Shirt, color: "bg-orange-100" },
        ],
        "department-leader": [
          { label: "Classes", value: 4, icon: Calendar, color: "bg-green-100" },
          { label: "Class Leaders", value: 4, icon: Users, color: "bg-blue-100" },
          { label: "Total Trainees", value: 82, icon: Users, color: "bg-purple-100" },
          { label: "Upcoming Sessions", value: 8, icon: Calendar, color: "bg-orange-100" },
        ],
        "class-leader": [
          { label: "Class Members", value: 28, icon: Users, color: "bg-blue-100" },
          { label: "Trainers", value: 2, icon: Users, color: "bg-green-100" },
          { label: "Upcoming Sessions", value: 5, icon: Calendar, color: "bg-purple-100" },
          { label: "Attendance Rate", value: "92%", icon: Calendar, color: "bg-orange-100" },
        ],
        "inventory-manager": [
          { label: "Total Items", value: 427, icon: Music, color: "bg-blue-100" },
          { label: "Items In Use", value: 156, icon: TrendingUp, color: "bg-orange-100" },
          { label: "Available", value: 271, icon: Music, color: "bg-green-100" },
          { label: "Needs Maintenance", value: 3, icon: Shirt, color: "bg-red-100" },
        ],
        "member-manager": [
          { label: "Active Members", value: 245, icon: Users, color: "bg-blue-100" },
          { label: "This Week Attendance", value: "89%", icon: TrendingUp, color: "bg-green-100" },
          { label: "Graduated", value: 12, icon: Users, color: "bg-purple-100" },
          { label: "Reports Generated", value: 8, icon: Calendar, color: "bg-orange-100" },
        ],
      }

      setStats(roleStats[user.role] || roleStats["trainee"] || [])
    }
  }, [user, isLoading])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!user) return null

  const avgAttendance =
    attendanceThisWeek.length > 0
      ? Math.round(
          (attendanceThisWeek.reduce((sum, d) => sum + d.presentCount / d.totalCount, 0) / attendanceThisWeek.length) *
            100,
        )
      : 0

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <main className="flex-1 overflow-auto md:pt-0 pt-16">
        <div className="p-4 md:p-6 max-w-7xl mx-auto">
          <DashboardHeader />

          {stats.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              {stats.map((stat, index) => {
                const Icon = stat.icon
                return (
                  <Card key={index}>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-muted-foreground">{stat.label}</p>
                          <p className="text-2xl font-bold mt-2">{stat.value}</p>
                        </div>
                        <div className={`p-3 rounded-lg ${stat.color}`}>
                          <Icon className="text-gray-700" size={24} />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* This Week's Training Sessions */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar size={20} />
                  This Week's Training Sessions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {weeklySessions.map((session) => (
                    <div key={session.id} className="flex items-start gap-3 p-3 border rounded-lg">
                      <div className="p-2 bg-blue-100 rounded">
                        <Calendar size={16} className="text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-start justify-between">
                          <div>
                            <p className="font-semibold text-sm">{session.subject}</p>
                            <p className="text-xs text-muted-foreground">{session.className}</p>
                          </div>
                          <span className="text-xs bg-primary text-primary-foreground px-2 py-1 rounded">
                            {session.date} @ {session.time}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Attendance Report */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <TrendingUp size={18} />
                  Attendance Report
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center p-4 bg-green-50 rounded-lg border border-green-200">
                  <p className="text-xs text-muted-foreground">Average Attendance</p>
                  <p className="text-3xl font-bold text-green-600">{avgAttendance}%</p>
                </div>

                <div className="space-y-2">
                  <p className="text-xs font-semibold text-muted-foreground">Daily Breakdown</p>
                  {attendanceThisWeek.map((day) => {
                    const percentage = Math.round((day.presentCount / day.totalCount) * 100)
                    return (
                      <div key={day.date} className="space-y-1">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-muted-foreground">{day.date}</span>
                          <span className="font-semibold">
                            {day.presentCount}/{day.totalCount}
                          </span>
                        </div>
                        <div className="w-full bg-secondary rounded-full h-2">
                          <div
                            className="bg-green-600 h-2 rounded-full transition-all"
                            style={{ width: `${percentage}%` }}
                          ></div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Activities */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Recent Activities</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium text-sm">Training Session Scheduled</p>
                    <p className="text-xs text-muted-foreground">Piano Basics - Nov 25, 2025</p>
                  </div>
                  <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">New</span>
                </div>
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium text-sm">Member Enrolled</p>
                    <p className="text-xs text-muted-foreground">Jane Doe - Guitar Class</p>
                  </div>
                  <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">New</span>
                </div>
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium text-sm">Equipment Maintenance</p>
                    <p className="text-xs text-muted-foreground">Piano tuning completed</p>
                  </div>
                  <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">Complete</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
