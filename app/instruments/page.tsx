"use client"

import { useAuth } from "@/hooks/use-auth"
import { Sidebar } from "@/components/sidebar"
import { InstrumentsList } from "@/components/instruments-list"
import { AddInstrumentForm } from "@/components/add-instrument-form"
import { useState } from "react"

export default function InstrumentsPage() {
  const { user, isLoading } = useAuth()
  const [refreshTrigger, setRefreshTrigger] = useState(0)

  if (isLoading || !user) return null

  const canManage = ["club-leader", "inventory-manager"].includes(user.role)

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <main className="flex-1 overflow-auto md:pt-0 pt-16">
        <div className="p-4 md:p-6 max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">Inventory Management</h1>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <InstrumentsList key={refreshTrigger} />
            </div>
            <div>{canManage && <AddInstrumentForm onSuccess={() => setRefreshTrigger((prev) => prev + 1)} />}</div>
          </div>
        </div>
      </main>
    </div>
  )
}
