import { Suspense } from "react"
import { PaymentCallbackContent } from "@/components/payment-callback-content"
import { Card, CardContent } from "@/components/ui/card"
import { Loader2 } from "lucide-react"

function LoadingFallback() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <Card className="w-full max-w-md">
        <CardContent className="flex flex-col items-center justify-center py-12">
          <Loader2 className="w-16 h-16 animate-spin text-blue-600 mb-4" />
          <p className="text-lg font-medium">Inapakia...</p>
        </CardContent>
      </Card>
    </div>
  )
}

export default function PaymentCallbackPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <PaymentCallbackContent />
    </Suspense>
  )
}
