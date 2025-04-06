import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    // Use mock data directly instead of trying to access the database
    const healthAlerts = [
      {
        deviceId: "D1000",
        timestamp: "1/22/2025 20:42",
        heartRate: 116,
        heartRateAlert: true,
        bloodPressure: "136/79 mmHg",
        bloodPressureAlert: true,
        glucoseLevels: 141,
        glucoseLevelsAlert: true,
        oxygenSaturation: 98,
        oxygenSaturationAlert: false,
        alertTriggered: true,
        caregiverNotified: true,
      },
      {
        deviceId: "D1006",
        timestamp: "1/30/2025 3:01",
        heartRate: 109,
        heartRateAlert: true,
        bloodPressure: "137/61 mmHg",
        bloodPressureAlert: true,
        glucoseLevels: 143,
        glucoseLevelsAlert: true,
        oxygenSaturation: 98,
        oxygenSaturationAlert: false,
        alertTriggered: true,
        caregiverNotified: true,
      },
      {
        deviceId: "D1016",
        timestamp: "1/24/2025 20:01",
        heartRate: 74,
        heartRateAlert: false,
        bloodPressure: "103/67 mmHg",
        bloodPressureAlert: false,
        glucoseLevels: 147,
        glucoseLevelsAlert: true,
        oxygenSaturation: 90,
        oxygenSaturationAlert: true,
        alertTriggered: true,
        caregiverNotified: true,
      },
    ]

    return NextResponse.json(healthAlerts)
  } catch (error) {
    console.error("Error fetching health alerts:", error)
    // Return a proper JSON response even in case of error
    return NextResponse.json({ error: "Failed to fetch health alerts", details: String(error) }, { status: 200 })
  }
}

