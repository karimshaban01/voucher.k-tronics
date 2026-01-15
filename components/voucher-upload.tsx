"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Upload, FileText, CheckCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

export function VoucherUpload() {
  const [file, setFile] = useState<File | null>(null)
  const [rollName, setRollName] = useState("")
  const [description, setDescription] = useState("")
  const [uploadSuccess, setUploadSuccess] = useState(false)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0])
    }
  }

  const handleUpload = (e: React.FormEvent) => {
    e.preventDefault()

    if (!file || !rollName) {
      return
    }

    // Read file and parse voucher codes
    const reader = new FileReader()
    reader.onload = (event) => {
      const text = event.target?.result as string
      const codes = text
        .split("\n")
        .slice(7) // Skip the first 7 rows
        .map((line) => line.trim().replace(/"/g, "")) // Remove all double quotes
        .filter((line) => line.length > 0)

      // Store voucher roll
      const rolls = JSON.parse(localStorage.getItem("voucherRolls") || "[]")
      rolls.push({
        id: Date.now().toString(),
        name: rollName,
        description,
        uploadDate: new Date().toISOString(),
        voucherCount: codes.length,
        codes,
        fileName: file.name,
      })
      localStorage.setItem("voucherRolls", JSON.stringify(rolls))

      setUploadSuccess(true)
      setFile(null)
      setRollName("")
      setDescription("")

      setTimeout(() => setUploadSuccess(false), 3000)
    }
    reader.readAsText(file)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Upload Voucher Roll</CardTitle>
        <CardDescription>
          Upload a CSV or text file containing voucher codes (first voucher starts at row 8)
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleUpload} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="rollName">Roll Name</Label>
            <Input
              id="rollName"
              placeholder="e.g., Daily Vouchers - January 2024"
              value={rollName}
              onChange={(e) => setRollName(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description (Optional)</Label>
            <Textarea
              id="description"
              placeholder="Add notes about this voucher roll..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="file">Voucher File</Label>
            <div className="flex items-center gap-2">
              <Input id="file" type="file" accept=".txt,.csv" onChange={handleFileChange} required className="flex-1" />
              {file && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <FileText className="w-4 h-4" />
                  <span>{file.name}</span>
                </div>
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              Upload a text or CSV file with voucher codes (first voucher starts at row 8)
            </p>
          </div>

          {uploadSuccess && (
            <Alert className="bg-green-50 border-green-200">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800">Voucher roll uploaded successfully!</AlertDescription>
            </Alert>
          )}

          <Button type="submit" className="w-full" disabled={!file || !rollName}>
            <Upload className="w-4 h-4 mr-2" />
            Upload Voucher Roll
          </Button>
        </form>

        <div className="mt-6 p-4 bg-muted rounded-lg">
          <h4 className="font-semibold mb-2 text-sm">File Format Example:</h4>
          <pre className="text-xs font-mono bg-background p-2 rounded border">
            {`... header rows 1-7 (will be skipped) ...
KT-ABC123-XYZ
KT-DEF456-UVW
KT-GHI789-RST`}
          </pre>
          <p className="text-xs text-muted-foreground mt-2">
            Note: First 7 rows are skipped. Voucher codes start from row 8.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
