import { type NextRequest, NextResponse } from "next/server"

const DPO_COMPANY_TOKEN = "8D3DA73D-9D7F-4E09-96D4-3D44E7A83EA3"
const DPO_API_URL = "https://secure.3gdirectpay.com/API/v6/"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { transToken } = body

    const xmlRequest = `<?xml version="1.0" encoding="utf-8"?>
<API3G>
  <CompanyToken>${DPO_COMPANY_TOKEN}</CompanyToken>
  <Request>verifyToken</Request>
  <TransactionToken>${transToken}</TransactionToken>
</API3G>`

    const response = await fetch(DPO_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/xml",
      },
      body: xmlRequest,
    })

    const responseText = await response.text()

    // Parse XML response
    const resultMatch = responseText.match(/<Result>(\d+)<\/Result>/)
    const resultExplanationMatch = responseText.match(/<ResultExplanation>(.*?)<\/ResultExplanation>/)
    const transactionAmountMatch = responseText.match(/<TransactionAmount>(.*?)<\/TransactionAmount>/)
    const transactionApprovalMatch = responseText.match(/<TransactionApproval>(.*?)<\/TransactionApproval>/)
    const transactionCurrencyMatch = responseText.match(/<TransactionCurrency>(.*?)<\/TransactionCurrency>/)
    const customerNameMatch = responseText.match(/<CustomerName>(.*?)<\/CustomerName>/)
    const customerEmailMatch = responseText.match(/<CustomerEmail>(.*?)<\/CustomerEmail>/)
    const customerPhoneMatch = responseText.match(/<CustomerPhone>(.*?)<\/CustomerPhone>/)

    const result = resultMatch ? resultMatch[1] : null
    const resultExplanation = resultExplanationMatch ? resultExplanationMatch[1] : null

    // Result 000 = Transaction paid
    // Result 001 = Transaction created but not paid
    // Result 002 = Transaction cancelled
    // Result 007 = Transaction declined

    if (result === "000") {
      return NextResponse.json({
        success: true,
        paid: true,
        result,
        resultExplanation,
        transactionAmount: transactionAmountMatch ? transactionAmountMatch[1] : null,
        transactionApproval: transactionApprovalMatch ? transactionApprovalMatch[1] : null,
        transactionCurrency: transactionCurrencyMatch ? transactionCurrencyMatch[1] : null,
        customerName: customerNameMatch ? customerNameMatch[1] : null,
        customerEmail: customerEmailMatch ? customerEmailMatch[1] : null,
        customerPhone: customerPhoneMatch ? customerPhoneMatch[1] : null,
      })
    } else {
      return NextResponse.json({
        success: true,
        paid: false,
        result,
        resultExplanation,
      })
    }
  } catch (error) {
    console.error("DPO Verify Token Error:", error)
    return NextResponse.json(
      {
        success: false,
        resultExplanation: "Tatizo la seva. Tafadhali jaribu tena.",
      },
      { status: 500 },
    )
  }
}
