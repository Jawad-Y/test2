"use client"

import { useAuth } from "@/hooks/use-auth"
import { Sidebar } from "@/components/sidebar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { Calendar, FileText, Plus, X } from "lucide-react"

interface Session {
  id: string
  classId: string
  className: string
  subject: string
  date: string
  startTime: string
  endTime: string
  location: string
  homeworks: Homework[]
}

interface Homework {
  id: string
  title: string
  description: string
  dueDate: string
  submittedBy: string[]
}

export default function SessionsPage() {
  const { user, isLoading } = useAuth()
  const [selectedSession, setSelectedSession] = useState<string | null>(null)
  const [showAddHomework, setShowAddHomework] = useState(false)
  const [sessions, setSessions] = useState<Session[]>([
    {
      id: "1",
      classId: "1",
      className: "Piano Basics",
      subject: "Chord Theory",
      date: "2025-11-25",
      startTime: "10:00",
      endTime: "11:30",
      location: "Room 101",
      homeworks: [
        {
          id: "h1",
          title: "Practice Scales",
          description: "Practice C Major scale 30 times",
          dueDate: "2025-11-27",
          submittedBy: ["Jane Trainee"],
        },
      ],
    },
    {
      id: "2",
      classId: "2",
      className: "Guitar Intermediate",
      subject: "Finger Techniques",
      date: "2025-11-26",
      startTime: "14:00",
      endTime: "15:30",
      location: "Room 202",
      homeworks: [],
    },
  ])
  const [newHomework, setNewHomework] = useState({
    title: "",
    description: "",
    dueDate: "",
  })

  if (isLoading || !user) return null

  const isTrainer = user.role === "trainer"
  const isTrainee = user.role === "trainee"

  const addHomework = (sessionId: string) => {
    if (!newHomework.title || !newHomework.dueDate) return
    setSessions(
      sessions.map((s) =>
        s.id === sessionId
          ? {
              ...s,
              homeworks: [
                ...s.homeworks,
                {
                  id: String(s.homeworks.length + 1),
                  ...newHomework,
                  submittedBy: [],
                },
              ],
            }
          : s,
      ),
    )
    setNewHomework({ title: "", description: "", dueDate: "" })
    setShowAddHomework(false)
  }

  const removeHomework = (sessionId: string, homeworkId: string) => {
    setSessions(
      sessions.map((s) =>
        s.id === sessionId
          ? {
              ...s,
              homeworks: s.homeworks.filter((h) => h.id !== homeworkId),
            }
          : s,
      ),
    )
  }

  const submitHomework = (sessionId: string, homeworkId: string) => {
    setSessions(
      sessions.map((s) =>
        s.id === sessionId
          ? {
              ...s,
              homeworks: s.homeworks.map((h) =>
                h.id === homeworkId && !h.submittedBy.includes(user.fullName)
                  ? { ...h, submittedBy: [...h.submittedBy, user.fullName] }
                  : h,
              ),
            }
          : s,
      ),
    )
  }

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <main className="flex-1 overflow-auto md:pt-0 pt-16">
        <div className="p-4 md:p-6 max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">Training Sessions</h1>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Sessions List */}
            <div className="lg:col-span-2 space-y-4">
              {sessions.map((session) => (
                <Card
                  key={session.id}
                  className={`cursor-pointer transition ${selectedSession === session.id ? "ring-2 ring-primary" : ""}`}
                  onClick={() => setSelectedSession(session.id)}
                >
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg">{session.subject}</CardTitle>
                        <p className="text-sm text-muted-foreground mt-1">{session.className}</p>
                      </div>
                      <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                        {session.homeworks.length} HW
                      </span>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div className="flex items-center gap-2">
                        <Calendar size={16} className="text-muted-foreground" />
                        <span>{session.date}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">
                          {session.startTime} - {session.endTime}
                        </span>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground">{session.location}</p>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Session Details & Homework */}
            {selectedSession && (
              <Card className="h-fit">
                <CardHeader>
                  <CardTitle className="text-lg">Homeworks</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {isTrainer &&
                    (!showAddHomework ? (
                      <Button onClick={() => setShowAddHomework(true)} className="w-full gap-2">
                        <Plus size={16} />
                        Add Homework
                      </Button>
                    ) : (
                      <div className="space-y-3 border rounded-lg p-3">
                        <input
                          type="text"
                          placeholder="Homework Title"
                          value={newHomework.title}
                          onChange={(e) => setNewHomework({ ...newHomework, title: e.target.value })}
                          className="w-full px-3 py-2 border rounded text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                        <textarea
                          placeholder="Description"
                          value={newHomework.description}
                          onChange={(e) =>
                            setNewHomework({
                              ...newHomework,
                              description: e.target.value,
                            })
                          }
                          className="w-full px-3 py-2 border rounded text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                          rows={2}
                        />
                        <input
                          type="date"
                          value={newHomework.dueDate}
                          onChange={(e) => setNewHomework({ ...newHomework, dueDate: e.target.value })}
                          className="w-full px-3 py-2 border rounded text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                        <div className="flex gap-2">
                          <Button onClick={() => addHomework(selectedSession)} size="sm" className="flex-1">
                            Add
                          </Button>
                          <Button
                            onClick={() => setShowAddHomework(false)}
                            variant="outline"
                            size="sm"
                            className="flex-1"
                          >
                            Cancel
                          </Button>
                        </div>
                      </div>
                    ))}

                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {sessions
                      .find((s) => s.id === selectedSession)
                      ?.homeworks.map((hw) => (
                        <div key={hw.id} className="p-3 bg-accent rounded-lg border">
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <FileText size={16} className="text-primary" />
                                <p className="font-semibold text-sm">{hw.title}</p>
                              </div>
                              <p className="text-xs text-muted-foreground mt-1">{hw.description}</p>
                              <p className="text-xs text-muted-foreground mt-1">Due: {hw.dueDate}</p>
                              <p className="text-xs text-green-600 mt-1">Submitted: {hw.submittedBy.length}</p>
                            </div>
                            <div className="flex gap-1">
                              {isTrainee && !hw.submittedBy.includes(user.fullName) && (
                                <Button
                                  onClick={() => submitHomework(selectedSession, hw.id)}
                                  size="sm"
                                  variant="outline"
                                >
                                  Submit
                                </Button>
                              )}
                              {isTrainee && hw.submittedBy.includes(user.fullName) && (
                                <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">Submitted</span>
                              )}
                              {isTrainer && (
                                <button
                                  onClick={() => removeHomework(selectedSession, hw.id)}
                                  className="text-red-600 hover:text-red-800"
                                >
                                  <X size={16} />
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
