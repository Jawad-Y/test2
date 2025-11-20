"use client"

import { useAuth } from "@/hooks/use-auth"
import { Sidebar } from "@/components/sidebar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Settings, Bell, Lock, User } from "lucide-react"

export default function SettingsPage() {
  const { user, isLoading } = useAuth()

  if (isLoading || !user) return null

  const onlyClubLeaders = user.role === "club-leader"

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <main className="flex-1 overflow-auto md:pt-0 pt-16">
        <div className="p-4 md:p-6 max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">Settings</h1>

          <div className="space-y-6">
            {/* Profile Settings */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User size={24} />
                  Profile Settings
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium">Full Name</label>
                      <Input value={user.fullName} disabled />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Email</label>
                      <Input value={user.email} disabled />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Role</label>
                      <Input value={user.role.replace("-", " ")} disabled />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Status</label>
                      <Input value={user.status} disabled />
                    </div>
                  </div>
                  <Button variant="outline">Edit Profile</Button>
                </div>
              </CardContent>
            </Card>

            {/* Security Settings */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lock size={24} />
                  Security
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p className="text-sm text-muted-foreground">Manage your password and security preferences</p>
                  <Button variant="outline">Change Password</Button>
                  <Button variant="outline">Enable Two-Factor Authentication</Button>
                </div>
              </CardContent>
            </Card>

            {/* Notification Settings */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell size={24} />
                  Notifications
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <label className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-accent">
                    <input type="checkbox" defaultChecked className="w-4 h-4" />
                    <div>
                      <p className="font-medium text-sm">Session Reminders</p>
                      <p className="text-xs text-muted-foreground">Get notified about upcoming sessions</p>
                    </div>
                  </label>
                  <label className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-accent">
                    <input type="checkbox" defaultChecked className="w-4 h-4" />
                    <div>
                      <p className="font-medium text-sm">Attendance Updates</p>
                      <p className="text-xs text-muted-foreground">Receive attendance notifications</p>
                    </div>
                  </label>
                  <label className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-accent">
                    <input type="checkbox" defaultChecked className="w-4 h-4" />
                    <div>
                      <p className="font-medium text-sm">Email Digests</p>
                      <p className="text-xs text-muted-foreground">Receive weekly summary emails</p>
                    </div>
                  </label>
                  <Button variant="outline" className="w-full bg-transparent">
                    Save Preferences
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* System Settings (Club Leaders Only) */}
            {onlyClubLeaders && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings size={24} />
                    System Configuration
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium">Club Name</label>
                      <Input placeholder="Enter club name" />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Club Email</label>
                      <Input type="email" placeholder="club@example.com" />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Contact Phone</label>
                      <Input placeholder="+1234567890" />
                    </div>
                    <Button>Save System Settings</Button>
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
