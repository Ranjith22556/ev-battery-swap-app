"use client"

import { useAuth } from "@/components/auth-provider"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Award, Battery, Bike, Gift, Leaf, Zap } from "lucide-react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

export default function RewardsPage() {
  const { user, isLoading } = useAuth()
  const router = useRouter()
  const [progressValue, setProgressValue] = useState(0)

  // Redirect if not logged in
  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/")
    }
  }, [user, isLoading, router])

  // Animate progress bar on load
  useEffect(() => {
    const timer = setTimeout(() => setProgressValue(65), 500)
    return () => clearTimeout(timer)
  }, [])

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    )
  }

  // Mock data for demonstration
  const loyaltyPoints = 450
  const currentTier = "Silver"
  const nextTier = "Gold"
  const pointsToNextTier = 200

  const availableRewards = [
    {
      id: 1,
      title: "Free Battery Swap",
      description: "Redeem 300 points for a free battery swap at any location",
      pointsCost: 300,
      icon: <Battery className="h-5 w-5" />,
      available: true
    },
    {
      id: 2,
      title: "2-Hour Bike Rental",
      description: "Redeem 250 points for a free 2-hour bike rental",
      pointsCost: 250,
      icon: <Bike className="h-5 w-5" />,
      available: true
    },
    {
      id: 3,
      title: "Premium Membership (1 Month)",
      description: "Redeem 1000 points for one month of premium membership with priority service",
      pointsCost: 1000,
      icon: <Award className="h-5 w-5" />,
      available: false
    }
  ]

  const achievements = [
    {
      id: 1,
      title: "First Swap",
      description: "Complete your first battery swap",
      icon: <Battery className="h-5 w-5" />,
      completed: true,
      points: 50
    },
    {
      id: 2,
      title: "Eco Warrior",
      description: "Save 100kg of CO₂ emissions",
      icon: <Leaf className="h-5 w-5" />,
      completed: true,
      points: 100
    },
    {
      id: 3,
      title: "Regular Rider",
      description: "Rent bikes 5 times in a month",
      icon: <Bike className="h-5 w-5" />,
      completed: false,
      progress: 3,
      total: 5,
      points: 150
    },
    {
      id: 4,
      title: "Power User",
      description: "Complete 20 battery swaps",
      icon: <Zap className="h-5 w-5" />,
      completed: false,
      progress: 12,
      total: 20,
      points: 200
    }
  ]

  const tierBenefits = {
    Bronze: [
      "Access to all standard stations",
      "Regular pricing on all services",
      "Basic customer support"
    ],
    Silver: [
      "5% discount on all services",
      "Priority at busy stations",
      "24/7 premium customer support",
      "Exclusive monthly promotions"
    ],
    Gold: [
      "10% discount on all services",
      "VIP access to all stations",
      "Free monthly battery swap",
      "Dedicated customer support line",
      "Early access to new features and locations"
    ]
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <main className="flex-1 py-12">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col space-y-8">
            {/* Loyalty Status Card */}
            <Card className="gradient-card">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle className="text-2xl">Loyalty Program</CardTitle>
                    <CardDescription>Your current rewards status</CardDescription>
                  </div>
                  <div className="flex items-center">
                    <Zap className="h-5 w-5 mr-2 text-primary" />
                    <span className="text-2xl font-bold">{loyaltyPoints} points</span>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <Badge variant="outline" className="px-3 py-1 bg-primary/20">
                      <Award className="h-4 w-4 mr-2" />
                      {currentTier} Member
                    </Badge>
                    <span className="text-sm">{pointsToNextTier} points to {nextTier}</span>
                  </div>
                  
                  <Progress value={progressValue} className="h-2" />
                  
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Bronze</span>
                    <span>Silver</span>
                    <span>Gold</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Tabs for Rewards, Achievements, and Benefits */}
            <Tabs defaultValue="rewards" className="space-y-4">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="rewards">Rewards</TabsTrigger>
                <TabsTrigger value="achievements">Achievements</TabsTrigger>
                <TabsTrigger value="benefits">Tier Benefits</TabsTrigger>
              </TabsList>
              
              {/* Rewards Tab */}
              <TabsContent value="rewards" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {availableRewards.map((reward) => (
                    <Card key={reward.id} className={!reward.available ? "opacity-70" : ""}>
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-start">
                          <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center">
                            {reward.icon}
                          </div>
                          <Badge variant="outline" className="bg-primary/10">
                            {reward.pointsCost} points
                          </Badge>
                        </div>
                        <CardTitle className="text-xl mt-2">{reward.title}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground">{reward.description}</p>
                      </CardContent>
                      <CardFooter>
                        <Button 
                          variant={reward.available && loyaltyPoints >= reward.pointsCost ? "gradient" : "outline"} 
                          className="w-full"
                          disabled={!reward.available || loyaltyPoints < reward.pointsCost}
                        >
                          <Gift className="mr-2 h-4 w-4" />
                          Redeem Reward
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              </TabsContent>
              
              {/* Achievements Tab */}
              <TabsContent value="achievements" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {achievements.map((achievement) => (
                    <Card key={achievement.id} className={achievement.completed ? "border-green-500/30" : ""}>
                      <CardContent className="p-6">
                        <div className="flex items-start space-x-4">
                          <div className={`h-12 w-12 rounded-full flex items-center justify-center ${
                            achievement.completed ? "bg-green-500/20" : "bg-primary/20"
                          }`}>
                            {achievement.icon}
                          </div>
                          <div className="flex-1">
                            <div className="flex justify-between items-start">
                              <h3 className="font-bold">{achievement.title}</h3>
                              <Badge variant="outline" className="bg-primary/10">
                                {achievement.points} pts
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground mt-1">{achievement.description}</p>
                            
                            {!achievement.completed && achievement.progress !== undefined && (
                              <div className="mt-2">
                                <div className="flex justify-between text-xs mb-1">
                                  <span>Progress</span>
                                  <span>{achievement.progress}/{achievement.total}</span>
                                </div>
                                <Progress 
                                  value={(achievement.progress / achievement.total) * 100} 
                                  className="h-2" 
                                />
                              </div>
                            )}
                            
                            {achievement.completed && (
                              <Badge variant="outline" className="mt-2 bg-green-500/20 text-green-500 border-green-500/30">
                                Completed
                              </Badge>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
              
              {/* Benefits Tab */}
              <TabsContent value="benefits" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {Object.entries(tierBenefits).map(([tier, benefits]) => (
                    <Card key={tier} className={tier === currentTier ? "border-primary/50" : ""}>
                      <CardHeader className={tier === currentTier ? "bg-primary/10" : ""}>
                        <CardTitle className="flex items-center">
                          <Award className="h-5 w-5 mr-2" />
                          {tier}
                          {tier === currentTier && (
                            <Badge className="ml-2 bg-primary text-primary-foreground">Current</Badge>
                          )}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="pt-4">
                        <ul className="space-y-2">
                          {benefits.map((benefit, index) => (
                            <li key={index} className="flex items-start">
                              <Zap className="h-4 w-4 mr-2 text-primary mt-0.5" />
                              <span className="text-sm">{benefit}</span>
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
} 