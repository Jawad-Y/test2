"use client"

import { useState } from "react"
import { useAuth } from "@/hooks/use-auth"
import { Sidebar } from "@/components/sidebar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, X, Edit2 } from "lucide-react"
import Link from "next/link"

interface ClassData {
  id: string
  className: string
  classLeader: string
  members: string[]
  trainers: string[]
  department: string
}

export default function ClassesPage() {
  const { user, isLoading } = useAuth()
  const [classes, setClasses] = useState<ClassData[]>([
    {
      id: "1",
      className: "Piano Basics",
      classLeader: "Sarah Johnson",
      department: "Music",
      members: ["Jane Trainee", "John Doe"],
      trainers: ["John Trainer"],
    },
    {
      id: "2",
      className: "Guitar Intermediate",
      classLeader: "Mike Thompson",
      department: "Music",
      members: ["Alice Smith"],
      trainers: ["Guitar Expert"],
    },
  ])
  const [selectedClass, setSelectedClass] = useState<string | null>(null)
  const [showAddMember, setShowAddMember] = useState(false)
  const [showEditMember, setShowEditMember] = useState<string | null>(null)
  const [newMemberName, setNewMemberName] = useState("")
  const [editedName, setEditedName] = useState("")

  if (isLoading || !user) return null

  const canManage = ["club-leader", "department-leader", "class-leader"].includes(user.role)

  if (!canManage) {
    return (
      <div className="flex h-screen bg-background">
        <Sidebar />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold">Access Denied</h1>
            <p className="text-muted-foreground">Only leaders can access this page</p>
          </div>
        </main>
      </div>
    )
  }

  const addMemberToClass = (classId: string, memberName: string) => {
    if (!memberName.trim()) return
    setClasses(classes.map((c) => (c.id === classId ? { ...c, members: [...c.members, memberName] } : c)))
    setNewMemberName("")
    setShowAddMember(false)
  }

  const removeMemberFromClass = (classId: string, memberName: string) => {
    setClasses(
      classes.map((c) => (c.id === classId ? { ...c, members: c.members.filter((m) => m !== memberName) } : c)),
    )
  }

  const editMemberName = (classId: string, oldName: string, newName: string) => {
    if (!newName.trim()) return
    setClasses(
      classes.map((c) =>
        c.id === classId ? { ...c, members: c.members.map((m) => (m === oldName ? newName : m)) } : c,
      ),
    )
    setShowEditMember(null)
    setEditedName("")
  }

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <main className="flex-1 overflow-auto md:pt-0 pt-16">
        <div className="p-4 md:p-6 max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">Classes Management</h1>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Classes List */}
            <div className="lg:col-span-2 space-y-4">
              {classes.map((cls) => (
                <Card
                  key={cls.id}
                  className={`cursor-pointer transition ${selectedClass === cls.id ? "ring-2 ring-primary" : ""}`}
                  onClick={() => setSelectedClass(cls.id)}
                >
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      {cls.className}
                      <Link href={`/classes/${cls.id}`}>
                        <Button variant="outline" size="sm">
                          View Details
                        </Button>
                      </Link>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs text-muted-foreground">Class Leader</p>
                        <p className="font-semibold text-sm">{cls.classLeader}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Department</p>
                        <p className="font-semibold text-sm">{cls.department}</p>
                      </div>
                    </div>
                    <div className="border-t pt-3">
                      <p className="text-xs text-muted-foreground mb-2">Members ({cls.members.length})</p>
                      <div className="flex flex-wrap gap-2">
                        {cls.members.map((member) => (
                          <span key={member} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                            {member}
                          </span>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {selectedClass && (
              <Card className="h-fit">
                <CardHeader>
                  <CardTitle className="text-lg">Manage Members</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {!showAddMember ? (
                    <Button onClick={() => setShowAddMember(true)} className="w-full gap-2">
                      <Plus size={16} />
                      Add Member
                    </Button>
                  ) : (
                    <div className="space-y-3">
                      <input
                        type="text"
                        placeholder="Enter member name"
                        value={newMemberName}
                        onChange={(e) => setNewMemberName(e.target.value)}
                        onKeyPress={(e) => {
                          if (e.key === "Enter") {
                            addMemberToClass(selectedClass, newMemberName)
                          }
                        }}
                        autoFocus
                        className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                      <div className="flex gap-2">
                        <Button
                          onClick={() => addMemberToClass(selectedClass, newMemberName)}
                          size="sm"
                          className="flex-1"
                        >
                          Add
                        </Button>
                        <Button
                          onClick={() => {
                            setShowAddMember(false)
                            setNewMemberName("")
                          }}
                          variant="outline"
                          size="sm"
                          className="flex-1"
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  )}

                  <div className="border-t pt-3">
                    <p className="text-xs text-muted-foreground mb-2">Current Members</p>
                    <div className="space-y-2 max-h-64 overflow-y-auto">
                      {classes
                        .find((c) => c.id === selectedClass)
                        ?.members.map((member) => (
                          <div
                            key={member}
                            className="flex items-center justify-between p-2 bg-accent rounded-lg text-sm"
                          >
                            {showEditMember === member ? (
                              <input
                                type="text"
                                defaultValue={member}
                                onChange={(e) => setEditedName(e.target.value)}
                                onKeyPress={(e) => {
                                  if (e.key === "Enter") {
                                    editMemberName(selectedClass, member, editedName)
                                  }
                                }}
                                autoFocus
                                className="flex-1 px-2 py-1 border rounded text-xs focus:outline-none focus:ring-2 focus:ring-primary"
                              />
                            ) : (
                              <span>{member}</span>
                            )}
                            <div className="flex gap-1">
                              {showEditMember === member ? (
                                <>
                                  <button
                                    onClick={() => editMemberName(selectedClass, member, editedName)}
                                    className="text-green-600 hover:text-green-800"
                                  >
                                    ✓
                                  </button>
                                  <button
                                    onClick={() => setShowEditMember(null)}
                                    className="text-gray-600 hover:text-gray-800"
                                  >
                                    ✕
                                  </button>
                                </>
                              ) : (
                                <>
                                  <button
                                    onClick={() => {
                                      setShowEditMember(member)
                                      setEditedName(member)
                                    }}
                                    className="text-blue-600 hover:text-blue-800"
                                  >
                                    <Edit2 size={14} />
                                  </button>
                                  <button
                                    onClick={() => removeMemberFromClass(selectedClass, member)}
                                    className="text-red-600 hover:text-red-800"
                                  >
                                    <X size={16} />
                                  </button>
                                </>
                              )}
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
