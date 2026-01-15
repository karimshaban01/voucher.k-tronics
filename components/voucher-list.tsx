"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Search, Trash2, Download, Eye, Upload, Copy, CheckCircle2 } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { useToast } from "@/hooks/use-toast"

interface VoucherRoll {
  id: string
  name: string
  description: string
  uploadDate: string
  voucherCount: number
  codes: string[]
  fileName: string
}

interface PurchasedVoucher {
  code: string
  plan: string
  duration: string
  price: number
  purchaseDate: string
  status: string
  userName: string
  userEmail: string
  userPhone: string
}

export function VoucherList() {
  const [rolls, setRolls] = useState<VoucherRoll[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedRoll, setSelectedRoll] = useState<VoucherRoll | null>(null)

  useEffect(() => {
    loadRolls()
  }, [])

  const loadRolls = () => {
    const storedRolls = JSON.parse(localStorage.getItem("voucherRolls") || "[]")
    setRolls(storedRolls)
  }

  const handleDelete = (id: string) => {
    const updatedRolls = rolls.filter((roll) => roll.id !== id)
    localStorage.setItem("voucherRolls", JSON.stringify(updatedRolls))
    setRolls(updatedRolls)
  }

  const handleDownload = (roll: VoucherRoll) => {
    const content = roll.codes.join("\n")
    const blob = new Blob([content], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `${roll.name.replace(/\s+/g, "_")}.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const filteredRolls = rolls.filter((roll) => roll.name.toLowerCase().includes(searchTerm.toLowerCase()))

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Voucher Rolls</CardTitle>
          <CardDescription>Manage your uploaded voucher rolls</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search voucher rolls..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {filteredRolls.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <Upload className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No voucher rolls uploaded yet</p>
              <p className="text-sm">Upload your first voucher roll to get started</p>
            </div>
          ) : (
            <div className="border rounded-lg">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Roll Name</TableHead>
                    <TableHead>Upload Date</TableHead>
                    <TableHead>Vouchers</TableHead>
                    <TableHead>File</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredRolls.map((roll) => (
                    <TableRow key={roll.id}>
                      <TableCell className="font-medium">{roll.name}</TableCell>
                      <TableCell>{new Date(roll.uploadDate).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <Badge variant="secondary">{roll.voucherCount} codes</Badge>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">{roll.fileName}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button variant="ghost" size="sm" onClick={() => setSelectedRoll(roll)}>
                                <Eye className="w-4 h-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-2xl">
                              <DialogHeader>
                                <DialogTitle>{roll.name}</DialogTitle>
                                <DialogDescription>
                                  Uploaded on {new Date(roll.uploadDate).toLocaleDateString()}
                                </DialogDescription>
                              </DialogHeader>
                              <div className="space-y-4">
                                {roll.description && (
                                  <div>
                                    <h4 className="text-sm font-semibold mb-1">Description</h4>
                                    <p className="text-sm text-muted-foreground">{roll.description}</p>
                                  </div>
                                )}
                                <div>
                                  <h4 className="text-sm font-semibold mb-2">Voucher Codes ({roll.voucherCount})</h4>
                                  <div className="max-h-96 overflow-y-auto border rounded-lg p-4 bg-muted">
                                    <pre className="text-xs font-mono">{roll.codes.join("\n")}</pre>
                                  </div>
                                </div>
                              </div>
                            </DialogContent>
                          </Dialog>
                          <Button variant="ghost" size="sm" onClick={() => handleDownload(roll)}>
                            <Download className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => handleDelete(roll.id)}>
                            <Trash2 className="w-4 h-4 text-destructive" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Purchased Vouchers Section */}
      <Card>
        <CardHeader>
          <CardTitle>Purchased Vouchers</CardTitle>
          <CardDescription>Track vouchers purchased by users with their contact information</CardDescription>
        </CardHeader>
        <CardContent>
          <PurchasedVouchers />
        </CardContent>
      </Card>
    </div>
  )
}

function PurchasedVouchers() {
  const [vouchers, setVouchers] = useState<PurchasedVoucher[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [copiedCode, setCopiedCode] = useState<string | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    const storedVouchers = JSON.parse(localStorage.getItem("purchasedVouchers") || "[]")
    setVouchers(storedVouchers)
  }, [])

  const handleCopyCode = async (code: string) => {
    try {
      await navigator.clipboard.writeText(code)
      setCopiedCode(code)
      toast({
        title: "Copied!",
        description: "Voucher code copied to clipboard",
      })
      setTimeout(() => setCopiedCode(null), 2000)
    } catch (err) {
      toast({
        title: "Copy Failed",
        description: "Please copy the code manually",
        variant: "destructive",
      })
    }
  }

  const filteredVouchers = vouchers.filter(
    (v) =>
      v.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      v.userName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      v.userEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
      v.userPhone.includes(searchTerm),
  )

  if (vouchers.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <p>No vouchers purchased yet</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Search by code, name, email, or phone..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>
      <div className="border rounded-lg overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Voucher Code</TableHead>
              <TableHead>Plan</TableHead>
              <TableHead>User Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Purchase Date</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredVouchers.map((voucher, index) => (
              <TableRow key={index}>
                <TableCell className="font-mono text-sm">{voucher.code}</TableCell>
                <TableCell className="font-medium">{voucher.plan}</TableCell>
                <TableCell>{voucher.userName || "N/A"}</TableCell>
                <TableCell>{voucher.userEmail}</TableCell>
                <TableCell>{voucher.userPhone}</TableCell>
                <TableCell>{new Date(voucher.purchaseDate).toLocaleDateString()}</TableCell>
                <TableCell className="font-semibold">KSH {voucher.price}</TableCell>
                <TableCell>
                  <Badge variant={voucher.status === "active" ? "default" : "secondary"}>{voucher.status}</Badge>
                </TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="sm" onClick={() => handleCopyCode(voucher.code)}>
                    {copiedCode === voucher.code ? (
                      <CheckCircle2 className="w-4 h-4 text-green-600" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
