"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calendar, Clock, MapPin, User } from "lucide-react"

interface TrainingSession {
  id: string
  classId: string
  trainerId: string
  subject: string
  date: string
  startTime: string
  endTime: string
  location?: string
  description?: string
}

export function SessionList() {
  const [sessions, setSessions] = useState<TrainingSession[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchSessions()
  }, [])

  const fetchSessions = async () => {
    try {
      const response = await fetch("/api/training-sessions")
      const data = await response.json()
      if (data.success) {
        setSessions(data.data)
      }
    } catch (error) {
      console.error("Failed to fetch sessions", error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div className="text-center py-8">Loading sessions...</div>
  }

  return (
    <div className="space-y-4">
      {sessions.map((session) => (
        <Card key={session.id}>
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="flex-1">
                <h3 className="text-lg font-semibold mb-3">{session.subject}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Calendar size={16} />
                    {new Date(session.date).toLocaleDateString()}
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Clock size={16} />
                    {session.startTime} - {session.endTime}
                  </div>
                  {session.location && (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <MapPin size={16} />
                      {session.location}
                    </div>
                  )}
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <User size={16} />
                    Trainer ID: {session.trainerId}
                  </div>
                </div>
                {session.description && <p className="text-sm text-muted-foreground mt-3">{session.description}</p>}
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  View Details
                </Button>
                <Button size="sm">Mark Attendance</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}

      {sessions.length === 0 && (
        <Card>
          <CardContent className="p-8 text-center text-muted-foreground">No training sessions scheduled</CardContent>
        </Card>
      )}
    </div>
  )
}
