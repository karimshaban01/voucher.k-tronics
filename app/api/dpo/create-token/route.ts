import { type NextRequest, NextResponse } from "next/server"

const DPO_COMPANY_TOKEN = "44951E49-7A54-4617-BCFE-5161EB6B0A08"
const DPO_SERVICE_ID = "5525"
const DPO_API_URL = "https://secure.3gdirectpay.com/API/v6/"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      amount,
      customerEmail,
      customerFirstName,
      customerLastName,
      customerPhone,
      companyRef,
      redirectURL,
      backURL,
      serviceDescription,
    } = body

    const currentDate = new Date()
    const serviceDate = `${currentDate.getFullYear()}/${String(currentDate.getMonth() + 1).padStart(2, "0")}/${String(currentDate.getDate()).padStart(2, "0")} ${String(currentDate.getHours()).padStart(2, "0")}:${String(currentDate.getMinutes()).padStart(2, "0")}`

    const xmlRequest = `<?xml version="1.0" encoding="utf-8"?>
<API3G>
  <CompanyToken>${DPO_COMPANY_TOKEN}</CompanyToken>
  <Request>createToken</Request>
  <Transaction>
    <PaymentAmount>${amount}</PaymentAmount>
    <PaymentCurrency>TZS</PaymentCurrency>
    <CompanyRef>${companyRef}</CompanyRef>
    <RedirectURL>${redirectURL}</RedirectURL>
    <BackURL>${backURL}</BackURL>
    <CompanyRefUnique>0</CompanyRefUnique>
    <PTL>24</PTL>
    <customerEmail>${customerEmail}</customerEmail>
    <customerFirstName>${customerFirstName}</customerFirstName>
    <customerLastName>${customerLastName}</customerLastName>
    <customerPhone>${customerPhone}</customerPhone>
    <customerCountry>TZ</customerCountry>
    <DefaultPayment>MO</DefaultPayment>
    <DefaultPaymentCountry>Tanzania</DefaultPaymentCountry>
  </Transaction>
  <Services>
    <Service>
      <ServiceType>${DPO_SERVICE_ID}</ServiceType>
      <ServiceDescription>${serviceDescription}</ServiceDescription>
      <ServiceDate>${serviceDate}</ServiceDate>
    </Service>
  </Services>
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
    const transTokenMatch = responseText.match(/<TransToken>(.*?)<\/TransToken>/)
    const transRefMatch = responseText.match(/<TransRef>(.*?)<\/TransRef>/)

    const result = resultMatch ? resultMatch[1] : null
    const resultExplanation = resultExplanationMatch ? resultExplanationMatch[1] : null
    const transToken = transTokenMatch ? transTokenMatch[1] : null
    const transRef = transRefMatch ? transRefMatch[1] : null

    if (result === "000" && transToken) {
      const paymentURL = `https://secure.3gdirectpay.com/payv2.php?ID=${transToken}`

      return NextResponse.json({
        success: true,
        transToken,
        transRef,
        paymentURL,
        resultExplanation,
      })
    } else {
      return NextResponse.json(
        {
          success: false,
          result,
          resultExplanation: resultExplanation || "Imeshindikana kuunda malipo",
        },
        { status: 400 },
      )
    }
  } catch (error) {
    console.error("DPO Create Token Error:", error)
    return NextResponse.json(
      {
        success: false,
        resultExplanation: "Tatizo la seva. Tafadhali jaribu tena.",
      },
      { status: 500 },
    )
  }
}
