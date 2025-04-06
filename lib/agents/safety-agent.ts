import { generateText, generateObject } from "ai"
import { openai } from "@ai-sdk/openai"
import { z } from "zod"
import { db } from "@/lib/db"

export class SafetyAgent {
  async processSafetyEvent(event: any) {
    // Analyze safety event
    const { object: analysis } = await generateObject({
      model: openai("gpt-4o"),
      schema: z.object({
        eventType: z.enum(["movement", "fall", "inactivity", "unusual_behavior", "other"]),
        riskLevel: z.enum(["low", "medium", "high", "critical"]),
        requiresEmergencyResponse: z.boolean(),
        recommendedAction: z.string(),
      }),
      prompt: `
        Analyze this safety event and determine the type and risk level:
        Event: ${JSON.stringify(event)}
        
        Return a structured analysis with:
        - The type of event (if it's a fall, classify as 'fall')
        - The risk level (if it's a fall with medium or high impact, classify as 'high' or 'critical')
        - Whether emergency response is required
        - Recommended action
      `,
    })

    // For high-risk events, generate emergency response
    if (analysis.riskLevel === "high" || analysis.riskLevel === "critical") {
      const { text: emergencyPlan } = await generateText({
        model: openai("gpt-4o"),
        prompt: `
          Generate an emergency response plan for this high-risk safety event:
          Event: ${JSON.stringify(event)}
          Analysis: ${JSON.stringify(analysis)}
          
          Include:
          1. Immediate actions to take
          2. Who should be notified (caregivers, emergency services, etc.)
          3. Information to provide to responders
          4. Follow-up actions after the immediate response
        `,
      })

      return {
        status: "emergency",
        analysis,
        emergencyPlan,
      }
    }

    return {
      status: "processed",
      analysis,
    }
  }

  async getSafetyContext() {
    // Get location activity data
    const locationActivity = await db.getLocationActivity()

    // Get fall events
    const fallEvents = await db.getFallEvents()

    // Get recent safety data
    const recentSafetyData = await db.getSafetyData(undefined, 10)

    // Calculate movement statistics
    const movementStats: Record<string, number> = {}
    recentSafetyData.forEach((data) => {
      movementStats[data.movementActivity] = (movementStats[data.movementActivity] || 0) + 1
    })

    return {
      homeEnvironment: {
        rooms: Object.entries(locationActivity).map(([name, data]) => ({
          name,
          lastActivity: data.lastActivity,
          status: this.determineRoomStatus(data.lastActivity),
        })),
      },
      movementPatterns: {
        stats: movementStats,
        recentActivity: recentSafetyData.slice(0, 5),
      },
      fallHistory: fallEvents,
    }
  }

  private determineRoomStatus(lastActivityTimestamp: string): "normal" | "warning" | "alert" {
    if (lastActivityTimestamp === "No data") {
      return "warning"
    }

    const lastActivity = new Date(lastActivityTimestamp)
    const now = new Date()
    const hoursSinceActivity = (now.getTime() - lastActivity.getTime()) / (1000 * 60 * 60)

    if (hoursSinceActivity > 24) {
      return "alert"
    } else if (hoursSinceActivity > 12) {
      return "warning"
    } else {
      return "normal"
    }
  }

  async analyzeInactivityPatterns() {
    const safetyData = await db.getSafetyData(undefined, 50)

    const { text: inactivityAnalysis } = await generateText({
      model: openai("gpt-4o"),
      prompt: `
        Analyze the following safety and movement data for inactivity patterns:
        ${JSON.stringify(safetyData)}
        
        Provide insights on:
        1. Patterns of inactivity that might indicate health or safety concerns
        2. Rooms with unusual inactivity
        3. Times of day with concerning movement patterns
        4. Recommendations for monitoring or intervention
      `,
    })

    return inactivityAnalysis
  }
}

