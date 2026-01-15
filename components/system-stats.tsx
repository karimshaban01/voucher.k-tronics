"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts"

const networkData = [
  { time: "00:00", download: 45, upload: 12 },
  { time: "04:00", download: 32, upload: 8 },
  { time: "08:00", download: 128, upload: 45 },
  { time: "12:00", download: 256, upload: 78 },
  { time: "16:00", download: 189, upload: 56 },
  { time: "20:00", download: 234, upload: 89 },
  { time: "24:00", download: 198, upload: 67 },
]

const deviceData = [
  { time: "00:00", active: 3, idle: 2 },
  { time: "04:00", active: 2, idle: 3 },
  { time: "08:00", active: 8, idle: 4 },
  { time: "12:00", active: 12, idle: 3 },
  { time: "16:00", active: 10, idle: 5 },
  { time: "20:00", active: 14, idle: 2 },
  { time: "24:00", active: 11, idle: 4 },
]

export function SystemStats() {
  return (
    <div className="grid gap-6">
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">CPU Usage</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold mb-2">42%</div>
            <Progress value={42} className="mb-2" />
            <p className="text-xs text-muted-foreground">Normal operation</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Memory Usage</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold mb-2">1.2 GB / 4 GB</div>
            <Progress value={30} className="mb-2" />
            <p className="text-xs text-muted-foreground">30% utilized</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Uptime</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold mb-2">15d 6h 23m</div>
            <Progress value={95} className="mb-2" />
            <p className="text-xs text-muted-foreground">Stable connection</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Network Throughput</CardTitle>
          <CardDescription>Download and upload speeds over 24 hours</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={networkData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="time" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Area
                type="monotone"
                dataKey="download"
                stroke="#3b82f6"
                fill="#3b82f6"
                fillOpacity={0.6}
                name="Download (MB/s)"
              />
              <Area
                type="monotone"
                dataKey="upload"
                stroke="#10b981"
                fill="#10b981"
                fillOpacity={0.6}
                name="Upload (MB/s)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Connected Devices Activity</CardTitle>
          <CardDescription>Active vs idle devices over 24 hours</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={deviceData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="time" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="active" stroke="#8b5cf6" strokeWidth={2} name="Active Devices" />
              <Line type="monotone" dataKey="idle" stroke="#f97316" strokeWidth={2} name="Idle Devices" />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  )
}
