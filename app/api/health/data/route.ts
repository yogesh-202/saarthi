import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    // Use mock data directly instead of trying to access the database
    const healthData = [
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
        deviceId: "D1001",
        timestamp: "1/16/2025 12:22",
        heartRate: 119,
        heartRateAlert: true,
        bloodPressure: "105/77 mmHg",
        bloodPressureAlert: false,
        glucoseLevels: 146,
        glucoseLevelsAlert: true,
        oxygenSaturation: 93,
        oxygenSaturationAlert: false,
        alertTriggered: true,
        caregiverNotified: true,
      },
      {
        deviceId: "D1002",
        timestamp: "1/10/2025 9:26",
        heartRate: 97,
        heartRateAlert: false,
        bloodPressure: "120/87 mmHg",
        bloodPressureAlert: true,
        glucoseLevels: 133,
        glucoseLevelsAlert: false,
        oxygenSaturation: 97,
        oxygenSaturationAlert: false,
        alertTriggered: true,
        caregiverNotified: true,
      },
      {
        deviceId: "D1003",
        timestamp: "1/10/2025 9:53",
        heartRate: 113,
        heartRateAlert: true,
        bloodPressure: "138/65 mmHg",
        bloodPressureAlert: true,
        glucoseLevels: 82,
        glucoseLevelsAlert: false,
        oxygenSaturation: 98,
        oxygenSaturationAlert: false,
        alertTriggered: true,
        caregiverNotified: true,
      },
      {
        deviceId: "D1004",
        timestamp: "1/3/2025 15:50",
        heartRate: 88,
        heartRateAlert: false,
        bloodPressure: "108/69 mmHg",
        bloodPressureAlert: false,
        glucoseLevels: 146,
        glucoseLevelsAlert: true,
        oxygenSaturation: 97,
        oxygenSaturationAlert: false,
        alertTriggered: true,
        caregiverNotified: true,
      },
      {
        deviceId: "D1005",
        timestamp: "1/5/2025 8:29",
        heartRate: 119,
        heartRateAlert: true,
        bloodPressure: "114/65 mmHg",
        bloodPressureAlert: false,
        glucoseLevels: 133,
        glucoseLevelsAlert: false,
        oxygenSaturation: 91,
        oxygenSaturationAlert: true,
        alertTriggered: true,
        caregiverNotified: true,
      },
    ]

    return NextResponse.json(healthData)
  } catch (error) {
    console.error("Error fetching health data:", error)
    // Return a proper JSON response even in case of error
    return NextResponse.json({ error: "Failed to fetch health data", details: String(error) }, { status: 200 })
  }
}

