"use client"

import Link from "next/link"
import { useAuth } from "./auth-provider"
import { Button } from "./ui/button"
import { 
  Award, 
  Battery, 
  Bike, 
  LogOut, 
  Menu, 
  User, 
  Users, 
  X,
  Wrench
} from "lucide-react"
import { useState } from "react"
import Image from "next/image"
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "./ui/dropdown-menu"

export function Navbar() {
  const { user, signOut } = useAuth()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <header className="w-full border-b border-border/40 bg-black/50 backdrop-blur-md fixed top-0 z-50">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="relative h-8 w-8">
            <Battery className="h-8 w-8 text-primary" />
            <Bike className="h-4 w-4 text-primary absolute bottom-0 right-0" />
          </div>
          <span className="text-xl font-bold bg-gradient-to-r from-green-400 to-emerald-600 bg-clip-text text-transparent">
            EcoSwap
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          <Link href="/" className="text-sm hover:text-primary transition-colors">
            Home
          </Link>
          <Link href="/battery-swap" className="text-sm hover:text-primary transition-colors">
            Battery Swap
          </Link>
          <Link href="/bike-rental" className="text-sm hover:text-primary transition-colors">
            Bike Rental
          </Link>
          <Link href="/service-booking" className="text-sm hover:text-primary transition-colors">
            Service Booking
          </Link>
          <Link href="/community" className="text-sm hover:text-primary transition-colors">
            Community
          </Link>
          {user && (
            <div className="flex items-center gap-4">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <div className="flex items-center gap-2 cursor-pointer">
                    <div className="h-8 w-8 rounded-full overflow-hidden border border-border">
                      <Image
                        src={user.image || "/placeholder.svg?height=32&width=32"}
                        alt={user.name || "User"}
                        width={32}
                        height={32}
                      />
                    </div>
                    <span className="text-sm">{user.name || "User"}</span>
                  </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard" className="flex items-center cursor-pointer">
                      <User className="h-4 w-4 mr-2" />
                      Dashboard
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/rewards" className="flex items-center cursor-pointer">
                      <Award className="h-4 w-4 mr-2" />
                      Rewards
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/community" className="flex items-center cursor-pointer">
                      <Users className="h-4 w-4 mr-2" />
                      Community
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/battery-health" className="flex items-center cursor-pointer">
                      <Battery className="h-4 w-4 mr-2" />
                      Battery Health
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/service-booking" className="flex items-center cursor-pointer">
                      <Wrench className="h-4 w-4 mr-2" />
                      Service Booking
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={signOut} className="cursor-pointer">
                    <LogOut className="h-4 w-4 mr-2" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          )}
        </nav>

        {/* Mobile Menu Button */}
        <button className="md:hidden text-foreground" onClick={() => setIsMenuOpen(!isMenuOpen)}>
          {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden gradient-bg animate-fade-in">
          <nav className="container py-4 flex flex-col gap-4">
            <Link
              href="/"
              className="text-sm py-2 hover:text-primary transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              href="/battery-swap"
              className="text-sm py-2 hover:text-primary transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Battery Swap
            </Link>
            <Link
              href="/bike-rental"
              className="text-sm py-2 hover:text-primary transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Bike Rental
            </Link>
            <Link
              href="/service-booking"
              className="text-sm py-2 hover:text-primary transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Service Booking
            </Link>
            <Link
              href="/community"
              className="text-sm py-2 hover:text-primary transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Community
            </Link>
            {user && (
              <div className="flex flex-col gap-4 pt-2 border-t border-border/40">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-full overflow-hidden border border-border">
                    <Image
                      src={user.image || "/placeholder.svg?height=32&width=32"}
                      alt={user.name || "User"}
                      width={32}
                      height={32}
                    />
                  </div>
                  <span className="text-sm">{user.name || "User"}</span>
                </div>
                <Link
                  href="/dashboard"
                  className="flex items-center text-sm py-2 hover:text-primary transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <User className="h-4 w-4 mr-2" />
                  Dashboard
                </Link>
                <Link
                  href="/rewards"
                  className="flex items-center text-sm py-2 hover:text-primary transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <Award className="h-4 w-4 mr-2" />
                  Rewards
                </Link>
                <Link
                  href="/battery-health"
                  className="flex items-center text-sm py-2 hover:text-primary transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <Battery className="h-4 w-4 mr-2" />
                  Battery Health
                </Link>
                <Link
                  href="/service-booking"
                  className="flex items-center text-sm py-2 hover:text-primary transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <Wrench className="h-4 w-4 mr-2" />
                  Service Booking
                </Link>
                <Button variant="outline" size="sm" onClick={signOut} className="w-full mt-2">
                  <LogOut className="h-4 w-4 mr-2" />
                  Sign Out
                </Button>
              </div>
            )}
          </nav>
        </div>
      )}
    </header>
  )
}

