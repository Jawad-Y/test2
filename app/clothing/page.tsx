"use client"

import { useAuth } from "@/hooks/use-auth"
import { Sidebar } from "@/components/sidebar"
import { ClothingInventory } from "@/components/clothing-inventory"

export default function ClothingPage() {
  const { user, isLoading } = useAuth()

  if (isLoading || !user) return null

  const canManage = ["club-leader", "inventory-manager"].includes(user.role)

  if (!canManage) {
    return (
      <div className="flex h-screen bg-background">
        <Sidebar />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold">Access Denied</h1>
            <p className="text-muted-foreground">Only inventory managers can access this page</p>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <main className="flex-1 overflow-auto md:pt-0 pt-16">
        <div className="p-4 md:p-6 max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">Clothing Inventory</h1>
          <ClothingInventory />
        </div>
      </main>
    </div>
  )
}
