"use client"

import { useState } from "react"
import { useAuth } from "@/hooks/use-auth"
import { Sidebar } from "@/components/sidebar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calendar, MapPin, Users, Music, Plus, Trash2, Check, Star } from "lucide-react"
import Link from "next/link"

interface Concert {
  id: string
  title: string
  date: string
  time: string
  location: string
  description: string
  performers: string[]
  genre: string
  ticketsAvailable: number
  ticketsSold: number
  createdBy: string
  createdByRole: string
  registeredUsers: string[]
  image?: string
}

export default function ConcertsPage() {
  const { user, isLoading } = useAuth()
  const [concerts, setConcerts] = useState<Concert[]>([
    {
      id: "1",
      title: "Classical Masterpiece Evening",
      date: "2025-12-20",
      time: "19:00",
      location: "Grand Concert Hall",
      description: "An evening of timeless classical compositions performed by our most talented musicians",
      performers: ["Sarah Johnson - Piano", "Michael Chen - Violin"],
      genre: "Classical",
      ticketsAvailable: 100,
      ticketsSold: 45,
      createdBy: "John Leader",
      createdByRole: "class-leader",
      registeredUsers: ["Jane Trainee"],
      image: "🎻",
    },
    {
      id: "2",
      title: "Jazz Night Extravaganza",
      date: "2025-12-25",
      time: "20:00",
      location: "Blue Note Studio",
      description: "Experience smooth jazz from our club's jazz ensemble and guest performers",
      performers: ["The Jazz Collective"],
      genre: "Jazz",
      ticketsAvailable: 75,
      ticketsSold: 28,
      createdBy: "Mike Davis",
      createdByRole: "trainer",
      registeredUsers: [],
      image: "🎷",
    },
    {
      id: "3",
      title: "New Year's Celebration Concert",
      date: "2025-12-31",
      time: "21:00",
      location: "Main Auditorium",
      description: "Ring in the new year with an spectacular concert featuring multiple genres",
      performers: ["Full Orchestra", "Special Guest Singers"],
      genre: "Mixed",
      ticketsAvailable: 200,
      ticketsSold: 120,
      createdBy: "Sarah Johnson",
      createdByRole: "club-leader",
      registeredUsers: ["Jane Trainee", "John Trainer", "Emma Student"],
      image: "🎼",
    },
  ])

  const [showCreateConcert, setShowCreateConcert] = useState(false)
  const [newConcert, setNewConcert] = useState({
    title: "",
    date: "",
    time: "",
    location: "",
    description: "",
    performers: "",
    genre: "Classical",
    ticketsAvailable: 100,
  })
  const [userRegisteredConcerts, setUserRegisteredConcerts] = useState<string[]>(["1"])

  if (isLoading || !user) return null

  const canCreateConcerts = ["club-leader", "department-leader", "class-leader", "trainer"].includes(user.role)
  const canRegisterConcerts = ["trainee", "guest"].includes(user.role)

  const createConcert = () => {
    if (!newConcert.title || !newConcert.date) return
    const concert: Concert = {
      id: String(concerts.length + 1),
      title: newConcert.title,
      date: newConcert.date,
      time: newConcert.time,
      location: newConcert.location,
      description: newConcert.description,
      performers: newConcert.performers
        .split(",")
        .map((p) => p.trim())
        .filter((p) => p),
      genre: newConcert.genre,
      ticketsAvailable: newConcert.ticketsAvailable,
      ticketsSold: 0,
      createdBy: user.fullName,
      createdByRole: user.role,
      registeredUsers: [],
    }
    setConcerts([...concerts, concert])
    setNewConcert({
      title: "",
      date: "",
      time: "",
      location: "",
      description: "",
      performers: "",
      genre: "Classical",
      ticketsAvailable: 100,
    })
    setShowCreateConcert(false)
  }

  const toggleConcertRegistration = (concertId: string) => {
    setUserRegisteredConcerts((prev) =>
      prev.includes(concertId) ? prev.filter((id) => id !== concertId) : [...prev, concertId],
    )
  }

  const deleteConcert = (concertId: string) => {
    setConcerts(concerts.filter((c) => c.id !== concertId))
  }

  const upcomingConcerts = concerts.filter((c) => new Date(c.date) > new Date())
  const pastConcerts = concerts.filter((c) => new Date(c.date) <= new Date())

  const genreColors: Record<string, string> = {
    Classical: "bg-blue-100 text-blue-800",
    Jazz: "bg-purple-100 text-purple-800",
    Mixed: "bg-green-100 text-green-800",
    Rock: "bg-red-100 text-red-800",
    Contemporary: "bg-orange-100 text-orange-800",
  }

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <main className="flex-1 overflow-auto md:pt-0 pt-16">
        <div className="p-4 md:p-6 max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <Music size={32} className="text-primary" />
                <div>
                  <h1 className="text-4xl font-bold">Club Concerts</h1>
                  <p className="text-sm text-muted-foreground mt-1">Discover and register for upcoming performances</p>
                </div>
              </div>
              {canCreateConcerts && (
                <Button onClick={() => setShowCreateConcert(!showCreateConcert)} className="gap-2">
                  <Plus size={18} />
                  Create Concert
                </Button>
              )}
            </div>
          </div>

          {/* Create Concert Form */}
          {showCreateConcert && canCreateConcerts && (
            <Card className="mb-8 border-2 border-primary">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Music size={20} />
                  Create New Concert
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <input
                  type="text"
                  placeholder="Concert Title"
                  value={newConcert.title}
                  onChange={(e) => setNewConcert({ ...newConcert, title: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    type="date"
                    value={newConcert.date}
                    onChange={(e) => setNewConcert({ ...newConcert, date: e.target.value })}
                    className="px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                  <input
                    type="time"
                    value={newConcert.time}
                    onChange={(e) => setNewConcert({ ...newConcert, time: e.target.value })}
                    className="px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <input
                  type="text"
                  placeholder="Location"
                  value={newConcert.location}
                  onChange={(e) => setNewConcert({ ...newConcert, location: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <textarea
                  placeholder="Concert Description"
                  value={newConcert.description}
                  onChange={(e) => setNewConcert({ ...newConcert, description: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  rows={3}
                />
                <input
                  type="text"
                  placeholder="Performers (comma separated)"
                  value={newConcert.performers}
                  onChange={(e) => setNewConcert({ ...newConcert, performers: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <select
                    value={newConcert.genre}
                    onChange={(e) => setNewConcert({ ...newConcert, genre: e.target.value })}
                    className="px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="Classical">Classical</option>
                    <option value="Jazz">Jazz</option>
                    <option value="Rock">Rock</option>
                    <option value="Contemporary">Contemporary</option>
                    <option value="Mixed">Mixed</option>
                  </select>
                  <input
                    type="number"
                    placeholder="Available Tickets"
                    value={newConcert.ticketsAvailable}
                    onChange={(e) =>
                      setNewConcert({ ...newConcert, ticketsAvailable: Number.parseInt(e.target.value) })
                    }
                    className="px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div className="flex gap-2">
                  <Button onClick={createConcert} className="flex-1">
                    Create Concert
                  </Button>
                  <Button onClick={() => setShowCreateConcert(false)} variant="outline" className="flex-1">
                    Cancel
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Upcoming Concerts Section */}
          {upcomingConcerts.length > 0 && (
            <div className="mb-12">
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <Calendar size={24} />
                Upcoming Concerts
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {upcomingConcerts.map((concert) => {
                  const isRegistered = userRegisteredConcerts.includes(concert.id)
                  const isFull = concert.ticketsSold >= concert.ticketsAvailable
                  const ticketsLeft = concert.ticketsAvailable - concert.ticketsSold

                  return (
                    <Card key={concert.id} className="hover:shadow-lg transition-shadow overflow-hidden">
                      <div className="bg-gradient-to-r from-blue-500 to-purple-500 p-4 text-white text-center text-3xl h-32 flex items-center justify-center">
                        {concert.image || "🎵"}
                      </div>
                      <CardHeader>
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1">
                            <CardTitle className="text-lg">{concert.title}</CardTitle>
                            <span
                              className={`inline-block text-xs font-semibold px-2 py-1 rounded mt-2 ${genreColors[concert.genre]}`}
                            >
                              {concert.genre}
                            </span>
                          </div>
                          {canCreateConcerts && (
                            <Button variant="ghost" size="icon" onClick={() => deleteConcert(concert.id)}>
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
                              {new Date(concert.date).toLocaleDateString()} at {concert.time}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <MapPin size={16} className="text-muted-foreground" />
                            <span>{concert.location}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <Users size={16} className="text-muted-foreground" />
                            <span>
                              {ticketsLeft} / {concert.ticketsAvailable} Tickets Available
                            </span>
                          </div>
                        </div>

                        {concert.performers.length > 0 && (
                          <div className="bg-accent rounded-lg p-3">
                            <h4 className="font-semibold text-sm mb-2 flex items-center gap-2">
                              <Star size={14} />
                              Featured Performers
                            </h4>
                            <ul className="text-xs space-y-1">
                              {concert.performers.map((performer, idx) => (
                                <li key={idx} className="text-muted-foreground">
                                  • {performer}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                        <p className="text-sm text-muted-foreground">{concert.description}</p>

                        {canRegisterConcerts && (
                          <Button
                            onClick={() => toggleConcertRegistration(concert.id)}
                            variant={isRegistered ? "default" : "outline"}
                            className="w-full gap-2"
                            disabled={!isRegistered && isFull}
                          >
                            {isRegistered ? (
                              <>
                                <Check size={16} />
                                You're Registered
                              </>
                            ) : isFull ? (
                              <>
                                <Users size={16} />
                                Sold Out
                              </>
                            ) : (
                              <>
                                <Plus size={16} />
                                Register Now
                              </>
                            )}
                          </Button>
                        )}
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            </div>
          )}

          {/* Past Concerts Section */}
          {pastConcerts.length > 0 && (
            <div>
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <Music size={24} />
                Past Concerts
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {pastConcerts.map((concert) => (
                  <Card key={concert.id} className="opacity-60">
                    <div className="bg-gradient-to-r from-gray-400 to-gray-500 p-4 text-white text-center text-3xl h-32 flex items-center justify-center">
                      {concert.image || "🎵"}
                    </div>
                    <CardHeader>
                      <div>
                        <CardTitle className="text-lg">{concert.title}</CardTitle>
                        <span className="text-xs text-muted-foreground block mt-1">Concert Completed</span>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm">
                          <Calendar size={16} className="text-muted-foreground" />
                          <span>
                            {new Date(concert.date).toLocaleDateString()} at {concert.time}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Users size={16} className="text-muted-foreground" />
                          <span>{concert.registeredUsers.length} Attended</span>
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground">Created by: {concert.createdBy}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Guest CTA */}
          {user.role === "guest" && (
            <Card className="mt-8 bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
              <CardHeader>
                <CardTitle>Join Our Music Community</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Create an account to register for concerts, participate in classes, and become part of our vibrant
                  music club.
                </p>
                <Link href="/">
                  <Button className="w-full">Sign In to Register</Button>
                </Link>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  )
}
