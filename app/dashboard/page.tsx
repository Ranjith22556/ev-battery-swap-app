"use client"

import { useAuth } from "@/components/auth-provider"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Battery, Bike, Calendar, Clock, CreditCard, MapPin, User, Zap, Wrench, CheckCircle2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"

export default function Dashboard() {
  const { user, isLoading } = useAuth()
  const router = useRouter()

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

  // Mock data for demonstration
  const recentActivities = [
    { 
      id: 1, 
      type: "battery", 
      location: "Downtown Station", 
      date: "2023-03-01", 
      time: "14:30", 
      status: "Completed",
      cost: "₹1,125"
    },
    { 
      id: 2, 
      type: "bike", 
      location: "Central Park Station", 
      date: "2023-02-25", 
      time: "10:15", 
      status: "Completed",
      cost: "₹1,500"
    },
    { 
      id: 3, 
      type: "service", 
      location: "EcoBike Service Hub", 
      date: "2023-02-22", 
      time: "11:00", 
      status: "Completed",
      cost: "₹1,500",
      serviceType: "General Service"
    },
    { 
      id: 4, 
      type: "battery", 
      location: "Westside Hub", 
      date: "2023-02-20", 
      time: "18:45", 
      status: "Completed",
      cost: "₹1,125"
    },
  ]

  const userStats = {
    totalSwaps: 12,
    totalRentals: 8,
    totalServices: 3,
    co2Saved: 156,
    loyaltyPoints: 450
  }

  const savedLocations = [
    { id: 1, name: "Home Station", address: "123 Main St" },
    { id: 2, name: "Work Hub", address: "456 Office Blvd" },
    { id: 3, name: "Gym Station", address: "789 Fitness Ave" }
  ]

  const paymentMethods = [
    { id: 1, type: "Credit Card", last4: "4242", expiry: "04/25" },
    { id: 2, type: "PayPal", email: "user@example.com" }
  ]
  
  const serviceAppointments = [
    { 
      id: 1, 
      center: "EcoBike Service Hub", 
      date: "2023-10-15", 
      time: "11:00", 
      serviceType: "General Service",
      status: "Upcoming",
      cost: "₹1,500"
    },
    { 
      id: 2, 
      center: "GreenWheel Repairs", 
      date: "2023-02-22", 
      time: "14:30", 
      serviceType: "Battery Repair",
      status: "Completed",
      cost: "₹3,000"
    },
    { 
      id: 3, 
      center: "ElectroVelo Technicians", 
      date: "2023-01-10", 
      time: "10:00", 
      serviceType: "Motor Tuning",
      status: "Completed",
      cost: "₹2,000"
    }
  ]

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <div className="fixed top-0 left-0 right-0 h-16 bg-background/80 backdrop-blur-sm border-b z-50 transition-all duration-200">
        <Navbar />
      </div>
      
      <main className="flex-1 pt-20 pb-8 animate-fadeIn">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-col md:flex-row gap-6 md:items-start">
            {/* User Profile Card */}
            <div className="md:w-1/3">
              <Card className="shadow-sm hover:shadow-md transition-all duration-200">
                <CardHeader className="pb-2">
                  <CardTitle className="text-2xl bg-gradient-to-r from-primary to-primary-foreground bg-clip-text text-transparent">My Profile</CardTitle>
                  <CardDescription>Manage your account details</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col items-center space-y-4 py-4">
                    <Avatar className="h-24 w-24 ring-2 ring-primary/20 ring-offset-2 transition-all duration-200 hover:scale-105">
                      <AvatarImage src={user?.image || ""} alt={user?.name || "User"} />
                      <AvatarFallback className="bg-gradient-to-br from-primary to-primary-foreground text-primary-foreground" name={user?.name}>{user?.name?.charAt(0) || "U"}</AvatarFallback>
                    </Avatar>
                    <div className="text-center">
                      <h3 className="text-xl font-bold">{user?.name}</h3>
                      <p className="text-muted-foreground">{user?.email}</p>
                    </div>
                  </div>
                  
                  <div className="space-y-4 mt-4">
                    <div className="flex justify-between items-center py-2 border-b hover:bg-muted/50 px-2 rounded transition-colors duration-200">
                      <div className="flex items-center">
                        <Zap className="h-4 w-4 mr-2 text-primary animate-pulse" />
                        <span>Loyalty Points</span>
                      </div>
                      <span className="font-bold">{userStats.loyaltyPoints}</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b hover:bg-muted/50 px-2 rounded transition-colors duration-200">
                      <div className="flex items-center">
                        <Battery className="h-4 w-4 mr-2 text-primary" />
                        <span>Total Swaps</span>
                      </div>
                      <span className="font-bold">{userStats.totalSwaps}</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b hover:bg-muted/50 px-2 rounded transition-colors duration-200">
                      <div className="flex items-center">
                        <Bike className="h-4 w-4 mr-2 text-primary" />
                        <span>Total Rentals</span>
                      </div>
                      <span className="font-bold">{userStats.totalRentals}</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b hover:bg-muted/50 px-2 rounded transition-colors duration-200">
                      <div className="flex items-center">
                        <Wrench className="h-4 w-4 mr-2 text-primary" />
                        <span>Total Services</span>
                      </div>
                      <span className="font-bold">{userStats.totalServices}</span>
                    </div>
                    <div className="flex justify-between items-center py-2 hover:bg-muted/50 px-2 rounded transition-colors duration-200">
                      <div className="flex items-center">
                        <Zap className="h-4 w-4 mr-2 text-green-500" />
                        <span>CO₂ Saved (kg)</span>
                      </div>
                      <span className="font-bold text-green-500">{userStats.co2Saved}</span>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3 mt-6">
                    <Button variant="outline" className="w-full hover:bg-primary hover:text-primary-foreground transition-colors duration-200">
                      <User className="mr-2 h-4 w-4" />
                      Edit Profile
                    </Button>
                    <Button variant="gradient" className="w-full bg-gradient-to-r from-primary to-primary-foreground hover:opacity-90 transition-opacity duration-200" asChild>
                      <Link href="/service-booking">
                        <Wrench className="mr-2 h-4 w-4" />
                        Book Service
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            {/* Main Content */}
            <div className="md:w-2/3">
              <Tabs defaultValue="activity" className="space-y-6">
                <TabsList className="grid w-full grid-cols-4 gap-4 rounded-lg p-1 h-12 bg-muted/50 backdrop-blur-sm">
                  <TabsTrigger value="activity" className="rounded-md data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all duration-200">Activity</TabsTrigger>
                  <TabsTrigger value="services" className="rounded-md data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all duration-200">Services</TabsTrigger>
                  <TabsTrigger value="locations" className="rounded-md data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all duration-200">Locations</TabsTrigger>
                  <TabsTrigger value="payment" className="rounded-md data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all duration-200">Payment</TabsTrigger>
                </TabsList>
                
                {/* Activity Tab */}
                <TabsContent value="activity" className="space-y-4 mt-2">
                  <h2 className="text-2xl font-bold mt-2 bg-gradient-to-r from-primary to-primary-foreground bg-clip-text text-transparent">Recent Activity</h2>
                  
                  {recentActivities.map((activity, index) => (
                    <Card key={activity.id} className="hover:shadow-md transition-all duration-200 animate-fadeIn" style={{ animationDelay: `${index * 100}ms` }}>
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex items-center">
                            <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center mr-4 group-hover:scale-105 transition-transform duration-200">
                              {activity.type === "battery" ? (
                                <Battery className="h-5 w-5 text-primary group-hover:animate-pulse" />
                              ) : activity.type === "bike" ? (
                                <Bike className="h-5 w-5 text-primary group-hover:animate-bounce" />
                              ) : (
                                <Wrench className="h-5 w-5 text-primary group-hover:animate-spin" />
                              )}
                            </div>
                            <div>
                              <h3 className="font-medium">
                                {activity.type === "battery" 
                                  ? "Battery Swap" 
                                  : activity.type === "bike" 
                                    ? "Bike Rental" 
                                    : activity.serviceType}
                              </h3>
                              <div className="flex items-center text-sm text-muted-foreground">
                                <MapPin className="h-3 w-3 mr-1" />
                                <span>{activity.location}</span>
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-bold">{activity.cost}</p>
                            <div className="flex items-center text-sm text-muted-foreground justify-end">
                              <Calendar className="h-3 w-3 mr-1" />
                              <span>{activity.date}</span>
                              <Clock className="h-3 w-3 ml-2 mr-1" />
                              <span>{activity.time}</span>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                  
                  <Button variant="outline" className="w-full">
                    View All Activity
                  </Button>
                </TabsContent>
                
                {/* Service Appointments Tab */}
                <TabsContent value="services" className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h2 className="text-2xl font-bold mt-2">Service Appointments</h2>
                    <Button variant="outline" size="sm" asChild>
                      <Link href="/service-booking">
                        <Wrench className="mr-2 h-4 w-4" />
                        Book New Service
                      </Link>
                    </Button>
                  </div>
                  
                  {serviceAppointments.map((appointment) => (
                    <Card key={appointment.id}>
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex items-center">
                            <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center mr-4">
                              <Wrench className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                              <div className="flex items-center">
                                <h3 className="font-medium">{appointment.serviceType}</h3>
                                <Badge 
                                  variant={appointment.status === "Upcoming" ? "outline" : "secondary"} 
                                  className="ml-2"
                                >
                                  {appointment.status}
                                </Badge>
                              </div>
                              <div className="flex items-center text-sm text-muted-foreground">
                                <MapPin className="h-3 w-3 mr-1" />
                                <span>{appointment.center}</span>
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-bold">{appointment.cost}</p>
                            <div className="flex items-center text-sm text-muted-foreground justify-end">
                              <Calendar className="h-3 w-3 mr-1" />
                              <span>{appointment.date}</span>
                              <Clock className="h-3 w-3 ml-2 mr-1" />
                              <span>{appointment.time}</span>
                            </div>
                          </div>
                        </div>
                        
                        {appointment.status === "Upcoming" && (
                          <div className="mt-3 pt-3 border-t border-border flex justify-end gap-2">
                            <Button variant="outline" size="sm">Reschedule</Button>
                            <Button variant="destructive" size="sm">Cancel</Button>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </TabsContent>
                
                {/* Saved Locations Tab */}
                <TabsContent value="locations" className="space-y-4">
                  <h2 className="text-2xl font-bold mt-2">Saved Locations</h2>
                  
                  {savedLocations.map((location) => (
                    <Card key={location.id}>
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center mr-4">
                              <MapPin className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                              <h3 className="font-medium">{location.name}</h3>
                              <p className="text-sm text-muted-foreground">{location.address}</p>
                            </div>
                          </div>
                          <Button variant="ghost" size="sm">
                            Edit
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                  
                  <Button variant="outline" className="w-full">
                    Add New Location
                  </Button>
                </TabsContent>
                
                {/* Payment Methods Tab */}
                <TabsContent value="payment" className="space-y-4">
                  <h2 className="text-2xl font-bold mt-2">Payment Methods</h2>
                  
                  {paymentMethods.map((method) => (
                    <Card key={method.id}>
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center mr-4">
                              <CreditCard className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                              <h3 className="font-medium">{method.type}</h3>
                              <p className="text-sm text-muted-foreground">
                                {method.type === "Credit Card" 
                                  ? `**** **** **** ${method.last4} (Expires: ${method.expiry})` 
                                  : method.email}
                              </p>
                            </div>
                          </div>
                          <Button variant="ghost" size="sm">
                            Edit
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                  
                  <Button variant="outline" className="w-full">
                    Add Payment Method
                  </Button>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
} 