"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Legend, Tooltip } from "recharts"

interface PurchasedVoucher {
  code: string
  plan: string
  duration: string
  price: number
  purchaseDate: string
  status: string
  userEmail: string
  userPhone: string
}

export function SalesStats() {
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalVouchers: 0,
    activeVouchers: 0,
    expiredVouchers: 0,
  })
  const [chartData, setChartData] = useState<any[]>([])

  useEffect(() => {
    const purchasedVouchers: PurchasedVoucher[] = JSON.parse(localStorage.getItem("purchasedVouchers") || "[]")

    // Calculate actual revenue from purchased vouchers
    const totalRevenue = purchasedVouchers.reduce((sum, v) => sum + v.price, 0)
    const totalVouchers = purchasedVouchers.length
    const activeVouchers = purchasedVouchers.filter((v) => v.status === "active").length
    const expiredVouchers = totalVouchers - activeVouchers

    setStats({
      totalRevenue,
      totalVouchers,
      activeVouchers,
      expiredVouchers,
    })

    const planStats: { [key: string]: { count: number; revenue: number } } = {}

    purchasedVouchers.forEach((voucher) => {
      if (!planStats[voucher.plan]) {
        planStats[voucher.plan] = { count: 0, revenue: 0 }
      }
      planStats[voucher.plan].count += 1
      planStats[voucher.plan].revenue += voucher.price
    })

    // Convert to chart data format
    const data = Object.entries(planStats).map(([planName, stats]) => ({
      name: planName.replace(" Access", "").replace(" Pass", ""),
      sales: stats.count,
      revenue: stats.revenue,
    }))

    setChartData(data.length > 0 ? data : [{ name: "No Sales", sales: 0, revenue: 0 }])
  }, [])

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">KSH {stats.totalRevenue.toLocaleString()}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Vouchers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.totalVouchers}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Active</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">{stats.activeVouchers}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Expired</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-muted-foreground">{stats.expiredVouchers}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Sales by Plan</CardTitle>
          <CardDescription>Voucher sales and revenue breakdown by plan type</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "var(--radius)",
                  }}
                  labelStyle={{ color: "hsl(var(--foreground))" }}
                />
                <Legend />
                <Bar dataKey="sales" fill="hsl(var(--chart-1))" name="Sales" radius={[8, 8, 0, 0]} />
                <Bar dataKey="revenue" fill="hsl(var(--chart-2))" name="Revenue (KSH)" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
