"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Music, AlertTriangle, CheckCircle, Wrench } from "lucide-react"

interface Instrument {
  id: string
  name: string
  type: string
  uniqueCode: string
  condition: "good" | "needs-repair" | "maintenance-required"
  assignedUser?: string
}

export function InstrumentsList() {
  const [instruments, setInstruments] = useState<Instrument[]>([])
  const [loading, setLoading] = useState(true)
  const [filterCondition, setFilterCondition] = useState("all")

  useEffect(() => {
    fetchInstruments()
  }, [])

  const fetchInstruments = async () => {
    try {
      const response = await fetch("/api/inventory/instruments")
      const data = await response.json()
      if (data.success) {
        setInstruments(data.data)
      }
    } catch (error) {
      console.error("Failed to fetch instruments", error)
    } finally {
      setLoading(false)
    }
  }

  const getConditionIcon = (condition: string) => {
    switch (condition) {
      case "good":
        return <CheckCircle className="text-green-600" size={20} />
      case "needs-repair":
        return <AlertTriangle className="text-yellow-600" size={20} />
      case "maintenance-required":
        return <Wrench className="text-red-600" size={20} />
      default:
        return null
    }
  }

  const filtered = filterCondition === "all" ? instruments : instruments.filter((i) => i.condition === filterCondition)

  if (loading) {
    return <div className="text-center py-8">Loading instruments...</div>
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Music size={24} />
          Instruments Inventory
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Filter */}
          <div className="flex gap-2">
            {["all", "good", "needs-repair", "maintenance-required"].map((status) => (
              <button
                key={status}
                onClick={() => setFilterCondition(status)}
                className={`px-3 py-1 text-sm rounded-full transition ${
                  filterCondition === status
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-secondary-foreground hover:bg-accent"
                }`}
              >
                {status === "all" ? "All" : status.replace("-", " ")}
              </button>
            ))}
          </div>

          {/* List */}
          <div className="space-y-3">
            {filtered.map((instrument) => (
              <div
                key={instrument.id}
                className="flex items-center justify-between p-3 border border-border rounded-lg hover:bg-accent transition"
              >
                <div className="flex items-start gap-3 flex-1">
                  <Music className="mt-1 text-primary" size={20} />
                  <div>
                    <h4 className="font-semibold text-sm">{instrument.name}</h4>
                    <p className="text-xs text-muted-foreground">Code: {instrument.uniqueCode}</p>
                    <p className="text-xs text-muted-foreground">Type: {instrument.type}</p>
                    {instrument.assignedUser && (
                      <p className="text-xs text-muted-foreground">Assigned to: {instrument.assignedUser}</p>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  {getConditionIcon(instrument.condition)}
                  <Button variant="outline" size="sm">
                    Edit
                  </Button>
                </div>
              </div>
            ))}
          </div>

          {filtered.length === 0 && <div className="text-center py-8 text-muted-foreground">No instruments found</div>}
        </div>
      </CardContent>
    </Card>
  )
}
