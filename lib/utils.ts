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
  const baseRate = 750 // ₹750 per hour
  return Math.round(hours * baseRate)
}

// Battery pricing based on health
export const getBatteryPrice = (healthPercentage: number): number => {
  if (healthPercentage >= 90) return 2625; // Premium price for excellent health (₹2,625)
  if (healthPercentage >= 70) return 1875; // Standard price for good health (₹1,875)
  return 1125; // Discounted price for limited health (₹1,125)
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
    batteries: [
      { id: "BAT-101", model: "EcoSwap Pro 5000", healthPercentage: 92, estimatedRangeKm: 245, chargeCycles: 128 },
      { id: "BAT-102", model: "EcoSwap Pro 5000", healthPercentage: 87, estimatedRangeKm: 230, chargeCycles: 215 },
      { id: "BAT-103", model: "EcoSwap Ultra 7500", healthPercentage: 95, estimatedRangeKm: 355, chargeCycles: 85 },
      { id: "BAT-104", model: "EcoSwap Ultra 7500", healthPercentage: 65, estimatedRangeKm: 243, chargeCycles: 612 },
      { id: "BAT-105", model: "EcoSwap Max 10000", healthPercentage: 89, estimatedRangeKm: 445, chargeCycles: 320 },
    ]
  },
  {
    id: 2,
    name: "GreenPower Hub",
    address: "456 Park Ave, Midtown",
    distance: "1.2 miles",
    availableBatteries: 8,
    coordinates: { lat: 40.7282, lng: -73.9942 },
    batteries: [
      { id: "BAT-201", model: "EcoSwap Pro 5000", healthPercentage: 78, estimatedRangeKm: 195, chargeCycles: 423 },
      { id: "BAT-202", model: "EcoSwap Ultra 7500", healthPercentage: 90, estimatedRangeKm: 338, chargeCycles: 178 },
      { id: "BAT-203", model: "EcoSwap Max 10000", healthPercentage: 35, estimatedRangeKm: 175, chargeCycles: 952 },
    ]
  },
  {
    id: 3,
    name: "ElectroSwap Station",
    address: "789 Broadway, Uptown",
    distance: "2.5 miles",
    availableBatteries: 22,
    coordinates: { lat: 40.7589, lng: -73.9851 },
    batteries: [
      { id: "BAT-301", model: "EcoSwap Pro 5000", healthPercentage: 94, estimatedRangeKm: 250, chargeCycles: 98 },
      { id: "BAT-302", model: "EcoSwap Pro 5000", healthPercentage: 88, estimatedRangeKm: 235, chargeCycles: 205 },
      { id: "BAT-303", model: "EcoSwap Ultra 7500", healthPercentage: 91, estimatedRangeKm: 340, chargeCycles: 165 },
      { id: "BAT-304", model: "EcoSwap Ultra 7500", healthPercentage: 82, estimatedRangeKm: 310, chargeCycles: 310 },
      { id: "BAT-305", model: "EcoSwap Max 10000", healthPercentage: 96, estimatedRangeKm: 480, chargeCycles: 75 },
    ]
  },
  {
    id: 4,
    name: "PowerExchange Center",
    address: "101 River Rd, Westside",
    distance: "3.1 miles",
    availableBatteries: 5,
    coordinates: { lat: 40.7549, lng: -74.0134 },
    batteries: [
      { id: "BAT-401", model: "EcoSwap Pro 5000", healthPercentage: 68, estimatedRangeKm: 180, chargeCycles: 520 },
      { id: "BAT-402", model: "EcoSwap Ultra 7500", healthPercentage: 72, estimatedRangeKm: 270, chargeCycles: 480 },
    ]
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

// Mock data for service centers
export const serviceCenters = [
  {
    id: 1,
    name: "EcoBike Service Hub",
    address: "123 Main St, Downtown",
    distance: "0.7 miles",
    rating: 4.8,
    reviews: 124,
    services: ["General Service", "Battery Repair", "Tire Replacement", "Motor Tuning"],
    availableSlots: [
      { date: "2023-10-15", slots: ["09:00", "11:30", "14:00", "16:30"] },
      { date: "2023-10-16", slots: ["10:00", "13:00", "15:30", "17:00"] },
      { date: "2023-10-17", slots: ["09:30", "12:00", "14:30", "16:00"] },
    ],
    coordinates: { lat: 40.7128, lng: -74.006 },
  },
  {
    id: 2,
    name: "GreenWheel Repairs",
    address: "456 Park Ave, Midtown",
    distance: "1.4 miles",
    rating: 4.6,
    reviews: 89,
    services: ["General Service", "Brake Adjustment", "Display Repair", "Software Update"],
    availableSlots: [
      { date: "2023-10-15", slots: ["10:00", "12:30", "15:00"] },
      { date: "2023-10-16", slots: ["09:00", "11:30", "14:00", "16:30"] },
      { date: "2023-10-17", slots: ["10:30", "13:00", "15:30"] },
    ],
    coordinates: { lat: 40.7282, lng: -73.9942 },
  },
  {
    id: 3,
    name: "ElectroVelo Technicians",
    address: "789 Broadway, Uptown",
    distance: "2.2 miles",
    rating: 4.9,
    reviews: 156,
    services: ["Premium Service", "Battery Replacement", "Motor Repair", "Frame Repair"],
    availableSlots: [
      { date: "2023-10-15", slots: ["09:30", "12:00", "14:30", "17:00"] },
      { date: "2023-10-16", slots: ["10:30", "13:00", "15:30"] },
      { date: "2023-10-17", slots: ["09:00", "11:30", "14:00", "16:30"] },
    ],
    coordinates: { lat: 40.7589, lng: -73.9851 },
  },
  {
    id: 4,
    name: "PowerPedal Service Center",
    address: "101 River Rd, Westside",
    distance: "3.5 miles",
    rating: 4.5,
    reviews: 72,
    services: ["General Service", "Wheel Alignment", "Controller Repair", "Diagnostic Check"],
    availableSlots: [
      { date: "2023-10-15", slots: ["10:00", "13:30", "16:00"] },
      { date: "2023-10-16", slots: ["09:30", "12:00", "14:30", "17:00"] },
      { date: "2023-10-17", slots: ["11:00", "13:30", "16:00"] },
    ],
    coordinates: { lat: 40.7549, lng: -74.0134 },
  },
];

// Service pricing
export const servicePricing = {
  "General Service": 1500, // ₹1,500
  "Premium Service": 2500, // ₹2,500
  "Battery Repair": 3000, // ₹3,000
  "Battery Replacement": 7500, // ₹7,500
  "Tire Replacement": 1200, // ₹1,200
  "Brake Adjustment": 800, // ₹800
  "Motor Tuning": 2000, // ₹2,000
  "Motor Repair": 4500, // ₹4,500
  "Display Repair": 1800, // ₹1,800
  "Software Update": 1000, // ₹1,000
  "Wheel Alignment": 1200, // ₹1,200
  "Controller Repair": 3500, // ₹3,500
  "Diagnostic Check": 750, // ₹750
  "Frame Repair": 3000, // ₹3,000
};

// Get next available dates (for the next 7 days)
export function getNextAvailableDates(): string[] {
  const dates: string[] = [];
  const today = new Date();
  
  for (let i = 0; i < 7; i++) {
    const nextDate = new Date(today);
    nextDate.setDate(today.getDate() + i);
    dates.push(nextDate.toISOString().split('T')[0]);
  }
  
  return dates;
}

