"use client"

import type React from "react"

import { useAuth } from "@/components/auth-provider"
import { Button } from "@/components/ui/button"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { batteryWarehouses, chargingStations, calculateFare, generatePin } from "@/lib/utils"
import { Battery, Bike, CreditCard, Lock, Check } from "lucide-react"
import { useRouter, useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"

export default function Payment() {
  const { user, isLoading } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()

  const type = searchParams.get("type")
  const id = searchParams.get("id") ? Number.parseInt(searchParams.get("id")!) : null
  const bikeId = searchParams.get("bike") ? Number.parseInt(searchParams.get("bike")!) : null
  const hours = searchParams.get("hours") ? Number.parseInt(searchParams.get("hours")!) : null

  const [cardNumber, setCardNumber] = useState("")
  const [cardName, setCardName] = useState("")
  const [expiryDate, setExpiryDate] = useState("")
  const [cvv, setCvv] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)
  const [paymentStatus, setPaymentStatus] = useState<"idle" | "processing" | "success" | "error">("idle")

  // Get details based on type
  const batteryWarehouse = id ? batteryWarehouses.find((w) => w.id === id) : null
  const chargingStation = id ? chargingStations.find((s) => s.id === id) : null
  const bike = bikeId && chargingStation ? chargingStation.availableBikes.find((b) => b.id === bikeId) : null

  // Calculate amount
  const amount = type === "battery" ? 25 : hours ? calculateFare(hours) : 0

  // Redirect if not logged in or missing parameters
  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/")
    } else if (!type || !id || (type === "bike" && (!bikeId || !hours))) {
      router.push("/select-service")
    }
  }, [user, isLoading, router, type, id, bikeId, hours])

  if (isLoading || !type || !id || (type === "bike" && (!bikeId || !hours))) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    )
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsProcessing(true)
    setPaymentStatus("processing")

    // Simulate payment processing with a more realistic flow
    setTimeout(() => {
      setPaymentStatus("success")
      
      // Generate a 6-digit PIN for battery or confirmation for bike
      const pin = generatePin()
      
      console.log(`Payment successful! Generated PIN: ${pin}`)
      
      // Wait a moment to show success message before redirecting
      setTimeout(() => {
        // Redirect to confirmation page with the PIN
        router.push(
          `/confirmation?type=${type}&id=${id}${type === "bike" ? `&bike=${bikeId}&hours=${hours}` : ""}&pin=${pin}`
        )
      }, 1000)
    }, 1500)
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <main className="flex-1 pt-16">
        <section className="py-12 md:py-24 gradient-bg">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2 animate-fade-in">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl">Payment</h1>
                <p className="max-w-[700px] text-muted-foreground md:text-xl/relaxed">
                  Complete your payment to{" "}
                  {type === "battery" ? "get your battery swap PIN" : "confirm your bike rental"}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-12 max-w-4xl mx-auto">
              {/* Order Summary */}
              <div className="animate-fade-in">
                <Card>
                  <CardHeader>
                    <CardTitle>Order Summary</CardTitle>
                    <CardDescription>
                      {type === "battery" ? "Battery Swap Details" : "Bike Rental Details"}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {type === "battery" && batteryWarehouse && (
                      <div className="space-y-4">
                        <div className="flex items-center gap-2">
                          <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center">
                            <Battery className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <h3 className="font-medium">{batteryWarehouse.name}</h3>
                            <p className="text-sm text-muted-foreground">{batteryWarehouse.address}</p>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Battery Swap Fee:</span>
                            <span>${amount}.00</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Available Batteries:</span>
                            <span>{batteryWarehouse.availableBatteries}</span>
                          </div>
                        </div>

                        <div className="pt-4 border-t border-border">
                          <div className="flex justify-between font-medium">
                            <span>Total:</span>
                            <span>${amount}.00</span>
                          </div>
                        </div>
                      </div>
                    )}

                    {type === "bike" && chargingStation && bike && hours && (
                      <div className="space-y-4">
                        <div className="flex items-center gap-2">
                          <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center">
                            <Bike className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <h3 className="font-medium">{chargingStation.name}</h3>
                            <p className="text-sm text-muted-foreground">{chargingStation.address}</p>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Bike Model:</span>
                            <span>{bike.model}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Battery Level:</span>
                            <span>{bike.batteryLevel}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Rental Duration:</span>
                            <span>
                              {hours} hour{hours !== 1 ? "s" : ""}
                            </span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Rate:</span>
                            <span>$10.00 per hour</span>
                          </div>
                        </div>

                        <div className="pt-4 border-t border-border">
                          <div className="flex justify-between font-medium">
                            <span>Total:</span>
                            <span>${amount}.00</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Payment Form */}
              <div className="animate-slide-up">
                <Card>
                  <CardHeader>
                    <CardTitle>Payment Details</CardTitle>
                    <CardDescription>Enter your card information to complete the payment</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {paymentStatus === "success" ? (
                      <div className="flex flex-col items-center justify-center py-8 space-y-4">
                        <div className="h-16 w-16 rounded-full bg-green-100 flex items-center justify-center">
                          <Check className="h-8 w-8 text-green-600" />
                        </div>
                        <h3 className="text-xl font-medium text-center">Payment Successful!</h3>
                        <p className="text-muted-foreground text-center">
                          Your payment has been processed successfully. Redirecting to confirmation page...
                        </p>
                      </div>
                    ) : (
                      <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                          <label className="text-sm font-medium" htmlFor="cardNumber">
                            Card Number
                          </label>
                          <div className="relative">
                            <Input
                              id="cardNumber"
                              placeholder="1234 5678 9012 3456"
                              value={cardNumber}
                              onChange={(e) => setCardNumber(e.target.value)}
                              required
                              maxLength={19}
                              className="pl-10"
                              disabled={paymentStatus === "processing"}
                            />
                            <CreditCard className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <label className="text-sm font-medium" htmlFor="cardName">
                            Cardholder Name
                          </label>
                          <Input
                            id="cardName"
                            placeholder="John Doe"
                            value={cardName}
                            onChange={(e) => setCardName(e.target.value)}
                            required
                            disabled={paymentStatus === "processing"}
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <label className="text-sm font-medium" htmlFor="expiryDate">
                              Expiry Date
                            </label>
                            <Input
                              id="expiryDate"
                              placeholder="MM/YY"
                              value={expiryDate}
                              onChange={(e) => setExpiryDate(e.target.value)}
                              required
                              maxLength={5}
                              disabled={paymentStatus === "processing"}
                            />
                          </div>

                          <div className="space-y-2">
                            <label className="text-sm font-medium" htmlFor="cvv">
                              CVV
                            </label>
                            <div className="relative">
                              <Input
                                id="cvv"
                                placeholder="123"
                                value={cvv}
                                onChange={(e) => setCvv(e.target.value)}
                                required
                                maxLength={3}
                                className="pl-10"
                                disabled={paymentStatus === "processing"}
                              />
                              <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                            </div>
                          </div>
                        </div>

                        <div className="pt-4">
                          <Button 
                            type="submit" 
                            className="w-full" 
                            disabled={paymentStatus === "processing"}
                          >
                            {paymentStatus === "processing" ? (
                              <>
                                <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-background border-t-transparent"></div>
                                Processing Payment...
                              </>
                            ) : (
                              `Pay $${amount}.00`
                            )}
                          </Button>
                        </div>
                        
                        {/* Test Card Information */}
                        <div className="mt-4 p-3 bg-muted/30 rounded-md">
                          <p className="text-xs text-muted-foreground mb-2">For testing, you can use:</p>
                          <div className="grid grid-cols-2 gap-2 text-xs">
                            <div>Card Number:</div>
                            <div className="font-mono">4242 4242 4242 4242</div>
                            <div>Expiry Date:</div>
                            <div className="font-mono">Any future date</div>
                            <div>CVV:</div>
                            <div className="font-mono">Any 3 digits</div>
                            <div>Name:</div>
                            <div className="font-mono">Any name</div>
                          </div>
                        </div>
                      </form>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}

