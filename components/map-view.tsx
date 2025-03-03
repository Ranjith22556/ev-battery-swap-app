"use client"

import { useState, useEffect } from "react"
import { MapPin } from "lucide-react"

interface Coordinates {
  lat: number
  lng: number
}

interface MapViewProps {
  locations: {
    id: number
    name: string
    coordinates: Coordinates
  }[]
  selectedId?: number
  onSelectLocation?: (id: number) => void
}

export function MapView({ locations, selectedId, onSelectLocation }: MapViewProps) {
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  if (!isClient) {
    return <div className="h-[300px] bg-muted/20 rounded-lg flex items-center justify-center">Loading map...</div>
  }

  return (
    <div className="relative h-[300px] bg-muted/20 rounded-lg overflow-hidden border border-border/50">
      {/* This is a simplified map visualization for demo purposes */}
      <div className="absolute inset-0 bg-[url('/placeholder.svg?height=600&width=800')] opacity-20"></div>

      <div className="absolute inset-0 p-4">
        <div className="text-xs text-muted-foreground absolute top-2 left-2">Map View (Simulation)</div>

        {/* Render location pins */}
        {locations.map((location) => {
          // Convert coordinates to relative positions within the container
          const x = ((location.coordinates.lng + 180) / 360) * 100
          const y = ((90 - location.coordinates.lat) / 180) * 100

          const isSelected = location.id === selectedId

          return (
            <div
              key={location.id}
              className={`absolute cursor-pointer transition-all duration-300 ${
                isSelected ? "z-10 scale-125" : "hover:scale-110"
              }`}
              style={{
                left: `${x}%`,
                top: `${y}%`,
                transform: "translate(-50%, -50%)",
              }}
              onClick={() => onSelectLocation && onSelectLocation(location.id)}
            >
              <div className="flex flex-col items-center">
                <MapPin
                  className={`h-6 w-6 ${isSelected ? "text-primary" : "text-white"}`}
                  fill={isSelected ? "currentColor" : "transparent"}
                />
                <div
                  className={`text-xs font-medium mt-1 px-1.5 py-0.5 rounded-full ${
                    isSelected ? "bg-primary text-primary-foreground" : "bg-background/80 text-foreground"
                  }`}
                >
                  {location.name}
                </div>
              </div>
            </div>
          )
        })}

        {/* User location (simulated) */}
        <div
          className="absolute bg-blue-500 h-3 w-3 rounded-full animate-pulse"
          style={{
            left: "50%",
            top: "50%",
            transform: "translate(-50%, -50%)",
            boxShadow: "0 0 0 rgba(59, 130, 246, 0.5)",
            animation: "pulse 2s infinite",
          }}
        >
          <div className="absolute inset-0 rounded-full bg-blue-500 opacity-75 animate-ping"></div>
          <div className="text-xs font-medium mt-3 px-1.5 py-0.5 rounded-full bg-blue-500/80 text-white whitespace-nowrap">
            Your Location
          </div>
        </div>
      </div>
    </div>
  )
}

