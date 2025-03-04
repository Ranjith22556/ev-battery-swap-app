"use client"

import { useState, useEffect } from "react"
import { MapPin, Navigation, Building, Home, ShoppingBag, Coffee, Car, Bus, Train, Trees, Bike, Wrench } from "lucide-react"

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

// Infrastructure elements for the map
const infrastructureElements = [
  { type: "road", x1: "10%", y1: "50%", x2: "90%", y2: "50%", width: "100%", className: "bg-gray-400" },
  { type: "road", x1: "50%", y1: "10%", x2: "50%", y2: "90%", width: "100%", className: "bg-gray-400" },
  { type: "road", x1: "20%", y1: "20%", x2: "80%", y2: "80%", width: "100%", className: "bg-gray-400" },
  { type: "road", x1: "20%", y1: "80%", x2: "80%", y2: "20%", width: "100%", className: "bg-gray-400" },
  { type: "road", x1: "10%", y1: "30%", x2: "30%", y2: "10%", width: "100%", className: "bg-gray-400" },
  { type: "road", x1: "70%", y1: "10%", x2: "90%", y2: "30%", width: "100%", className: "bg-gray-400" },
  { type: "road", x1: "10%", y1: "70%", x2: "30%", y2: "90%", width: "100%", className: "bg-gray-400" },
  { type: "road", x1: "70%", y1: "90%", x2: "90%", y2: "70%", width: "100%", className: "bg-gray-400" },
];

// Points of interest for the map
const pointsOfInterest = [
  { type: "building", x: "25%", y: "35%", icon: Building, label: "Office Complex" },
  { type: "home", x: "75%", y: "25%", icon: Home, label: "Residential Area" },
  { type: "shopping", x: "65%", y: "65%", icon: ShoppingBag, label: "Shopping Mall" },
  { type: "cafe", x: "35%", y: "75%", icon: Coffee, label: "Cafe District" },
  { type: "transport", x: "85%", y: "45%", icon: Bus, label: "Bus Terminal" },
  { type: "transport", x: "15%", y: "55%", icon: Train, label: "Metro Station" },
  { type: "park", x: "45%", y: "15%", icon: Trees, label: "City Park" },
  { type: "transport", x: "55%", y: "85%", icon: Car, label: "Parking Lot" },
];

export function MapView({ locations, selectedId, onSelectLocation }: MapViewProps) {
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  if (!isClient) {
    return <div className="h-[400px] bg-muted/20 rounded-lg flex items-center justify-center">Loading map...</div>
  }

  // Draw a line between two points
  const Line = ({ x1, y1, x2, y2, className }: { x1: string, y1: string, x2: string, y2: string, className: string }) => {
    // Calculate the length and angle of the line
    const x1Num = parseFloat(x1);
    const y1Num = parseFloat(y1);
    const x2Num = parseFloat(x2);
    const y2Num = parseFloat(y2);
    
    const length = Math.sqrt(Math.pow(x2Num - x1Num, 2) + Math.pow(y2Num - y1Num, 2));
    const angle = Math.atan2(y2Num - y1Num, x2Num - x1Num) * 180 / Math.PI;
    
    return (
      <div 
        className={`absolute h-1.5 ${className}`}
        style={{
          width: `${length}%`,
          left: x1,
          top: y1,
          transformOrigin: '0 0',
          transform: `rotate(${angle}deg)`,
        }}
      />
    );
  };

  return (
    <div className="relative h-[400px] bg-[#f0f4f8] rounded-lg overflow-hidden border border-border/50 shadow-inner">
      {/* Map background with grid */}
      <div className="absolute inset-0 bg-[#e6eef5]">
        <div className="absolute inset-0 grid grid-cols-10 grid-rows-10">
          {Array.from({ length: 100 }).map((_, i) => (
            <div key={i} className="border-[0.5px] border-gray-200/30"></div>
          ))}
        </div>
      </div>

      {/* Map infrastructure - roads */}
      <div className="absolute inset-0">
        {infrastructureElements.map((element, index) => (
          <Line 
            key={`road-${index}`}
            x1={element.x1}
            y1={element.y1}
            x2={element.x2}
            y2={element.y2}
            className={element.className}
          />
        ))}
      </div>

      {/* Points of interest */}
      <div className="absolute inset-0">
        {pointsOfInterest.map((poi, index) => {
          const Icon = poi.icon;
          return (
            <div
              key={`poi-${index}`}
              className="absolute"
              style={{
                left: poi.x,
                top: poi.y,
                transform: "translate(-50%, -50%)",
              }}
            >
              <div className="flex flex-col items-center">
                <div className="bg-white/80 p-1 rounded-full shadow-sm">
                  <Icon className="h-4 w-4 text-gray-600" />
                </div>
                <div className="text-[10px] font-medium mt-1 px-1 py-0.5 rounded bg-white/80 text-gray-700 shadow-sm whitespace-nowrap">
                  {poi.label}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Service center locations */}
      <div className="absolute inset-0">
        {locations.map((location) => {
          // Convert coordinates to relative positions within the container
          const x = ((location.coordinates.lng + 180) / 360) * 100
          const y = ((90 - location.coordinates.lat) / 180) * 100

          const isSelected = location.id === selectedId

          return (
            <div
              key={location.id}
              className={`absolute cursor-pointer transition-all duration-300 ${
                isSelected ? "z-20 scale-125" : "hover:scale-110 z-10"
              }`}
              style={{
                left: `${x}%`,
                top: `${y}%`,
                transform: "translate(-50%, -50%)",
              }}
              onClick={() => onSelectLocation && onSelectLocation(location.id)}
            >
              <div className="flex flex-col items-center">
                <div className={`p-1 rounded-full shadow-md ${isSelected ? "bg-primary" : "bg-white"}`}>
                  <Wrench className={`h-4 w-4 ${isSelected ? "text-white" : "text-primary"}`} />
                </div>
                <div
                  className={`text-xs font-medium mt-1 px-2 py-1 rounded-full shadow-md ${
                    isSelected 
                      ? "bg-primary text-white" 
                      : "bg-white text-gray-800"
                  }`}
                >
                  {location.name}
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* User location */}
      <div
        className="absolute z-30"
        style={{
          left: "50%",
          top: "50%",
          transform: "translate(-50%, -50%)",
        }}
      >
        <div className="flex flex-col items-center">
          <div className="relative">
            <div className="absolute -inset-2 rounded-full bg-blue-500/20 animate-pulse"></div>
            <div className="bg-blue-500 p-1.5 rounded-full shadow-lg">
              <Navigation className="h-4 w-4 text-white" />
            </div>
          </div>
          <div className="text-xs font-medium mt-1.5 px-2 py-1 rounded-full bg-blue-500 text-white shadow-md whitespace-nowrap">
            Your Location
          </div>
        </div>
      </div>

      {/* Map controls and attribution */}
      <div className="absolute bottom-2 right-2 flex flex-col gap-2">
        <div className="bg-white rounded-md shadow-md p-1.5 flex flex-col gap-1.5">
          <button className="h-6 w-6 flex items-center justify-center rounded hover:bg-gray-100">
            <span className="text-lg font-bold">+</span>
          </button>
          <div className="h-px w-full bg-gray-200"></div>
          <button className="h-6 w-6 flex items-center justify-center rounded hover:bg-gray-100">
            <span className="text-lg font-bold">−</span>
          </button>
        </div>
      </div>

      <div className="absolute bottom-2 left-2 text-xs text-gray-500 bg-white/80 px-2 py-1 rounded">
        Map data © EcoSwap 2023
      </div>
    </div>
  )
}

