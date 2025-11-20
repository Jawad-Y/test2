"use client"

import { useState } from "react"
import { useAuth } from "@/hooks/use-auth"
import { Sidebar } from "@/components/sidebar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Clock, Users, BookOpen, CheckCircle } from "lucide-react"
import Link from "next/link"

interface Session {
  id: string
  date: string
  time: string
  topic: string
  trainer: string
  location: string
  homework: Homework[]
}

interface Homework {
  id: string
  title: string
  description: string
  dueDate: string
  submitted: boolean
}

export default function ClassDetailPage({ params }: { params: { id: string } }) {
  const { user, isLoading } = useAuth()
  const [sessions, setSessions] = useState<Session[]>([
    {
      id: "1",
      date: "2025-01-15",
      time: "3:00 PM",
      topic: "Piano Scales & Arpeggios",
      trainer: "John Trainer",
      location: "Room 101",
      homework: [
        {
          id: "h1",
          title: "Practice C Major Scale",
          description: "Practice C major scale with both hands for 30 minutes daily",
          dueDate: "2025-01-18",
          submitted: true,
        },
        {
          id: "h2",
          title: "Arpeggio Exercises",
          description: "Complete exercises from page 45 in the workbook",
          dueDate: "2025-01-20",
          submitted: false,
        },
      ],
    },
    {
      id: "2",
      date: "2025-01-17",
      time: "3:00 PM",
      topic: "Chord Progressions",
      trainer: "John Trainer",
      location: "Room 101",
      homework: [
        {
          id: "h3",
          title: "Common Chord Progressions",
          description: "Learn and practice the I-IV-V progression",
          dueDate: "2025-01-21",
          submitted: false,
        },
      ],
    },
  ])
  const [expandedSession, setExpandedSession] = useState<string | null>(null)
  const [showAddSession, setShowAddSession] = useState(false)
  const [newSession, setNewSession] = useState({
    date: "",
    time: "",
    topic: "",
    location: "",
  })

  if (isLoading || !user) return null

  const classInfo = {
    id: params.id,
    name: "Piano Basics",
    leader: "Sarah Johnson",
    department: "Music",
    level: "Beginner",
    members: 28,
    description: "Learn the fundamentals of piano playing",
  }

  const canAddSession = ["club-leader", "department-leader", "class-leader", "trainer"].includes(user.role)

  const submitHomework = (sessionId: string, homeworkId: string) => {
    setSessions(
      sessions.map((s) =>
        s.id === sessionId
          ? {
              ...s,
              homework: s.homework.map((h) => (h.id === homeworkId ? { ...h, submitted: true } : h)),
            }
          : s,
      ),
    )
  }

  const addSession = () => {
    if (!newSession.date || !newSession.time || !newSession.topic) return
    setSessions([
      ...sessions,
      {
        id: `session-${Date.now()}`,
        date: newSession.date,
        time: newSession.time,
        topic: newSession.topic,
        trainer: user?.fullName || "Trainer",
        location: newSession.location || "TBD",
        homework: [],
      },
    ])
    setNewSession({ date: "", time: "", topic: "", location: "" })
    setShowAddSession(false)
  }

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <main className="flex-1 overflow-auto md:pt-0 pt-16">
        <div className="p-4 md:p-6 max-w-7xl mx-auto">
          <Link href="/classes">
            <Button variant="outline" size="sm" className="mb-4 gap-2 bg-transparent">
              <ArrowLeft size={16} />
              Back to Classes
            </Button>
          </Link>

          {/* Class Header */}
          <Card className="mb-6">
            <CardContent className="pt-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h1 className="text-3xl font-bold mb-2">{classInfo.name}</h1>
                  <p className="text-muted-foreground mb-4">{classInfo.description}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t">
                <div>
                  <p className="text-xs text-muted-foreground">Class Leader</p>
                  <p className="font-semibold">{classInfo.leader}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Level</p>
                  <p className="font-semibold">{classInfo.level}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Department</p>
                  <p className="font-semibold">{classInfo.department}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Members</p>
                  <p className="font-semibold">{classInfo.members}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Training Sessions</h2>
            {canAddSession && (
              <Button onClick={() => setShowAddSession(!showAddSession)} className="gap-2">
                <Clock size={16} />
                Add Session
              </Button>
            )}
          </div>

          {showAddSession && canAddSession && (
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Create New Session</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-semibold mb-2 block">Date</label>
                    <input
                      type="date"
                      value={newSession.date}
                      onChange={(e) => setNewSession({ ...newSession, date: e.target.value })}
                      className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-semibold mb-2 block">Time</label>
                    <input
                      type="time"
                      value={newSession.time}
                      onChange={(e) => setNewSession({ ...newSession, time: e.target.value })}
                      className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-semibold mb-2 block">Topic</label>
                  <input
                    type="text"
                    placeholder="e.g., Piano Scales & Arpeggios"
                    value={newSession.topic}
                    onChange={(e) => setNewSession({ ...newSession, topic: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="text-sm font-semibold mb-2 block">Location</label>
                  <input
                    type="text"
                    placeholder="e.g., Room 101"
                    value={newSession.location}
                    onChange={(e) => setNewSession({ ...newSession, location: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div className="flex gap-2">
                  <Button onClick={addSession} className="flex-1">
                    Create Session
                  </Button>
                  <Button onClick={() => setShowAddSession(false)} variant="outline" className="flex-1">
                    Cancel
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Sessions List */}
          <div className="space-y-4">
            {sessions.map((session) => (
              <Card
                key={session.id}
                className="cursor-pointer transition hover:shadow-md"
                onClick={() => setExpandedSession(expandedSession === session.id ? null : session.id)}
              >
                <CardHeader>
                  <CardTitle className="flex items-start justify-between">
                    <div>
                      <p>{session.topic}</p>
                      <p className="text-xs text-muted-foreground font-normal mt-1">
                        {session.date} at {session.time}
                      </p>
                    </div>
                    <span className="text-lg">{expandedSession === session.id ? "▼" : "▶"}</span>
                  </CardTitle>
                </CardHeader>

                {expandedSession === session.id && (
                  <CardContent className="space-y-4 border-t pt-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex items-center gap-2">
                        <Clock size={16} className="text-muted-foreground" />
                        <span className="text-sm">
                          {session.time} - {session.location}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users size={16} className="text-muted-foreground" />
                        <span className="text-sm">Trainer: {session.trainer}</span>
                      </div>
                    </div>

                    {/* Homework Section */}
                    {session.homework.length > 0 && (
                      <div className="border-t pt-4">
                        <h4 className="font-semibold mb-3 flex items-center gap-2">
                          <BookOpen size={16} />
                          Homework
                        </h4>
                        <div className="space-y-3">
                          {session.homework.map((hw) => (
                            <div key={hw.id} className="p-3 bg-accent rounded-lg">
                              <div className="flex items-start justify-between mb-2">
                                <div className="flex-1">
                                  <p className="font-semibold text-sm">{hw.title}</p>
                                  <p className="text-xs text-muted-foreground mt-1">{hw.description}</p>
                                  <p className="text-xs text-muted-foreground mt-2">Due: {hw.dueDate}</p>
                                </div>
                                <span
                                  className={`text-xs font-semibold px-2 py-1 rounded-full ${
                                    hw.submitted ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
                                  }`}
                                >
                                  {hw.submitted ? "Submitted" : "Pending"}
                                </span>
                              </div>
                              {!hw.submitted && user?.role === "trainee" && (
                                <Button
                                  onClick={() => submitHomework(session.id, hw.id)}
                                  size="sm"
                                  className="w-full mt-2 gap-1"
                                >
                                  <CheckCircle size={14} />
                                  Submit Homework
                                </Button>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                )}
              </Card>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}
