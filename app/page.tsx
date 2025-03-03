"use client"

import { useAuth } from "@/components/auth-provider"
import { Button } from "@/components/ui/button"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Battery, Bike, ChevronRight, Zap } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { useEffect, useRef } from "react"

export default function Home() {
  const { user, signIn, isLoading } = useAuth()
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    // Ensure video plays automatically when component mounts
    if (videoRef.current) {
      videoRef.current.play().catch(error => {
        console.error("Error playing video:", error)
      })
    }
  }, [])

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative h-screen flex items-center justify-center overflow-hidden">
          {/* Video Background */}
          <div className="absolute inset-0 w-full h-full z-0">
            <video 
              ref={videoRef}
              className="absolute inset-0 w-full h-full object-cover"
              autoPlay
              muted
              loop
              playsInline
              poster="/placeholder.jpg"
            >
              <source src="/videos/ev-bike-video.mp4" type="video/mp4" />
              Your browser does not support the video tag.
            </video>
            {/* Overlay to ensure text is readable */}
            <div className="absolute inset-0 bg-black bg-opacity-60 z-10"></div>
          </div>

          <div className="container px-4 md:px-6 relative z-20">
            <div className="flex flex-col items-center justify-center text-center max-w-3xl mx-auto">
              <div className="flex flex-col justify-center space-y-4 animate-fade-in">
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none bg-gradient-to-r from-white to-green-400 bg-clip-text text-transparent">
                    Sustainable Mobility for a Greener Future
                  </h1>
                  <p className="text-muted-foreground md:text-xl mx-auto">
                    Swap batteries or rent electric bikes with ease. Our network of stations makes sustainable
                    transportation accessible to everyone.
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-3 pt-4 justify-center">
                  {user ? (
                    <Button asChild variant="gradient" size="lg">
                      <Link href="/select-service">
                        Get Started
                        <ChevronRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  ) : (
                    <Button 
                      variant="gradient" 
                      size="lg" 
                      onClick={() => {
                        console.log("Sign in button clicked");
                        try {
                          signIn("google");
                          console.log("Sign in function called successfully");
                        } catch (error) {
                          console.error("Error calling sign in function:", error);
                        }
                      }} 
                      disabled={isLoading}
                    >
                      <div className="mr-2 h-4 w-4 rounded-full bg-white"></div>
                      Sign in with Google
                    </Button>
                  )}
                  <Button asChild variant="outline" size="lg">
                    <Link href="#services">Learn More</Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Services Section */}
        <section id="services" className="py-12 md:py-24">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Our Services</h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed">
                  Choose between battery swapping for your electric vehicle or renting an e-bike for your journey.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
              {/* Battery Swap Card */}
              <div className="gradient-card rounded-xl p-6 flex flex-col h-full">
                <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center mb-6">
                  <Battery className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-2xl font-bold mb-2">Battery Swapping</h3>
                <p className="text-muted-foreground mb-6 flex-1">
                  Quickly swap your depleted EV battery for a fully charged one at any of our convenient locations. No
                  waiting for a charge.
                </p>
                <ul className="space-y-2 mb-6">
                  <li className="flex items-center">
                    <Zap className="h-4 w-4 text-primary mr-2" />
                    <span className="text-sm">Instant power, no charging wait</span>
                  </li>
                  <li className="flex items-center">
                    <Zap className="h-4 w-4 text-primary mr-2" />
                    <span className="text-sm">Multiple warehouse locations</span>
                  </li>
                  <li className="flex items-center">
                    <Zap className="h-4 w-4 text-primary mr-2" />
                    <span className="text-sm">Secure PIN-based collection</span>
                  </li>
                </ul>
                <Button asChild variant="gradient" className="mt-auto">
                  <Link href={user ? "/battery-swap" : "/"}>Find Battery Stations</Link>
                </Button>
              </div>

              {/* Bike Rental Card */}
              <div className="gradient-card rounded-xl p-6 flex flex-col h-full">
                <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center mb-6">
                  <Bike className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-2xl font-bold mb-2">Bike Rental</h3>
                <p className="text-muted-foreground mb-6 flex-1">
                  Rent an electric bike for your commute or leisure ride. Pick up and drop off at any of our charging
                  stations.
                </p>
                <ul className="space-y-2 mb-6">
                  <li className="flex items-center">
                    <Zap className="h-4 w-4 text-primary mr-2" />
                    <span className="text-sm">Variety of e-bike models</span>
                  </li>
                  <li className="flex items-center">
                    <Zap className="h-4 w-4 text-primary mr-2" />
                    <span className="text-sm">Hourly rental options</span>
                  </li>
                  <li className="flex items-center">
                    <Zap className="h-4 w-4 text-primary mr-2" />
                    <span className="text-sm">Convenient pickup locations</span>
                  </li>
                </ul>
                <Button asChild variant="gradient" className="mt-auto">
                  <Link href={user ? "/bike-rental" : "/"}>Rent a Bike</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="py-12 md:py-24 bg-muted/20">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">How It Works</h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed">
                  Simple steps to get you moving with sustainable transportation
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
              {/* Step 1 */}
              <div className="bg-card/50 rounded-xl p-6 border border-border/50 relative">
                <div className="absolute -top-4 -left-4 h-8 w-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold">
                  1
                </div>
                <h3 className="text-xl font-bold mb-4 mt-2">Sign Up</h3>
                <p className="text-muted-foreground">
                  Create an account with your Google credentials to access our services.
                </p>
              </div>

              {/* Step 2 */}
              <div className="bg-card/50 rounded-xl p-6 border border-border/50 relative">
                <div className="absolute -top-4 -left-4 h-8 w-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold">
                  2
                </div>
                <h3 className="text-xl font-bold mb-4 mt-2">Choose Service</h3>
                <p className="text-muted-foreground">
                  Select whether you need a battery swap or want to rent an e-bike.
                </p>
              </div>

              {/* Step 3 */}
              <div className="bg-card/50 rounded-xl p-6 border border-border/50 relative">
                <div className="absolute -top-4 -left-4 h-8 w-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold">
                  3
                </div>
                <h3 className="text-xl font-bold mb-4 mt-2">Pay & Go</h3>
                <p className="text-muted-foreground">
                  Make a payment and receive your PIN or booking confirmation to get started.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-12 md:py-24">
          <div className="container px-4 md:px-6">
            <div className="rounded-xl overflow-hidden gradient-bg">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-8 md:p-12 flex flex-col justify-center">
                  <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl mb-4">Ready to get started?</h2>
                  <p className="text-muted-foreground mb-6">
                    Join thousands of users who are already enjoying sustainable mobility with EcoSwap.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3">
                    {user ? (
                      <Button asChild variant="gradient" size="lg">
                        <Link href="/select-service">
                          Get Started
                          <ChevronRight className="ml-2 h-4 w-4" />
                        </Link>
                      </Button>
                    ) : (
                      <Button 
                        variant="gradient" 
                        size="lg" 
                        onClick={() => {
                          console.log("Sign in button clicked");
                          try {
                            signIn("google");
                            console.log("Sign in function called successfully");
                          } catch (error) {
                            console.error("Error calling sign in function:", error);
                          }
                        }} 
                        disabled={isLoading}
                      >
                        <div className="mr-2 h-4 w-4 rounded-full bg-white"></div>
                        Sign in with Google
                      </Button>
                    )}
                  </div>
                </div>
                <div className="relative h-64 md:h-auto overflow-hidden rounded-r-xl">
                  {/* Using a default EV bike image with a fallback to our SVG */}
                  <div className="absolute inset-0 flex items-center justify-center p-8">
                    <Image
                      src="/images/ev-bike.jpg"
                      fill
                      alt="Electric bike"
                      className="object-contain hover:scale-105 transition-transform duration-500"
                      onError={(e) => {
                        // Fallback to our SVG if the JPG doesn't exist
                        const target = e.target as HTMLImageElement;
                        target.src = "/images/ev-bike.svg";
                      }}
                    />
                    {/* Gradient overlay for better text readability */}
                    <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}

