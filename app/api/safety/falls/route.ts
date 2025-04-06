import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    // Use mock data directly instead of trying to access the database
    const fallEvents = [
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

    return NextResponse.json(fallEvents)
  } catch (error) {
    console.error("Error fetching fall events:", error)
    return NextResponse.json({ error: "Failed to fetch fall events", details: String(error) }, { status: 200 })
  }
}

