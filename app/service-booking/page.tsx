"use client"

import { useAuth } from "@/components/auth-provider"
import { Button } from "@/components/ui/button"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { MapView } from "@/components/map-view"
import { serviceCenters, servicePricing, getNextAvailableDates } from "@/lib/utils"
import { Wrench, MapPin, Calendar, Clock, Star, CreditCard, CheckCircle2, SlidersHorizontal, Info, Phone } from "lucide-react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Slider } from "@/components/ui/slider"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"

export default function ServiceBooking() {
  const { user, isLoading } = useAuth()
  const router = useRouter()
  const [selectedCenter, setSelectedCenter] = useState<number | null>(null)
  const [selectedService, setSelectedService] = useState<string | null>(null)
  const [selectedDate, setSelectedDate] = useState<string>("")
  const [selectedTime, setSelectedTime] = useState<string>("")
  const [bikeDetails, setBikeDetails] = useState<string>("")
  const [issueDescription, setIssueDescription] = useState<string>("")
  const [maxDistance, setMaxDistance] = useState<number>(5)
  const [showFilters, setShowFilters] = useState<boolean>(false)
  const [selectedServiceTypes, setSelectedServiceTypes] = useState<string[]>([])
  const [minRating, setMinRating] = useState<number>(0)
  const [bookingComplete, setBookingComplete] = useState<boolean>(false)
  
  // Get all available service types
  const allServiceTypes = Array.from(
    new Set(
      serviceCenters.flatMap(center => center.services)
    )
  ).sort();
  
  // Toggle service type selection in filter
  const toggleServiceTypeSelection = (serviceType: string) => {
    if (selectedServiceTypes.includes(serviceType)) {
      setSelectedServiceTypes(selectedServiceTypes.filter(s => s !== serviceType));
    } else {
      setSelectedServiceTypes([...selectedServiceTypes, serviceType]);
    }
  };
  
  // Filtered service centers based on distance, rating, and services
  const filteredCenters = serviceCenters.filter(center => {
    const distanceValue = parseFloat(center.distance.split(' ')[0]);
    const distanceMatch = distanceValue <= maxDistance;
    const ratingMatch = center.rating >= minRating;
    const serviceMatch = selectedServiceTypes.length === 0 || 
      selectedServiceTypes.some(service => center.services.includes(service));
    return distanceMatch && ratingMatch && serviceMatch;
  });
  
  // Available dates for booking
  const availableDates = getNextAvailableDates();
  
  // Get available time slots for selected center and date
  const getAvailableTimeSlots = () => {
    if (!selectedCenter || !selectedDate) return [];
    
    const center = serviceCenters.find(c => c.id === selectedCenter);
    if (!center) return [];
    
    const dateSlots = center.availableSlots.find(slot => slot.date === selectedDate);
    return dateSlots ? dateSlots.slots : [];
  };
  
  // Get service price
  const getServicePrice = (service: string) => {
    return servicePricing[service as keyof typeof servicePricing] || 0;
  };
  
  // Redirect if not logged in
  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/")
    }
  }, [user, isLoading, router]);
  
  // Reset time when date changes
  useEffect(() => {
    setSelectedTime("");
  }, [selectedDate]);
  
  // Reset service and date when center changes
  useEffect(() => {
    setSelectedService(null);
    setSelectedDate("");
    setSelectedTime("");
  }, [selectedCenter]);
  
  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    )
  }
  
  const handleSelectCenter = (id: number) => {
    setSelectedCenter(id);
  };
  
  const handleBookService = () => {
    // In a real app, this would send the booking data to a server
    setBookingComplete(true);
  };
  
  const selectedCenterData = serviceCenters.find(center => center.id === selectedCenter);
  const availableTimeSlots = getAvailableTimeSlots();
  const servicePrice = selectedService ? getServicePrice(selectedService) : 0;
  
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-1 pt-16">
        <section className="py-12 md:py-24 gradient-bg">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2 animate-fade-in">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl">Bike Service Booking</h1>
                <p className="max-w-[700px] text-muted-foreground md:text-xl/relaxed">
                  Book a service appointment at authorized service centers near you
                </p>
              </div>
            </div>
            
            {/* Booking Complete Message */}
            {bookingComplete ? (
              <div className="mt-12 animate-fade-in">
                <Card className="border-primary">
                  <CardHeader className="bg-primary/10">
                    <div className="flex items-center justify-center">
                      <CheckCircle2 className="h-12 w-12 text-primary mb-4" />
                    </div>
                    <CardTitle className="text-center text-2xl">Booking Confirmed!</CardTitle>
                    <CardDescription className="text-center text-lg">
                      Your service appointment has been successfully booked
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <h3 className="text-lg font-medium mb-2">Appointment Details</h3>
                          <ul className="space-y-2">
                            <li className="flex justify-between">
                              <span className="text-muted-foreground">Service Center:</span>
                              <span className="font-medium">{selectedCenterData?.name}</span>
                            </li>
                            <li className="flex justify-between">
                              <span className="text-muted-foreground">Service Type:</span>
                              <span className="font-medium">{selectedService}</span>
                            </li>
                            <li className="flex justify-between">
                              <span className="text-muted-foreground">Date & Time:</span>
                              <span className="font-medium">{selectedDate} at {selectedTime}</span>
                            </li>
                            <li className="flex justify-between">
                              <span className="text-muted-foreground">Amount:</span>
                              <span className="font-medium">₹{servicePrice}</span>
                            </li>
                          </ul>
                        </div>
                        <div>
                          <h3 className="text-lg font-medium mb-2">Service Center Contact</h3>
                          <ul className="space-y-2">
                            <li className="flex justify-between">
                              <span className="text-muted-foreground">Address:</span>
                              <span className="font-medium">{selectedCenterData?.address}</span>
                            </li>
                            <li className="flex justify-between">
                              <span className="text-muted-foreground">Phone:</span>
                              <span className="font-medium">+91 98765 43210</span>
                            </li>
                          </ul>
                        </div>
                      </div>
                      
                      <div className="bg-muted/30 p-4 rounded-lg mt-4">
                        <h4 className="font-medium mb-2 flex items-center">
                          <Info className="h-4 w-4 mr-2" />
                          Important Information
                        </h4>
                        <ul className="space-y-1 text-sm text-muted-foreground">
                          <li>• Please arrive 15 minutes before your appointment time</li>
                          <li>• Bring your bike and any relevant documentation</li>
                          <li>• Payment can be made at the service center</li>
                          <li>• You can reschedule up to 24 hours before your appointment</li>
                        </ul>
                      </div>
                      
                      <div className="flex justify-center mt-6">
                        <Button onClick={() => setBookingComplete(false)}>
                          Book Another Appointment
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ) : (
              <>
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
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                          
                          {/* Rating Filter */}
                          <div className="space-y-4">
                            <div className="flex justify-between items-center">
                              <Label>Minimum Rating</Label>
                              <Badge variant="outline" className="font-medium flex items-center">
                                {minRating} <Star className="h-3 w-3 ml-1 fill-current" />
                              </Badge>
                            </div>
                            <Slider
                              value={[minRating]}
                              min={0}
                              max={5}
                              step={0.5}
                              onValueChange={(value) => setMinRating(value[0])}
                              className="py-4"
                            />
                            <div className="flex justify-between text-xs text-muted-foreground">
                              <span>Any</span>
                              <span>3.0</span>
                              <span>5.0</span>
                            </div>
                          </div>
                        </div>
                        
                        {/* Service Type Filter */}
                        <div className="mt-6">
                          <Label className="mb-2 block">Service Types</Label>
                          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                            {allServiceTypes.map(service => (
                              <div key={service} className="flex items-center space-x-2">
                                <Checkbox 
                                  id={`service-${service}`} 
                                  checked={selectedServiceTypes.includes(service)}
                                  onCheckedChange={() => toggleServiceTypeSelection(service)}
                                />
                                <Label htmlFor={`service-${service}`} className="text-sm">{service}</Label>
                              </div>
                            ))}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </div>
                
                {/* Map View */}
                <div className="mt-6 animate-fade-in">
                  <h2 className="text-xl font-semibold mb-4">Service Centers Near You</h2>
                  <MapView
                    locations={filteredCenters}
                    selectedId={selectedCenter || undefined}
                    onSelectLocation={handleSelectCenter}
                  />
                  <p className="text-sm text-muted-foreground mt-2">
                    Showing {filteredCenters.length} service centers within {maxDistance} miles
                  </p>
                </div>
                
                {/* Service Center Selection */}
                {filteredCenters.length > 0 && (
                  <div className="mt-8 animate-fade-in">
                    <h2 className="text-xl font-semibold mb-4">Available Service Centers</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {filteredCenters.map((center) => (
                        <Card 
                          key={center.id}
                          className={`cursor-pointer transition-all duration-200 ${
                            selectedCenter === center.id ? "border-primary" : "border-border hover:border-primary/50"
                          }`}
                          onClick={() => handleSelectCenter(center.id)}
                        >
                          <CardContent className="p-4">
                            <div className="flex justify-between items-start">
                              <div>
                                <h3 className="font-medium text-lg">{center.name}</h3>
                                <p className="text-sm text-muted-foreground flex items-center mt-1">
                                  <MapPin className="h-3.5 w-3.5 mr-1" />
                                  {center.address} ({center.distance})
                                </p>
                              </div>
                              <div className="flex items-center bg-primary/10 px-2 py-1 rounded">
                                <Star className="h-4 w-4 text-amber-500 fill-amber-500 mr-1" />
                                <span className="font-medium">{center.rating}</span>
                                <span className="text-xs text-muted-foreground ml-1">({center.reviews})</span>
                              </div>
                            </div>
                            
                            <div className="mt-3">
                              <h4 className="text-sm font-medium mb-1">Available Services:</h4>
                              <div className="flex flex-wrap gap-1">
                                {center.services.map(service => (
                                  <Badge key={service} variant="outline" className="text-xs">
                                    {service}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                            
                            {selectedCenter === center.id && (
                              <div className="mt-2 pt-2 border-t border-border">
                                <p className="text-xs text-primary font-medium">Selected</p>
                              </div>
                            )}
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                )}
                
                {/* Booking Form - Appears when a service center is selected */}
                {selectedCenter && selectedCenterData && (
                  <div className="mt-8 animate-fade-in">
                    <Card>
                      <CardHeader>
                        <CardTitle>Book a Service at {selectedCenterData.name}</CardTitle>
                        <CardDescription>
                          Fill in the details below to schedule your bike service appointment
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                          {/* Service Selection */}
                          <div className="space-y-6">
                            <div>
                              <Label className="text-base font-medium">Select Service Type</Label>
                              <RadioGroup 
                                className="mt-3 space-y-3"
                                value={selectedService || ""}
                                onValueChange={setSelectedService}
                              >
                                {selectedCenterData.services.map(service => (
                                  <div key={service} className="flex items-center justify-between space-x-2 p-3 border rounded-md hover:bg-muted/50 transition-colors">
                                    <div className="flex items-center space-x-2">
                                      <RadioGroupItem value={service} id={`service-${service}`} />
                                      <Label htmlFor={`service-${service}`} className="font-normal cursor-pointer">
                                        {service}
                                      </Label>
                                    </div>
                                    <div className="font-medium">₹{getServicePrice(service)}</div>
                                  </div>
                                ))}
                              </RadioGroup>
                            </div>
                            
                            <div className="space-y-3">
                              <Label htmlFor="bike-details">Bike Details</Label>
                              <Input
                                id="bike-details"
                                placeholder="Model, Year, Registration Number"
                                value={bikeDetails}
                                onChange={(e) => setBikeDetails(e.target.value)}
                              />
                            </div>
                            
                            <div className="space-y-3">
                              <Label htmlFor="issue-description">Issue Description (Optional)</Label>
                              <Textarea
                                id="issue-description"
                                placeholder="Describe the issues you're experiencing with your bike"
                                value={issueDescription}
                                onChange={(e) => setIssueDescription(e.target.value)}
                                rows={4}
                              />
                            </div>
                          </div>
                          
                          {/* Date and Time Selection */}
                          <div className="space-y-6">
                            <div className="space-y-3">
                              <Label htmlFor="appointment-date">Select Date</Label>
                              <Select
                                value={selectedDate}
                                onValueChange={setSelectedDate}
                              >
                                <SelectTrigger id="appointment-date" className="w-full">
                                  <SelectValue placeholder="Select a date" />
                                </SelectTrigger>
                                <SelectContent>
                                  {availableDates.map(date => (
                                    <SelectItem key={date} value={date}>
                                      {new Date(date).toLocaleDateString('en-US', { 
                                        weekday: 'short', 
                                        month: 'short', 
                                        day: 'numeric' 
                                      })}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                            
                            {selectedDate && (
                              <div className="space-y-3">
                                <Label htmlFor="appointment-time">Select Time</Label>
                                <Select
                                  value={selectedTime}
                                  onValueChange={setSelectedTime}
                                  disabled={availableTimeSlots.length === 0}
                                >
                                  <SelectTrigger id="appointment-time" className="w-full">
                                    <SelectValue placeholder={
                                      availableTimeSlots.length === 0 
                                        ? "No slots available" 
                                        : "Select a time"
                                    } />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {availableTimeSlots.map(time => (
                                      <SelectItem key={time} value={time}>
                                        {time}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                                {availableTimeSlots.length === 0 && (
                                  <p className="text-sm text-muted-foreground">
                                    No slots available for this date. Please select another date.
                                  </p>
                                )}
                              </div>
                            )}
                            
                            {/* Booking Summary */}
                            {selectedService && selectedDate && selectedTime && (
                              <div className="mt-6 p-4 bg-muted/20 rounded-lg border border-border">
                                <h3 className="font-medium text-lg mb-2">Booking Summary</h3>
                                <div className="space-y-2 text-sm">
                                  <div className="flex justify-between">
                                    <span className="text-muted-foreground">Service:</span>
                                    <span>{selectedService}</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-muted-foreground">Date & Time:</span>
                                    <span>{selectedDate} at {selectedTime}</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-muted-foreground">Service Center:</span>
                                    <span>{selectedCenterData.name}</span>
                                  </div>
                                  <Separator className="my-2" />
                                  <div className="flex justify-between font-medium">
                                    <span>Total Amount:</span>
                                    <span>₹{servicePrice}</span>
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter className="flex justify-end">
                        <Button
                          onClick={handleBookService}
                          disabled={!selectedService || !selectedDate || !selectedTime || !bikeDetails}
                        >
                          <CreditCard className="h-4 w-4 mr-2" />
                          Book Appointment
                        </Button>
                      </CardFooter>
                    </Card>
                  </div>
                )}
              </>
            )}
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  )
} 