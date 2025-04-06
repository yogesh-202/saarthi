import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    // Use mock data directly instead of trying to access the database
    const reminderData = [
      {
        deviceId: "D1000",
        timestamp: "1/2/2025 11:25",
        reminderType: "Exercise",
        scheduledTime: "13:00:00",
        reminderSent: false,
        acknowledged: false,
        title: "Morning Walk",
        contextualTrigger: "after breakfast",
      },
      {
        deviceId: "D1001",
        timestamp: "1/3/2025 2:52",
        reminderType: "Hydration",
        scheduledTime: "13:00:00",
        reminderSent: true,
        acknowledged: true,
        title: "Drink Water",
        contextualTrigger: "after lunch",
      },
      {
        deviceId: "D1002",
        timestamp: "1/8/2025 13:50",
        reminderType: "Appointment",
        scheduledTime: "13:30:00",
        reminderSent: false,
        acknowledged: false,
        title: "Doctor Appointment",
        contextualTrigger: "specific time",
      },
      {
        deviceId: "D1004",
        timestamp: "1/1/2025 4:20",
        reminderType: "Medication",
        scheduledTime: "11:30:00",
        reminderSent: false,
        acknowledged: false,
        title: "Blood Pressure Medication",
        contextualTrigger: "before lunch",
      },
      {
        deviceId: "D1005",
        timestamp: "1/20/2025 10:39",
        reminderType: "Hydration",
        scheduledTime: "14:30:00",
        reminderSent: false,
        acknowledged: false,
        title: "Drink Water",
        contextualTrigger: "afternoon",
      },
    ]

    return NextResponse.json(reminderData)
  } catch (error) {
    console.error("Error fetching reminder data:", error)
    return NextResponse.json({ error: "Failed to fetch reminder data", details: String(error) }, { status: 200 })
  }
}

