"use client"

import { useEffect, useState } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle2, XCircle, Loader2, Copy, Phone, Mail } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

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
  transRef?: string
}

export function PaymentCallbackContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const { toast } = useToast()

  const [status, setStatus] = useState<"loading" | "success" | "failed">("loading")
  const [voucher, setVoucher] = useState<PurchasedVoucher | null>(null)
  const [copied, setCopied] = useState(false)
  const [message, setMessage] = useState("")

  useEffect(() => {
    const verifyPayment = async () => {
      const transToken = searchParams.get("TransactionToken") || searchParams.get("TransID")
      const companyRef = searchParams.get("CompanyRef")

      if (!transToken) {
        setStatus("failed")
        setMessage("Hakuna taarifa za malipo")
        return
      }

      try {
        const response = await fetch("/api/dpo/verify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ transToken }),
        })

        const data = await response.json()

        if (data.paid) {
          // Get pending purchase from localStorage
          const pendingPurchase = localStorage.getItem("pendingPurchase")

          if (pendingPurchase) {
            const purchase = JSON.parse(pendingPurchase)

            // Get available voucher code
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

            if (allAvailableCodes.length > 0) {
              const voucherCode = allAvailableCodes[0]

              const newPurchase: PurchasedVoucher = {
                code: voucherCode,
                plan: purchase.plan,
                duration: purchase.duration,
                price: purchase.price,
                purchaseDate: new Date().toISOString(),
                status: "active",
                userName: purchase.userName,
                userEmail: purchase.userEmail,
                userPhone: purchase.userPhone,
                transRef: companyRef || undefined,
              }

              purchasedVouchers.push(newPurchase)
              localStorage.setItem("purchasedVouchers", JSON.stringify(purchasedVouchers))
              localStorage.removeItem("pendingPurchase")

              setVoucher(newPurchase)
              setStatus("success")
              setMessage("Malipo yamefanikiwa!")
            } else {
              setStatus("failed")
              setMessage("Hakuna vocha zinazopatikana. Wasiliana na msaada.")
            }
          } else {
            setStatus("failed")
            setMessage("Taarifa za ununuzi hazikupatikana")
          }
        } else {
          setStatus("failed")
          setMessage(data.resultExplanation || "Malipo hayakufanikiwa")
        }
      } catch (error) {
        console.error("Verify payment error:", error)
        setStatus("failed")
        setMessage("Tatizo la kuthibitisha malipo")
      }
    }

    verifyPayment()
  }, [searchParams])

  const handleCopyCode = async () => {
    if (voucher) {
      try {
        await navigator.clipboard.writeText(voucher.code)
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

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <Card className="w-full max-w-md">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Loader2 className="w-16 h-16 animate-spin text-blue-600 mb-4" />
            <p className="text-lg font-medium">Inathibitisha malipo...</p>
            <p className="text-sm text-muted-foreground">Tafadhali subiri</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (status === "failed") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-orange-100 p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <CardTitle className="text-red-700">Malipo Yameshindikana</CardTitle>
            <CardDescription>{message}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-red-50 border border-red-200 p-4 rounded-lg space-y-2">
              <p className="font-semibold text-sm text-red-900">Unahitaji Msaada? Wasiliana Nasi:</p>
              <div className="space-y-1 text-sm">
                <div className="flex items-center gap-2 text-red-800">
                  <Phone className="w-4 h-4" />
                  <span>0785817222, 0628370174</span>
                </div>
                <div className="flex items-center gap-2 text-red-800">
                  <Mail className="w-4 h-4" />
                  <span>karimxhaban@gmail.com</span>
                </div>
              </div>
            </div>
            <Button className="w-full" onClick={() => router.push("/")}>
              Rudi Nyumbani
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-emerald-100 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <CardTitle className="text-green-700">Malipo Yamefanikiwa!</CardTitle>
          <CardDescription>Vocha yako ya WiFi iko tayari</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-lg border-2 border-blue-200">
            <p className="text-sm text-muted-foreground mb-2 text-center">Nambari Yako ya Vocha:</p>
            <p className="text-2xl font-bold text-center font-mono break-all mb-4">{voucher?.code}</p>
            <Button variant="outline" className="w-full bg-white" onClick={handleCopyCode}>
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
              <span className="font-medium">{voucher?.plan}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Muda:</span>
              <span className="font-medium">{voucher?.duration}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Kiasi Kilicholipwa:</span>
              <span className="font-medium">TSH {formatPrice(voucher?.price || 0)}</span>
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

          <Button className="w-full" onClick={() => router.push("/")}>
            Rudi Nyumbani
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
