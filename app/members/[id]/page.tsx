"use client"

import { useState } from "react"
import { useAuth } from "@/hooks/use-auth"
import { Sidebar } from "@/components/sidebar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Download } from "lucide-react"
import Link from "next/link"

export default function MemberProfilePage({ params }: { params: { id: string } }) {
  const { user, isLoading } = useAuth()
  const [memberData] = useState({
    id: params.id,
    name: "Jane Trainee",
    email: "jane@example.com",
    phone: "+1-555-0123",
    role: "trainee",
    joinDate: "2024-01-15",
    status: "active",
    avatar: "JT",
    classes: [
      { id: "1", name: "Piano Basics", level: "Beginner", attendance: "94%" },
      { id: "2", name: "Music Theory", level: "Intermediate", attendance: "88%" },
    ],
    performance: [
      { date: "2025-01-10", rating: 4.5, comment: "Excellent progress on scales" },
      { date: "2025-01-03", rating: 4.0, comment: "Good effort, needs practice" },
    ],
    attendance: [
      { class: "Piano Basics", present: 15, absent: 1, late: 2, rate: "88%" },
      { class: "Music Theory", present: 13, absent: 2, late: 1, rate: "81%" },
    ],
  })

  if (isLoading || !user) return null

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <main className="flex-1 overflow-auto md:pt-0 pt-16">
        <div className="p-4 md:p-6 max-w-7xl mx-auto">
          <Link href="/members">
            <Button variant="outline" size="sm" className="mb-4 gap-2 bg-transparent">
              <ArrowLeft size={16} />
              Back
            </Button>
          </Link>

          {/* Profile Header */}
          <Card className="mb-6">
            <CardContent className="pt-6">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-20 h-20 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-2xl font-bold">
                    {memberData.avatar}
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold">{memberData.name}</h1>
                    <p className="text-sm text-muted-foreground capitalize">{memberData.role}</p>
                    <p className="text-sm text-muted-foreground">Joined {memberData.joinDate}</p>
                    <span className="inline-block mt-2 px-3 py-1 bg-green-100 text-green-800 text-xs rounded-full capitalize">
                      {memberData.status}
                    </span>
                  </div>
                </div>
                <Button>Edit Profile</Button>
              </div>
              <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t">
                <div>
                  <p className="text-xs text-muted-foreground">Email</p>
                  <p className="font-semibold text-sm">{memberData.email}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Phone</p>
                  <p className="font-semibold text-sm">{memberData.phone}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Classes</p>
                  <p className="font-semibold text-sm">{memberData.classes.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Enrolled Classes */}
            <Card>
              <CardHeader>
                <CardTitle>Enrolled Classes</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {memberData.classes.map((cls) => (
                  <div key={cls.id} className="p-3 border rounded-lg">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <p className="font-semibold text-sm">{cls.name}</p>
                        <p className="text-xs text-muted-foreground">{cls.level}</p>
                      </div>
                      <span className="text-xs font-semibold text-green-600">Att: {cls.attendance}</span>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Performance Summary */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Performance</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {memberData.performance.map((perf, idx) => (
                  <div key={idx} className="p-3 border rounded-lg">
                    <div className="flex items-start justify-between mb-2">
                      <p className="text-xs text-muted-foreground">{perf.date}</p>
                      <span className="text-sm font-semibold text-yellow-600">★ {perf.rating}</span>
                    </div>
                    <p className="text-sm">{perf.comment}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Attendance Details */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Attendance Records</span>
                <Button variant="outline" size="sm" className="gap-2 bg-transparent">
                  <Download size={16} />
                  Export
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="border-b">
                    <tr>
                      <th className="text-left py-2 px-2">Class</th>
                      <th className="text-center py-2 px-2">Present</th>
                      <th className="text-center py-2 px-2">Absent</th>
                      <th className="text-center py-2 px-2">Late</th>
                      <th className="text-right py-2 px-2">Rate</th>
                    </tr>
                  </thead>
                  <tbody>
                    {memberData.attendance.map((att) => (
                      <tr key={att.class} className="border-b hover:bg-accent">
                        <td className="py-3 px-2">{att.class}</td>
                        <td className="text-center text-green-600 font-semibold">{att.present}</td>
                        <td className="text-center text-red-600 font-semibold">{att.absent}</td>
                        <td className="text-center text-yellow-600 font-semibold">{att.late}</td>
                        <td className="text-right font-semibold">{att.rate}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
