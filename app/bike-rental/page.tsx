"use client"

import { useAuth } from "@/components/auth-provider"
import { Button } from "@/components/ui/button"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { MapView } from "@/components/map-view"
import { chargingStations, calculateFare } from "@/lib/utils"
import { Bike, Calendar, Clock, MapPin, Navigation, Timer, CreditCard, Info, CheckCircle2, SlidersHorizontal, Battery } from "lucide-react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Slider } from "@/components/ui/slider"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Progress } from "@/components/ui/progress"

export default function BikeRental() {
  const { user, isLoading } = useAuth()
  const router = useRouter()
  const [selectedStation, setSelectedStation] = useState<number | null>(null)
  const [selectedBike, setSelectedBike] = useState<number | null>(null)
  const [pickupDate, setPickupDate] = useState<string>(new Date().toISOString().split("T")[0])
  const [pickupTime, setPickupTime] = useState<string>("12:00")
  const [rentalDuration, setRentalDuration] = useState<number>(2)
  const [rentalFare, setRentalFare] = useState<number>(20)
  const [rentalMethod, setRentalMethod] = useState<"duration" | "specific">("duration")
  
  // Filter states
  const [maxDistance, setMaxDistance] = useState<number>(5)
  const [minBatteryLevel, setMinBatteryLevel] = useState<number>(0)
  const [selectedModels, setSelectedModels] = useState<string[]>([])
  const [showFilters, setShowFilters] = useState<boolean>(false)
  
  // Get unique bike models for filter
  const allBikeModels = Array.from(
    new Set(
      chargingStations.flatMap(station => 
        station.availableBikes.map(bike => bike.model)
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

  // Filtered stations based on distance
  const filteredStations = chargingStations.filter(station => {
    const distanceValue = parseFloat(station.distance.split(' ')[0]);
    return distanceValue <= maxDistance;
  });

  // Generate time options for dropdown
  const timeOptions = Array.from({ length: 24 * 4 }, (_, i) => {
    const hour = Math.floor(i / 4);
    const minute = (i % 4) * 15;
    return `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
  });

  // Redirect if not logged in
  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/")
    }
  }, [user, isLoading, router])

  // Calculate rental fare when duration changes
  useEffect(() => {
    setRentalFare(calculateFare(rentalDuration))
  }, [rentalDuration])

  // Calculate return date and time based on pickup and duration
  const getReturnDateTime = () => {
    const pickupDateTime = new Date(`${pickupDate}T${pickupTime}:00`);
    const returnDateTime = new Date(pickupDateTime.getTime() + rentalDuration * 60 * 60 * 1000);
    
    const returnDate = returnDateTime.toISOString().split('T')[0];
    const hours = returnDateTime.getHours().toString().padStart(2, '0');
    const minutes = returnDateTime.getMinutes().toString().padStart(2, '0');
    const returnTime = `${hours}:${minutes}`;
    
    return { returnDate, returnTime };
  }

  const { returnDate, returnTime } = getReturnDateTime();

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
  
  // Filter bikes based on battery level and model
  const filteredBikes = selectedStationData?.availableBikes.filter(bike => {
    const batteryLevelValue = parseInt(bike.batteryLevel.replace('%', ''));
    const batteryMatch = batteryLevelValue >= minBatteryLevel;
    const modelMatch = selectedModels.length === 0 || selectedModels.includes(bike.model);
    return batteryMatch && modelMatch;
  }) || [];
  
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
                      
                      {/* Battery Level Filter */}
                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <Label>Minimum Battery Level</Label>
                          <Badge variant="outline" className="font-medium">
                            {minBatteryLevel}%
                          </Badge>
                        </div>
                        <Slider
                          value={[minBatteryLevel]}
                          min={0}
                          max={100}
                          step={5}
                          onValueChange={(value) => setMinBatteryLevel(value[0])}
                          className="py-4"
                        />
                        <div className="flex justify-between text-xs text-muted-foreground">
                          <span>0%</span>
                          <span>50%</span>
                          <span>100%</span>
                        </div>
                      </div>
                    </div>
                    
                    {/* Bike Model Filter */}
                    <div className="mt-6">
                      <Label className="mb-2 block">Bike Models</Label>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                        {allBikeModels.map(model => (
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
                locations={filteredStations}
                selectedId={selectedStation || undefined}
                onSelectLocation={handleSelectStation}
              />
              <p className="text-sm text-muted-foreground mt-2">
                Showing {filteredStations.length} stations within {maxDistance} miles
              </p>
            </div>

            {/* Charging Stations List */}
            <div className="animate-slide-up mt-8">
              <h2 className="text-xl font-semibold mb-4">Nearby Charging Stations</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredStations.map((station) => (
                  <div
                    key={station.id}
                    className={`gradient-card cursor-pointer transition-all duration-300 ${
                      selectedStation === station.id ? "border-primary shadow-lg" : "hover:border-primary/50 hover:shadow-md"
                    }`}
                    onClick={() => handleSelectStation(station.id)}
                  >
                    <div className="p-4">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="text-lg font-medium flex items-center">
                          <Bike className="h-5 w-5 mr-2 text-primary" />
                          {station.name}
                        </h3>
                        <Badge variant="outline" className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 border-green-200 dark:border-green-800">
                          <CheckCircle2 className="h-3 w-3 mr-1" />
                          Open
                        </Badge>
                      </div>
                      
                      <p className="text-sm text-muted-foreground flex items-center mb-3">
                        <MapPin className="h-3 w-3 mr-1 flex-shrink-0" />
                        {station.address}
                      </p>
                      
                      <div className="space-y-2 mb-4">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Distance:</span>
                          <span className="font-medium">{station.distance}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Available Bikes:</span>
                          <span className="font-medium">{station.availableBikes.length}</span>
                        </div>
                        
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Bike Models:</span>
                          <span className="font-medium">
                            {Array.from(new Set(station.availableBikes.map(bike => bike.model))).join(', ')}
                          </span>
                        </div>
                      </div>
                      
                      <div className="flex gap-2 w-full mt-4">
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
                          {selectedStation === station.id ? "Selected" : "View Details"}
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Selected Station Details */}
            {selectedStationData && (
              <div className="mt-8 animate-fade-in">
                <div className="gradient-card">
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-xl font-semibold">Selected Station: {selectedStationData.name}</h3>
                      <Badge variant="outline" className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 border-green-200 dark:border-green-800">
                        <CheckCircle2 className="h-3 w-3 mr-1" />
                        Open
                      </Badge>
                    </div>
                    <p className="text-muted-foreground mb-6">{selectedStationData.address}</p>

                    <div>
                      <h4 className="text-lg font-medium mb-4">Available Bikes</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {filteredBikes.map((bike) => (
                          <div
                            key={bike.id}
                            className={`gradient-card cursor-pointer transition-all duration-200 ${
                              selectedBike === bike.id ? "border-primary shadow-md" : "hover:border-primary/50 hover:shadow-sm"
                            }`}
                            onClick={() => handleSelectBike(bike.id)}
                          >
                            <div className="p-4">
                              <div className="flex justify-between items-center mb-3">
                                <h5 className="text-base font-medium flex items-center">
                                  <Bike className="h-4 w-4 mr-2 text-primary" />
                                  {bike.model}
                                </h5>
                                {selectedBike === bike.id && (
                                  <Badge variant="outline" className="bg-primary/20 text-primary border-primary/30">
                                    <CheckCircle2 className="h-3 w-3 mr-1" />
                                    Selected
                                  </Badge>
                                )}
                              </div>
                              
                              <div className="space-y-2 mb-3">
                                <div>
                                  <div className="flex items-center justify-between mb-1">
                                    <div className="text-xs text-muted-foreground">Battery Level</div>
                                    <div className="text-xs text-green-600 dark:text-green-400">
                                      {bike.batteryLevel}
                                    </div>
                                  </div>
                                  <Progress 
                                    value={parseInt(bike.batteryLevel)} 
                                    className="h-1" 
                                  />
                                </div>
                                
                                <div className="flex justify-between text-xs">
                                  <span className="text-muted-foreground">Bike ID:</span>
                                  <span>#{bike.id}</span>
                                </div>
                                
                                <div className="flex justify-between text-xs">
                                  <span className="text-muted-foreground">Range:</span>
                                  <span>{parseInt(bike.batteryLevel) * 1.5} km</span>
                                </div>
                                
                                <div className="flex justify-between text-xs">
                                  <span className="text-muted-foreground">Status:</span>
                                  <span className="text-green-600 dark:text-green-400 flex items-center">
                                    <CheckCircle2 className="h-3 w-3 mr-1" />
                                    Available
                                  </span>
                                </div>
                              </div>
                              
                              <Button
                                variant={selectedBike === bike.id ? "gradient" : "outline"}
                                size="sm"
                                className="w-full mt-2"
                                onClick={() => handleSelectBike(bike.id)}
                              >
                                {selectedBike === bike.id ? "Selected" : "Select This Bike"}
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {selectedBike && (
                      <div>
                        <h4 className="text-lg font-medium mt-6 mb-4">Rental Details</h4>
                        
                        {/* Rental Method Tabs */}
                        <Tabs 
                          defaultValue="duration" 
                          className="w-full" 
                          onValueChange={(value) => setRentalMethod(value as "duration" | "specific")}
                        >
                          <TabsList className="grid w-full grid-cols-2 mb-6">
                            <TabsTrigger value="duration">
                              <Timer className="h-4 w-4 mr-2" />
                              Quick Duration
                            </TabsTrigger>
                            <TabsTrigger value="specific">
                              <Calendar className="h-4 w-4 mr-2" />
                              Specific Times
                            </TabsTrigger>
                          </TabsList>
                          
                          {/* Duration-based rental */}
                          <TabsContent value="duration" className="space-y-6">
                            <div className="gradient-card">
                              <div className="p-6">
                                <h5 className="text-lg font-medium mb-2">Select Rental Duration</h5>
                                <p className="text-sm text-muted-foreground mb-4">
                                  Choose how long you want to rent the bike
                                </p>
                                <div className="space-y-6">
                                  {/* Pickup Date and Time */}
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                      <Label htmlFor="pickup-date">Pickup Date</Label>
                                      <div className="relative">
                                        <Input
                                          id="pickup-date"
                                          type="date"
                                          value={pickupDate}
                                          onChange={(e) => setPickupDate(e.target.value)}
                                          min={new Date().toISOString().split("T")[0]}
                                          className="pl-10"
                                        />
                                        <Calendar className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                      </div>
                                    </div>
                                    <div className="space-y-2">
                                      <Label htmlFor="pickup-time">Pickup Time</Label>
                                      <Select
                                        value={pickupTime}
                                        onValueChange={setPickupTime}
                                      >
                                        <SelectTrigger id="pickup-time" className="pl-10">
                                          <SelectValue placeholder="Select time" />
                                        </SelectTrigger>
                                        <SelectContent>
                                          {timeOptions.map((time) => (
                                            <SelectItem key={time} value={time}>
                                              {time}
                                            </SelectItem>
                                          ))}
                                        </SelectContent>
                                        <Clock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                      </Select>
                                    </div>
                                  </div>
                                  
                                  {/* Duration Slider */}
                                  <div className="space-y-4">
                                    <div className="flex justify-between items-center">
                                      <Label>Rental Duration</Label>
                                      <Badge variant="outline" className="font-medium">
                                        {rentalDuration} hour{rentalDuration !== 1 ? "s" : ""}
                                      </Badge>
                                    </div>
                                    <Slider
                                      value={[rentalDuration]}
                                      min={1}
                                      max={24}
                                      step={1}
                                      onValueChange={(value) => setRentalDuration(value[0])}
                                      className="py-4"
                                    />
                                    <div className="flex justify-between text-xs text-muted-foreground">
                                      <span>1 hour</span>
                                      <span>12 hours</span>
                                      <span>24 hours</span>
                                    </div>
                                  </div>
                                  
                                  {/* Return Time Display */}
                                  <div className="p-4 bg-muted rounded-lg">
                                    <div className="flex items-start">
                                      <Info className="h-5 w-5 mr-2 text-muted-foreground flex-shrink-0 mt-0.5" />
                                      <div>
                                        <h4 className="font-medium">Return Information</h4>
                                        <p className="text-sm text-muted-foreground mt-1">
                                          Your bike will be due back on <span className="font-medium">{returnDate}</span> at <span className="font-medium">{returnTime}</span>
                                        </p>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </TabsContent>
                          
                          {/* Specific date/time rental */}
                          <TabsContent value="specific" className="space-y-6">
                            <div className="gradient-card">
                              <div className="p-6">
                                <h5 className="text-lg font-medium mb-2">Select Pickup & Return Times</h5>
                                <p className="text-sm text-muted-foreground mb-4">
                                  Choose specific pickup and return times
                                </p>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                  <div className="space-y-4">
                                    <div className="space-y-2">
                                      <Label htmlFor="specific-pickup-date">Pickup Date</Label>
                                      <div className="relative">
                                        <Input
                                          id="specific-pickup-date"
                                          type="date"
                                          value={pickupDate}
                                          onChange={(e) => setPickupDate(e.target.value)}
                                          min={new Date().toISOString().split("T")[0]}
                                          className="pl-10"
                                        />
                                        <Calendar className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                      </div>
                                    </div>
                                    <div className="space-y-2">
                                      <Label htmlFor="specific-pickup-time">Pickup Time</Label>
                                      <Select
                                        value={pickupTime}
                                        onValueChange={setPickupTime}
                                      >
                                        <SelectTrigger id="specific-pickup-time" className="pl-10">
                                          <SelectValue placeholder="Select time" />
                                        </SelectTrigger>
                                        <SelectContent>
                                          {timeOptions.map((time) => (
                                            <SelectItem key={`pickup-${time}`} value={time}>
                                              {time}
                                            </SelectItem>
                                          ))}
                                        </SelectContent>
                                        <Clock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                      </Select>
                                    </div>
                                  </div>
                                  <div className="space-y-4">
                                    <div className="space-y-2">
                                      <Label htmlFor="specific-return-date">Return Date</Label>
                                      <div className="relative">
                                        <Input
                                          id="specific-return-date"
                                          type="date"
                                          value={returnDate}
                                          onChange={(e) => {
                                            // Calculate new duration based on return date
                                            const newReturnDate = new Date(`${e.target.value}T${returnTime}:00`);
                                            const pickupDateTime = new Date(`${pickupDate}T${pickupTime}:00`);
                                            const diffHours = Math.max(1, Math.ceil((newReturnDate.getTime() - pickupDateTime.getTime()) / (1000 * 60 * 60)));
                                            setRentalDuration(diffHours);
                                          }}
                                          min={pickupDate}
                                          className="pl-10"
                                        />
                                        <Calendar className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                      </div>
                                    </div>
                                    <div className="space-y-2">
                                      <Label htmlFor="specific-return-time">Return Time</Label>
                                      <Select
                                        value={returnTime}
                                        onValueChange={(time) => {
                                          // Calculate new duration based on return time
                                          const newReturnDateTime = new Date(`${returnDate}T${time}:00`);
                                          const pickupDateTime = new Date(`${pickupDate}T${pickupTime}:00`);
                                          const diffHours = Math.max(1, Math.ceil((newReturnDateTime.getTime() - pickupDateTime.getTime()) / (1000 * 60 * 60)));
                                          setRentalDuration(diffHours);
                                        }}
                                      >
                                        <SelectTrigger id="specific-return-time" className="pl-10">
                                          <SelectValue placeholder="Select time" />
                                        </SelectTrigger>
                                        <SelectContent>
                                          {timeOptions.map((time) => (
                                            <SelectItem key={`return-${time}`} value={time}>
                                              {time}
                                            </SelectItem>
                                          ))}
                                        </SelectContent>
                                        <Clock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                      </Select>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </TabsContent>
                        </Tabs>

                        {/* Rental Summary */}
                        <div className="mt-6 gradient-card">
                          <div className="p-6">
                            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                              <div>
                                <h4 className="font-medium text-lg">Rental Summary</h4>
                                <div className="text-sm text-muted-foreground mt-1 space-y-1">
                                  <p>
                                    <span className="inline-block w-24">Duration:</span>
                                    <span className="font-medium">{rentalDuration} hour{rentalDuration !== 1 ? "s" : ""}</span>
                                  </p>
                                  <p>
                                    <span className="inline-block w-24">Pickup:</span>
                                    <span className="font-medium">{pickupDate} at {pickupTime}</span>
                                  </p>
                                  <p>
                                    <span className="inline-block w-24">Return:</span>
                                    <span className="font-medium">{returnDate} at {returnTime}</span>
                                  </p>
                                  <p>
                                    <span className="inline-block w-24">Rate:</span>
                                    <span className="font-medium">₹750.00/hour</span>
                                  </p>
                                </div>
                              </div>
                              <div className="text-right bg-primary/10 p-4 rounded-lg border border-primary/20 w-full md:w-auto">
                                <div className="text-3xl font-bold text-primary">₹{rentalFare}</div>
                                <p className="text-xs text-muted-foreground">Total fare</p>
                                <Button
                                  variant="gradient"
                                  size="sm" 
                                  className="mt-2"
                                  onClick={() => {
                                    if (selectedBike) {
                                      router.push(
                                        `/payment?type=bike&id=${selectedStationData.id}&bike=${selectedBike}&hours=${rentalDuration}`,
                                      )
                                    }
                                  }}
                                >
                                  <CreditCard className="h-4 w-4 mr-2" />
                                  Proceed to Payment
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                    <div className="p-4 border-t border-border mt-4">
                      <Button
                        variant="gradient"
                        className="w-full"
                        disabled={!selectedBike}
                        onClick={() => {
                          if (selectedBike) {
                            router.push(
                              `/payment?type=bike&id=${selectedStationData.id}&bike=${selectedBike}&hours=${rentalDuration}`,
                            )
                          }
                        }}
                      >
                        {selectedBike ? "Proceed to Payment" : "Select a Bike to Continue"}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}

