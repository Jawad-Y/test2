"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useAuth } from "@/hooks/use-auth"
import { Button } from "@/components/ui/button"
import {
  LayoutDashboard,
  Users,
  Calendar,
  BookOpen,
  BarChart3,
  Settings,
  LogOut,
  Menu,
  X,
  Music,
  Shirt,
  ChevronLeft,
} from "lucide-react"

const roleMenuItems: Record<string, Array<{ label: string; href: string; icon: any }>> = {
  "club-leader": [
    { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { label: "Members", href: "/members", icon: Users },
    { label: "Classes", href: "/classes", icon: Calendar },
    { label: "Training Sessions", href: "/sessions", icon: Calendar },
    { label: "Library", href: "/library", icon: BookOpen },
    { label: "Concerts", href: "/concerts", icon: Music },
    { label: "Instruments", href: "/instruments", icon: Music },
    { label: "Clothing", href: "/clothing", icon: Shirt },
    { label: "Reports", href: "/reports", icon: BarChart3 },
    { label: "Settings", href: "/settings", icon: Settings },
  ],
  "department-leader": [
    { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { label: "Classes", href: "/classes", icon: Calendar },
    { label: "Training Sessions", href: "/sessions", icon: Calendar },
    { label: "Concerts", href: "/concerts", icon: Music },
    { label: "Reports", href: "/reports", icon: BarChart3 },
  ],
  "class-leader": [
    { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { label: "My Class", href: "/my-class", icon: Calendar },
    { label: "Members", href: "/members", icon: Users },
    { label: "Sessions", href: "/sessions", icon: Calendar },
    { label: "Concerts", href: "/concerts", icon: Music },
  ],
  trainer: [
    { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { label: "My Sessions", href: "/my-sessions", icon: Calendar },
    { label: "Library", href: "/library", icon: BookOpen },
    { label: "Trainees", href: "/trainees", icon: Users },
    { label: "Concerts", href: "/concerts", icon: Music },
  ],
  trainee: [
    { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { label: "My Class", href: "/my-class", icon: Calendar },
    { label: "Schedule", href: "/schedule", icon: Calendar },
    { label: "Library", href: "/library", icon: BookOpen },
    { label: "Events", href: "/events", icon: Calendar },
    { label: "Concerts", href: "/concerts", icon: Music },
    { label: "Homework", href: "/homework", icon: BookOpen },
  ],
  "inventory-manager": [
    { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { label: "Instruments", href: "/instruments", icon: Music },
    { label: "Clothing", href: "/clothing", icon: Shirt },
    { label: "Concerts", href: "/concerts", icon: Music },
    { label: "Reports", href: "/reports", icon: BarChart3 },
    { label: "Events", href: "/events", icon: Calendar },
  ],
  "member-manager": [
    { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { label: "Members", href: "/members", icon: Users },
    { label: "Concerts", href: "/concerts", icon: Music },
    { label: "Reports", href: "/reports", icon: BarChart3 },
    { label: "Events", href: "/events", icon: Calendar },
  ],
  guest: [
    { label: "About Club", href: "/guest", icon: LayoutDashboard },
    { label: "Events", href: "/events", icon: Calendar },
    { label: "Concerts", href: "/concerts", icon: Music },
  ],
}

export function Sidebar() {
  const { user, logout } = useAuth()
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)
  const [isCollapsed, setIsCollapsed] = useState(false)

  if (!user) return null

  const menuItems = roleMenuItems[user.role] || []

  const sidebarContent = (
    <>
      <div className="p-4 border-b flex items-center justify-between">
        {!isCollapsed && (
          <>
            <h1 className="text-xl font-bold text-primary">Club Management</h1>
            <p className="text-xs text-muted-foreground mt-1">{user.role.replace("-", " ")}</p>
          </>
        )}
      </div>

      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href
          return (
            <Link key={item.href} href={item.href}>
              <div
                className={`flex items-center gap-3 px-4 py-2 rounded-lg transition ${
                  isActive ? "bg-primary text-primary-foreground" : "text-foreground hover:bg-accent"
                } ${isCollapsed ? "justify-center" : ""}`}
                title={isCollapsed ? item.label : ""}
              >
                <Icon size={20} />
                {!isCollapsed && <span className="text-sm font-medium">{item.label}</span>}
              </div>
            </Link>
          )
        })}
      </nav>

      <div className="p-4 border-t space-y-2">
        {!isCollapsed && (
          <div className="flex items-center gap-2 px-4 py-2 text-sm">
            <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center">
              {user.fullName.charAt(0)}
            </div>
            <div>
              <p className="font-medium text-sm">{user.fullName}</p>
              <p className="text-xs text-muted-foreground">{user.email}</p>
            </div>
          </div>
        )}
        <Button
          variant="outline"
          className={`w-full justify-start gap-2 bg-transparent ${isCollapsed ? "px-0" : ""}`}
          onClick={() => {
            logout()
            window.location.href = "/"
          }}
        >
          <LogOut size={16} />
          {!isCollapsed && "Logout"}
        </Button>
      </div>
    </>
  )

  return (
    <>
      {/* Desktop Sidebar with collapse toggle */}
      <aside
        className={`hidden md:flex flex-col bg-sidebar border-r border-sidebar-border h-screen sticky top-0 transition-all duration-300 ${
          isCollapsed ? "w-20" : "w-64"
        }`}
      >
        {sidebarContent}
      </aside>

      {/* Collapse toggle button (visible on desktop) */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="hidden md:flex fixed left-64 top-4 z-20 p-1 hover:bg-accent rounded transition"
        style={{ left: isCollapsed ? "80px" : "256px" }}
      >
        <ChevronLeft size={20} className={`transition-transform ${isCollapsed ? "rotate-180" : ""}`} />
      </button>

      {/* Mobile Menu */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-40 bg-sidebar border-b border-sidebar-border flex items-center justify-between p-4">
        <h1 className="text-lg font-bold text-primary">Club Management</h1>
        <Button variant="ghost" size="icon" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </Button>
      </div>

      {/* Mobile Sidebar */}
      {isOpen && (
        <aside className="md:hidden fixed inset-0 top-16 z-30 bg-sidebar border-r border-sidebar-border overflow-y-auto">
          {sidebarContent}
        </aside>
      )}
    </>
  )
}
