"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Wifi, LogOut, Upload, Ticket, Users, TrendingUp } from "lucide-react"
import { VoucherUpload } from "@/components/voucher-upload"
import { VoucherList } from "@/components/voucher-list"
import { SalesStats } from "@/components/sales-stats"

export default function AdminDashboard() {
  const router = useRouter()
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    const adminStatus = localStorage.getItem("isAdmin")
    if (adminStatus !== "true") {
      router.push("/")
    } else {
      setIsAuthenticated(true)
    }
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem("isAdmin")
    router.push("/")
  }

  if (!isAuthenticated) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
              <Wifi className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">K-TRONICS Admin</h1>
              <p className="text-sm text-muted-foreground">Voucher Management System</p>
            </div>
          </div>
          <Button variant="outline" onClick={handleLogout}>
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium">Total Vouchers</CardTitle>
                <Ticket className="w-4 h-4 text-blue-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{JSON.parse(localStorage.getItem("vouchers") || "[]").length}</div>
              <p className="text-xs text-muted-foreground mt-1">Purchased vouchers</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium">Voucher Rolls</CardTitle>
                <Upload className="w-4 h-4 text-green-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {JSON.parse(localStorage.getItem("voucherRolls") || "[]").length}
              </div>
              <p className="text-xs text-muted-foreground mt-1">Uploaded rolls</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium">Active Users</CardTitle>
                <Users className="w-4 h-4 text-purple-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {JSON.parse(localStorage.getItem("vouchers") || "[]").filter((v: any) => v.status === "active").length}
              </div>
              <p className="text-xs text-muted-foreground mt-1">Currently connected</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium">Revenue</CardTitle>
                <TrendingUp className="w-4 h-4 text-orange-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">KSH 12,450</div>
              <p className="text-xs text-muted-foreground mt-1">Total sales</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="upload" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="upload">Upload Vouchers</TabsTrigger>
            <TabsTrigger value="vouchers">Manage Vouchers</TabsTrigger>
            <TabsTrigger value="stats">Statistics</TabsTrigger>
          </TabsList>

          <TabsContent value="upload" className="mt-6">
            <VoucherUpload />
          </TabsContent>

          <TabsContent value="vouchers" className="mt-6">
            <VoucherList />
          </TabsContent>

          <TabsContent value="stats" className="mt-6">
            <SalesStats />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
