"use client"

import { useAuth } from "@/hooks/use-auth"
import { Sidebar } from "@/components/sidebar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { Music, Users, Calendar, Award } from "lucide-react"

export default function GuestPage() {
  const { user, isLoading } = useAuth()
  const router = useRouter()

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!user || user.role !== "guest") {
    return null
  }

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <main className="flex-1 overflow-auto md:pt-0 pt-16">
        <div className="p-4 md:p-6 max-w-7xl mx-auto">
          {/* Hero Section */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg p-8 mb-8 text-white">
            <h1 className="text-4xl font-bold mb-2">Welcome to Our Music Club</h1>
            <p className="text-lg opacity-90">Discover musical excellence, join our community, and grow your talent</p>
          </div>

          {/* Club Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <Music className="text-blue-500" size={18} />
                  Instruments
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">7</p>
                <p className="text-xs text-muted-foreground">Piano, Guitar, Violin, Drums, Bass, Flute, Saxophone</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <Users className="text-green-500" size={18} />
                  Members
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">150+</p>
                <p className="text-xs text-muted-foreground">Active members from all levels</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <Calendar className="text-purple-500" size={18} />
                  Classes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">12</p>
                <p className="text-xs text-muted-foreground">Weekly classes for all skill levels</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <Award className="text-amber-500" size={18} />
                  Events
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">8/year</p>
                <p className="text-xs text-muted-foreground">Recitals, workshops, competitions</p>
              </CardContent>
            </Card>
          </div>

          {/* About Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <Card>
              <CardHeader>
                <CardTitle>About Us</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Our music club is dedicated to fostering musical talent and building a vibrant community of musicians.
                  With experienced trainers and state-of-the-art facilities, we offer comprehensive training across
                  multiple instruments.
                </p>
                <p className="text-sm text-muted-foreground">
                  Whether you are a beginner exploring music for the first time or an advanced musician refining your
                  craft, we have classes and programs designed to meet your needs.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Why Join Us?</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <span className="text-blue-500 font-bold">✓</span>
                    <span>Expert trainers with years of experience</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-500 font-bold">✓</span>
                    <span>Small class sizes for personalized attention</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-500 font-bold">✓</span>
                    <span>Access to quality instruments and resources</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-500 font-bold">✓</span>
                    <span>Performance opportunities throughout the year</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-500 font-bold">✓</span>
                    <span>Supportive community of musicians</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>

          {/* Instruments Section */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Our Instruments</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {["Piano", "Guitar", "Violin", "Drums", "Bass", "Flute", "Saxophone", "Vocals"].map((instrument) => (
                  <div key={instrument} className="p-4 bg-accent rounded-lg text-center">
                    <p className="font-medium text-sm">{instrument}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* CTA Section */}
          <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
            <CardHeader>
              <CardTitle>Ready to Join?</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Browse our upcoming events and see what the club offers. Sign in to register for classes and events.
              </p>
              <div className="flex gap-4">
                <Button onClick={() => router.push("/events")} className="flex-1">
                  View Events Schedule
                </Button>
                <Button onClick={() => router.push("/")} variant="outline" className="flex-1">
                  Sign In to Join
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
