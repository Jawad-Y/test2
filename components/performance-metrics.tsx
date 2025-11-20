"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts"

export function PerformanceMetrics() {
  const performanceData = [
    { trainee: "Jane T.", rating: 8.5, progress: 75 },
    { trainee: "John D.", rating: 7.8, progress: 65 },
    { trainee: "Alice S.", rating: 9.1, progress: 85 },
    { trainee: "Bob M.", rating: 7.2, progress: 60 },
    { trainee: "Carol K.", rating: 8.9, progress: 82 },
  ]

  const progressTrendData = [
    { week: "Week 1", avgRating: 7.2 },
    { week: "Week 2", avgRating: 7.5 },
    { week: "Week 3", avgRating: 7.8 },
    { week: "Week 4", avgRating: 8.1 },
    { week: "Week 5", avgRating: 8.4 },
  ]

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Trainee Performance Ratings</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={performanceData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="trainee" fontSize={12} />
              <YAxis fontSize={12} domain={[0, 10]} />
              <Tooltip />
              <Bar dataKey="rating" fill="#8b5cf6" name="Rating" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Performance Trend</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={progressTrendData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="week" fontSize={12} />
              <YAxis fontSize={12} domain={[0, 10]} />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="avgRating"
                stroke="#3b82f6"
                dot={{ fill: "#3b82f6", r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  )
}
