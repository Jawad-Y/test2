"use client"

import { Card, CardContent } from "@/components/ui/card"
import { TrendingUp, TrendingDown, Users, Calendar, BookOpen } from "lucide-react"

interface AnalyticCard {
  title: string
  value: string | number
  change: number
  trend: "up" | "down"
  icon: any
}

export function AnalyticsCards() {
  const cards: AnalyticCard[] = [
    {
      title: "Total Attendance",
      value: "92%",
      change: 5,
      trend: "up",
      icon: Users,
    },
    {
      title: "Active Sessions",
      value: 24,
      change: 8,
      trend: "up",
      icon: Calendar,
    },
    {
      title: "Library Materials",
      value: 156,
      change: 12,
      trend: "up",
      icon: BookOpen,
    },
    {
      title: "Avg Performance",
      value: "8.2/10",
      change: 2,
      trend: "up",
      icon: TrendingUp,
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card, idx) => {
        const Icon = card.icon
        return (
          <Card key={idx}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-muted-foreground">{card.title}</p>
                <Icon className="text-primary" size={20} />
              </div>
              <div className="flex items-baseline gap-2">
                <p className="text-2xl font-bold">{card.value}</p>
                <div className="flex items-center gap-1 text-xs">
                  {card.trend === "up" ? (
                    <TrendingUp className="text-green-600" size={16} />
                  ) : (
                    <TrendingDown className="text-red-600" size={16} />
                  )}
                  <span className={card.trend === "up" ? "text-green-600" : "text-red-600"}>{card.change}%</span>
                </div>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
