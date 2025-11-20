"use client"

import { useState, useMemo } from "react"
import { useAuth } from "@/hooks/use-auth"
import { Sidebar } from "@/components/sidebar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { BookOpen, FileText, Music, Download, Search, Upload } from "lucide-react"

interface Material {
  id: number
  title: string
  type: "PDF" | "Video" | "Audio"
  uploadedBy: string
  size: string
  instrument: string
  date: string
  description: string
}

export default function LibraryPage() {
  const { user, isLoading } = useAuth()
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedInstrument, setSelectedInstrument] = useState<string | null>(null)
  const [sortBy, setSortBy] = useState<"date" | "title" | "uploader">("date")
  const [showUpload, setShowUpload] = useState(false)

  const materials: Material[] = [
    {
      id: 1,
      title: "Piano Fundamentals Guide",
      type: "PDF",
      uploadedBy: "John Trainer",
      size: "2.4 MB",
      instrument: "Piano",
      date: "2025-01-10",
      description: "Complete guide to piano playing basics",
    },
    {
      id: 2,
      title: "Basic Chords Tutorial",
      type: "Video",
      uploadedBy: "John Trainer",
      size: "156 MB",
      instrument: "Piano",
      date: "2025-01-09",
      description: "Video tutorial on basic chord progressions",
    },
    {
      id: 3,
      title: "Guitar Techniques",
      type: "PDF",
      uploadedBy: "Sarah Johnson",
      size: "1.8 MB",
      instrument: "Guitar",
      date: "2025-01-08",
      description: "Essential guitar playing techniques",
    },
    {
      id: 4,
      title: "Practice Sheets - Week 1",
      type: "PDF",
      uploadedBy: "Sarah Johnson",
      size: "1.2 MB",
      instrument: "Piano",
      date: "2025-01-07",
      description: "Weekly practice sheets for piano students",
    },
    {
      id: 5,
      title: "Performance Recording",
      type: "Audio",
      uploadedBy: "John Trainer",
      size: "45 MB",
      instrument: "Piano",
      date: "2025-01-06",
      description: "Professional performance recording example",
    },
    {
      id: 6,
      title: "Violin Basics",
      type: "Video",
      uploadedBy: "Mike Thompson",
      size: "234 MB",
      instrument: "Violin",
      date: "2025-01-05",
      description: "Introduction to violin playing",
    },
  ]

  const instruments = Array.from(new Set(materials.map((m) => m.instrument)))

  const filteredMaterials = useMemo(() => {
    let filtered = materials

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(
        (m) =>
          m.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          m.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          m.uploadedBy.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    // Filter by instrument
    if (selectedInstrument) {
      filtered = filtered.filter((m) => m.instrument === selectedInstrument)
    }

    // Filter for trainees - only their instrument materials
    if (user?.role === "trainee") {
      filtered = filtered.filter((m) => m.instrument === "Piano") // Would be user's assigned instrument
    }

    // Sort
    const sorted = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case "title":
          return a.title.localeCompare(b.title)
        case "uploader":
          return a.uploadedBy.localeCompare(b.uploadedBy)
        case "date":
        default:
          return new Date(b.date).getTime() - new Date(a.date).getTime()
      }
    })

    return sorted
  }, [searchTerm, selectedInstrument, sortBy, user?.role])

  const getFileIcon = (type: string) => {
    switch (type) {
      case "PDF":
        return <FileText className="text-red-600" size={20} />
      case "Video":
        return <Music className="text-blue-600" size={20} />
      case "Audio":
        return <Music className="text-purple-600" size={20} />
      default:
        return <BookOpen size={20} />
    }
  }

  if (isLoading || !user) return null

  const canUpload = ["trainer", "class-leader", "department-leader", "club-leader"].includes(user.role)

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <main className="flex-1 overflow-auto md:pt-0 pt-16">
        <div className="p-4 md:p-6 max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold">Learning Library</h1>
            {canUpload && (
              <Button onClick={() => setShowUpload(!showUpload)} className="gap-2">
                <Upload size={16} />
                Upload Material
              </Button>
            )}
          </div>

          {/* Upload Section */}
          {showUpload && canUpload && (
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Upload New Material</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
                  <BookOpen className="mx-auto text-muted-foreground mb-2" size={32} />
                  <p className="text-sm font-medium mb-2">Drop files here or click to upload</p>
                  <p className="text-xs text-muted-foreground mb-4">PDF, Video, or Audio files (max 500MB)</p>
                  <Button>Choose File</Button>
                </div>
              </CardContent>
            </Card>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            {/* Search */}
            <div className="relative md:col-span-2">
              <Search className="absolute left-3 top-3 text-muted-foreground" size={18} />
              <input
                type="text"
                placeholder="Search materials by title, description, or uploader..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            {/* Filters */}
            <div className="flex gap-2">
              <select
                value={selectedInstrument || ""}
                onChange={(e) => setSelectedInstrument(e.target.value || null)}
                className="flex-1 px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary bg-background"
              >
                <option value="">All Instruments</option>
                {instruments.map((inst) => (
                  <option key={inst} value={inst}>
                    {inst}
                  </option>
                ))}
              </select>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as "date" | "title" | "uploader")}
                className="flex-1 px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary bg-background"
              >
                <option value="date">Newest</option>
                <option value="title">Title A-Z</option>
                <option value="uploader">Uploader</option>
              </select>
            </div>
          </div>

          {/* Materials List */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen size={24} />
                Course Materials ({filteredMaterials.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {filteredMaterials.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">No materials found matching your criteria</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {filteredMaterials.map((material) => (
                    <div
                      key={material.id}
                      className="flex items-start justify-between p-4 border rounded-lg hover:bg-accent transition"
                    >
                      <div className="flex items-start gap-3 flex-1">
                        {getFileIcon(material.type)}
                        <div className="flex-1">
                          <h4 className="font-semibold text-sm">{material.title}</h4>
                          <p className="text-xs text-muted-foreground mt-1">{material.description}</p>
                          <div className="flex gap-4 text-xs text-muted-foreground mt-2 flex-wrap">
                            <span className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded">{material.instrument}</span>
                            <span>{material.type}</span>
                            <span>{material.size}</span>
                            <span>by {material.uploadedBy}</span>
                            <span>{new Date(material.date).toLocaleDateString()}</span>
                          </div>
                        </div>
                      </div>
                      <Button variant="outline" size="sm" className="gap-1 flex-shrink-0 ml-2 bg-transparent">
                        <Download size={16} />
                        <span className="hidden sm:inline">Download</span>
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
