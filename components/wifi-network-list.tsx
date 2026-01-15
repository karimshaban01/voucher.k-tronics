"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Wifi, Lock, Unlock } from "lucide-react"
import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface Network {
  id: string
  name: string
  signal: number
  secured: boolean
  frequency: string
  connected: boolean
}

interface WiFiNetworkListProps {
  isScanning: boolean
}

export function WiFiNetworkList({ isScanning }: WiFiNetworkListProps) {
  const [networks, setNetworks] = useState<Network[]>([
    { id: "1", name: "K-TRONICS-5G", signal: 95, secured: true, frequency: "5GHz", connected: true },
    { id: "2", name: "K-TRONICS-2.4G", signal: 88, secured: true, frequency: "2.4GHz", connected: false },
    { id: "3", name: "Office-WiFi", signal: 72, secured: true, frequency: "5GHz", connected: false },
    { id: "4", name: "Guest-Network", signal: 65, secured: false, frequency: "2.4GHz", connected: false },
    { id: "5", name: "K-TRONICS-Lab", signal: 54, secured: true, frequency: "5GHz", connected: false },
  ])

  const [selectedNetwork, setSelectedNetwork] = useState<Network | null>(null)
  const [showDialog, setShowDialog] = useState(false)
  const [password, setPassword] = useState("")

  const handleConnect = (network: Network) => {
    if (network.secured) {
      setSelectedNetwork(network)
      setShowDialog(true)
    } else {
      connectToNetwork(network)
    }
  }

  const connectToNetwork = (network: Network) => {
    setNetworks(
      networks.map((n) => ({
        ...n,
        connected: n.id === network.id,
      })),
    )
    setShowDialog(false)
    setPassword("")
  }

  const getSignalColor = (signal: number) => {
    if (signal >= 80) return "text-green-500"
    if (signal >= 60) return "text-yellow-500"
    return "text-red-500"
  }

  const getSignalBars = (signal: number) => {
    if (signal >= 80) return 4
    if (signal >= 60) return 3
    if (signal >= 40) return 2
    return 1
  }

  return (
    <>
      <div className="grid gap-4">
        {networks.map((network) => (
          <Card key={network.id} className={network.connected ? "border-blue-500 border-2" : ""}>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4 flex-1">
                  <div className={`${getSignalColor(network.signal)}`}>
                    <Wifi className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-lg">{network.name}</h3>
                      {network.connected && <Badge variant="default">Connected</Badge>}
                      {network.secured ? (
                        <Lock className="w-4 h-4 text-muted-foreground" />
                      ) : (
                        <Unlock className="w-4 h-4 text-muted-foreground" />
                      )}
                    </div>
                    <div className="flex items-center gap-4 mt-1">
                      <span className="text-sm text-muted-foreground">Signal: {network.signal}%</span>
                      <Badge variant="outline">{network.frequency}</Badge>
                      <span className="text-xs text-muted-foreground">{network.secured ? "Secured" : "Open"}</span>
                    </div>
                  </div>
                </div>
                <Button
                  onClick={() => handleConnect(network)}
                  disabled={network.connected || isScanning}
                  variant={network.connected ? "outline" : "default"}
                >
                  {network.connected ? "Connected" : "Connect"}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Connect to {selectedNetwork?.name}</DialogTitle>
            <DialogDescription>Enter the password to connect to this secured network.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter network password"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDialog(false)}>
              Cancel
            </Button>
            <Button onClick={() => selectedNetwork && connectToNetwork(selectedNetwork)}>Connect</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
