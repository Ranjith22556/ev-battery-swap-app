"use client"

import { useAuth } from "@/components/auth-provider"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { 
  Award, 
  Battery, 
  Bike, 
  Calendar, 
  Heart, 
  MapPin, 
  MessageSquare, 
  Share2, 
  ThumbsUp, 
  Trophy, 
  Users, 
  Zap 
} from "lucide-react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

export default function CommunityPage() {
  const { user, isLoading } = useAuth()
  const router = useRouter()
  const [postContent, setPostContent] = useState("")

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
  const communityPosts = [
    {
      id: 1,
      user: {
        name: "Alex Johnson",
        avatar: "",
        badge: "Gold Member"
      },
      content: "Just completed my 50th battery swap! The new downtown station is super efficient - in and out in less than 2 minutes. Loving the service! #EcoSwap #SustainableMobility",
      image: null,
      timestamp: "2 hours ago",
      likes: 24,
      comments: 5,
      liked: true
    },
    {
      id: 2,
      user: {
        name: "Samantha Lee",
        avatar: "",
        badge: "Silver Member"
      },
      content: "Weekend bike ride through Central Park using the rental service. Perfect weather and the battery lasted all day! Would recommend the Model X bikes for longer trips. 🚲 #WeekendRide #GreenCommute",
      image: null,
      timestamp: "Yesterday",
      likes: 42,
      comments: 8,
      liked: false
    },
    {
      id: 3,
      user: {
        name: "David Chen",
        avatar: "",
        badge: "Bronze Member"
      },
      content: "Has anyone tried the new quick-swap batteries? I'm curious if they really last 20% longer as advertised. My commute is about 15 miles each way and I'm considering upgrading.",
      image: null,
      timestamp: "2 days ago",
      likes: 13,
      comments: 12,
      liked: false
    }
  ]

  const upcomingEvents = [
    {
      id: 1,
      title: "Community Bike Ride",
      description: "Join us for a guided tour of the city's green spaces. Free bike rental for all participants!",
      date: "March 15, 2023",
      time: "10:00 AM",
      location: "Central Park Entrance",
      attendees: 34,
      image: ""
    },
    {
      id: 2,
      title: "EV Technology Workshop",
      description: "Learn about the latest in electric vehicle battery technology and how our swap system works.",
      date: "March 22, 2023",
      time: "6:30 PM",
      location: "Downtown Innovation Hub",
      attendees: 28,
      image: ""
    },
    {
      id: 3,
      title: "Sustainability Meetup",
      description: "Network with other eco-conscious individuals and share ideas for a greener future.",
      date: "April 5, 2023",
      time: "7:00 PM",
      location: "Green Cafe on 5th Avenue",
      attendees: 42,
      image: ""
    }
  ]

  const leaderboard = [
    { id: 1, name: "Michael T.", points: 2450, avatar: "", rank: 1 },
    { id: 2, name: "Sarah W.", points: 2340, avatar: "", rank: 2 },
    { id: 3, name: "James L.", points: 2180, avatar: "", rank: 3 },
    { id: 4, name: "Emma R.", points: 1950, avatar: "", rank: 4 },
    { id: 5, name: "Daniel K.", points: 1820, avatar: "", rank: 5 },
    { id: 6, name: "Olivia P.", points: 1760, avatar: "", rank: 6 },
    { id: 7, name: "Noah S.", points: 1690, avatar: "", rank: 7 },
    { id: 8, name: "Sophia C.", points: 1580, avatar: "", rank: 8 },
    { id: 9, name: "Ethan B.", points: 1510, avatar: "", rank: 9 },
    { id: 10, name: "Ava M.", points: 1470, avatar: "", rank: 10 }
  ]

  const handlePostSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    // In a real app, this would send the post to the server
    alert("Post submitted! In a real app, this would be saved to the database.")
    setPostContent("")
  }

  const toggleLike = (postId: number) => {
    // In a real app, this would update the like status in the database
    console.log(`Toggled like for post ${postId}`)
  }

  const registerForEvent = (eventId: number) => {
    // In a real app, this would register the user for the event
    alert(`Registered for event! In a real app, you would be added to event #${eventId}`)
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <main className="flex-1 py-12">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col space-y-8">
            <div className="flex flex-col space-y-2">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl">Community Hub</h1>
              <p className="text-muted-foreground">
                Connect with other eco-conscious users, share your experiences, and join events
              </p>
            </div>

            <Tabs defaultValue="feed" className="space-y-4">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="feed">Social Feed</TabsTrigger>
                <TabsTrigger value="events">Events</TabsTrigger>
                <TabsTrigger value="leaderboard">Leaderboard</TabsTrigger>
              </TabsList>
              
              {/* Social Feed Tab */}
              <TabsContent value="feed" className="space-y-6">
                {/* Post Creation Card */}
                <Card>
                  <CardHeader>
                    <CardTitle>Share Your Experience</CardTitle>
                    <CardDescription>Post about your latest ride or battery swap</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handlePostSubmit}>
                      <div className="flex items-start space-x-4">
                        <Avatar>
                          <AvatarImage src={user?.image || ""} alt={user?.name || "User"} />
                          <AvatarFallback name={user?.name}>{user?.name?.charAt(0) || "U"}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1 space-y-4">
                          <Textarea
                            placeholder="What's on your mind?"
                            value={postContent}
                            onChange={(e) => setPostContent(e.target.value)}
                            className="min-h-[100px]"
                          />
                          <div className="flex justify-between items-center">
                            <div className="flex space-x-2">
                              <Button type="button" variant="outline" size="sm">
                                Add Photo
                              </Button>
                              <Button type="button" variant="outline" size="sm">
                                Tag Location
                              </Button>
                            </div>
                            <Button type="submit" disabled={!postContent.trim()}>
                              Post
                            </Button>
                          </div>
                        </div>
                      </div>
                    </form>
                  </CardContent>
                </Card>

                {/* Community Posts */}
                {communityPosts.map((post) => (
                  <Card key={post.id} className="overflow-hidden">
                    <CardHeader className="pb-3">
                      <div className="flex justify-between items-start">
                        <div className="flex items-center space-x-4">
                          <Avatar>
                            <AvatarImage src={post.user.avatar} alt={post.user.name} />
                            <AvatarFallback name={post.user.name}>{post.user.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="flex items-center">
                              <h3 className="font-semibold">{post.user.name}</h3>
                              <Badge variant="outline" className="ml-2 bg-primary/10 text-xs">
                                {post.user.badge}
                              </Badge>
                            </div>
                            <p className="text-xs text-muted-foreground">{post.timestamp}</p>
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="pb-3">
                      <p className="whitespace-pre-line">{post.content}</p>
                      {post.image && (
                        <div className="mt-3 rounded-md overflow-hidden">
                          <img 
                            src={post.image} 
                            alt="Post attachment" 
                            className="w-full h-auto object-cover max-h-[300px]" 
                          />
                        </div>
                      )}
                    </CardContent>
                    <CardFooter className="border-t pt-3 flex justify-between">
                      <div className="flex space-x-4">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className={post.liked ? "text-primary" : ""}
                          onClick={() => toggleLike(post.id)}
                        >
                          <ThumbsUp className="h-4 w-4 mr-1" />
                          {post.likes}
                        </Button>
                        <Button variant="ghost" size="sm">
                          <MessageSquare className="h-4 w-4 mr-1" />
                          {post.comments}
                        </Button>
                      </div>
                      <Button variant="ghost" size="sm">
                        <Share2 className="h-4 w-4 mr-1" />
                        Share
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </TabsContent>
              
              {/* Events Tab */}
              <TabsContent value="events" className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {upcomingEvents.map((event) => (
                    <Card key={event.id} className="overflow-hidden flex flex-col">
                      <div className="relative h-48 bg-gradient-to-br from-primary/30 to-primary/10">
                        {event.image && (
                          <>
                            <img 
                              src={event.image} 
                              alt={event.title} 
                              className="absolute inset-0 w-full h-full object-cover" 
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                          </>
                        )}
                        <div className="absolute bottom-3 left-3 right-3">
                          <Badge className="bg-primary text-primary-foreground">
                            <Calendar className="h-3 w-3 mr-1" />
                            {event.date}
                          </Badge>
                        </div>
                      </div>
                      <CardHeader className="pb-2">
                        <CardTitle>{event.title}</CardTitle>
                      </CardHeader>
                      <CardContent className="flex-1">
                        <p className="text-sm text-muted-foreground mb-4">{event.description}</p>
                        <div className="space-y-2 text-sm">
                          <div className="flex items-center">
                            <Calendar className="h-4 w-4 mr-2 text-primary" />
                            <span>{event.date} at {event.time}</span>
                          </div>
                          <div className="flex items-center">
                            <MapPin className="h-4 w-4 mr-2 text-primary" />
                            <span>{event.location}</span>
                          </div>
                          <div className="flex items-center">
                            <Users className="h-4 w-4 mr-2 text-primary" />
                            <span>{event.attendees} attending</span>
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter>
                        <Button 
                          variant="gradient" 
                          className="w-full"
                          onClick={() => registerForEvent(event.id)}
                        >
                          Register
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              </TabsContent>
              
              {/* Leaderboard Tab */}
              <TabsContent value="leaderboard" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Trophy className="h-5 w-5 mr-2 text-primary" />
                      Top Contributors
                    </CardTitle>
                    <CardDescription>
                      Users with the most points from swaps, rentals, and community engagement
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {leaderboard.map((user) => (
                        <div 
                          key={user.id} 
                          className={`flex items-center p-3 rounded-lg ${
                            user.rank <= 3 ? "bg-primary/10 border border-primary/20" : ""
                          }`}
                        >
                          <div className="flex items-center justify-center h-8 w-8 rounded-full bg-muted mr-4 font-bold text-sm">
                            {user.rank}
                          </div>
                          <Avatar className="h-10 w-10 mr-4">
                            <AvatarImage src={user.avatar} alt={user.name} />
                            <AvatarFallback name={user.name}>{user.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <h3 className="font-medium">{user.name}</h3>
                            <div className="flex items-center">
                              <Zap className="h-3 w-3 mr-1 text-primary" />
                              <span className="text-sm text-muted-foreground">{user.points} points</span>
                            </div>
                          </div>
                          {user.rank <= 3 && (
                            <Badge className={`
                              ${user.rank === 1 ? "bg-yellow-500/20 text-yellow-600 border-yellow-500/30" : ""}
                              ${user.rank === 2 ? "bg-gray-300/20 text-gray-600 border-gray-300/30" : ""}
                              ${user.rank === 3 ? "bg-amber-600/20 text-amber-700 border-amber-600/30" : ""}
                            `}>
                              {user.rank === 1 ? "Gold" : user.rank === 2 ? "Silver" : "Bronze"}
                            </Badge>
                          )}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                  <CardFooter className="border-t pt-4 flex justify-between">
                    <div className="flex items-center">
                      <Heart className="h-4 w-4 mr-2 text-primary" />
                      <span className="text-sm">Your Rank: 24th (950 points)</span>
                    </div>
                    <Button variant="outline" size="sm">
                      View Full Leaderboard
                    </Button>
                  </CardFooter>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
} 