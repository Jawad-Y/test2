"use client"

import { useAuth } from "@/hooks/use-auth"
import { Sidebar } from "@/components/sidebar"
import { AddMemberForm } from "@/components/add-member-form"
import { UsersTable } from "@/components/users-table"
import { useState } from "react"

export default function MembersPage() {
  const { user, isLoading } = useAuth()
  const [refreshTrigger, setRefreshTrigger] = useState(0)

  if (isLoading || !user) return null

  // Only Club Leader and Member Manager can manage members
  const canManage = ["club-leader", "member-manager"].includes(user.role)

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <main className="flex-1 overflow-auto md:pt-0 pt-16">
        <div className="p-4 md:p-6 max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">Members Management</h1>

          <div className="grid grid-cols-1 gap-6">
            {canManage && <AddMemberForm onSuccess={() => setRefreshTrigger((prev) => prev + 1)} />}
            <UsersTable key={refreshTrigger} />
          </div>
        </div>
      </main>
    </div>
  )
}
