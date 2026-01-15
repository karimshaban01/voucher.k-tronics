"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Smartphone, Laptop, Tablet, Monitor, Ban } from "lucide-react"

interface Device {
  id: string
  name: string
  type: "phone" | "laptop" | "tablet" | "desktop"
  ip: string
  mac: string
  bandwidth: string
  status: "active" | "idle"
}

const devices: Device[] = [
  {
    id: "1",
    name: "iPhone 15 Pro",
    type: "phone",
    ip: "192.168.1.101",
    mac: "00:1B:44:11:3A:B7",
    bandwidth: "45 MB/s",
    status: "active",
  },
  {
    id: "2",
    name: "MacBook Pro",
    type: "laptop",
    ip: "192.168.1.102",
    mac: "00:1B:44:11:3A:B8",
    bandwidth: "128 MB/s",
    status: "active",
  },
  {
    id: "3",
    name: "iPad Air",
    type: "tablet",
    ip: "192.168.1.103",
    mac: "00:1B:44:11:3A:B9",
    bandwidth: "32 MB/s",
    status: "idle",
  },
  {
    id: "4",
    name: "Desktop PC",
    type: "desktop",
    ip: "192.168.1.104",
    mac: "00:1B:44:11:3A:BA",
    bandwidth: "156 MB/s",
    status: "active",
  },
  {
    id: "5",
    name: "Samsung S24",
    type: "phone",
    ip: "192.168.1.105",
    mac: "00:1B:44:11:3A:BB",
    bandwidth: "28 MB/s",
    status: "active",
  },
]

const getDeviceIcon = (type: Device["type"]) => {
  switch (type) {
    case "phone":
      return <Smartphone className="w-5 h-5" />
    case "laptop":
      return <Laptop className="w-5 h-5" />
    case "tablet":
      return <Tablet className="w-5 h-5" />
    case "desktop":
      return <Monitor className="w-5 h-5" />
  }
}

export function ConnectedDevices() {
  return (
    <div className="grid gap-4">
      {devices.map((device) => (
        <Card key={device.id}>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4 flex-1">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center text-primary">
                  {getDeviceIcon(device.type)}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold">{device.name}</h3>
                    <Badge variant={device.status === "active" ? "default" : "secondary"}>{device.status}</Badge>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm text-muted-foreground">
                    <span>IP: {device.ip}</span>
                    <span>MAC: {device.mac}</span>
                    <span>Bandwidth: {device.bandwidth}</span>
                    <span className="capitalize">Type: {device.type}</span>
                  </div>
                </div>
              </div>
              <Button variant="outline" size="sm">
                <Ban className="w-4 h-4 mr-2" />
                Block
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
