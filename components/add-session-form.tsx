"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface AddSessionFormProps {
  onSuccess?: () => void
}

export function AddSessionForm({ onSuccess }: AddSessionFormProps) {
  const [formData, setFormData] = useState({
    classId: "1",
    trainerId: "3",
    subject: "",
    date: "",
    startTime: "",
    endTime: "",
    location: "",
    description: "",
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSuccess("")
    setLoading(true)

    try {
      const response = await fetch("/api/training-sessions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      const data = await response.json()
      if (data.success) {
        setSuccess("Session created successfully!")
        setFormData({
          classId: "1",
          trainerId: "3",
          subject: "",
          date: "",
          startTime: "",
          endTime: "",
          location: "",
          description: "",
        })
        onSuccess?.()
      } else {
        setError(data.message || "Failed to create session")
      }
    } catch (err) {
      setError("Failed to create session")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Schedule New Training Session</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">Subject</label>
              <Input
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                placeholder="Piano Fundamentals"
                required
              />
            </div>
            <div>
              <label className="text-sm font-medium">Class ID</label>
              <Input name="classId" value={formData.classId} onChange={handleChange} placeholder="1" />
            </div>
            <div>
              <label className="text-sm font-medium">Date</label>
              <Input name="date" type="date" value={formData.date} onChange={handleChange} required />
            </div>
            <div>
              <label className="text-sm font-medium">Location</label>
              <Input name="location" value={formData.location} onChange={handleChange} placeholder="Room 101" />
            </div>
            <div>
              <label className="text-sm font-medium">Start Time</label>
              <Input name="startTime" type="time" value={formData.startTime} onChange={handleChange} required />
            </div>
            <div>
              <label className="text-sm font-medium">End Time</label>
              <Input name="endTime" type="time" value={formData.endTime} onChange={handleChange} required />
            </div>
          </div>
          <div>
            <label className="text-sm font-medium">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Add session description..."
              className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground"
              rows={3}
            />
          </div>

          {error && <div className="p-3 bg-red-50 text-red-700 rounded-lg text-sm">{error}</div>}
          {success && <div className="p-3 bg-green-50 text-green-700 rounded-lg text-sm">{success}</div>}

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Creating..." : "Create Session"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
