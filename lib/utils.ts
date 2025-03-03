import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Generate a random 6-digit PIN
export function generatePin(): string {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

// Calculate rental fare based on hours
export function calculateFare(hours: number): number {
  const baseRate = 10 // $10 per hour
  return Math.round(hours * baseRate)
}

// Mock data for battery warehouses
export const batteryWarehouses = [
  {
    id: 1,
    name: "EcoSwap Central",
    address: "123 Main St, Downtown",
    distance: "0.8 miles",
    availableBatteries: 15,
    coordinates: { lat: 40.7128, lng: -74.006 },
  },
  {
    id: 2,
    name: "GreenPower Hub",
    address: "456 Park Ave, Midtown",
    distance: "1.2 miles",
    availableBatteries: 8,
    coordinates: { lat: 40.7282, lng: -73.9942 },
  },
  {
    id: 3,
    name: "ElectroSwap Station",
    address: "789 Broadway, Uptown",
    distance: "2.5 miles",
    availableBatteries: 22,
    coordinates: { lat: 40.7589, lng: -73.9851 },
  },
  {
    id: 4,
    name: "PowerExchange Center",
    address: "101 River Rd, Westside",
    distance: "3.1 miles",
    availableBatteries: 5,
    coordinates: { lat: 40.7549, lng: -74.0134 },
  },
]

// Mock data for charging stations with bikes
export const chargingStations = [
  {
    id: 1,
    name: "EcoBike Central",
    address: "123 Main St, Downtown",
    distance: "0.8 miles",
    availableBikes: [
      { id: 101, model: "Urban Cruiser", batteryLevel: "95%" },
      { id: 102, model: "City Commuter", batteryLevel: "87%" },
      { id: 103, model: "Eco Rider", batteryLevel: "100%" },
    ],
    coordinates: { lat: 40.7128, lng: -74.006 },
  },
  {
    id: 2,
    name: "GreenRide Hub",
    address: "456 Park Ave, Midtown",
    distance: "1.2 miles",
    availableBikes: [
      { id: 201, model: "Mountain Explorer", batteryLevel: "78%" },
      { id: 202, model: "Urban Cruiser", batteryLevel: "92%" },
    ],
    coordinates: { lat: 40.7282, lng: -73.9942 },
  },
  {
    id: 3,
    name: "ElectroCycle Station",
    address: "789 Broadway, Uptown",
    distance: "2.5 miles",
    availableBikes: [
      { id: 301, model: "City Commuter", batteryLevel: "85%" },
      { id: 302, model: "Eco Rider", batteryLevel: "90%" },
      { id: 303, model: "Urban Cruiser", batteryLevel: "100%" },
      { id: 304, model: "Mountain Explorer", batteryLevel: "75%" },
    ],
    coordinates: { lat: 40.7589, lng: -73.9851 },
  },
]

