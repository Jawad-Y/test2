import { type NextRequest, NextResponse } from "next/server"
import { mockUsers } from "@/lib/auth"

export async function POST(request: NextRequest) {
  try {
    const { action, email, password } = await request.json()

    if (action === "login") {
      const user = mockUsers[email]
      if (user && password === "password") {
        return NextResponse.json({ success: true, user })
      }
      return NextResponse.json({ success: false, message: "Invalid credentials" }, { status: 401 })
    }

    if (action === "logout") {
      return NextResponse.json({ success: true })
    }

    return NextResponse.json({ success: false, message: "Invalid action" }, { status: 400 })
  } catch (error) {
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 })
  }
}
