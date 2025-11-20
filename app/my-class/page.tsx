"use client"

import { useState } from "react"
import { useAuth } from "@/hooks/use-auth"
import { Sidebar } from "@/components/sidebar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Users, Calendar, Clock, BookOpen, ChevronDown } from "lucide-react"
import Link from "next/link"

interface Class {
  id: string
  name: string
  leader: string
  level: string
  attendance: string
  schedule: string
  location: string
  members: number
  description: string
}

export default function MyClassPage() {
  const { user, isLoading } = useAuth()
  const [expandedClass, setExpandedClass] = useState<string | null>(null)

  const userClasses: Class[] = [
    {
      id: "1",
      name: "Piano Basics",
      leader: "Sarah Johnson",
      level: "Beginner",
      attendance: "94%",
      schedule: "Mon & Wed, 3:00 PM",
      location: "Room 101",
      members: 28,
      description: "Learn the fundamentals of piano playing from the basics to intermediate level",
    },
    {
      id: "2",
      name: "Music Theory",
      leader: "Mike Thompson",
      level: "Intermediate",
      attendance: "88%",
      schedule: "Tue & Thu, 4:00 PM",
      location: "Room 105",
      members: 22,
      description: "Understanding music theory concepts and applications",
    },
  ]

  if (isLoading || !user) return null

  const canView = ["trainee", "class-leader", "trainer", "department-leader", "club-leader"].includes(user.role)

  if (!canView) {
    return (
      <div className="flex h-screen bg-background">
        <Sidebar />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold">Access Denied</h1>
            <p className="text-muted-foreground">This page is only available to class members and leaders</p>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <main className="flex-1 overflow-auto md:pt-0 pt-16">
        <div className="p-4 md:p-6 max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">My Classes</h1>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Classes List */}
            <div className="lg:col-span-2 space-y-4">
              {userClasses.map((cls) => (
                <Card key={cls.id} className="overflow-hidden">
                  <CardHeader
                    className="cursor-pointer hover:bg-accent transition"
                    onClick={() => setExpandedClass(expandedClass === cls.id ? null : cls.id)}
                  >
                    <CardTitle className="flex items-center justify-between">
                      <div>
                        <p>{cls.name}</p>
                        <p className="text-xs text-muted-foreground font-normal mt-1">{cls.level}</p>
                      </div>
                      <ChevronDown size={20} className={`transition ${expandedClass === cls.id ? "rotate-180" : ""}`} />
                    </CardTitle>
                  </CardHeader>

                  {expandedClass === cls.id && (
                    <CardContent className="space-y-4 border-t pt-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-xs text-muted-foreground">Class Leader</p>
                          <p className="font-semibold">{cls.leader}</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Schedule</p>
                          <p className="font-semibold text-sm">{cls.schedule}</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Location</p>
                          <p className="font-semibold text-sm">{cls.location}</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Your Attendance</p>
                          <p className="font-semibold text-green-600">{cls.attendance}</p>
                        </div>
                      </div>

                      <div>
                        <p className="text-sm text-muted-foreground mb-2">Description</p>
                        <p className="text-sm">{cls.description}</p>
                      </div>

                      {/* Quick Stats */}
                      <div className="grid grid-cols-3 gap-2 p-3 bg-accent rounded-lg">
                        <div className="text-center">
                          <p className="text-xs text-muted-foreground">Members</p>
                          <p className="font-semibold">{cls.members}</p>
                        </div>
                        <div className="text-center border-l border-r">
                          <p className="text-xs text-muted-foreground">Sessions</p>
                          <p className="font-semibold">8</p>
                        </div>
                        <div className="text-center">
                          <p className="text-xs text-muted-foreground">Materials</p>
                          <p className="font-semibold">5</p>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex gap-2 pt-2">
                        <Link href={`/classes/${cls.id}`} className="flex-1">
                          <Button className="w-full gap-2">
                            <Calendar size={16} />
                            View Sessions & Homework
                          </Button>
                        </Link>
                        <Button variant="outline" className="flex-1 gap-2 bg-transparent">
                          <Users size={16} />
                          Members
                        </Button>
                      </div>
                    </CardContent>
                  )}
                </Card>
              ))}
            </div>

            {/* Summary Statistics */}
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <BookOpen className="text-blue-600" size={20} />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Total Classes</p>
                      <p className="font-semibold">{userClasses.length}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <Calendar className="text-green-600" size={20} />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Avg Attendance</p>
                      <p className="font-semibold">91%</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-purple-100 rounded-lg">
                      <Clock className="text-purple-600" size={20} />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Pending Homework</p>
                      <p className="font-semibold">2</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Access to Library */}
              <Card>
                <CardHeader>
                  <CardTitle>Quick Links</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Link href="/library" className="block">
                    <Button variant="outline" className="w-full justify-start gap-2 bg-transparent">
                      <BookOpen size={16} />
                      Learning Library
                    </Button>
                  </Link>
                  <Link href="/events" className="block">
                    <Button variant="outline" className="w-full justify-start gap-2 bg-transparent">
                      <Calendar size={16} />
                      Events
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
