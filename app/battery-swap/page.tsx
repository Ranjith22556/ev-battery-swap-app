"use client"

import { useAuth } from "@/components/auth-provider"
import { Button } from "@/components/ui/button"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { MapView } from "@/components/map-view"
import { batteryWarehouses } from "@/lib/utils"
import { Battery, MapPin, Navigation } from "lucide-react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

export default function BatterySwap() {
  const { user, isLoading } = useAuth()
  const router = useRouter()
  const [selectedWarehouse, setSelectedWarehouse] = useState<number | null>(null)

  // Redirect if not logged in
  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/")
    }
  }, [user, isLoading, router])

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    )
  }

  const handleSelectWarehouse = (id: number) => {
    setSelectedWarehouse(id)
  }

  const selectedWarehouseData = batteryWarehouses.find((warehouse) => warehouse.id === selectedWarehouse)

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <main className="flex-1 pt-16">
        <section className="py-12 md:py-24 gradient-bg">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2 animate-fade-in">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl">Battery Swap Stations</h1>
                <p className="max-w-[700px] text-muted-foreground md:text-xl/relaxed">
                  Find a battery warehouse near you to swap your depleted battery
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-8 mt-12">
              {/* Map View */}
              <div className="animate-fade-in">
                <h2 className="text-xl font-semibold mb-4">Map View</h2>
                <MapView
                  locations={batteryWarehouses}
                  selectedId={selectedWarehouse || undefined}
                  onSelectLocation={handleSelectWarehouse}
                />
                <p className="text-sm text-muted-foreground mt-2">Click on a location pin to select a warehouse</p>
              </div>

              {/* Warehouses List */}
              <div className="animate-slide-up">
                <h2 className="text-xl font-semibold mb-4">Nearby Warehouses</h2>
                <div className="space-y-4">
                  {batteryWarehouses.map((warehouse) => (
                    <Card
                      key={warehouse.id}
                      className={`cursor-pointer transition-all duration-300 ${
                        selectedWarehouse === warehouse.id ? "border-primary" : "border-border hover:border-primary/50"
                      }`}
                      onClick={() => handleSelectWarehouse(warehouse.id)}
                    >
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg flex items-center">
                          <Battery className="h-5 w-5 mr-2 text-primary" />
                          {warehouse.name}
                        </CardTitle>
                        <CardDescription className="flex items-center">
                          <MapPin className="h-3 w-3 mr-1" />
                          {warehouse.address}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="pb-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Distance:</span>
                          <span>{warehouse.distance}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Available Batteries:</span>
                          <span>{warehouse.availableBatteries}</span>
                        </div>
                      </CardContent>
                      <CardFooter>
                        <div className="flex gap-2 w-full">
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex-1"
                            onClick={(e) => {
                              e.stopPropagation()
                              // In a real app, this would open maps with directions
                              window.alert(`Directions to ${warehouse.name}`)
                            }}
                          >
                            <Navigation className="h-4 w-4 mr-1" />
                            Directions
                          </Button>
                          <Button
                            variant="gradient"
                            size="sm"
                            className="flex-1"
                            onClick={(e) => {
                              e.stopPropagation()
                              if (selectedWarehouse === warehouse.id) {
                                router.push(`/payment?type=battery&id=${warehouse.id}`)
                              } else {
                                handleSelectWarehouse(warehouse.id)
                              }
                            }}
                          >
                            {selectedWarehouse === warehouse.id ? "Select" : "View"}
                          </Button>
                        </div>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              </div>
            </div>

            {/* Selected Warehouse Details */}
            {selectedWarehouseData && (
              <div className="mt-8 animate-fade-in">
                <Card className="border-primary">
                  <CardHeader>
                    <CardTitle>Selected Warehouse: {selectedWarehouseData.name}</CardTitle>
                    <CardDescription>{selectedWarehouseData.address}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h3 className="text-lg font-medium mb-2">Warehouse Details</h3>
                        <ul className="space-y-2">
                          <li className="flex justify-between">
                            <span className="text-muted-foreground">Distance:</span>
                            <span>{selectedWarehouseData.distance}</span>
                          </li>
                          <li className="flex justify-between">
                            <span className="text-muted-foreground">Available Batteries:</span>
                            <span>{selectedWarehouseData.availableBatteries}</span>
                          </li>
                          <li className="flex justify-between">
                            <span className="text-muted-foreground">Battery Price:</span>
                            <span>$25.00</span>
                          </li>
                        </ul>
                      </div>
                      <div>
                        <h3 className="text-lg font-medium mb-2">Operating Hours</h3>
                        <ul className="space-y-1">
                          <li className="flex justify-between">
                            <span className="text-muted-foreground">Monday - Friday:</span>
                            <span>7:00 AM - 10:00 PM</span>
                          </li>
                          <li className="flex justify-between">
                            <span className="text-muted-foreground">Saturday:</span>
                            <span>8:00 AM - 8:00 PM</span>
                          </li>
                          <li className="flex justify-between">
                            <span className="text-muted-foreground">Sunday:</span>
                            <span>9:00 AM - 6:00 PM</span>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button
                      variant="gradient"
                      className="w-full"
                      onClick={() => router.push(`/payment?type=battery&id=${selectedWarehouseData.id}`)}
                    >
                      Proceed to Payment
                    </Button>
                  </CardFooter>
                </Card>
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}

