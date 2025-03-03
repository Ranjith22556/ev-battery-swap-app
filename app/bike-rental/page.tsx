"use client"

import { useAuth } from "@/components/auth-provider"
import { Button } from "@/components/ui/button"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { MapView } from "@/components/map-view"
import { chargingStations, calculateFare } from "@/lib/utils"
import { Bike, Calendar, Clock, MapPin, Navigation } from "lucide-react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"

export default function BikeRental() {
  const { user, isLoading } = useAuth()
  const router = useRouter()
  const [selectedStation, setSelectedStation] = useState<number | null>(null)
  const [selectedBike, setSelectedBike] = useState<number | null>(null)
  const [pickupDate, setPickupDate] = useState<string>(new Date().toISOString().split("T")[0])
  const [pickupTime, setPickupTime] = useState<string>("12:00")
  const [returnDate, setReturnDate] = useState<string>(new Date().toISOString().split("T")[0])
  const [returnTime, setReturnTime] = useState<string>("14:00")
  const [rentalHours, setRentalHours] = useState<number>(2)
  const [rentalFare, setRentalFare] = useState<number>(20)

  // Redirect if not logged in
  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/")
    }
  }, [user, isLoading, router])

  // Calculate rental hours and fare when dates/times change
  useEffect(() => {
    const pickupDateTime = new Date(`${pickupDate}T${pickupTime}:00`)
    const returnDateTime = new Date(`${returnDate}T${returnTime}:00`)

    // Calculate difference in hours
    const diffMs = returnDateTime.getTime() - pickupDateTime.getTime()
    const diffHours = Math.max(1, Math.ceil(diffMs / (1000 * 60 * 60)))

    setRentalHours(diffHours)
    setRentalFare(calculateFare(diffHours))
  }, [pickupDate, pickupTime, returnDate, returnTime])

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    )
  }

  const handleSelectStation = (id: number) => {
    setSelectedStation(id)
    setSelectedBike(null) // Reset selected bike when station changes
  }

  const handleSelectBike = (id: number) => {
    setSelectedBike(id)
  }

  const selectedStationData = chargingStations.find((station) => station.id === selectedStation)
  const selectedBikeData = selectedStationData?.availableBikes.find((bike) => bike.id === selectedBike)

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <main className="flex-1 pt-16">
        <section className="py-12 md:py-24 gradient-bg">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2 animate-fade-in">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl">Bike Rental Stations</h1>
                <p className="max-w-[700px] text-muted-foreground md:text-xl/relaxed">
                  Find a charging station near you to rent an electric bike
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-8 mt-12">
              {/* Map View */}
              <div className="animate-fade-in">
                <h2 className="text-xl font-semibold mb-4">Map View</h2>
                <MapView
                  locations={chargingStations}
                  selectedId={selectedStation || undefined}
                  onSelectLocation={handleSelectStation}
                />
                <p className="text-sm text-muted-foreground mt-2">
                  Click on a location pin to select a charging station
                </p>
              </div>

              {/* Charging Stations List */}
              <div className="animate-slide-up">
                <h2 className="text-xl font-semibold mb-4">Nearby Charging Stations</h2>
                <div className="space-y-4">
                  {chargingStations.map((station) => (
                    <Card
                      key={station.id}
                      className={`cursor-pointer transition-all duration-300 ${
                        selectedStation === station.id ? "border-primary" : "border-border hover:border-primary/50"
                      }`}
                      onClick={() => handleSelectStation(station.id)}
                    >
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg flex items-center">
                          <Bike className="h-5 w-5 mr-2 text-primary" />
                          {station.name}
                        </CardTitle>
                        <CardDescription className="flex items-center">
                          <MapPin className="h-3 w-3 mr-1" />
                          {station.address}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="pb-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Distance:</span>
                          <span>{station.distance}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Available Bikes:</span>
                          <span>{station.availableBikes.length}</span>
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
                              window.alert(`Directions to ${station.name}`)
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
                              if (selectedStation === station.id) {
                                // Already selected, do nothing
                              } else {
                                handleSelectStation(station.id)
                              }
                            }}
                          >
                            {selectedStation === station.id ? "Selected" : "View"}
                          </Button>
                        </div>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              </div>
            </div>

            {/* Selected Station Details */}
            {selectedStationData && (
              <div className="mt-8 animate-fade-in">
                <Card className="border-primary">
                  <CardHeader>
                    <CardTitle>Selected Station: {selectedStationData.name}</CardTitle>
                    <CardDescription>{selectedStationData.address}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-lg font-medium mb-4">Available Bikes</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {selectedStationData.availableBikes.map((bike) => (
                            <Card
                              key={bike.id}
                              className={`cursor-pointer transition-all duration-300 ${
                                selectedBike === bike.id ? "border-primary" : "border-border hover:border-primary/50"
                              }`}
                              onClick={() => handleSelectBike(bike.id)}
                            >
                              <CardHeader className="pb-2">
                                <CardTitle className="text-lg flex items-center">
                                  <Bike className="h-5 w-5 mr-2 text-primary" />
                                  {bike.model}
                                </CardTitle>
                              </CardHeader>
                              <CardContent className="pb-2">
                                <div className="flex justify-between text-sm">
                                  <span className="text-muted-foreground">Battery Level:</span>
                                  <span>{bike.batteryLevel}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                  <span className="text-muted-foreground">Bike ID:</span>
                                  <span>#{bike.id}</span>
                                </div>
                              </CardContent>
                              <CardFooter>
                                <Button
                                  variant={selectedBike === bike.id ? "gradient" : "outline"}
                                  size="sm"
                                  className="w-full"
                                  onClick={() => handleSelectBike(bike.id)}
                                >
                                  {selectedBike === bike.id ? "Selected" : "Select This Bike"}
                                </Button>
                              </CardFooter>
                            </Card>
                          ))}
                        </div>
                      </div>

                      {selectedBike && (
                        <div>
                          <h3 className="text-lg font-medium mb-4">Rental Details</h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-4">
                              <div>
                                <label className="text-sm font-medium mb-1 block">Pickup Date</label>
                                <div className="flex items-center">
                                  <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                                  <Input
                                    type="date"
                                    value={pickupDate}
                                    onChange={(e) => setPickupDate(e.target.value)}
                                    min={new Date().toISOString().split("T")[0]}
                                  />
                                </div>
                              </div>
                              <div>
                                <label className="text-sm font-medium mb-1 block">Pickup Time</label>
                                <div className="flex items-center">
                                  <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                                  <Input
                                    type="time"
                                    value={pickupTime}
                                    onChange={(e) => setPickupTime(e.target.value)}
                                  />
                                </div>
                              </div>
                            </div>
                            <div className="space-y-4">
                              <div>
                                <label className="text-sm font-medium mb-1 block">Return Date</label>
                                <div className="flex items-center">
                                  <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                                  <Input
                                    type="date"
                                    value={returnDate}
                                    onChange={(e) => setReturnDate(e.target.value)}
                                    min={pickupDate}
                                  />
                                </div>
                              </div>
                              <div>
                                <label className="text-sm font-medium mb-1 block">Return Time</label>
                                <div className="flex items-center">
                                  <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                                  <Input
                                    type="time"
                                    value={returnTime}
                                    onChange={(e) => setReturnTime(e.target.value)}
                                  />
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="mt-6 p-4 bg-muted/20 rounded-lg">
                            <div className="flex justify-between items-center">
                              <div>
                                <h4 className="font-medium">Rental Summary</h4>
                                <p className="text-sm text-muted-foreground">
                                  {rentalHours} hour{rentalHours !== 1 ? "s" : ""} @ $10/hour
                                </p>
                              </div>
                              <div className="text-right">
                                <div className="text-2xl font-bold">${rentalFare}.00</div>
                                <p className="text-xs text-muted-foreground">Total fare</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button
                      variant="gradient"
                      className="w-full"
                      disabled={!selectedBike}
                      onClick={() => {
                        if (selectedBike) {
                          router.push(
                            `/payment?type=bike&id=${selectedStationData.id}&bike=${selectedBike}&hours=${rentalHours}`,
                          )
                        }
                      }}
                    >
                      {selectedBike ? "Proceed to Payment" : "Select a Bike to Continue"}
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

