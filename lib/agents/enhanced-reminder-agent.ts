import { generateText, generateObject } from "ai"
import { openai } from "@ai-sdk/openai"
import { z } from "zod"
import { db } from "@/lib/db"
import type { ReminderData } from "@/lib/db"

export class EnhancedReminderAgent {
  async processReminderEvent(event: any) {
    // Process reminder event with context awareness
    const { object: analysis } = await generateObject({
      model: openai("gpt-4o"), // In production, replace with Ollama model
      schema: z.object({
        reminderType: z.enum(["Medication", "Appointment", "Exercise", "Hydration", "Other"]),
        priority: z.enum(["low", "medium", "high"]),
        scheduledTime: z.string(),
        contextualTrigger: z.string(),
        requiresFollowUp: z.boolean(),
        voicePrompt: z.string(),
        adaptiveScheduling: z.boolean(),
      }),
      prompt: `
        Analyze this reminder event with context awareness:
        Event: ${JSON.stringify(event)}
        
        Return a structured analysis with:
        - The type of reminder (match exactly one of: Medication, Appointment, Exercise, Hydration, Other)
        - The priority level (Medication and Appointments are typically high priority)
        - The scheduled time
        - A contextual trigger (e.g., "after breakfast", "before bedtime")
        - Whether follow-up is required
        - A natural voice prompt to be used with TTS
        - Whether this reminder should use adaptive scheduling based on user behavior
      `,
    })

    // Generate personalized reminder message
    const { text: reminderMessage } = await generateText({
      model: openai("gpt-4o"), // In production, replace with Ollama model
      prompt: `
        Generate a personalized, conversational reminder message for an elderly person:
        Reminder Type: ${analysis.reminderType}
        Details: ${JSON.stringify(event)}
        Contextual Trigger: ${analysis.contextualTrigger}
        
        The message should be:
        1. Conversational and natural-sounding (for TTS)
        2. Warm and encouraging
        3. Specific about what needs to be done
        4. Include the contextual trigger rather than just a specific time
        5. Ask a question that encourages a response
        
        For example: "Good morning, Yogesh! It's time for your morning walk. The weather looks nice today. Would you like to go now, or should I remind you after breakfast?"
      `,
    })

    return {
      status: "reminder_created",
      analysis,
      message: reminderMessage,
    }
  }

  async generateContextualReminder(deviceId: string, reminderType: string) {
    // Get behavioral patterns to determine optimal timing
    const patterns = await db.getBehavioralPatterns(deviceId)

    // Get existing reminders
    const existingReminders = await db.getReminderData(deviceId)

    // Generate contextual reminder
    const { object: contextualReminder } = await generateObject({
      model: openai("gpt-4o"), // In production, replace with Ollama model
      schema: z.object({
        title: z.string(),
        reminderType: z.string(),
        contextualTrigger: z.string(),
        scheduledTime: z.string(),
        reasoning: z.string(),
        voicePrompt: z.string(),
      }),
      prompt: `
        Create a contextual reminder for this person based on their behavioral patterns:
        
        Reminder Type: ${reminderType}
        Behavioral Patterns: ${JSON.stringify(patterns)}
        Existing Reminders: ${JSON.stringify(existingReminders)}
        
        Determine:
        1. The best contextual trigger for this reminder (e.g., "after breakfast", "before bedtime")
        2. An appropriate time based on the person's routine
        3. A clear title for the reminder
        4. A natural voice prompt that sounds conversational
        5. Explanation of why this timing is optimal
      `,
    })

    // Create the reminder in the database
    const newReminder: Omit<ReminderData, "id"> = {
      deviceId,
      timestamp: new Date().toLocaleString(),
      reminderType: contextualReminder.reminderType,
      scheduledTime: contextualReminder.scheduledTime,
      reminderSent: false,
      acknowledged: false,
      title: contextualReminder.title,
      contextualTrigger: contextualReminder.contextualTrigger,
    }

    await db.addReminder(newReminder)

    return {
      status: "contextual_reminder_created",
      reminder: contextualReminder,
    }
  }

  async processFeedback(deviceId: string, timestamp: string, feedback: string) {
    // Get the reminder
    const reminderData = await db.getReminderData(deviceId)
    const reminder = reminderData.find((r) => r.timestamp === timestamp)

    if (!reminder) {
      return {
        status: "error",
        message: "Reminder not found",
      }
    }

    // Update reminder with feedback
    await db.updateReminderStatus(deviceId, timestamp, reminder.reminderSent, reminder.acknowledged, feedback)

    // Analyze feedback to improve future reminders
    const { object: feedbackAnalysis } = await generateObject({
      model: openai("gpt-4o"), // In production, replace with Ollama model
      schema: z.object({
        sentiment: z.enum(["positive", "neutral", "negative"]),
        adjustmentNeeded: z.boolean(),
        suggestedChanges: z.array(
          z.object({
            aspect: z.string(),
            currentValue: z.string(),
            recommendedValue: z.string(),
            reason: z.string(),
          }),
        ),
        learningInsights: z.string(),
      }),
      prompt: `
        Analyze this feedback for a reminder:
        
        Reminder: ${JSON.stringify(reminder)}
        Feedback: ${feedback}
        
        Determine:
        1. The sentiment of the feedback
        2. Whether adjustments are needed for future reminders
        3. Specific suggested changes (timing, wording, context, etc.)
        4. Learning insights that can be applied to other reminders
      `,
    })

    return {
      status: "feedback_processed",
      reminder,
      feedbackAnalysis,
    }
  }

  async generateTTSReminder(reminder: ReminderData) {
    // In a real implementation, this would use a TTS service
    // For now, we'll just return the text that would be spoken

    const { text: speechText } = await generateText({
      model: openai("gpt-4o"), // In production, replace with Ollama model
      prompt: `
        Generate a natural, conversational speech text for this reminder:
        
        Reminder: ${JSON.stringify(reminder)}
        
        The speech should:
        1. Sound natural and friendly, like a person speaking
        2. Include a greeting
        3. Clearly state the reminder purpose
        4. Reference the contextual trigger if available
        5. End with a question that encourages a response
        
        Keep it concise but warm and engaging.
      `,
    })

    return {
      status: "tts_generated",
      reminderText: speechText,
      // In a real implementation, this would include the audio URL
      audioUrl: "/api/tts/reminder?id=" + encodeURIComponent(reminder.deviceId + "_" + reminder.timestamp),
    }
  }

  async adjustReminderBasedOnResponse(deviceId: string, timestamp: string, response: string) {
    // Get the reminder
    const reminderData = await db.getReminderData(deviceId)
    const reminder = reminderData.find((r) => r.timestamp === timestamp)

    if (!reminder) {
      return {
        status: "error",
        message: "Reminder not found",
      }
    }

    // Analyze user response
    const { object: responseAnalysis } = await generateObject({
      model: openai("gpt-4o"), // In production, replace with Ollama model
      schema: z.object({
        intent: z.enum(["accept", "delay", "decline", "question", "other"]),
        delayDuration: z.number().optional(),
        questions: z.array(z.string()).optional(),
        sentiment: z.enum(["positive", "neutral", "negative"]),
        suggestedAction: z.string(),
      }),
      prompt: `
        Analyze this response to a reminder:
        
        Reminder: ${JSON.stringify(reminder)}
        User Response: ${response}
        
        Determine:
        1. The user's intent (accept, delay, decline, question, other)
        2. If delaying, the requested duration in minutes
        3. Any questions the user is asking
        4. The sentiment of the response
        5. The suggested next action
      `,
    })

    // Take action based on analysis
    if (responseAnalysis.intent === "accept") {
      await db.updateReminderStatus(deviceId, timestamp, true, true)

      return {
        status: "reminder_accepted",
        analysis: responseAnalysis,
      }
    } else if (responseAnalysis.intent === "delay" && responseAnalysis.delayDuration) {
      // Create a new delayed reminder
      const delayedTime = new Date()
      delayedTime.setMinutes(delayedTime.getMinutes() + responseAnalysis.delayDuration)

      const newReminder: Omit<ReminderData, "id"> = {
        ...reminder,
        timestamp: new Date().toLocaleString(),
        scheduledTime: delayedTime.toLocaleTimeString(),
        reminderSent: false,
        acknowledged: false,
        feedback: `Delayed from original reminder at ${reminder.timestamp}`,
      }

      await db.addReminder(newReminder)
      await db.updateReminderStatus(deviceId, timestamp, true, false, "Delayed by user request")

      return {
        status: "reminder_delayed",
        analysis: responseAnalysis,
        newReminderTime: delayedTime.toLocaleTimeString(),
      }
    } else if (responseAnalysis.intent === "question" && responseAnalysis.questions) {
      // Generate answer to user's question
      const { text: answer } = await generateText({
        model: openai("gpt-4o"), // In production, replace with Ollama model
        prompt: `
          Answer this question about a reminder:
          
          Reminder: ${JSON.stringify(reminder)}
          Question: ${responseAnalysis.questions.join(", ")}
          
          Provide a helpful, concise answer that addresses the question directly.
        `,
      })

      return {
        status: "question_answered",
        analysis: responseAnalysis,
        answer,
      }
    } else {
      // Handle decline or other responses
      await db.updateReminderStatus(deviceId, timestamp, true, false, "User declined: " + response)

      return {
        status: "reminder_declined",
        analysis: responseAnalysis,
      }
    }
  }
}

