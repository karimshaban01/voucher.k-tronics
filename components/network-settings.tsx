"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useState } from "react"

export function NetworkSettings() {
  const [settings, setSettings] = useState({
    ssid: "K-TRONICS-5G",
    password: "••••••••••••",
    channel: "36",
    bandwidth: "80MHz",
    encryption: "WPA3",
    dhcp: true,
    hideSSID: false,
    guestNetwork: true,
  })

  return (
    <div className="grid gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Basic Configuration</CardTitle>
          <CardDescription>Configure your network name and security settings</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="ssid">Network Name (SSID)</Label>
            <Input
              id="ssid"
              value={settings.ssid}
              onChange={(e) => setSettings({ ...settings, ssid: e.target.value })}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="password">Network Password</Label>
            <Input
              id="password"
              type="password"
              value={settings.password}
              onChange={(e) => setSettings({ ...settings, password: e.target.value })}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="encryption">Encryption Type</Label>
            <Select
              value={settings.encryption}
              onValueChange={(value) => setSettings({ ...settings, encryption: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="WPA3">WPA3 (Recommended)</SelectItem>
                <SelectItem value="WPA2">WPA2</SelectItem>
                <SelectItem value="WPA">WPA</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Advanced Settings</CardTitle>
          <CardDescription>Configure channel, bandwidth, and advanced options</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="channel">WiFi Channel</Label>
            <Select value={settings.channel} onValueChange={(value) => setSettings({ ...settings, channel: value })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="36">Channel 36 (5GHz)</SelectItem>
                <SelectItem value="40">Channel 40 (5GHz)</SelectItem>
                <SelectItem value="44">Channel 44 (5GHz)</SelectItem>
                <SelectItem value="6">Channel 6 (2.4GHz)</SelectItem>
                <SelectItem value="11">Channel 11 (2.4GHz)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="bandwidth">Channel Bandwidth</Label>
            <Select
              value={settings.bandwidth}
              onValueChange={(value) => setSettings({ ...settings, bandwidth: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="20MHz">20 MHz</SelectItem>
                <SelectItem value="40MHz">40 MHz</SelectItem>
                <SelectItem value="80MHz">80 MHz</SelectItem>
                <SelectItem value="160MHz">160 MHz</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>DHCP Server</Label>
              <p className="text-sm text-muted-foreground">Automatically assign IP addresses</p>
            </div>
            <Switch
              checked={settings.dhcp}
              onCheckedChange={(checked) => setSettings({ ...settings, dhcp: checked })}
            />
          </div>
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Hide SSID</Label>
              <p className="text-sm text-muted-foreground">Make network invisible to others</p>
            </div>
            <Switch
              checked={settings.hideSSID}
              onCheckedChange={(checked) => setSettings({ ...settings, hideSSID: checked })}
            />
          </div>
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Guest Network</Label>
              <p className="text-sm text-muted-foreground">Enable isolated guest access</p>
            </div>
            <Switch
              checked={settings.guestNetwork}
              onCheckedChange={(checked) => setSettings({ ...settings, guestNetwork: checked })}
            />
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end gap-4">
        <Button variant="outline">Reset to Defaults</Button>
        <Button>Save Changes</Button>
      </div>
    </div>
  )
}
