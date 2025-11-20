import { type NextRequest, NextResponse } from "next/server"

interface Attendance {
  id: string
  sessionId: string
  traineeId: string
  status: "present" | "absent" | "late"
  confirmation: "accepted" | "declined" | "pending"
}

const attendance: Attendance[] = []

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const sessionId = searchParams.get("sessionId")

    let filtered = attendance
    if (sessionId) {
      filtered = filtered.filter((a) => a.sessionId === sessionId)
    }

    return NextResponse.json({ success: true, data: filtered })
  } catch (error) {
    return NextResponse.json({ success: false, message: "Failed to fetch attendance" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const newAttendance: Attendance = {
      id: String(attendance.length + 1),
      ...body,
      confirmation: body.confirmation || "pending",
    }
    attendance.push(newAttendance)
    return NextResponse.json({ success: true, data: newAttendance }, { status: 201 })
  } catch (error) {
    return NextResponse.json({ success: false, message: "Failed to record attendance" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const index = attendance.findIndex((a) => a.id === body.id)
    if (index === -1) {
      return NextResponse.json({ success: false, message: "Attendance record not found" }, { status: 404 })
    }
    attendance[index] = { ...attendance[index], ...body }
    return NextResponse.json({ success: true, data: attendance[index] })
  } catch (error) {
    return NextResponse.json({ success: false, message: "Failed to update attendance" }, { status: 500 })
  }
}
