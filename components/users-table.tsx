"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Trash2, Edit2, Eye } from "lucide-react"

interface User {
  id: string
  fullName: string
  email: string
  phone?: string
  role: string
  status: string
  classId?: string
}

export function UsersTable() {
  const [users, setUsers] = useState<User[]>([])
  const [filteredUsers, setFilteredUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [roleFilter, setRoleFilter] = useState("all")

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      const response = await fetch("/api/users")
      const data = await response.json()
      if (data.success) {
        setUsers(data.data)
        setFilteredUsers(data.data)
      }
    } catch (error) {
      console.error("Failed to fetch users", error)
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (term: string) => {
    setSearchTerm(term)
    filterUsers(term, roleFilter)
  }

  const handleRoleFilter = (role: string) => {
    setRoleFilter(role)
    filterUsers(searchTerm, role)
  }

  const filterUsers = (search: string, role: string) => {
    let filtered = users
    if (search) {
      filtered = filtered.filter(
        (u) =>
          u.fullName.toLowerCase().includes(search.toLowerCase()) ||
          u.email.toLowerCase().includes(search.toLowerCase()),
      )
    }
    if (role !== "all") {
      filtered = filtered.filter((u) => u.role === role)
    }
    setFilteredUsers(filtered)
  }

  if (loading) {
    return <div className="text-center py-8">Loading...</div>
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Members Management</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Filters */}
          <div className="flex gap-4 flex-col md:flex-row">
            <Input
              placeholder="Search by name or email..."
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              className="flex-1"
            />
            <select
              value={roleFilter}
              onChange={(e) => handleRoleFilter(e.target.value)}
              className="px-4 py-2 border border-border rounded-lg bg-background"
            >
              <option value="all">All Roles</option>
              <option value="club-leader">Club Leader</option>
              <option value="department-leader">Department Leader</option>
              <option value="class-leader">Class Leader</option>
              <option value="trainer">Trainer</option>
              <option value="trainee">Trainee</option>
              <option value="inventory-manager">Inventory Manager</option>
              <option value="member-manager">Member Manager</option>
            </select>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2 font-semibold">Name</th>
                  <th className="text-left p-2 font-semibold">Email</th>
                  <th className="text-left p-2 font-semibold">Role</th>
                  <th className="text-left p-2 font-semibold">Status</th>
                  <th className="text-left p-2 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="border-b hover:bg-accent transition">
                    <td className="p-2">{user.fullName}</td>
                    <td className="p-2 text-muted-foreground">{user.email}</td>
                    <td className="p-2">
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full capitalize">
                        {user.role.replace("-", " ")}
                      </span>
                    </td>
                    <td className="p-2">
                      <span
                        className={`px-2 py-1 text-xs rounded-full ${
                          user.status === "active" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {user.status}
                      </span>
                    </td>
                    <td className="p-2 flex gap-2">
                      <Button variant="ghost" size="icon">
                        <Eye size={16} />
                      </Button>
                      <Button variant="ghost" size="icon">
                        <Edit2 size={16} />
                      </Button>
                      <Button variant="ghost" size="icon">
                        <Trash2 size={16} />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredUsers.length === 0 && <div className="text-center py-8 text-muted-foreground">No users found</div>}
        </div>
      </CardContent>
    </Card>
  )
}
