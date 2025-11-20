import { type NextRequest, NextResponse } from "next/server"

interface TrainingSession {
  id: string
  classId: string
  trainerId: string
  subject: string
  date: string
  startTime: string
  endTime: string
  location?: string
  description?: string
}

const sessions: TrainingSession[] = [
  {
    id: "1",
    classId: "1",
    trainerId: "3",
    subject: "Piano Fundamentals",
    date: "2025-11-25",
    startTime: "10:00",
    endTime: "11:30",
    location: "Room 101",
    description: "Introduction to piano basics",
  },
]

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const classId = searchParams.get("classId")
    const date = searchParams.get("date")

    let filtered = sessions
    if (classId) filtered = filtered.filter((s) => s.classId === classId)
    if (date) filtered = filtered.filter((s) => s.date === date)

    return NextResponse.json({ success: true, data: filtered })
  } catch (error) {
    return NextResponse.json({ success: false, message: "Failed to fetch sessions" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const newSession: TrainingSession = {
      id: String(sessions.length + 1),
      ...body,
    }
    sessions.push(newSession)
    return NextResponse.json({ success: true, data: newSession }, { status: 201 })
  } catch (error) {
    return NextResponse.json({ success: false, message: "Failed to create session" }, { status: 500 })
  }
}
