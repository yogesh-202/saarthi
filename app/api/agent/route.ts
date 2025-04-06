import { type NextRequest, NextResponse } from "next/server"
import { OrchestratorAgent } from "@/lib/agents/orchestrator-agent"

const orchestrator = new OrchestratorAgent()

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Process the event through the orchestrator agent
    const result = await orchestrator.processEvent(body)

    return NextResponse.json({ success: true, result })
  } catch (error) {
    console.error("Agent API error:", error)
    return NextResponse.json({ success: false, error: "Failed to process agent request" }, { status: 500 })
  }
}

