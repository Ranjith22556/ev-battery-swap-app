"use client"

import { useAuth } from "@/components/auth-provider"
import { Button } from "@/components/ui/button"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Battery, Bike, ChevronRight } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

export default function SelectService() {
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

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <main className="flex-1 pt-16">
        <section className="py-12 md:py-24 gradient-bg">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2 animate-fade-in">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl">Choose Your Service</h1>
                <p className="max-w-[700px] text-muted-foreground md:text-xl/relaxed">
                  Select the service you need today
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12 max-w-4xl mx-auto">
              {/* Battery Swap Card */}
              <div className="gradient-card rounded-xl p-8 flex flex-col items-center text-center animate-slide-up">
                <div className="h-20 w-20 rounded-full bg-primary/20 flex items-center justify-center mb-6">
                  <Battery className="h-10 w-10 text-primary" />
                </div>
                <h3 className="text-2xl font-bold mb-4">Battery Swapping</h3>
                <p className="text-muted-foreground mb-8">
                  Quickly swap your depleted EV battery for a fully charged one at any of our convenient locations.
                </p>
                <Button asChild variant="gradient" size="lg" className="w-full">
                  <Link href="/battery-swap">
                    Select Battery Swap
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>

              {/* Bike Rental Card */}
              <div
                className="gradient-card rounded-xl p-8 flex flex-col items-center text-center animate-slide-up"
                style={{ animationDelay: "0.2s" }}
              >
                <div className="h-20 w-20 rounded-full bg-primary/20 flex items-center justify-center mb-6">
                  <Bike className="h-10 w-10 text-primary" />
                </div>
                <h3 className="text-2xl font-bold mb-4">Bike Rental</h3>
                <p className="text-muted-foreground mb-8">
                  Rent an electric bike for your commute or leisure ride. Pick up and drop off at any of our charging
                  stations.
                </p>
                <Button asChild variant="gradient" size="lg" className="w-full">
                  <Link href="/bike-rental">
                    Select Bike Rental
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}

