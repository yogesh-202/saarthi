import { type NextRequest, NextResponse } from "next/server"
import { OrchestratorAgent } from "@/lib/agents/orchestrator-agent"

const orchestrator = new OrchestratorAgent()

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Coordinate emergency response
    const response = await orchestrator.coordinateEmergencyResponse(body)

    return NextResponse.json({ success: true, response })
  } catch (error) {
    console.error("Emergency API error:", error)
    return NextResponse.json({ success: false, error: "Failed to process emergency request" }, { status: 500 })
  }
}

