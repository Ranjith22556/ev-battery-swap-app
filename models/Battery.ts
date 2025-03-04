import mongoose, { Schema, Document } from "mongoose"

export interface IBattery extends Document {
  batteryId: string
  serialNumber: string
  manufacturer: string
  model: string
  capacityWh: number
  currentCapacityWh: number
  healthPercentage: number
  chargeCycles: number
  manufactureDate: Date
  lastServiceDate: Date
  lastSwapDate: Date
  lastChargingStation: string
  temperatureHistory: Array<{
    timestamp: Date
    temperature: number
  }>
  voltageHistory: Array<{
    timestamp: Date
    voltage: number
  }>
  currentHistory: Array<{
    timestamp: Date
    current: number
  }>
  swapHistory: Array<{
    timestamp: Date
    userId: string
    stationId: string
    batteryHealthAtSwap: number
    chargePercentageAtSwap: number
  }>
  status: "available" | "in-use" | "charging" | "maintenance" | "retired"
  estimatedRangeKm: number
  efficiencyScore: number
  predictedEndOfLife: Date
  qrCode: string
}

const BatterySchema: Schema = new Schema(
  {
    batteryId: {
      type: String,
      required: true,
      unique: true,
    },
    serialNumber: {
      type: String,
      required: true,
      unique: true,
    },
    manufacturer: {
      type: String,
      required: true,
    },
    model: {
      type: String,
      required: true,
    },
    capacityWh: {
      type: Number,
      required: true,
    },
    currentCapacityWh: {
      type: Number,
      required: true,
    },
    healthPercentage: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
    },
    chargeCycles: {
      type: Number,
      required: true,
      default: 0,
    },
    manufactureDate: {
      type: Date,
      required: true,
    },
    lastServiceDate: {
      type: Date,
    },
    lastSwapDate: {
      type: Date,
    },
    lastChargingStation: {
      type: String,
    },
    temperatureHistory: [
      {
        timestamp: {
          type: Date,
          default: Date.now,
        },
        temperature: Number,
      },
    ],
    voltageHistory: [
      {
        timestamp: {
          type: Date,
          default: Date.now,
        },
        voltage: Number,
      },
    ],
    currentHistory: [
      {
        timestamp: {
          type: Date,
          default: Date.now,
        },
        current: Number,
      },
    ],
    swapHistory: [
      {
        timestamp: {
          type: Date,
          default: Date.now,
        },
        userId: {
          type: Schema.Types.ObjectId,
          ref: "User",
        },
        stationId: String,
        batteryHealthAtSwap: Number,
        chargePercentageAtSwap: Number,
      },
    ],
    status: {
      type: String,
      enum: ["available", "in-use", "charging", "maintenance", "retired"],
      default: "available",
    },
    estimatedRangeKm: {
      type: Number,
    },
    efficiencyScore: {
      type: Number,
      min: 0,
      max: 100,
    },
    predictedEndOfLife: {
      type: Date,
    },
    qrCode: {
      type: String,
    },
  },
  { timestamps: true }
)

// Calculate health percentage based on current capacity vs original capacity
BatterySchema.pre("save", function (next) {
  if (this.capacityWh && this.currentCapacityWh) {
    this.healthPercentage = Math.round((this.currentCapacityWh / this.capacityWh) * 100)
  }
  next()
})

// Calculate estimated range based on health and capacity
BatterySchema.pre("save", function (next) {
  // Example formula: 5km per Wh * current capacity * health factor
  const baseRangePerWh = 5
  const healthFactor = this.healthPercentage / 100
  this.estimatedRangeKm = Math.round(this.currentCapacityWh * baseRangePerWh * healthFactor)
  next()
})

export default mongoose.models.Battery || mongoose.model<IBattery>("Battery", BatterySchema) 