"use client"

import { useAuth } from "@/components/auth-provider"
import { Navbar } from "@/components/navbar"
import { batteryWarehouses, chargingStations } from "@/lib/utils"
import { Battery, Bike, Check, Copy, MapPin } from "lucide-react"
import { useRouter, useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function Confirmation() {
  const { user, isLoading } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()
  
  const type = searchParams.get("type")
  const id = searchParams.get("id") ? Number.parseInt(searchParams.get("id")!) : null
  const bikeId = searchParams.get("bike") ? Number.parseInt(searchParams.get("bike")!) : null
  const hours = searchParams.get("hours") ? Number.parseInt(searchParams.get("hours")!) : null
  const pin = searchParams.get("pin")
  const batteryId = searchParams.get("batteryId")
  
  const [copied, setCopied] = useState(false)
  const [copiedBatteryId, setCopiedBatteryId] = useState(false)
  
  // Get details based on type
  const batteryWarehouse = id ? batteryWarehouses.find(w => w.id === id) : null
  const chargingStation = id ? chargingStations.find(s => s.id === id) : null
  const bike = bikeId && chargingStation ? chargingStation.availableBikes.find(b => b.id === bikeId) : null
  
  // Redirect if not logged in or missing parameters
  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/")
    } else if (!type || !id || !pin || (type === "bike" && (!bikeId || !hours))) {
      router.push("/select-service")
    }
  }, [user, isLoading, router, type, id, bikeId, hours, pin])

  if (isLoading || !type || !id || !pin || (type === "bike" && (!bikeId || !hours))) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    )
  }

  const copyPin = () => {
    navigator.clipboard.writeText(pin)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-1 pt-16">
        <section className="py-12 md:py-24 gradient-bg">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="h-16 w-16 rounded-full bg-primary/20 flex items-center justify-center mb-4 animate-fade-in">
                <Check className="h-8 w-8 text-primary" />
              </div>
              <div className="space-y-2 animate-fade-in">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl">
                  Confirmation
                </h1>
                <p className="max-w-[700px] text-muted-foreground md:text-xl/relaxed">
                  {type === "battery" 
                    ? "Your battery swap has been confirmed" 
                    : "Your bike rental has been confirmed"}
                </p>
              </div>
            </div>
            
            <div className="max-w-md mx-auto mt-12 animate-slide-up">
              <Card className="border-primary">
                <CardHeader className="text-center">
                  <CardTitle>
                    {type === "battery" ? "Battery Swap PIN" : "Bike Rental Confirmation"}
                  </CardTitle>
                  <CardDescription>
                    {type === "battery" 
                      ? "Use this PIN to collect your battery" 
                      : "Show this confirmation at the station"}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* PIN Display */}
                  <div className="flex flex-col items-center">
                    <div className="text-4xl font-bold tracking-widest bg-muted/30 py-4 px-6 rounded-lg w-full text-center">
                      {pin}
                    </div>
                    <button 
                      className="flex items-center text-sm text-primary mt-2 hover:underline"
                      onClick={copyPin}
                    >
                      {copied ? (
                        <>
                          <Check className="h-4 w-4 mr-1" />
                          Copied!
                        </>
                      ) : (
                        <>
                          <Copy className="h-4 w-4 mr-1" />
                          Copy PIN
                        </>
                      )}
                    </button>
                  </div>
                  
                  {/* Location Details */}
                  <div className="space-y-2 pt-4 border-t border-border">
                    <h3 className="font-medium">Location</h3>
                    <div className="flex items-start gap-2">
                      <MapPin className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                      <div>
                        <p className="font-medium">
                          {type === "battery" ? batteryWarehouse?.name : chargingStation?.name}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {type === "battery" ? batteryWarehouse?.address : chargingStation?.address}
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Service Details */}
                  <div className="space-y-2 pt-4 border-t border-border">
                    <h3 className="font-medium">Details</h3>
                    {type === "battery" ? (
                      <div className="flex items-start gap-2">
                        <Battery className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                        <div>
                          <p className="font-medium">Battery Swap</p>
                          <p className="text-sm text-muted-foreground">
                            One fully charged battery
                          </p>
                          {batteryId && (
                            <div className="mt-2 p-2 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-md">
                              <p className="text-xs font-medium text-green-800 dark:text-green-300">Battery ID (Confidential)</p>
                              <div className="flex items-center justify-between mt-1">
                                <code className="text-sm font-mono bg-green-100 dark:bg-green-800/30 px-2 py-0.5 rounded">
                                  {batteryId}
                                </code>
                                <button 
                                  className="text-xs text-primary flex items-center"
                                  onClick={() => {
                                    navigator.clipboard.writeText(batteryId);
                                    setCopiedBatteryId(true);
                                    setTimeout(() => setCopiedBatteryId(false), 2000);
                                  }}
                                >
                                  {copiedBatteryId ? (
                                    <>
                                      <Check className="h-3 w-3 mr-1" />
                                      Copied
                                    </>
                                  ) : (
                                    <>
                                      <Copy className="h-3 w-3 mr-1" />
                                      Copy
                                    </>
                                  )}
                                </button>
                              </div>
                              <p className="text-xs text-green-700 dark:text-green-400 mt-1">
                                Keep this ID confidential. You'll need it for service and warranty.
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-start gap-2">
                        <Bike className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                        <div>
                          <p className="font-medium">{bike?.model}</p>
                          <p className="text-sm text-muted-foreground">
                            {hours} hour{hours !== 1 ? 's' : ''} rental
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  {/* Instructions */}
                  <div className="space-y-2 pt-4 border-t border-border">
                    <h3 className="font-medium">Instructions</h3>
                    <p className="text-sm text-muted-foreground">
                      {type === "battery" 
                        ? "Present this PIN at the warehouse counter to collect your battery." 
                        : "Show this confirmation at the station to collect your bike."}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}

