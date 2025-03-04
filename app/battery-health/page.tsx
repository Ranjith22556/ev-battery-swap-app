"use client"

import { useAuth } from "@/components/auth-provider"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { 
  Battery, 
  BatteryCharging, 
  BatteryFull, 
  BatteryLow, 
  BatteryMedium, 
  BatteryWarning,
  Calendar, 
  Clock, 
  Download,
  History,
  Info,
  LineChart,
  Zap,
  AlertCircle,
  AlertTriangle,
  Wrench
} from "lucide-react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { 
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  PointElement, 
  LineElement, 
  Title, 
  Tooltip, 
  Legend,
  Filler
} from 'chart.js'
import { Line } from 'react-chartjs-2'

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
)

// Define types for our battery data
interface BatterySwapHistory {
  date: string;
  station: string;
  healthAtSwap: number;
  chargeAtSwap: number;
}

interface ChartData {
  labels: string[];
  values: number[];
}

interface BatteryDetails {
  id: string;
  serialNumber: string;
  manufacturer: string;
  model: string;
  capacityWh: number;
  currentCapacityWh: number;
  healthPercentage: number;
  chargeCycles: number;
  maxChargeCycles: number;
  manufactureDate: string;
  lastServiceDate: string;
  lastSwapDate: string;
  lastChargingStation: string;
  status: string;
  estimatedRangeKm: number;
  efficiencyScore: number;
  predictedEndOfLife: string;
  temperatureData: ChartData;
  voltageData: ChartData;
  healthData: ChartData;
  swapHistory: BatterySwapHistory[];
}

interface BatteryItem {
  id: string;
  serialNumber: string;
  model: string;
}

export default function BatteryHealthPage() {
  const { user, isLoading } = useAuth()
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedBattery, setSelectedBattery] = useState<string | null>(null)
  const [healthProgressValue, setHealthProgressValue] = useState(0)
  const [cycleProgressValue, setCycleProgressValue] = useState(0)

  // Redirect if not logged in
  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/")
    }
  }, [user, isLoading, router])

  // Animate progress bars on load
  useEffect(() => {
    if (selectedBattery) {
      const timer1 = setTimeout(() => setHealthProgressValue(78), 500)
      const timer2 = setTimeout(() => setCycleProgressValue(42), 700)
      return () => {
        clearTimeout(timer1)
        clearTimeout(timer2)
      }
    }
  }, [selectedBattery])

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    )
  }

  // Mock data for demonstration
  const batteries: BatteryItem[] = [
    { id: "BAT-001", serialNumber: "SN12345678", model: "EcoSwap Pro 5000" },
    { id: "BAT-002", serialNumber: "SN23456789", model: "EcoSwap Pro 5000" },
    { id: "BAT-003", serialNumber: "SN34567890", model: "EcoSwap Ultra 7500" },
    { id: "BAT-004", serialNumber: "SN45678901", model: "EcoSwap Ultra 7500" },
    { id: "BAT-005", serialNumber: "SN56789012", model: "EcoSwap Max 10000" },
  ]

  // Battery details for each battery
  const batteryDetailsMap: Record<string, BatteryDetails> = {
    "BAT-001": {
      id: "BAT-001",
      serialNumber: "SN12345678",
      manufacturer: "EcoSwap Technologies",
      model: "EcoSwap Pro 5000",
      capacityWh: 5000,
      currentCapacityWh: 3900,
      healthPercentage: 78,
      chargeCycles: 423,
      maxChargeCycles: 1000,
      manufactureDate: "2022-06-15",
      lastServiceDate: "2023-10-22",
      lastSwapDate: "2023-12-05",
      lastChargingStation: "Downtown Hub Station",
      status: "available",
      estimatedRangeKm: 195,
      efficiencyScore: 82,
      predictedEndOfLife: "2025-08-10",
      temperatureData: {
        labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
        values: [25, 26, 28, 30, 32, 35, 36, 35, 32, 30, 28, 26]
      },
      voltageData: {
        labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
        values: [48.2, 48.0, 47.8, 47.5, 47.2, 47.0, 46.8, 46.5, 46.2, 46.0, 45.8, 45.5]
      },
      healthData: {
        labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
        values: [95, 93, 91, 89, 87, 85, 83, 82, 81, 80, 79, 78]
      },
      swapHistory: [
        { date: "2023-12-05", station: "Downtown Hub Station", healthAtSwap: 78, chargeAtSwap: 15 },
        { date: "2023-11-20", station: "Westside Charging Point", healthAtSwap: 80, chargeAtSwap: 12 },
        { date: "2023-11-05", station: "Central Station", healthAtSwap: 81, chargeAtSwap: 18 },
        { date: "2023-10-22", station: "North District Hub", healthAtSwap: 82, chargeAtSwap: 10 },
        { date: "2023-10-08", station: "Downtown Hub Station", healthAtSwap: 83, chargeAtSwap: 14 },
      ]
    },
    "BAT-002": {
      id: "BAT-002",
      serialNumber: "SN23456789",
      manufacturer: "EcoSwap Technologies",
      model: "EcoSwap Pro 5000",
      capacityWh: 5000,
      currentCapacityWh: 4350,
      healthPercentage: 87,
      chargeCycles: 215,
      maxChargeCycles: 1000,
      manufactureDate: "2023-01-20",
      lastServiceDate: "2023-11-15",
      lastSwapDate: "2023-12-10",
      lastChargingStation: "Eastside Swap Station",
      status: "available",
      estimatedRangeKm: 235,
      efficiencyScore: 91,
      predictedEndOfLife: "2026-03-18",
      temperatureData: {
        labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
        values: [24, 25, 26, 28, 30, 32, 33, 32, 30, 28, 26, 25]
      },
      voltageData: {
        labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
        values: [49.5, 49.3, 49.1, 48.9, 48.7, 48.5, 48.3, 48.1, 47.9, 47.7, 47.5, 47.3]
      },
      healthData: {
        labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
        values: [98, 97, 96, 95, 94, 93, 92, 91, 90, 89, 88, 87]
      },
      swapHistory: [
        { date: "2023-12-10", station: "Eastside Swap Station", healthAtSwap: 87, chargeAtSwap: 18 },
        { date: "2023-11-25", station: "Central Station", healthAtSwap: 88, chargeAtSwap: 15 },
        { date: "2023-11-10", station: "Downtown Hub Station", healthAtSwap: 90, chargeAtSwap: 20 },
        { date: "2023-10-28", station: "Westside Charging Point", healthAtSwap: 91, chargeAtSwap: 17 },
        { date: "2023-10-15", station: "North District Hub", healthAtSwap: 92, chargeAtSwap: 14 },
      ]
    },
    "BAT-003": {
      id: "BAT-003",
      serialNumber: "SN34567890",
      manufacturer: "EcoSwap Technologies",
      model: "EcoSwap Ultra 7500",
      capacityWh: 7500,
      currentCapacityWh: 4875,
      healthPercentage: 65,
      chargeCycles: 612,
      maxChargeCycles: 1200,
      manufactureDate: "2021-08-05",
      lastServiceDate: "2023-09-10",
      lastSwapDate: "2023-12-02",
      lastChargingStation: "South Terminal Station",
      status: "maintenance",
      estimatedRangeKm: 243,
      efficiencyScore: 68,
      predictedEndOfLife: "2024-11-30",
      temperatureData: {
        labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
        values: [27, 28, 30, 32, 35, 38, 40, 39, 36, 33, 30, 28]
      },
      voltageData: {
        labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
        values: [46.8, 46.5, 46.2, 45.9, 45.6, 45.3, 45.0, 44.7, 44.4, 44.1, 43.8, 43.5]
      },
      healthData: {
        labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
        values: [75, 73, 72, 70, 69, 68, 67, 66, 66, 65, 65, 65]
      },
      swapHistory: [
        { date: "2023-12-02", station: "South Terminal Station", healthAtSwap: 65, chargeAtSwap: 10 },
        { date: "2023-11-18", station: "Downtown Hub Station", healthAtSwap: 65, chargeAtSwap: 8 },
        { date: "2023-11-05", station: "Eastside Swap Station", healthAtSwap: 66, chargeAtSwap: 12 },
        { date: "2023-10-22", station: "Central Station", healthAtSwap: 66, chargeAtSwap: 9 },
        { date: "2023-10-10", station: "Westside Charging Point", healthAtSwap: 67, chargeAtSwap: 11 },
      ]
    },
    "BAT-004": {
      id: "BAT-004",
      serialNumber: "SN45678901",
      manufacturer: "EcoSwap Technologies",
      model: "EcoSwap Ultra 7500",
      capacityWh: 7500,
      currentCapacityWh: 6750,
      healthPercentage: 90,
      chargeCycles: 178,
      maxChargeCycles: 1200,
      manufactureDate: "2023-03-12",
      lastServiceDate: "2023-11-28",
      lastSwapDate: "2023-12-15",
      lastChargingStation: "Airport Express Station",
      status: "available",
      estimatedRangeKm: 338,
      efficiencyScore: 94,
      predictedEndOfLife: "2026-09-25",
      temperatureData: {
        labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
        values: [23, 24, 25, 26, 28, 30, 31, 30, 28, 26, 25, 24]
      },
      voltageData: {
        labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
        values: [50.0, 49.8, 49.6, 49.4, 49.2, 49.0, 48.8, 48.6, 48.4, 48.2, 48.0, 47.8]
      },
      healthData: {
        labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
        values: [99, 98, 97, 96, 95, 94, 93, 92, 91, 90, 90, 90]
      },
      swapHistory: [
        { date: "2023-12-15", station: "Airport Express Station", healthAtSwap: 90, chargeAtSwap: 22 },
        { date: "2023-11-30", station: "Downtown Hub Station", healthAtSwap: 90, chargeAtSwap: 25 },
        { date: "2023-11-15", station: "North District Hub", healthAtSwap: 91, chargeAtSwap: 20 },
        { date: "2023-10-31", station: "Central Station", healthAtSwap: 92, chargeAtSwap: 18 },
        { date: "2023-10-15", station: "South Terminal Station", healthAtSwap: 93, chargeAtSwap: 24 },
      ]
    },
    "BAT-005": {
      id: "BAT-005",
      serialNumber: "SN56789012",
      manufacturer: "EcoSwap Technologies",
      model: "EcoSwap Max 10000",
      capacityWh: 10000,
      currentCapacityWh: 3500,
      healthPercentage: 35,
      chargeCycles: 952,
      maxChargeCycles: 1500,
      manufactureDate: "2020-11-10",
      lastServiceDate: "2023-08-05",
      lastSwapDate: "2023-11-28",
      lastChargingStation: "Central Station",
      status: "retired",
      estimatedRangeKm: 175,
      efficiencyScore: 42,
      predictedEndOfLife: "2024-02-15",
      temperatureData: {
        labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
        values: [30, 32, 34, 36, 38, 42, 45, 43, 40, 38, 35, 32]
      },
      voltageData: {
        labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
        values: [44.5, 44.0, 43.5, 43.0, 42.5, 42.0, 41.5, 41.0, 40.5, 40.0, 39.5, 39.0]
      },
      healthData: {
        labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
        values: [45, 43, 42, 41, 40, 39, 38, 37, 36, 36, 35, 35]
      },
      swapHistory: [
        { date: "2023-11-28", station: "Central Station", healthAtSwap: 35, chargeAtSwap: 5 },
        { date: "2023-11-15", station: "Downtown Hub Station", healthAtSwap: 36, chargeAtSwap: 8 },
        { date: "2023-11-02", station: "Westside Charging Point", healthAtSwap: 36, chargeAtSwap: 6 },
        { date: "2023-10-20", station: "South Terminal Station", healthAtSwap: 37, chargeAtSwap: 7 },
        { date: "2023-10-08", station: "Eastside Swap Station", healthAtSwap: 38, chargeAtSwap: 9 },
      ]
    }
  }

  const filteredBatteries = batteries.filter(battery => 
    battery.id.toLowerCase().includes(searchQuery.toLowerCase()) || 
    battery.serialNumber.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleBatterySelect = (batteryId: string) => {
    setSelectedBattery(batteryId)
    setHealthProgressValue(0)
    setCycleProgressValue(0)
  }

  // Get the details for the selected battery
  const batteryDetails = selectedBattery ? batteryDetailsMap[selectedBattery] : batteryDetailsMap["BAT-001"]

  // Chart options and data
  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
    },
    scales: {
      y: {
        beginAtZero: false,
      },
    },
  }

  const temperatureChartData = {
    labels: batteryDetails.temperatureData.labels,
    datasets: [
      {
        label: 'Average Temperature (°C)',
        data: batteryDetails.temperatureData.values,
        borderColor: 'rgb(255, 99, 132)',
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
        tension: 0.3,
      },
    ],
  }

  const voltageChartData = {
    labels: batteryDetails.voltageData.labels,
    datasets: [
      {
        label: 'Average Voltage (V)',
        data: batteryDetails.voltageData.values,
        borderColor: 'rgb(53, 162, 235)',
        backgroundColor: 'rgba(53, 162, 235, 0.5)',
        tension: 0.3,
      },
    ],
  }

  const healthChartData = {
    labels: batteryDetails.healthData.labels,
    datasets: [
      {
        label: 'Battery Health (%)',
        data: batteryDetails.healthData.values,
        borderColor: 'rgb(75, 192, 192)',
        backgroundColor: 'rgba(75, 192, 192, 0.5)',
        fill: true,
        tension: 0.3,
      },
    ],
  }

  const getBatteryIcon = (health: number) => {
    if (health > 80) return <BatteryFull className="h-6 w-6 text-green-500" />
    if (health > 50) return <BatteryMedium className="h-6 w-6 text-yellow-500" />
    if (health > 20) return <BatteryLow className="h-6 w-6 text-orange-500" />
    return <BatteryWarning className="h-6 w-6 text-red-500" />
  }

  const getHealthColor = (health: number) => {
    if (health > 80) return "text-green-500"
    if (health > 50) return "text-yellow-500"
    if (health > 20) return "text-orange-500"
    return "text-red-500"
  }

  const getCycleColor = (cycles: number, maxCycles: number) => {
    const percentage = (cycles / maxCycles) * 100
    if (percentage < 40) return "text-green-500"
    if (percentage < 70) return "text-yellow-500"
    if (percentage < 90) return "text-orange-500"
    return "text-red-500"
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <main className="flex-1 py-12 pt-24">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col space-y-8">
            <div className="flex flex-col space-y-2">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl">Battery Health Dashboard</h1>
              <p className="text-muted-foreground">
                Monitor battery health, track charge cycles, and view performance metrics
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {/* Battery Selection Sidebar */}
              <div className="gradient-card rounded-xl p-6 md:col-span-1">
                <div className="mb-4">
                  <h3 className="text-xl font-bold">Your Batteries</h3>
                  <p className="text-muted-foreground text-sm">Select a battery to view details</p>
                </div>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="search-battery">Search</Label>
                    <Input 
                      id="search-battery" 
                      placeholder="Battery ID or Serial Number" 
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  
                  <div className="space-y-2 mt-4">
                    {filteredBatteries.length > 0 ? (
                      filteredBatteries.map((battery) => (
                        <div 
                          key={battery.id}
                          className={`p-3 rounded-lg cursor-pointer transition-colors ${
                            selectedBattery === battery.id 
                              ? "bg-primary/10 border border-primary/30" 
                              : "hover:bg-muted"
                          }`}
                          onClick={() => handleBatterySelect(battery.id)}
                        >
                          <div className="flex items-center">
                            <Battery className="h-5 w-5 mr-2 text-primary" />
                            <div>
                              <p className="font-medium">{battery.id}</p>
                              <p className="text-xs text-muted-foreground">{battery.serialNumber}</p>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-muted-foreground py-2">No batteries found</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Battery Details */}
              <div className="md:col-span-3 space-y-6">
                {selectedBattery ? (
                  <>
                    {/* Main Content Area */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {/* Battery Health Card */}
                      <div className="gradient-card rounded-xl p-6 col-span-1 md:col-span-2">
                        <div className="mb-4">
                          <h3 className="text-xl font-bold">Battery Health</h3>
                          <p className="text-muted-foreground text-sm">Current health metrics and status</p>
                        </div>
                        <div className="space-y-4">
                          {/* Health Status with Warning for Low Health */}
                          <div>
                            <div className="flex items-center justify-between mb-1">
                              <div className="text-sm font-medium">Health Status</div>
                              <div className={`text-sm font-medium ${batteryDetails.healthPercentage < 70 ? 'text-red-600 dark:text-red-400' : ''}`}>
                                {batteryDetails.healthPercentage}%
                              </div>
                            </div>
                            <Progress value={healthProgressValue} className={`h-2 ${batteryDetails.healthPercentage < 70 ? 'bg-red-200 dark:bg-red-800' : ''}`} />
                            
                            {/* Critical Health Warning */}
                            {batteryDetails.healthPercentage < 70 && (
                              <div className="mt-3 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md">
                                <div className="flex items-start">
                                  <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400 mr-2 flex-shrink-0 mt-0.5" />
                                  <div>
                                    <h4 className="text-sm font-medium text-red-800 dark:text-red-300">Critical Battery Health Warning</h4>
                                    <p className="text-xs mt-1 text-red-700 dark:text-red-300">
                                      This battery health is critically low. Not recommended for swapping if you are traveling long distances.
                                    </p>
                                    <div className="mt-2 flex items-center text-xs text-red-700 dark:text-red-300">
                                      <AlertCircle className="h-4 w-4 mr-1" />
                                      <span>Estimated range: <strong>{batteryDetails.estimatedRangeKm} km</strong> ({Math.round(batteryDetails.estimatedRangeKm * 0.621)} miles)</span>
                                    </div>
                                    <div className="mt-2 flex items-center text-xs text-red-700 dark:text-red-300">
                                      <Wrench className="h-4 w-4 mr-1" />
                                      <span>Service recommended before next use</span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>

                          {/* Charge Cycles */}
                          <div>
                            <div className="flex items-center justify-between mb-1">
                              <div className="text-sm font-medium">Charge Cycles</div>
                              <div className="text-sm text-muted-foreground">{batteryDetails.chargeCycles} / {batteryDetails.maxChargeCycles}</div>
                            </div>
                            <Progress value={cycleProgressValue} className="h-2" />
                          </div>

                          {/* Battery Details */}
                          <div className="grid grid-cols-2 gap-4 pt-2">
                            <div>
                              <div className="text-xs text-muted-foreground">Efficiency Score</div>
                              <div className={`text-sm font-medium ${batteryDetails.efficiencyScore < 70 ? 'text-red-600 dark:text-red-400' : ''}`}>
                                {batteryDetails.efficiencyScore}%
                              </div>
                            </div>
                            <div>
                              <div className="text-xs text-muted-foreground">Current Capacity</div>
                              <div className="text-sm font-medium">{batteryDetails.currentCapacityWh} Wh</div>
                            </div>
                            <div>
                              <div className="text-xs text-muted-foreground">Estimated Range</div>
                              <div className={`text-sm font-medium ${batteryDetails.healthPercentage < 70 ? 'text-red-600 dark:text-red-400' : ''}`}>
                                {batteryDetails.estimatedRangeKm} km
                              </div>
                            </div>
                            <div>
                              <div className="text-xs text-muted-foreground">Status</div>
                              <div className={`text-sm font-medium ${
                                batteryDetails.status === 'maintenance' ? 'text-amber-600 dark:text-amber-400' : 
                                batteryDetails.status === 'retired' ? 'text-red-600 dark:text-red-400' : 
                                'text-green-600 dark:text-green-400'
                              }`}>
                                {batteryDetails.status.charAt(0).toUpperCase() + batteryDetails.status.slice(1)}
                                {batteryDetails.status === 'maintenance' && <Wrench className="h-3 w-3 inline ml-1" />}
                                {batteryDetails.status === 'retired' && <AlertTriangle className="h-3 w-3 inline ml-1" />}
                              </div>
                            </div>
                          </div>

                          {/* Usage Recommendations */}
                          <div className="mt-4">
                            <h4 className="text-sm font-medium mb-2">Usage Recommendations</h4>
                            <div className={`text-xs p-2 rounded ${
                              batteryDetails.healthPercentage < 50 ? 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300' :
                              batteryDetails.healthPercentage < 70 ? 'bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-300' :
                              'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300'
                            }`}>
                              {batteryDetails.healthPercentage < 50 ? (
                                <>
                                  <strong>Not recommended for use.</strong> This battery should be retired or recycled. Maximum safe travel distance: {batteryDetails.estimatedRangeKm} km.
                                </>
                              ) : batteryDetails.healthPercentage < 70 ? (
                                <>
                                  <strong>Limited use recommended.</strong> Best for short trips under {Math.round(batteryDetails.estimatedRangeKm * 0.7)} km. Not suitable for highway driving or long distances.
                                </>
                              ) : (
                                <>
                                  <strong>Suitable for all uses.</strong> This battery is in good condition and can be used for trips up to {batteryDetails.estimatedRangeKm} km on a full charge.
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Battery Details Card */}
                      <div className="gradient-card rounded-xl p-6">
                        <div className="mb-4">
                          <h3 className="text-xl font-bold">Battery Details</h3>
                          <p className="text-muted-foreground text-sm">Technical specifications</p>
                        </div>
                        <div className="space-y-2">
                          <div className="grid grid-cols-2 gap-1">
                            <div className="text-xs text-muted-foreground">Serial Number</div>
                            <div className="text-xs font-medium">{batteryDetails.serialNumber}</div>
                          </div>
                          <div className="grid grid-cols-2 gap-1">
                            <div className="text-xs text-muted-foreground">Model</div>
                            <div className="text-xs font-medium">{batteryDetails.model}</div>
                          </div>
                          <div className="grid grid-cols-2 gap-1">
                            <div className="text-xs text-muted-foreground">Manufacturer</div>
                            <div className="text-xs font-medium">{batteryDetails.manufacturer}</div>
                          </div>
                          <div className="grid grid-cols-2 gap-1">
                            <div className="text-xs text-muted-foreground">Manufacture Date</div>
                            <div className="text-xs font-medium">{batteryDetails.manufactureDate}</div>
                          </div>
                          <div className="grid grid-cols-2 gap-1">
                            <div className="text-xs text-muted-foreground">Last Service</div>
                            <div className="text-xs font-medium">{batteryDetails.lastServiceDate}</div>
                          </div>
                          <div className="grid grid-cols-2 gap-1">
                            <div className="text-xs text-muted-foreground">Last Swap</div>
                            <div className="text-xs font-medium">{batteryDetails.lastSwapDate}</div>
                          </div>
                          <div className="grid grid-cols-2 gap-1">
                            <div className="text-xs text-muted-foreground">Last Station</div>
                            <div className="text-xs font-medium">{batteryDetails.lastChargingStation}</div>
                          </div>
                          <div className="grid grid-cols-2 gap-1">
                            <div className="text-xs text-muted-foreground">Predicted EOL</div>
                            <div className={`text-xs font-medium ${
                              new Date(batteryDetails.predictedEndOfLife) <= new Date(new Date().setMonth(new Date().getMonth() + 3)) 
                                ? 'text-red-600 dark:text-red-400' 
                                : ''
                            }`}>
                              {batteryDetails.predictedEndOfLife}
                              {new Date(batteryDetails.predictedEndOfLife) <= new Date(new Date().setMonth(new Date().getMonth() + 3)) && 
                                <AlertTriangle className="h-3 w-3 inline ml-1" />
                              }
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Detailed Tabs */}
                    <Tabs defaultValue="performance" className="space-y-4">
                      <TabsList className="grid w-full grid-cols-3">
                        <TabsTrigger value="performance">Performance</TabsTrigger>
                        <TabsTrigger value="history">Swap History</TabsTrigger>
                        <TabsTrigger value="prediction">Predictions</TabsTrigger>
                      </TabsList>
                      
                      {/* Performance Tab */}
                      <TabsContent value="performance" className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="gradient-card rounded-xl p-6">
                            <div className="mb-4">
                              <h3 className="text-xl font-bold">Temperature History</h3>
                              <p className="text-muted-foreground text-sm">Average monthly temperature readings</p>
                            </div>
                            <div className="h-[300px]">
                              <Line options={chartOptions} data={temperatureChartData} />
                            </div>
                          </div>
                          
                          <div className="gradient-card rounded-xl p-6">
                            <div className="mb-4">
                              <h3 className="text-xl font-bold">Voltage History</h3>
                              <p className="text-muted-foreground text-sm">Average monthly voltage readings</p>
                            </div>
                            <div className="h-[300px]">
                              <Line options={chartOptions} data={voltageChartData} />
                            </div>
                          </div>
                          
                          <div className="gradient-card rounded-xl p-6 md:col-span-2">
                            <div className="mb-4">
                              <h3 className="text-xl font-bold">Health Degradation</h3>
                              <p className="text-muted-foreground text-sm">Battery health percentage over time</p>
                            </div>
                            <div className="h-[300px]">
                              <Line options={chartOptions} data={healthChartData} />
                            </div>
                          </div>
                        </div>
                      </TabsContent>
                      
                      {/* History Tab */}
                      <TabsContent value="history" className="space-y-4">
                        <div className="gradient-card rounded-xl p-6">
                          <div className="mb-4">
                            <div className="flex items-center">
                              <History className="h-5 w-5 mr-2 text-primary" />
                              <h3 className="text-xl font-bold">Recent Swap History</h3>
                            </div>
                            <p className="text-muted-foreground text-sm">Last 5 battery swap events</p>
                          </div>
                          <div className="space-y-4">
                            {batteryDetails.swapHistory.map((swap: BatterySwapHistory, index: number) => (
                              <div 
                                key={index} 
                                className="p-4 rounded-lg border border-border/50 flex flex-col md:flex-row md:items-center md:justify-between"
                              >
                                <div className="flex items-start md:items-center">
                                  <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center mr-4">
                                    <BatteryCharging className="h-5 w-5 text-primary" />
                                  </div>
                                  <div>
                                    <h3 className="font-medium">{swap.station}</h3>
                                    <div className="flex items-center text-sm text-muted-foreground">
                                      <Calendar className="h-3 w-3 mr-1" />
                                      <span>{swap.date}</span>
                                    </div>
                                  </div>
                                </div>
                                <div className="flex items-center mt-2 md:mt-0 space-x-4">
                                  <div className="text-center">
                                    <p className="text-xs text-muted-foreground">Health</p>
                                    <p className={`font-medium ${getHealthColor(swap.healthAtSwap)}`}>
                                      {swap.healthAtSwap}%
                                    </p>
                                  </div>
                                  <div className="text-center">
                                    <p className="text-xs text-muted-foreground">Charge</p>
                                    <p className="font-medium">{swap.chargeAtSwap}%</p>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                          <div className="mt-6">
                            <Button variant="outline" className="w-full">
                              <Download className="h-4 w-4 mr-2" />
                              Export Full History
                            </Button>
                          </div>
                        </div>
                      </TabsContent>
                      
                      {/* Prediction Tab */}
                      <TabsContent value="prediction" className="space-y-4">
                        <div className="gradient-card rounded-xl p-6">
                          <div className="mb-4">
                            <div className="flex items-center">
                              <LineChart className="h-5 w-5 mr-2 text-primary" />
                              <h3 className="text-xl font-bold">Battery Lifecycle Predictions</h3>
                            </div>
                            <p className="text-muted-foreground text-sm">AI-powered predictions based on usage patterns</p>
                          </div>
                          <div className="space-y-6">
                            <div className="p-4 rounded-lg border border-border/50">
                              <div className="flex items-start">
                                <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center mr-4">
                                  <AlertTriangle className="h-5 w-5 text-yellow-500" />
                                </div>
                                <div>
                                  <h3 className="font-medium">Predicted End of Life</h3>
                                  <p className="text-sm text-muted-foreground">
                                    Based on your usage patterns, this battery is expected to reach end of life (below 60% health) by:
                                  </p>
                                  <p className="text-lg font-bold mt-2">{batteryDetails.predictedEndOfLife}</p>
                                </div>
                              </div>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                              <div className="p-4 rounded-lg border border-border/50">
                                <h3 className="font-medium flex items-center">
                                  <Zap className="h-4 w-4 mr-2 text-primary" />
                                  Optimal Usage
                                </h3>
                                <p className="text-sm text-muted-foreground mt-1">
                                  Avoid discharging below 20% and charging above 80% for maximum lifespan
                                </p>
                              </div>
                              
                              <div className="p-4 rounded-lg border border-border/50">
                                <h3 className="font-medium flex items-center">
                                  <Zap className="h-4 w-4 mr-2 text-primary" />
                                  Temperature Control
                                </h3>
                                <p className="text-sm text-muted-foreground mt-1">
                                  Keep battery between 15-30°C for optimal performance and longevity
                                </p>
                              </div>
                              
                              <div className="p-4 rounded-lg border border-border/50">
                                <h3 className="font-medium flex items-center">
                                  <Zap className="h-4 w-4 mr-2 text-primary" />
                                  Service Recommendation
                                </h3>
                                <p className="text-sm text-muted-foreground mt-1">
                                  Schedule next service by {new Date(batteryDetails.lastServiceDate).setMonth(new Date(batteryDetails.lastServiceDate).getMonth() + 6)}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </TabsContent>
                    </Tabs>
                  </>
                ) : (
                  <div className="gradient-card rounded-xl p-12 flex items-center justify-center">
                    <div className="text-center">
                      <Battery className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-medium">No Battery Selected</h3>
                      <p className="text-muted-foreground mt-2">
                        Select a battery from the list to view detailed health information
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
} 