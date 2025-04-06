import { generateText, generateObject } from "ai"
import { openai } from "@ai-sdk/openai"
import { z } from "zod"
import { db } from "@/lib/db"

export class BehavioralPatternAgent {
  async analyzePatterns(deviceId: string) {
    // Get safety data for pattern analysis
    const safetyData = await db.getSafetyData(deviceId, 100)

    // Get existing patterns
    const existingPatterns = await db.getBehavioralPatterns(deviceId)

    // Use Ollama LLM to analyze patterns (fallback to OpenAI if Ollama not available)
    try {
      const { object: patternAnalysis } = await generateObject({
        model: openai("gpt-4o"), // In production, replace with Ollama model
        schema: z.object({
          patterns: z.array(
            z.object({
              patternType: z.string(),
              startTime: z.string(),
              endTime: z.string(),
              daysOfWeek: z.array(z.string()),
              location: z.string(),
              confidence: z.number(),
              description: z.string(),
            }),
          ),
          anomalies: z.array(
            z.object({
              timestamp: z.string(),
              description: z.string(),
              severity: z.enum(["low", "medium", "high"]),
              recommendedAction: z.string(),
            }),
          ),
        }),
        prompt: `
          Analyze this safety and movement data to identify behavioral patterns and anomalies:
          
          Safety Data: ${JSON.stringify(safetyData)}
          Existing Patterns: ${JSON.stringify(existingPatterns)}
          
          Identify:
          1. Regular patterns in movement, location, and activity
          2. Typical times for activities like sleeping, eating, bathroom visits
          3. Any anomalies or deviations from established patterns
          4. Potential concerns based on unusual inactivity or changes in routine
          
          Return a structured analysis with identified patterns and anomalies.
        `,
      })

      // Update behavioral patterns in database
      for (const pattern of patternAnalysis.patterns) {
        await db.updateBehavioralPattern({
          deviceId,
          patternType: pattern.patternType,
          startTime: pattern.startTime,
          endTime: pattern.endTime,
          daysOfWeek: pattern.daysOfWeek,
          location: pattern.location,
          confidence: pattern.confidence,
          lastUpdated: new Date().toLocaleDateString(),
        })
      }

      return {
        status: "patterns_analyzed",
        patterns: patternAnalysis.patterns,
        anomalies: patternAnalysis.anomalies,
      }
    } catch (error) {
      console.error("Error analyzing behavioral patterns:", error)
      return {
        status: "analysis_failed",
        error: String(error),
      }
    }
  }

  async detectAnomalies(deviceId: string) {
    // Get recent safety data
    const recentData = await db.getSafetyData(deviceId, 10)

    // Get established patterns
    const patterns = await db.getBehavioralPatterns(deviceId)

    // Check for deviations from patterns
    const { text: anomalyAnalysis } = await generateText({
      model: openai("gpt-4o"), // In production, replace with Ollama model
      prompt: `
        Analyze this recent activity data and check for deviations from established patterns:
        
        Recent Activity: ${JSON.stringify(recentData)}
        Established Patterns: ${JSON.stringify(patterns)}
        
        Identify any concerning anomalies such as:
        1. Unusual inactivity in rooms typically visited
        2. Missing regular activities (meals, bathroom visits, etc.)
        3. Activity at unusual times
        4. Extended periods without movement
        
        If anomalies are detected, explain their significance and potential concerns.
        If no anomalies are detected, confirm that behavior follows expected patterns.
      `,
    })

    return {
      status: "anomaly_check_complete",
      recentActivity: recentData,
      anomalyAnalysis,
    }
  }

  async predictFallRisk(deviceId: string) {
    // Get gait analysis data
    const gaitData = await db.getGaitData(deviceId)

    // Get fall risk trend
    const riskTrend = await db.getFallRiskTrend(deviceId)

    // Analyze fall risk
    const { object: riskAnalysis } = await generateObject({
      model: openai("gpt-4o"), // In production, replace with Ollama model
      schema: z.object({
        currentRiskScore: z.number(),
        riskLevel: z.enum(["low", "moderate", "high", "severe"]),
        riskFactors: z.array(z.string()),
        trend: z.enum(["improving", "stable", "worsening"]),
        recommendations: z.array(z.string()),
      }),
      prompt: `
        Analyze this gait data to assess fall risk:
        
        Gait Data: ${JSON.stringify(gaitData)}
        Risk Trend: ${JSON.stringify(riskTrend)}
        
        Provide a comprehensive fall risk assessment including:
        1. Current risk score (0-100)
        2. Risk level classification
        3. Specific risk factors identified in the gait data
        4. Whether the trend is improving, stable, or worsening
        5. Recommendations to reduce fall risk
      `,
    })

    return {
      status: "fall_risk_assessed",
      assessment: riskAnalysis,
    }
  }

  async optimizeRoutine(deviceId: string) {
    // Get behavioral patterns
    const patterns = await db.getBehavioralPatterns(deviceId)

    // Get health data
    const healthData = await db.getHealthData(deviceId, 50)

    // Generate optimized routine
    const { text: optimizedRoutine } = await generateText({
      model: openai("gpt-4o"), // In production, replace with Ollama model
      prompt: `
        Based on this behavioral pattern and health data, suggest an optimized daily routine:
        
        Behavioral Patterns: ${JSON.stringify(patterns)}
        Health Data: ${JSON.stringify(healthData)}
        
        Consider:
        1. Optimal meal times based on glucose readings
        2. Best times for medication based on vital signs
        3. Ideal activity periods for improved health
        4. Rest periods when needed
        5. Hydration schedule
        
        Provide a detailed optimized daily schedule that maintains the person's preferences
        while improving health outcomes and reducing fall risk.
      `,
    })

    return {
      status: "routine_optimized",
      currentPatterns: patterns,
      optimizedRoutine,
    }
  }
}

