import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    // Use mock data directly instead of trying to access the database
    const safetyData = [
      {
        deviceId: "D1000",
        timestamp: "1/7/2025 16:04",
        movementActivity: "No Movement",
        fallDetected: false,
        impactForceLevel: "-",
        postFallInactivityDuration: 0,
        location: "Kitchen",
        alertTriggered: false,
        caregiverNotified: false,
      },
      {
        deviceId: "D1001",
        timestamp: "1/20/2025 15:45",
        movementActivity: "Lying",
        fallDetected: false,
        impactForceLevel: "-",
        postFallInactivityDuration: 0,
        location: "Living Room",
        alertTriggered: false,
        caregiverNotified: false,
      },
      {
        deviceId: "D1002",
        timestamp: "1/2/2025 2:42",
        movementActivity: "No Movement",
        fallDetected: false,
        impactForceLevel: "-",
        postFallInactivityDuration: 0,
        location: "Bedroom",
        alertTriggered: false,
        caregiverNotified: false,
      },
      {
        deviceId: "D1022",
        timestamp: "1/19/2025 19:46",
        movementActivity: "No Movement",
        fallDetected: true,
        impactForceLevel: "Medium",
        postFallInactivityDuration: 463,
        location: "Bathroom",
        alertTriggered: true,
        caregiverNotified: true,
      },
    ]

    return NextResponse.json(safetyData)
  } catch (error) {
    console.error("Error fetching safety data:", error)
    return NextResponse.json({ error: "Failed to fetch safety data", details: String(error) }, { status: 200 })
  }
}

