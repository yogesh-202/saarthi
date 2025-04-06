import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"
import { HealthAgent } from "./health-agent"
import { SafetyAgent } from "./safety-agent"
import { ReminderAgent } from "./reminder-agent"

export class OrchestratorAgent {
  private healthAgent: HealthAgent
  private safetyAgent: SafetyAgent
  private reminderAgent: ReminderAgent

  constructor() {
    this.healthAgent = new HealthAgent()
    this.safetyAgent = new SafetyAgent()
    this.reminderAgent = new ReminderAgent()
  }

  async processEvent(event: any) {
    // Determine which agent should handle the event
    const { text: agentDecision } = await generateText({
      model: openai("gpt-4o"),
      prompt: `
        Based on this event, determine which agent should handle it:
        Event: ${JSON.stringify(event)}
        
        Options:
        1. Health Monitoring Agent - for health-related events
        2. Safety Monitoring Agent - for safety and unusual behavior events
        3. Reminder Agent - for medication, appointments, and activities
        
        Return only the name of the agent that should handle this event.
      `,
    })

    // Route to appropriate agent
    if (agentDecision.includes("Health")) {
      return this.healthAgent.processHealthEvent(event)
    } else if (agentDecision.includes("Safety")) {
      return this.safetyAgent.processSafetyEvent(event)
    } else if (agentDecision.includes("Reminder")) {
      return this.reminderAgent.processReminderEvent(event)
    } else {
      // Handle unknown event type
      return {
        status: "unhandled",
        message: "No appropriate agent found for this event",
      }
    }
  }

  async coordinateEmergencyResponse(alert: any) {
    // Coordinate between agents for emergency response
    const healthContext = await this.healthAgent.getHealthContext()
    const safetyContext = await this.safetyAgent.getSafetyContext()

    const { text: responseAction } = await generateText({
      model: openai("gpt-4o"),
      prompt: `
        An emergency alert has been triggered:
        Alert: ${JSON.stringify(alert)}
        
        Health Context:
        ${JSON.stringify(healthContext)}
        
        Safety Context:
        ${JSON.stringify(safetyContext)}
        
        Determine the appropriate emergency response actions in order of priority.
        Include who should be notified and what information should be provided to them.
      `,
    })

    return {
      status: "emergency_response_initiated",
      actions: responseAction,
    }
  }
}

