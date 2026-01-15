"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Check, Wifi, CreditCard, Copy, CheckCircle2, Phone, Mail } from "lucide-react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useToast } from "@/hooks/use-toast"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

const voucherPlans = [
  {
    id: "1hour",
    name: "1 Hour Access",
    duration: "1 Hour",
    price: 50,
    devices: 1,
    speed: "5 Mbps",
    features: ["Basic speed", "1 device", "No support"],
  },
  {
    id: "1day",
    name: "Daily Pass",
    duration: "24 Hours",
    price: 200,
    devices: 2,
    speed: "10 Mbps",
    features: ["Standard speed", "2 devices", "Email support"],
    popular: true,
  },
  {
    id: "1week",
    name: "Weekly Pass",
    duration: "7 Days",
    price: 1000,
    devices: 5,
    speed: "20 Mbps",
    features: ["High speed", "5 devices", "Priority support", "No data cap"],
  },
  {
    id: "1month",
    name: "Monthly Pass",
    duration: "30 Days",
    price: 3500,
    devices: 10,
    speed: "50 Mbps",
    features: ["Maximum speed", "10 devices", "24/7 support", "Unlimited data"],
  },
]

const paymentMethods = [
  { id: "mpesa", name: "M-Pesa", icon: "📱" },
  { id: "airtel", name: "Airtel Money", icon: "📱" },
  { id: "tigo", name: "Tigo Pesa", icon: "📱" },
  { id: "halopesa", name: "HaloPesa", icon: "📱" },
  { id: "ttcl", name: "TTCL", icon: "📱" },
  { id: "card", name: "Card Payment", icon: "💳" },
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
  const [paymentMethod, setPaymentMethod] = useState("mpesa")
  const [paymentNumber, setPaymentNumber] = useState("")
  const [copied, setCopied] = useState(false)
  const { toast } = useToast()

  const handlePurchase = (planId: string) => {
    setSelectedPlan(planId)
    setShowCheckout(true)
  }

  const handleCheckout = (e: React.FormEvent) => {
    e.preventDefault()

    // Get available voucher codes from uploaded rolls
    const voucherRolls = JSON.parse(localStorage.getItem("voucherRolls") || "[]")
    const purchasedVouchers = JSON.parse(localStorage.getItem("purchasedVouchers") || "[]")

    // Get all available codes (not yet purchased)
    const allAvailableCodes: string[] = []
    voucherRolls.forEach((roll: any) => {
      roll.codes.forEach((code: string) => {
        if (!purchasedVouchers.find((pv: any) => pv.code === code)) {
          allAvailableCodes.push(code)
        }
      })
    })

    // Check if there are available vouchers
    if (allAvailableCodes.length === 0) {
      toast({
        title: "No Vouchers Available",
        description: "Sorry, there are no available vouchers at the moment. Please contact admin.",
        variant: "destructive",
      })
      setShowCheckout(false)
      return
    }

    // Assign the first available voucher
    const voucherCode = allAvailableCodes[0]
    const plan = voucherPlans.find((p) => p.id === selectedPlan)!

    // Create purchased voucher record
    const newPurchase: PurchasedVoucher = {
      code: voucherCode,
      plan: plan.name,
      duration: plan.duration,
      price: plan.price,
      purchaseDate: new Date().toISOString(),
      status: "active",
      userName: userName,
      userEmail: userEmail,
      userPhone: userPhone,
    }

    // Store in purchasedVouchers
    purchasedVouchers.push(newPurchase)
    localStorage.setItem("purchasedVouchers", JSON.stringify(purchasedVouchers))

    setPurchasedVoucher(newPurchase)
    setShowCheckout(false)
    setUserName("")
    setUserEmail("")
    setUserPhone("")
    setPaymentNumber("")
  }

  const handleCopyCode = async () => {
    if (purchasedVoucher) {
      try {
        await navigator.clipboard.writeText(purchasedVoucher.code)
        setCopied(true)
        toast({
          title: "Copied!",
          description: "Voucher code copied to clipboard",
        })
        setTimeout(() => setCopied(false), 2000)
      } catch (err) {
        toast({
          title: "Copy Failed",
          description: "Please copy the code manually",
          variant: "destructive",
        })
      }
    }
  }

  return (
    <>
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-center mb-2">Choose Your Plan</h2>
        <p className="text-center text-muted-foreground">Select the perfect WiFi voucher for your needs</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {voucherPlans.map((plan) => (
          <Card key={plan.id} className={`relative ${plan.popular ? "border-blue-600 border-2 shadow-lg" : ""}`}>
            {plan.popular && (
              <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-600">Most Popular</Badge>
            )}
            <CardHeader>
              <CardTitle className="text-xl">{plan.name}</CardTitle>
              <CardDescription>{plan.duration}</CardDescription>
              <div className="mt-4">
                <span className="text-4xl font-bold">KSH {plan.price}</span>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <Wifi className="w-4 h-4 text-blue-600" />
                  <span>Speed: {plan.speed}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Check className="w-4 h-4 text-green-600" />
                  <span>
                    {plan.devices} device{plan.devices > 1 ? "s" : ""}
                  </span>
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
                Purchase Voucher
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      {/* Checkout Dialog */}
      <Dialog open={showCheckout} onOpenChange={setShowCheckout}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Complete Your Purchase</DialogTitle>
            <DialogDescription>Enter your details and select payment method</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleCheckout} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                type="text"
                placeholder="John Doe"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                placeholder="your@email.com"
                value={userEmail}
                onChange={(e) => setUserEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="+255 700 000 000"
                value={userPhone}
                onChange={(e) => setUserPhone(e.target.value)}
                required
              />
            </div>

            <div className="space-y-3">
              <Label>Select Payment Method</Label>
              <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
                <div className="grid grid-cols-2 gap-3">
                  {paymentMethods.map((method) => (
                    <div key={method.id} className="relative">
                      <RadioGroupItem value={method.id} id={method.id} className="peer sr-only" />
                      <Label
                        htmlFor={method.id}
                        className="flex items-center gap-3 p-4 border-2 rounded-lg cursor-pointer hover:bg-accent peer-data-[state=checked]:border-blue-600 peer-data-[state=checked]:bg-blue-50 transition-all"
                      >
                        <span className="text-2xl">{method.icon}</span>
                        <span className="font-medium text-sm">{method.name}</span>
                      </Label>
                    </div>
                  ))}
                </div>
              </RadioGroup>
            </div>

            <div className="space-y-2">
              <Label htmlFor="payment-number">
                {paymentMethod === "card"
                  ? "Card Number"
                  : `${paymentMethods.find((m) => m.id === paymentMethod)?.name} Number`}
              </Label>
              <Input
                id="payment-number"
                type={paymentMethod === "card" ? "text" : "tel"}
                placeholder={paymentMethod === "card" ? "1234 5678 9012 3456" : "0700000000"}
                value={paymentNumber}
                onChange={(e) => setPaymentNumber(e.target.value)}
                required
              />
            </div>

            <div className="bg-muted p-4 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm">Selected Plan:</span>
                <span className="font-semibold">{voucherPlans.find((p) => p.id === selectedPlan)?.name}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Total Amount:</span>
                <span className="text-xl font-bold">KSH {voucherPlans.find((p) => p.id === selectedPlan)?.price}</span>
              </div>
            </div>
            <Button type="submit" className="w-full">
              <CreditCard className="w-4 h-4 mr-2" />
              Complete Payment
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={!!purchasedVoucher} onOpenChange={() => setPurchasedVoucher(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Voucher Purchased Successfully!</DialogTitle>
            <DialogDescription>Save your voucher code to connect to WiFi</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-lg border-2 border-blue-200">
              <p className="text-sm text-muted-foreground mb-2">Your Voucher Code:</p>
              <p className="text-2xl font-bold text-center font-mono break-all mb-4">{purchasedVoucher?.code}</p>
              <Button variant="outline" className="w-full bg-transparent" onClick={handleCopyCode}>
                {copied ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 mr-2 text-green-600" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 mr-2" />
                    Copy Code
                  </>
                )}
              </Button>
            </div>
            <div className="bg-muted p-4 rounded-lg space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Plan:</span>
                <span className="font-medium">{purchasedVoucher?.plan}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Duration:</span>
                <span className="font-medium">{purchasedVoucher?.duration}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Amount Paid:</span>
                <span className="font-medium">KSH {purchasedVoucher?.price}</span>
              </div>
            </div>
            <div className="space-y-2 text-sm text-muted-foreground">
              <p>1. Connect to K-TRONICS WiFi network</p>
              <p>2. Open your browser and enter the voucher code</p>
              <p>3. Enjoy your internet access!</p>
            </div>

            <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg space-y-2">
              <p className="font-semibold text-sm text-blue-900">Need Help? Contact Support:</p>
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
              Got it!
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
