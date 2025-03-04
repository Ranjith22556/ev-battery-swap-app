"use client"

import { useAuth } from "@/components/auth-provider"
import { Button } from "@/components/ui/button"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { MapView } from "@/components/map-view"
import { batteryWarehouses, getBatteryPrice } from "@/lib/utils"
import { Battery, MapPin, Navigation, AlertTriangle, AlertCircle, Zap, IndianRupee, Filter, SlidersHorizontal } from "lucide-react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Slider } from "@/components/ui/slider"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Separator } from "@/components/ui/separator"

// Battery health helper functions
const getHealthColor = (health: number) => {
  if (health < 50) return "text-red-600 dark:text-red-400"
  if (health < 70) return "text-amber-600 dark:text-amber-400"
  return "text-green-600 dark:text-green-400"
}

const getHealthBadgeVariant = (health: number) => {
  if (health < 50) return "destructive"
  if (health < 70) return "secondary"
  return "outline"
}

export default function BatterySwap() {
  const { user, isLoading } = useAuth()
  const router = useRouter()
  const [selectedWarehouse, setSelectedWarehouse] = useState<number | null>(null)
  const [selectedBattery, setSelectedBattery] = useState<string | null>(null)
  
  // Filter states
  const [maxDistance, setMaxDistance] = useState<number>(5)
  const [minBatteryHealth, setMinBatteryHealth] = useState<number>(0)
  const [minRange, setMinRange] = useState<number>(0)
  const [selectedModels, setSelectedModels] = useState<string[]>([])
  const [showFilters, setShowFilters] = useState<boolean>(false)
  
  // Get unique battery models for filter
  const allBatteryModels = Array.from(
    new Set(
      batteryWarehouses.flatMap(warehouse => 
        warehouse.batteries.map(battery => battery.model)
      )
    )
  );

  // Toggle model selection in filter
  const toggleModelSelection = (model: string) => {
    if (selectedModels.includes(model)) {
      setSelectedModels(selectedModels.filter(m => m !== model));
    } else {
      setSelectedModels([...selectedModels, model]);
    }
  };

  // Filtered warehouses based on distance
  const filteredWarehouses = batteryWarehouses.filter(warehouse => {
    const distanceValue = parseFloat(warehouse.distance.split(' ')[0]);
    return distanceValue <= maxDistance;
  });

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
    setSelectedBattery(null) // Reset selected battery when warehouse changes
  }

  const handleSelectBattery = (id: string) => {
    setSelectedBattery(id)
  }

  const selectedWarehouseData = batteryWarehouses.find((warehouse) => warehouse.id === selectedWarehouse)
  
  // Filter batteries based on health, range, and model
  const filteredBatteries = selectedWarehouseData?.batteries.filter(battery => {
    const healthMatch = battery.healthPercentage >= minBatteryHealth;
    const rangeMatch = battery.estimatedRangeKm >= minRange;
    const modelMatch = selectedModels.length === 0 || selectedModels.includes(battery.model);
    return healthMatch && rangeMatch && modelMatch;
  }) || [];

  const selectedBatteryData = selectedWarehouseData?.batteries.find(battery => battery.id === selectedBattery)

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

            {/* Filter Section */}
            <div className="mt-8 animate-fade-in">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Filter Options</h2>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setShowFilters(!showFilters)}
                >
                  <SlidersHorizontal className="h-4 w-4 mr-2" />
                  {showFilters ? "Hide Filters" : "Show Filters"}
                </Button>
              </div>
              
              {showFilters && (
                <Card className="mb-6">
                  <CardContent className="pt-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {/* Distance Filter */}
                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <Label>Maximum Distance</Label>
                          <Badge variant="outline" className="font-medium">
                            {maxDistance} miles
                          </Badge>
                        </div>
                        <Slider
                          value={[maxDistance]}
                          min={1}
                          max={10}
                          step={0.5}
                          onValueChange={(value) => setMaxDistance(value[0])}
                          className="py-4"
                        />
                        <div className="flex justify-between text-xs text-muted-foreground">
                          <span>1 mile</span>
                          <span>5 miles</span>
                          <span>10 miles</span>
                        </div>
                      </div>
                      
                      {/* Battery Health Filter */}
                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <Label>Minimum Battery Health</Label>
                          <Badge variant="outline" className={`font-medium ${getHealthColor(minBatteryHealth)}`}>
                            {minBatteryHealth}%
                          </Badge>
                        </div>
                        <Slider
                          value={[minBatteryHealth]}
                          min={0}
                          max={100}
                          step={5}
                          onValueChange={(value) => setMinBatteryHealth(value[0])}
                          className="py-4"
                        />
                        <div className="flex justify-between text-xs text-muted-foreground">
                          <span>0%</span>
                          <span>50%</span>
                          <span>100%</span>
                        </div>
                      </div>
                      
                      {/* Range Filter */}
                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <Label>Minimum Range</Label>
                          <Badge variant="outline" className="font-medium">
                            {minRange} km
                          </Badge>
                        </div>
                        <Slider
                          value={[minRange]}
                          min={0}
                          max={500}
                          step={25}
                          onValueChange={(value) => setMinRange(value[0])}
                          className="py-4"
                        />
                        <div className="flex justify-between text-xs text-muted-foreground">
                          <span>0 km</span>
                          <span>250 km</span>
                          <span>500 km</span>
                        </div>
                      </div>
                    </div>
                    
                    {/* Battery Model Filter */}
                    <div className="mt-6">
                      <Label className="mb-2 block">Battery Models</Label>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                        {allBatteryModels.map(model => (
                          <div key={model} className="flex items-center space-x-2">
                            <Checkbox 
                              id={`model-${model}`} 
                              checked={selectedModels.includes(model)}
                              onCheckedChange={() => toggleModelSelection(model)}
                            />
                            <Label htmlFor={`model-${model}`} className="text-sm">{model}</Label>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Map View - Full Width */}
            <div className="mt-6 animate-fade-in">
              <h2 className="text-xl font-semibold mb-4">Map View</h2>
              <MapView
                locations={filteredWarehouses}
                selectedId={selectedWarehouse || undefined}
                onSelectLocation={handleSelectWarehouse}
              />
              <p className="text-sm text-muted-foreground mt-2">
                Showing {filteredWarehouses.length} warehouses within {maxDistance} miles
              </p>
            </div>

            {/* Selected Warehouse Details - Appears below map when a warehouse is selected */}
            {selectedWarehouseData && (
              <div className="mt-8 animate-fade-in">
                <Card className="border-primary">
                  <CardHeader>
                    <CardTitle>Selected Warehouse: {selectedWarehouseData.name}</CardTitle>
                    <CardDescription>{selectedWarehouseData.address}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Tabs defaultValue="details" className="w-full">
                      <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="details">Warehouse Details</TabsTrigger>
                        <TabsTrigger value="batteries">Available Batteries</TabsTrigger>
                      </TabsList>
                      <TabsContent value="details">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
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
                                <span>₹1875.00</span>
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
                      </TabsContent>
                      <TabsContent value="batteries">
                        <div className="mt-4">
                          <h3 className="text-lg font-medium mb-2">
                            Available Batteries 
                            <span className="text-sm font-normal text-muted-foreground ml-2">
                              ({filteredBatteries.length} batteries match your filters)
                            </span>
                          </h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                            {filteredBatteries.map((battery) => (
                              <Card 
                                key={battery.id}
                                className={`cursor-pointer transition-all duration-200 ${
                                  selectedBattery === battery.id ? "border-primary" : "border-border hover:border-primary/50"
                                }`}
                                onClick={() => handleSelectBattery(battery.id)}
                              >
                                <CardContent className="p-4">
                                  <div className="flex justify-between items-center mb-2">
                                    <div className="font-medium">{battery.model}</div>
                                    <Badge variant={getHealthBadgeVariant(battery.healthPercentage)}>
                                      {battery.healthPercentage}% Health
                                    </Badge>
                                  </div>
                                  
                                  <div className="space-y-2">
                                    <div>
                                      <div className="flex items-center justify-between mb-1">
                                        <div className="text-xs text-muted-foreground">Battery Health</div>
                                        <div className={`text-xs ${getHealthColor(battery.healthPercentage)}`}>
                                          {battery.healthPercentage}%
                                        </div>
                                      </div>
                                      <Progress 
                                        value={battery.healthPercentage} 
                                        className={`h-1 ${battery.healthPercentage < 70 ? 'bg-red-200 dark:bg-red-800' : ''}`} 
                                      />
                                    </div>
                                    
                                    <div className="flex justify-between text-xs">
                                      <span className="text-muted-foreground">ID:</span>
                                      <span>{battery.id.substring(0, 3)}****{battery.id.substring(battery.id.length - 2)}</span>
                                    </div>
                                    
                                    <div className="flex justify-between text-xs">
                                      <span className="text-muted-foreground">Range:</span>
                                      <span>{battery.estimatedRangeKm} km</span>
                                    </div>
                                    
                                    <div className="flex justify-between text-xs">
                                      <span className="text-muted-foreground">Charge Cycles:</span>
                                      <span>{battery.chargeCycles}</span>
                                    </div>
                                    
                                    <div className="flex justify-between text-xs">
                                      <span className="text-muted-foreground">Price:</span>
                                      <span className="font-medium flex items-center">
                                        <IndianRupee className="h-3 w-3 mr-0.5" />
                                        {getBatteryPrice(battery.healthPercentage).toFixed(2)}
                                      </span>
                                    </div>
                                    
                                    {/* Warning for low health batteries */}
                                    {battery.healthPercentage < 70 && (
                                      <div className="mt-2 p-2 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded text-xs text-amber-700 dark:text-amber-300 flex items-start">
                                        <AlertTriangle className="h-3 w-3 mr-1 flex-shrink-0 mt-0.5" />
                                        <span>
                                          Limited range of {battery.estimatedRangeKm} km. Not recommended for long trips.
                                        </span>
                                      </div>
                                    )}
                                  </div>
                                </CardContent>
                              </Card>
                            ))}
                          </div>
                        </div>
                      </TabsContent>
                    </Tabs>
                  </CardContent>
                  <CardFooter>
                    <Button
                      variant="gradient"
                      className="w-full"
                      onClick={() => {
                        if (selectedBattery) {
                          router.push(`/payment?type=battery&id=${selectedWarehouseData.id}&batteryId=${selectedBattery}`)
                        } else {
                          router.push(`/payment?type=battery&id=${selectedWarehouseData.id}`)
                        }
                      }}
                    >
                      {selectedBattery ? "Proceed with Selected Battery" : "Proceed to Payment"}
                    </Button>
                  </CardFooter>
                </Card>
              </div>
            )}

            {/* Selected Battery Details */}
            {selectedBatteryData && (
              <div className="mt-4 animate-fade-in">
                <Card className={`border-${selectedBatteryData.healthPercentage < 70 ? 'amber-500' : 'green-500'}`}>
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-center">
                      <CardTitle>Selected Battery: {selectedBatteryData.id.substring(0, 3)}****{selectedBatteryData.id.substring(selectedBatteryData.id.length - 2)}</CardTitle>
                      <Badge variant={getHealthBadgeVariant(selectedBatteryData.healthPercentage)} className="ml-2">
                        {selectedBatteryData.healthPercentage}% Health
                      </Badge>
                    </div>
                    <CardDescription>{selectedBatteryData.model}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {/* Health Status with Warning for Low Health */}
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <div className="text-sm font-medium">Health Status</div>
                          <div className={`text-sm font-medium ${getHealthColor(selectedBatteryData.healthPercentage)}`}>
                            {selectedBatteryData.healthPercentage}%
                          </div>
                        </div>
                        <Progress 
                          value={selectedBatteryData.healthPercentage} 
                          className={`h-2 ${selectedBatteryData.healthPercentage < 70 ? 'bg-red-200 dark:bg-red-800' : ''}`} 
                        />
                        
                        {/* Critical Health Warning */}
                        {selectedBatteryData.healthPercentage < 70 && (
                          <div className="mt-3 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md">
                            <div className="flex items-start">
                              <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400 mr-2 flex-shrink-0 mt-0.5" />
                              <div>
                                <h4 className="text-sm font-medium text-red-800 dark:text-red-300">Critical Battery Health Warning</h4>
                                <p className="text-xs mt-1 text-red-700 dark:text-red-300">
                                  This battery health is critically low. Not recommended for swapping if you are traveling long distances.
                                </p>
                                <div className="mt-2 flex items-center text-xs text-red-700 dark:text-red-300">
                                  <AlertCircle className="h-4 w-4 mr-1" />
                                  <span>Estimated range: <strong>{selectedBatteryData.estimatedRangeKm} km</strong> ({Math.round(selectedBatteryData.estimatedRangeKm * 0.621)} miles)</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Battery Details */}
                      <div className="grid grid-cols-2 gap-4 pt-2">
                        <div>
                          <div className="text-xs text-muted-foreground">Model</div>
                          <div className="text-sm font-medium">{selectedBatteryData.model}</div>
                        </div>
                        <div>
                          <div className="text-xs text-muted-foreground">Charge Cycles</div>
                          <div className="text-sm font-medium">{selectedBatteryData.chargeCycles}</div>
                        </div>
                        <div>
                          <div className="text-xs text-muted-foreground">Estimated Range</div>
                          <div className={`text-sm font-medium ${selectedBatteryData.healthPercentage < 70 ? 'text-red-600 dark:text-red-400' : ''}`}>
                            {selectedBatteryData.estimatedRangeKm} km
                          </div>
                        </div>
                        <div>
                          <div className="text-xs text-muted-foreground">Battery ID</div>
                          <div className="text-sm font-medium">
                            <span className="font-mono">{selectedBatteryData.id.substring(0, 3)}****{selectedBatteryData.id.substring(selectedBatteryData.id.length - 2)}</span>
                            <span className="ml-1 text-xs text-muted-foreground">(Revealed after payment)</span>
                          </div>
                        </div>
                        <div>
                          <div className="text-xs text-muted-foreground">Price</div>
                          <div className="text-sm font-medium flex items-center">
                            <IndianRupee className="h-4 w-4 mr-0.5" />
                            {getBatteryPrice(selectedBatteryData.healthPercentage).toFixed(2)}
                            {selectedBatteryData.healthPercentage < 70 && (
                              <Badge variant="outline" className="ml-1 text-xs bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300">
                                Discounted
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Pricing Explanation */}
                      <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-md">
                        <h4 className="text-sm font-medium text-blue-800 dark:text-blue-300 mb-1">Tiered Pricing</h4>
                        <ul className="text-xs text-blue-700 dark:text-blue-300 space-y-1">
                          <li className="flex justify-between">
                            <span>Premium (90%+ health):</span>
                            <span className="font-medium">₹{getBatteryPrice(90).toFixed(2)}</span>
                          </li>
                          <li className="flex justify-between">
                            <span>Standard (70-89% health):</span>
                            <span className="font-medium">₹{getBatteryPrice(80).toFixed(2)}</span>
                          </li>
                          <li className="flex justify-between">
                            <span>Economy (below 70% health):</span>
                            <span className="font-medium">₹{getBatteryPrice(60).toFixed(2)}</span>
                          </li>
                        </ul>
                        <p className="text-xs mt-2 text-blue-700 dark:text-blue-300">
                          Pricing reflects battery performance and expected range. Lower health batteries are offered at a discount.
                        </p>
                      </div>

                      {/* Usage Recommendations */}
                      <div className="mt-4">
                        <h4 className="text-sm font-medium mb-2">Usage Recommendations</h4>
                        <div className={`text-xs p-2 rounded ${
                          selectedBatteryData.healthPercentage < 50 ? 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300' :
                          selectedBatteryData.healthPercentage < 70 ? 'bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-300' :
                          'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300'
                        }`}>
                          {selectedBatteryData.healthPercentage < 50 ? (
                            <>
                              <strong>Not recommended for use.</strong> This battery should be retired or recycled. Maximum safe travel distance: {selectedBatteryData.estimatedRangeKm} km.
                            </>
                          ) : selectedBatteryData.healthPercentage < 70 ? (
                            <>
                              <strong>Limited use recommended.</strong> Best for short trips under {Math.round(selectedBatteryData.estimatedRangeKm * 0.7)} km. Not suitable for highway driving or long distances.
                            </>
                          ) : (
                            <>
                              <strong>Suitable for all uses.</strong> This battery is in good condition and can be used for trips up to {selectedBatteryData.estimatedRangeKm} km on a full charge.
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button
                      variant="gradient"
                      className="w-full"
                      onClick={() => router.push(`/payment?type=battery&id=${selectedWarehouseData?.id}&batteryId=${selectedBatteryData.id}`)}
                    >
                      <Zap className="h-4 w-4 mr-2" />
                      Proceed with This Battery
                    </Button>
                  </CardFooter>
                </Card>
              </div>
            )}

            {/* Warehouses List - Moved to bottom */}
            <div className="mt-8 animate-slide-up">
              <h2 className="text-xl font-semibold mb-4">Nearby Warehouses</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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
                      {/* Battery Health Summary */}
                      <div className="mt-2 pt-2 border-t border-border">
                        <div className="text-xs text-muted-foreground mb-1">Battery Health Range:</div>
                        <div className="flex gap-1 flex-wrap">
                          {warehouse.batteries.some(b => b.healthPercentage >= 90) && (
                            <Badge variant="outline" className="text-xs bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300">90%+</Badge>
                          )}
                          {warehouse.batteries.some(b => b.healthPercentage >= 70 && b.healthPercentage < 90) && (
                            <Badge variant="secondary" className="text-xs">70-89%</Badge>
                          )}
                          {warehouse.batteries.some(b => b.healthPercentage < 70) && (
                            <Badge variant="destructive" className="text-xs">Below 70%</Badge>
                          )}
                        </div>
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
        </section>
      </main>

      <Footer />
    </div>
  )
}

