"use client"

import { useAuth } from "@/hooks/use-auth"
import { Card } from "@/components/ui/card"

export function DashboardHeader() {
  const { user } = useAuth()

  if (!user) return null

  const roleDescriptions: Record<string, string> = {
    "club-leader": "Full control over the entire club management system",
    "department-leader": "Manage department classes and trainers",
    "class-leader": "Manage your class members and sessions",
    trainer: "Create sessions and manage trainees",
    trainee: "Access your class schedule and materials",
    "inventory-manager": "Manage club instruments and clothing inventory",
    "member-manager": "Generate reports and manage member status",
  }

  return (
    <div className="space-y-4 mb-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Welcome, {user.fullName}!</h1>
        <p className="text-muted-foreground mt-1">{roleDescriptions[user.role]}</p>
      </div>
      <Card className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-sm font-medium text-muted-foreground">Role</p>
            <p className="text-lg font-semibold text-foreground capitalize">{user.role.replace("-", " ")}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Status</p>
            <p className="text-lg font-semibold text-green-600 capitalize">{user.status}</p>
          </div>
          {user.classId && (
            <div>
              <p className="text-sm font-medium text-muted-foreground">Class ID</p>
              <p className="text-lg font-semibold text-foreground">{user.classId}</p>
            </div>
          )}
        </div>
      </Card>
    </div>
  )
}
