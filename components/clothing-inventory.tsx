"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Shirt, Plus, Minus, User, X } from "lucide-react"

interface ClothingItem {
  id: string
  category: string
  size: string
  totalQuantity: number
  inUse: number
  assignments: { userName: string; quantity: number }[]
}

export function ClothingInventory() {
  const [items, setItems] = useState<ClothingItem[]>([
    {
      id: "1",
      category: "Uniform - Jacket",
      size: "M",
      totalQuantity: 15,
      inUse: 8,
      assignments: [
        { userName: "Jane Trainee", quantity: 1 },
        { userName: "John Doe", quantity: 1 },
      ],
    },
    {
      id: "2",
      category: "Uniform - Jacket",
      size: "L",
      totalQuantity: 12,
      inUse: 5,
      assignments: [{ userName: "Alice Smith", quantity: 1 }],
    },
    {
      id: "3",
      category: "Uniform - Pants",
      size: "M",
      totalQuantity: 20,
      inUse: 12,
      assignments: [
        { userName: "Jane Trainee", quantity: 1 },
        { userName: "Bob Miller", quantity: 1 },
      ],
    },
    {
      id: "4",
      category: "Accessories - Cap",
      size: "OneSize",
      totalQuantity: 35,
      inUse: 20,
      assignments: [{ userName: "Jane Trainee", quantity: 1 }],
    },
  ])

  const [selectedItemId, setSelectedItemId] = useState<string | null>(null)
  const [showAssignForm, setShowAssignForm] = useState(false)
  const [newAssignment, setNewAssignment] = useState({ userName: "", quantity: 1 })

  const handleAddQuantity = (id: string) => {
    setItems((prev) => prev.map((item) => (item.id === id ? { ...item, totalQuantity: item.totalQuantity + 1 } : item)))
  }

  const handleReduceQuantity = (id: string) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id && item.totalQuantity > 0 ? { ...item, totalQuantity: item.totalQuantity - 1 } : item,
      ),
    )
  }

  const handleAssignClothing = (itemId: string) => {
    if (!newAssignment.userName || newAssignment.quantity <= 0) return

    setItems((prev) =>
      prev.map((item) => {
        if (item.id === itemId) {
          const existingIndex = item.assignments.findIndex((a) => a.userName === newAssignment.userName)

          if (existingIndex >= 0) {
            const updatedAssignments = [...item.assignments]
            updatedAssignments[existingIndex].quantity += newAssignment.quantity
            return {
              ...item,
              inUse: Math.min(item.inUse + newAssignment.quantity, item.totalQuantity),
              assignments: updatedAssignments,
            }
          } else {
            return {
              ...item,
              inUse: Math.min(item.inUse + newAssignment.quantity, item.totalQuantity),
              assignments: [...item.assignments, newAssignment],
            }
          }
        }
        return item
      }),
    )

    setNewAssignment({ userName: "", quantity: 1 })
    setShowAssignForm(false)
  }

  const handleRemoveAssignment = (itemId: string, userName: string) => {
    setItems((prev) =>
      prev.map((item) => {
        if (item.id === itemId) {
          const removedAssignment = item.assignments.find((a) => a.userName === userName)
          return {
            ...item,
            inUse: Math.max(0, item.inUse - (removedAssignment?.quantity || 0)),
            assignments: item.assignments.filter((a) => a.userName !== userName),
          }
        }
        return item
      }),
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shirt size={24} />
          Clothing Inventory
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Summary Stats */}
        <div className="grid grid-cols-3 gap-3 p-3 bg-accent rounded-lg">
          <div>
            <p className="text-xs text-muted-foreground">Total Items</p>
            <p className="text-lg font-bold">{items.reduce((sum, i) => sum + i.totalQuantity, 0)}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">In Use</p>
            <p className="text-lg font-bold text-orange-600">{items.reduce((sum, i) => sum + i.inUse, 0)}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Available</p>
            <p className="text-lg font-bold text-green-600">
              {items.reduce((sum, i) => sum + (i.totalQuantity - i.inUse), 0)}
            </p>
          </div>
        </div>

        {/* Items List */}
        <div className="space-y-3">
          {items.map((item) => (
            <div
              key={item.id}
              className={`border rounded-lg p-3 transition cursor-pointer ${
                selectedItemId === item.id ? "ring-2 ring-primary bg-accent" : ""
              }`}
              onClick={() => setSelectedItemId(selectedItemId === item.id ? null : item.id)}
            >
              <div className="flex items-center justify-between gap-3">
                <div className="flex-1">
                  <h4 className="font-semibold text-sm">{item.category}</h4>
                  <p className="text-xs text-muted-foreground">Size: {item.size}</p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground">Total</p>
                    <p className="font-bold text-sm">{item.totalQuantity}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground">In Use</p>
                    <p className="font-bold text-sm text-orange-600">{item.inUse}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground">Available</p>
                    <p className="font-bold text-sm text-green-600">{item.totalQuantity - item.inUse}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleAddQuantity(item.id)
                      }}
                    >
                      <Plus size={14} />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleReduceQuantity(item.id)
                      }}
                    >
                      <Minus size={14} />
                    </Button>
                  </div>
                </div>
              </div>

              {/* Expanded view - Assignments */}
              {selectedItemId === item.id && (
                <div className="mt-4 pt-4 border-t space-y-3">
                  <div>
                    <p className="text-xs font-semibold text-muted-foreground mb-2">Assignments</p>
                    <div className="space-y-2">
                      {item.assignments.length > 0 ? (
                        item.assignments.map((assignment) => (
                          <div
                            key={assignment.userName}
                            className="flex items-center justify-between p-2 bg-background rounded"
                          >
                            <div className="flex items-center gap-2">
                              <User size={14} className="text-muted-foreground" />
                              <span className="text-sm">
                                {assignment.userName} ({assignment.quantity})
                              </span>
                            </div>
                            <button
                              onClick={() => handleRemoveAssignment(item.id, assignment.userName)}
                              className="text-red-600 hover:text-red-800"
                            >
                              <X size={14} />
                            </button>
                          </div>
                        ))
                      ) : (
                        <p className="text-xs text-muted-foreground italic">No assignments</p>
                      )}
                    </div>
                  </div>

                  {/* Add Assignment Form */}
                  {!showAssignForm ? (
                    <Button onClick={() => setShowAssignForm(true)} variant="outline" className="w-full gap-2 text-sm">
                      <Plus size={14} />
                      Assign to Person
                    </Button>
                  ) : (
                    <div className="p-3 bg-background rounded border space-y-2">
                      <input
                        type="text"
                        placeholder="Person name"
                        value={newAssignment.userName}
                        onChange={(e) =>
                          setNewAssignment({
                            ...newAssignment,
                            userName: e.target.value,
                          })
                        }
                        className="w-full px-2 py-1 border rounded text-xs focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                      <input
                        type="number"
                        min="1"
                        max={item.totalQuantity - item.inUse}
                        value={newAssignment.quantity}
                        onChange={(e) =>
                          setNewAssignment({
                            ...newAssignment,
                            quantity: Number.parseInt(e.target.value) || 1,
                          })
                        }
                        className="w-full px-2 py-1 border rounded text-xs focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                      <div className="flex gap-2">
                        <Button onClick={() => handleAssignClothing(item.id)} size="sm" className="flex-1 text-xs">
                          Assign
                        </Button>
                        <Button
                          onClick={() => {
                            setShowAssignForm(false)
                            setNewAssignment({ userName: "", quantity: 1 })
                          }}
                          variant="outline"
                          size="sm"
                          className="flex-1 text-xs"
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
