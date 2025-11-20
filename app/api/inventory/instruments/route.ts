import { type NextRequest, NextResponse } from "next/server"

interface Instrument {
  id: string
  name: string
  type: string
  uniqueCode: string
  condition: "good" | "needs-repair" | "maintenance-required"
  assignedUser?: string
  maintenanceLogs: string[]
}

const instruments: Instrument[] = [
  {
    id: "1",
    name: "Piano - Grand",
    type: "Piano",
    uniqueCode: "PNO-001",
    condition: "good",
    maintenanceLogs: [],
  },
  {
    id: "2",
    name: "Acoustic Guitar",
    type: "Guitar",
    uniqueCode: "GTR-001",
    condition: "good",
    maintenanceLogs: [],
  },
]

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const condition = searchParams.get("condition")
    const type = searchParams.get("type")

    let filtered = instruments
    if (condition) filtered = filtered.filter((i) => i.condition === condition)
    if (type) filtered = filtered.filter((i) => i.type === type)

    return NextResponse.json({ success: true, data: filtered })
  } catch (error) {
    return NextResponse.json({ success: false, message: "Failed to fetch instruments" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const newInstrument: Instrument = {
      id: String(instruments.length + 1),
      ...body,
      maintenanceLogs: [],
    }
    instruments.push(newInstrument)
    return NextResponse.json({ success: true, data: newInstrument }, { status: 201 })
  } catch (error) {
    return NextResponse.json({ success: false, message: "Failed to create instrument" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const index = instruments.findIndex((i) => i.id === body.id)
    if (index === -1) {
      return NextResponse.json({ success: false, message: "Instrument not found" }, { status: 404 })
    }
    instruments[index] = { ...instruments[index], ...body }
    return NextResponse.json({ success: true, data: instruments[index] })
  } catch (error) {
    return NextResponse.json({ success: false, message: "Failed to update instrument" }, { status: 500 })
  }
}
