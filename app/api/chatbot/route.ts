import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { message } = await request.json()

    // Simple mock data for demonstration
    const mockHealthData = [
      {
        deviceId: "D1000",
        timestamp: "1/22/2025 20:42",
        heartRate: 116,
        bloodPressure: "136/79 mmHg",
        glucoseLevels: 141,
        oxygenSaturation: 98,
      },
    ]

    const mockSafetyData = [
      {
        deviceId: "D1022",
        timestamp: "1/19/2025 19:46",
        location: "Bathroom",
        movementActivity: "No Movement",
        fallDetected: true,
      },
    ]

    const mockReminderData = [
      {
        deviceId: "D1004",
        timestamp: "1/1/2025 4:20",
        reminderType: "Medication",
        title: "Blood Pressure Medication",
        scheduledTime: "11:30:00",
      },
    ]

    // Determine if this is a reminder creation request
    const isReminderRequest =
      message.toLowerCase().includes("remind") ||
      message.toLowerCase().includes("reminder") ||
      message.toLowerCase().includes("schedule")

    if (isReminderRequest) {
      // Generate a simple response for reminder requests
      return NextResponse.json({
        response: `I've created a reminder for you: "${message}". Is there anything else you'd like me to remind you about?`,
      })
    }

    // Check if this is a health data query
    const isHealthQuery =
      message.toLowerCase().includes("health") ||
      message.toLowerCase().includes("heart") ||
      message.toLowerCase().includes("blood pressure") ||
      message.toLowerCase().includes("glucose") ||
      message.toLowerCase().includes("oxygen")

    if (isHealthQuery) {
      // Generate a simple response for health queries
      return NextResponse.json({
        response: `Based on your recent health data, your heart rate was 116 bpm, blood pressure was 136/79 mmHg, glucose level was 141 mg/dL, and oxygen saturation was 98%.`,
      })
    }

    // Check if this is a safety query
    const isSafetyQuery =
      message.toLowerCase().includes("safety") ||
      message.toLowerCase().includes("fall") ||
      message.toLowerCase().includes("movement") ||
      message.toLowerCase().includes("activity")

    if (isSafetyQuery) {
      // Generate a simple response for safety queries
      return NextResponse.json({
        response: `There was a fall detected in the bathroom on January 19th. I've been monitoring your movement patterns and have noticed some changes in your gait that might increase fall risk.`,
      })
    }

    // For other queries, use a simple fallback response
    return NextResponse.json({
      response: `I understand you're asking about "${message}". How can I help you with that? You can ask me about your health data, safety information, or set reminders.`,
    })
  } catch (error) {
    console.error("Chatbot error:", error)
    return NextResponse.json(
      { response: "I'm sorry, I encountered an error processing your request. Please try again." },
      { status: 200 }, // Return 200 even for errors to ensure the client gets a valid response
    )
  }
}

