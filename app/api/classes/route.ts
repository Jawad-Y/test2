import { type NextRequest, NextResponse } from "next/server"

interface TrainingClass {
  id: string
  className: string
  departmentId: string
  classLeaderId: string
  createdAt: string
}

const classes: TrainingClass[] = [
  {
    id: "1",
    className: "Piano Basics",
    departmentId: "1",
    classLeaderId: "2",
    createdAt: new Date().toISOString(),
  },
  {
    id: "2",
    className: "Guitar Intermediate",
    departmentId: "1",
    classLeaderId: "2",
    createdAt: new Date().toISOString(),
  },
]

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const departmentId = searchParams.get("departmentId")

    let filtered = classes
    if (departmentId) {
      filtered = filtered.filter((c) => c.departmentId === departmentId)
    }

    return NextResponse.json({ success: true, data: filtered })
  } catch (error) {
    return NextResponse.json({ success: false, message: "Failed to fetch classes" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const newClass: TrainingClass = {
      id: String(classes.length + 1),
      ...body,
      createdAt: new Date().toISOString(),
    }
    classes.push(newClass)
    return NextResponse.json({ success: true, data: newClass }, { status: 201 })
  } catch (error) {
    return NextResponse.json({ success: false, message: "Failed to create class" }, { status: 500 })
  }
}
