"use client"

import { useEffect, useState } from "react"
import { type AuthUser, mockUsers } from "@/lib/auth"

export function useAuth() {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Mock authentication - replace with real auth
    const storedUser = localStorage.getItem("auth_user")
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
    setIsLoading(false)
  }, [])

  const login = async (email: string, password: string) => {
    const user = mockUsers[email as keyof typeof mockUsers]
    if (user && password === "password") {
      localStorage.setItem("auth_user", JSON.stringify(user))
      setUser(user)
    } else {
      throw new Error("Invalid credentials")
    }
  }

  const logout = async () => {
    localStorage.removeItem("auth_user")
    setUser(null)
  }

  return { user, isLoading, login, logout }
}
