import { generateText, generateObject } from "ai"
import { openai } from "@ai-sdk/openai"
import { z } from "zod"
import { db } from "@/lib/db"

export class ReminderAgent {
  async processReminderEvent(event: any) {
    // Process reminder event
    const { object: analysis } = await generateObject({
      model: openai("gpt-4o"),
      schema: z.object({
        reminderType: z.enum(["Medication", "Appointment", "Exercise", "Hydration", "Other"]),
        priority: z.enum(["low", "medium", "high"]),
        scheduledTime: z.string(),
        requiresFollowUp: z.boolean(),
      }),
      prompt: `
        Analyze this reminder event:
        Event: ${JSON.stringify(event)}
        
        Return a structured analysis with:
        - The type of reminder (match exactly one of: Medication, Appointment, Exercise, Hydration, Other)
        - The priority level (Medication and Appointments are typically high priority)
        - The scheduled time
        - Whether follow-up is required (true for Medication and Appointments)
      `,
    })

    // Generate personalized reminder message
    const { text: reminderMessage } = await generateText({
      model: openai("gpt-4o"),
      prompt: `
        Generate a personalized, friendly reminder message for an elderly person:
        Reminder Type: ${analysis.reminderType}
        Details: ${JSON.stringify(event)}
        
        The message should be:
        1. Clear and easy to understand
        2. Warm and encouraging
        3. Specific about what needs to be done
        4. Include the time/schedule
      `,
    })

    return {
      status: "reminder_created",
      analysis,
      message: reminderMessage,
    }
  }

  async getPendingReminders() {
    return db.getPendingReminders()
  }

  async getReminderStats() {
    return db.getReminderStats()
  }

  async generateComplianceReport() {
    const stats = await db.getReminderStats()
    const reminderData = await db.getReminderData(undefined, 50)

    const { text: complianceReport } = await generateText({
      model: openai("gpt-4o"),
      prompt: `
        Generate a compliance report based on the following reminder data:
        Stats: ${JSON.stringify(stats)}
        Reminder Data: ${JSON.stringify(reminderData)}
        
        The report should include:
        1. Overall compliance rate
        2. Compliance by reminder type
        3. Patterns in missed reminders
        4. Recommendations for improving compliance
        5. Specific strategies for each reminder type
      `,
    })

    return complianceReport
  }

  async optimizeReminderSchedule() {
    const reminderData = await db.getReminderData(undefined, 50)
    const stats = await db.getReminderStats()

    const { object: optimizedSchedule } = await generateObject({
      model: openai("gpt-4o"),
      schema: z.object({
        recommendedChanges: z.array(
          z.object({
            reminderType: z.string(),
            currentPattern: z.string(),
            suggestedPattern: z.string(),
            rationale: z.string(),
          }),
        ),
        generalRecommendations: z.array(z.string()),
      }),
      prompt: `
        Analyze the following reminder data and suggest optimizations to the reminder schedule:
        Reminder Data: ${JSON.stringify(reminderData)}
        Stats: ${JSON.stringify(stats)}
        
        Consider:
        1. Patterns in acknowledgment rates
        2. Time of day effectiveness
        3. Clustering vs. spreading out reminders
        4. Reminder frequency
        
        Return recommendations for optimizing the reminder schedule.
      `,
    })

    return optimizedSchedule
  }
}

