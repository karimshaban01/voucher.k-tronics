"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Check, Wifi, CreditCard, Copy, CheckCircle2, Phone, Mail, Loader2 } from "lucide-react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useToast } from "@/hooks/use-toast"

const voucherPlans = [
  {
    id: "1day",
    name: "Pasi ya Siku 1",
    duration: "Saa 24",
    price: 500,
    devices: 1,
    speed: "5 Mbps",
    features: ["Kasi ya kawaida", "Kifaa 1", "Msaada wa barua pepe"],
  },
  {
    id: "2days",
    name: "Pasi ya Siku 2",
    duration: "Siku 2",
    price: 1000,
    devices: 2,
    speed: "10 Mbps",
    features: ["Kasi nzuri", "Vifaa 2", "Msaada wa kipaumbele"],
    popular: true,
  },
  {
    id: "1week",
    name: "Pasi ya Wiki",
    duration: "Siku 7",
    price: 3000,
    devices: 5,
    speed: "20 Mbps",
    features: ["Kasi ya juu", "Vifaa 5", "Msaada wa kipaumbele", "Data isiyo na kikomo"],
  },
  {
    id: "1month",
    name: "Pasi ya Mwezi",
    duration: "Siku 30",
    price: 10000,
    devices: 10,
    speed: "50 Mbps",
    features: ["Kasi ya juu kabisa", "Vifaa 10", "Msaada 24/7", "Data isiyo na kikomo"],
  },
]

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

export function VoucherPurchase() {
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null)
  const [showCheckout, setShowCheckout] = useState(false)
  const [purchasedVoucher, setPurchasedVoucher] = useState<PurchasedVoucher | null>(null)
  const [userName, setUserName] = useState("")
  const [userEmail, setUserEmail] = useState("")
  const [userPhone, setUserPhone] = useState("")
  const [copied, setCopied] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const { toast } = useToast()

  const handlePurchase = (planId: string) => {
    setSelectedPlan(planId)
    setShowCheckout(true)
  }

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsProcessing(true)

    const plan = voucherPlans.find((p) => p.id === selectedPlan)!

    // Check if vouchers are available
    const voucherRolls = JSON.parse(localStorage.getItem("voucherRolls") || "[]")
    const purchasedVouchers = JSON.parse(localStorage.getItem("purchasedVouchers") || "[]")

    const allAvailableCodes: string[] = []
    voucherRolls.forEach((roll: any) => {
      roll.codes.forEach((code: string) => {
        if (!purchasedVouchers.find((pv: any) => pv.code === code)) {
          allAvailableCodes.push(code)
        }
      })
    })

    if (allAvailableCodes.length === 0) {
      toast({
        title: "Hakuna Vocha Zinazopatikana",
        description: "Samahani, hakuna vocha zinazopatikana kwa sasa. Tafadhali wasiliana na msimamizi.",
        variant: "destructive",
      })
      setShowCheckout(false)
      setIsProcessing(false)
      return
    }

    // Split name into first and last name
    const nameParts = userName.trim().split(" ")
    const firstName = nameParts[0] || ""
    const lastName = nameParts.slice(1).join(" ") || firstName

    // Generate unique reference
    const companyRef = `KTRONICS-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`

    // Store pending purchase
    const pendingPurchase = {
      plan: plan.name,
      duration: plan.duration,
      price: plan.price,
      userName,
      userEmail,
      userPhone,
      companyRef,
    }
    localStorage.setItem("pendingPurchase", JSON.stringify(pendingPurchase))

    try {
      const baseUrl = window.location.origin

      const response = await fetch("/api/dpo/create-token", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: plan.price,
          customerEmail: userEmail,
          customerFirstName: firstName,
          customerLastName: lastName,
          customerPhone: userPhone.replace(/\D/g, ""),
          companyRef,
          redirectURL: `${baseUrl}/payment/callback`,
          backURL: `${baseUrl}`,
          serviceDescription: `K-TRONICS WiFi - ${plan.name}`,
        }),
      })

      const data = await response.json()

      if (data.success && data.paymentURL) {
        // Redirect to DPO payment page
        window.location.href = data.paymentURL
      } else {
        toast({
          title: "Tatizo la Malipo",
          description: data.resultExplanation || "Imeshindikana kuanzisha malipo. Tafadhali jaribu tena.",
          variant: "destructive",
        })
        setIsProcessing(false)
      }
    } catch (error) {
      console.error("Payment initiation error:", error)
      toast({
        title: "Tatizo la Mtandao",
        description: "Imeshindikana kuwasiliana na seva. Tafadhali jaribu tena.",
        variant: "destructive",
      })
      setIsProcessing(false)
    }
  }

  const handleCopyCode = async () => {
    if (purchasedVoucher) {
      try {
        await navigator.clipboard.writeText(purchasedVoucher.code)
        setCopied(true)
        toast({
          title: "Imenakiliwa!",
          description: "Nambari ya vocha imenakiliwa",
        })
        setTimeout(() => setCopied(false), 2000)
      } catch (err) {
        toast({
          title: "Kunakili Kumeshindikana",
          description: "Tafadhali nakili nambari wewe mwenyewe",
          variant: "destructive",
        })
      }
    }
  }

  const formatPrice = (price: number) => {
    return price.toLocaleString("sw-TZ")
  }

  return (
    <>
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-center mb-2">Chagua Mpango Wako</h2>
        <p className="text-center text-muted-foreground">Chagua vocha ya WiFi inayofaa mahitaji yako</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {voucherPlans.map((plan) => (
          <Card key={plan.id} className={`relative ${plan.popular ? "border-blue-600 border-2 shadow-lg" : ""}`}>
            {plan.popular && (
              <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-600">Maarufu Zaidi</Badge>
            )}
            <CardHeader>
              <CardTitle className="text-xl">{plan.name}</CardTitle>
              <CardDescription>{plan.duration}</CardDescription>
              <div className="mt-4">
                <span className="text-4xl font-bold">TSH {formatPrice(plan.price)}</span>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <Wifi className="w-4 h-4 text-blue-600" />
                  <span>Kasi: {plan.speed}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Check className="w-4 h-4 text-green-600" />
                  <span>{plan.devices > 1 ? `Vifaa ${plan.devices}` : `Kifaa ${plan.devices}`}</span>
                </div>
              </div>
              <div className="space-y-2">
                {plan.features.map((feature, index) => (
                  <div key={index} className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Check className="w-4 h-4" />
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full" onClick={() => handlePurchase(plan.id)}>
                Nunua Vocha
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      {/* Checkout Dialog */}
      <Dialog open={showCheckout} onOpenChange={(open) => !isProcessing && setShowCheckout(open)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Kamilisha Ununuzi Wako</DialogTitle>
            <DialogDescription>Jaza taarifa zako kuendelea na malipo</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleCheckout} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Jina Kamili</Label>
              <Input
                id="name"
                type="text"
                placeholder="Jina Kamili"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                required
                disabled={isProcessing}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Barua Pepe</Label>
              <Input
                id="email"
                type="email"
                placeholder="barua@mfano.com"
                value={userEmail}
                onChange={(e) => setUserEmail(e.target.value)}
                required
                disabled={isProcessing}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Nambari ya Simu</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="0700 000 000"
                value={userPhone}
                onChange={(e) => setUserPhone(e.target.value)}
                required
                disabled={isProcessing}
              />
            </div>

            <div className="bg-muted p-4 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm">Mpango Uliochaguliwa:</span>
                <span className="font-semibold">{voucherPlans.find((p) => p.id === selectedPlan)?.name}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Jumla ya Malipo:</span>
                <span className="text-xl font-bold">
                  TSH {formatPrice(voucherPlans.find((p) => p.id === selectedPlan)?.price || 0)}
                </span>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 p-3 rounded-lg">
              <p className="text-xs text-blue-800 text-center">
                Utaelekezwa kwenye DPO Payment kuchagua njia ya malipo (M-Pesa, Airtel Money, Tigo Pesa, HaloPesa, TTCL,
                au Kadi)
              </p>
            </div>

            <Button type="submit" className="w-full" disabled={isProcessing}>
              {isProcessing ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Inaandaa Malipo...
                </>
              ) : (
                <>
                  <CreditCard className="w-4 h-4 mr-2" />
                  Endelea na Malipo
                </>
              )}
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      {/* Success Dialog */}
      <Dialog open={!!purchasedVoucher} onOpenChange={() => setPurchasedVoucher(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Vocha Imenunuliwa Kwa Mafanikio!</DialogTitle>
            <DialogDescription>Hifadhi nambari yako ya vocha kuunganisha na WiFi</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-lg border-2 border-blue-200">
              <p className="text-sm text-muted-foreground mb-2">Nambari Yako ya Vocha:</p>
              <p className="text-2xl font-bold text-center font-mono break-all mb-4">{purchasedVoucher?.code}</p>
              <Button variant="outline" className="w-full bg-transparent" onClick={handleCopyCode}>
                {copied ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 mr-2 text-green-600" />
                    Imenakiliwa!
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 mr-2" />
                    Nakili Nambari
                  </>
                )}
              </Button>
            </div>
            <div className="bg-muted p-4 rounded-lg space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Mpango:</span>
                <span className="font-medium">{purchasedVoucher?.plan}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Muda:</span>
                <span className="font-medium">{purchasedVoucher?.duration}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Kiasi Kilicholipwa:</span>
                <span className="font-medium">TSH {formatPrice(purchasedVoucher?.price || 0)}</span>
              </div>
            </div>
            <div className="space-y-2 text-sm text-muted-foreground">
              <p>1. Unganisha na mtandao wa K-TRONICS WiFi</p>
              <p>2. Fungua kivinjari chako na uweke nambari ya vocha</p>
              <p>3. Furahia matumizi yako ya intaneti!</p>
            </div>

            <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg space-y-2">
              <p className="font-semibold text-sm text-blue-900">Unahitaji Msaada? Wasiliana Nasi:</p>
              <div className="space-y-1 text-sm">
                <div className="flex items-center gap-2 text-blue-800">
                  <Phone className="w-4 h-4" />
                  <span>0785817222, 0628370174</span>
                </div>
                <div className="flex items-center gap-2 text-blue-800">
                  <Mail className="w-4 h-4" />
                  <span>karimxhaban@gmail.com</span>
                </div>
              </div>
            </div>

            <Button className="w-full" onClick={() => setPurchasedVoucher(null)}>
              Nimeelewa!
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
