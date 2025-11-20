"use client"

import { useState } from "react"
import { useAuth } from "@/hooks/use-auth"
import { Sidebar } from "@/components/sidebar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calendar, MapPin, Users, Check, Plus, Trash2 } from "lucide-react"
import Link from "next/link"

interface Event {
  id: string
  title: string
  date: string
  time: string
  location: string
  description: string
  createdBy: string
  attendees: string[]
  maxAttendees?: number
}

export default function EventsPage() {
  const { user, isLoading } = useAuth()
  const [events, setEvents] = useState<Event[]>([
    {
      id: "1",
      title: "Annual Recital",
      date: "2025-12-15",
      time: "19:00",
      location: "Main Hall",
      description: "Showcase your skills in front of audience",
      createdBy: "Sarah Johnson",
      attendees: ["Jane Trainee"],
      maxAttendees: 50,
    },
    {
      id: "2",
      title: "Instrument Workshop",
      date: "2025-12-20",
      time: "14:00",
      location: "Room 201",
      description: "Learn advanced techniques from experienced trainers",
      createdBy: "John Trainer",
      attendees: [],
      maxAttendees: 20,
    },
    {
      id: "3",
      title: "Jazz Jam Session",
      date: "2025-12-10",
      time: "18:00",
      location: "Studio A",
      description: "Collaborative jam session for intermediate to advanced musicians",
      createdBy: "Mike Davis",
      attendees: ["Jane Trainee", "John Trainer"],
      maxAttendees: 15,
    },
  ])
  const [showNewEvent, setShowNewEvent] = useState(false)
  const [newEvent, setNewEvent] = useState({
    title: "",
    date: "",
    time: "",
    location: "",
    description: "",
  })
  const [userRegisteredEvents, setUserRegisteredEvents] = useState<string[]>(["1"])

  if (isLoading || !user) return null

  const canCreateEvents = ["club-leader", "department-leader", "class-leader", "trainer"].includes(user.role)
  const canRegisterEvents = ["trainee", "guest"].includes(user.role)

  const createEvent = () => {
    if (!newEvent.title || !newEvent.date) return
    const event: Event = {
      id: String(events.length + 1),
      ...newEvent,
      createdBy: user.fullName,
      attendees: [],
    }
    setEvents([...events, event])
    setNewEvent({ title: "", date: "", time: "", location: "", description: "" })
    setShowNewEvent(false)
  }

  const toggleEventRegistration = (eventId: string) => {
    setUserRegisteredEvents((prev) =>
      prev.includes(eventId) ? prev.filter((id) => id !== eventId) : [...prev, eventId],
    )
  }

  const deleteEvent = (eventId: string) => {
    setEvents(events.filter((e) => e.id !== eventId))
  }

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <main className="flex-1 overflow-auto md:pt-0 pt-16">
        <div className="p-4 md:p-6 max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold">Events</h1>
            {canCreateEvents && (
              <Button onClick={() => setShowNewEvent(!showNewEvent)} className="gap-2">
                <Plus size={16} />
                Create Event
              </Button>
            )}
          </div>

          {/* Create Event Form */}
          {showNewEvent && canCreateEvents && (
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Create New Event</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <input
                  type="text"
                  placeholder="Event Title"
                  value={newEvent.title}
                  onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="date"
                    value={newEvent.date}
                    onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
                    className="px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                  <input
                    type="time"
                    value={newEvent.time}
                    onChange={(e) => setNewEvent({ ...newEvent, time: e.target.value })}
                    className="px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <input
                  type="text"
                  placeholder="Location"
                  value={newEvent.location}
                  onChange={(e) => setNewEvent({ ...newEvent, location: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <textarea
                  placeholder="Description"
                  value={newEvent.description}
                  onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  rows={3}
                />
                <div className="flex gap-2">
                  <Button onClick={createEvent} className="flex-1">
                    Create Event
                  </Button>
                  <Button onClick={() => setShowNewEvent(false)} variant="outline" className="flex-1">
                    Cancel
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Events Schedule Header */}
          <div className="mb-6 p-4 bg-accent rounded-lg">
            <h2 className="font-semibold text-sm mb-2">Events Calendar</h2>
            <p className="text-sm text-muted-foreground">
              {events.length} events scheduled •{" "}
              {events.length - events.filter((e) => new Date(e.date) < new Date()).length} upcoming
            </p>
          </div>

          {/* Events List */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {events.map((event) => {
              const isRegistered = userRegisteredEvents.includes(event.id)
              const isFull = !!(event.maxAttendees && event.attendees.length >= event.maxAttendees)
              const eventDate = new Date(event.date)
              const isUpcoming = eventDate > new Date()

              return (
                <Card key={event.id} className={!isUpcoming ? "opacity-60" : ""}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg">{event.title}</CardTitle>
                        {!isUpcoming && <span className="text-xs text-muted-foreground">Past Event</span>}
                      </div>
                      {canCreateEvents && (
                        <Button variant="ghost" size="icon" onClick={() => deleteEvent(event.id)}>
                          <Trash2 size={16} className="text-red-500" />
                        </Button>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm">
                        <Calendar size={16} className="text-muted-foreground" />
                        <span>
                          {new Date(event.date).toLocaleDateString()} at {event.time}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <MapPin size={16} className="text-muted-foreground" />
                        <span>{event.location}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Users size={16} className="text-muted-foreground" />
                        <span>
                          {event.attendees.length}
                          {event.maxAttendees ? `/${event.maxAttendees}` : ""} Registered
                        </span>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground">{event.description}</p>
                    <p className="text-xs text-muted-foreground">Created by: {event.createdBy}</p>

                    {canRegisterEvents && isUpcoming && (
                      <Button
                        onClick={() => toggleEventRegistration(event.id)}
                        variant={isRegistered ? "default" : "outline"}
                        className="w-full gap-2"
                        disabled={!isRegistered && isFull}
                      >
                        {isRegistered ? (
                          <>
                            <Check size={16} />
                            Registered
                          </>
                        ) : isFull ? (
                          <>
                            <Users size={16} />
                            Event Full
                          </>
                        ) : (
                          <>
                            <Plus size={16} />
                            Register Event
                          </>
                        )}
                      </Button>
                    )}

                    {canRegisterEvents && !isUpcoming && (
                      <div className="text-xs text-center text-muted-foreground py-2">
                        This event has already occurred
                      </div>
                    )}
                  </CardContent>
                </Card>
              )
            })}
          </div>

          {/* Guest CTA */}
          {user.role === "guest" && (
            <Card className="mt-8 bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
              <CardHeader>
                <CardTitle>Interested in Joining Our Club?</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Create an account to enroll in classes and unlock full access to our training programs.
                </p>
                <Link href="/">
                  <Button className="w-full">Sign Up Now</Button>
                </Link>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  )
}
