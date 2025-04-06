import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    // Use mock data directly instead of trying to access the database
    const stats = {
      total: 18,
      sent: 6,
      acknowledged: 5,
      sentPercentage: 33,
      acknowledgedPercentage: 83,
      typeBreakdown: {
        Medication: 4,
        Appointment: 6,
        Exercise: 4,
        Hydration: 4,
      },
    }

    return NextResponse.json(stats)
  } catch (error) {
    console.error("Error fetching reminder stats:", error)
    return NextResponse.json({ error: "Failed to fetch reminder stats", details: String(error) }, { status: 200 })
  }
}

