"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface AddInstrumentFormProps {
  onSuccess?: () => void
}

export function AddInstrumentForm({ onSuccess }: AddInstrumentFormProps) {
  const [formData, setFormData] = useState({
    name: "",
    type: "",
    uniqueCode: "",
    condition: "good",
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSuccess("")
    setLoading(true)

    try {
      const response = await fetch("/api/inventory/instruments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      const data = await response.json()
      if (data.success) {
        setSuccess("Instrument added successfully!")
        setFormData({ name: "", type: "", uniqueCode: "", condition: "good" })
        onSuccess?.()
      } else {
        setError(data.message || "Failed to add instrument")
      }
    } catch (err) {
      setError("Failed to add instrument")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add New Instrument</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">Instrument Name</label>
              <Input name="name" value={formData.name} onChange={handleChange} placeholder="Piano - Grand" required />
            </div>
            <div>
              <label className="text-sm font-medium">Type</label>
              <select
                name="type"
                value={formData.type}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-border rounded-lg bg-background"
                required
              >
                <option value="">Select Type</option>
                <option value="Piano">Piano</option>
                <option value="Guitar">Guitar</option>
                <option value="Violin">Violin</option>
                <option value="Drums">Drums</option>
                <option value="Flute">Flute</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-medium">Unique Code</label>
              <Input
                name="uniqueCode"
                value={formData.uniqueCode}
                onChange={handleChange}
                placeholder="PNO-001"
                required
              />
            </div>
            <div>
              <label className="text-sm font-medium">Condition</label>
              <select
                name="condition"
                value={formData.condition}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-border rounded-lg bg-background"
              >
                <option value="good">Good</option>
                <option value="needs-repair">Needs Repair</option>
                <option value="maintenance-required">Maintenance Required</option>
              </select>
            </div>
          </div>

          {error && <div className="p-3 bg-red-50 text-red-700 rounded-lg text-sm">{error}</div>}
          {success && <div className="p-3 bg-green-50 text-green-700 rounded-lg text-sm">{success}</div>}

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Adding..." : "Add Instrument"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
