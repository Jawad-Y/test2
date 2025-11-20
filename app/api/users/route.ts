import { type NextRequest, NextResponse } from "next/server"

interface User {
  id: string
  fullName: string
  email: string
  phone?: string
  role: string
  status: string
  classId?: string
  departmentId?: string
}

// Mock data store
const users: User[] = [
  {
    id: "1",
    fullName: "Admin Leader",
    email: "admin@club.com",
    role: "club-leader",
    status: "active",
  },
  {
    id: "2",
    fullName: "Department Leader",
    email: "dept@club.com",
    role: "department-leader",
    status: "active",
    departmentId: "1",
  },
  {
    id: "3",
    fullName: "John Trainer",
    email: "trainer@club.com",
    role: "trainer",
    status: "active",
    classId: "1",
  },
  {
    id: "4",
    fullName: "Jane Trainee",
    email: "trainee@club.com",
    role: "trainee",
    status: "active",
    classId: "1",
  },
]

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const role = searchParams.get("role")
    const status = searchParams.get("status")

    let filtered = users
    if (role) filtered = filtered.filter((u) => u.role === role)
    if (status) filtered = filtered.filter((u) => u.status === status)

    return NextResponse.json({ success: true, data: filtered })
  } catch (error) {
    return NextResponse.json({ success: false, message: "Failed to fetch users" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const newUser: User = {
      id: String(users.length + 1),
      ...body,
      status: body.status || "active",
    }
    users.push(newUser)
    return NextResponse.json({ success: true, data: newUser }, { status: 201 })
  } catch (error) {
    return NextResponse.json({ success: false, message: "Failed to create user" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const index = users.findIndex((u) => u.id === body.id)
    if (index === -1) {
      return NextResponse.json({ success: false, message: "User not found" }, { status: 404 })
    }
    users[index] = { ...users[index], ...body }
    return NextResponse.json({ success: true, data: users[index] })
  } catch (error) {
    return NextResponse.json({ success: false, message: "Failed to update user" }, { status: 500 })
  }
}
