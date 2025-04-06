import { generateText, generateObject } from "ai"
import { openai } from "@ai-sdk/openai"
import { z } from "zod"
import { db } from "@/lib/db"

export class HealthAgent {
  async processHealthEvent(event: any) {
    // Analyze health data
    const { object: analysis } = await generateObject({
      model: openai("gpt-4o"),
      schema: z.object({
        isAnomaly: z.boolean(),
        severity: z.enum(["normal", "mild", "moderate", "severe"]),
        anomalyType: z.array(z.enum(["heartRate", "bloodPressure", "glucoseLevels", "oxygenSaturation", "none"])),
        recommendation: z.string(),
        requiresAttention: z.boolean(),
      }),
      prompt: `
        Analyze this health event data and determine if there's an anomaly:
        Event: ${JSON.stringify(event)}
        
        Return a structured analysis with:
        - Whether this is an anomaly (based on any alert flags)
        - The severity level
        - The type of anomaly (which vital signs are concerning)
        - A recommendation for action
        - Whether immediate attention is required
      `,
    })

    // If anomaly detected, generate detailed report
    if (analysis.isAnomaly) {
      const { text: detailedAnalysis } = await generateText({
        model: openai("gpt-4o"),
        prompt: `
          Generate a detailed analysis of this health anomaly:
          Event: ${JSON.stringify(event)}
          Initial Analysis: ${JSON.stringify(analysis)}
          
          Include:
          1. Possible causes for the anomalies in ${analysis.anomalyType.join(", ")}
          2. Specific recommendations for healthcare providers
          3. Urgency level and timeframe for action
          4. Potential interventions that could be suggested
        `,
      })

      return {
        status: "anomaly_detected",
        analysis,
        detailedAnalysis,
      }
    }

    return {
      status: "normal",
      analysis,
    }
  }

  async getHealthContext() {
    // Get the most recent health data
    const recentData = await db.getHealthData(undefined, 1)
    const allData = await db.getHealthData(undefined, 20)

    // Calculate averages
    const heartRates = allData.map((d) => d.heartRate)
    const avgHeartRate = Math.round(heartRates.reduce((sum, rate) => sum + rate, 0) / heartRates.length)

    const glucoseLevels = allData.map((d) => d.glucoseLevels)
    const avgGlucose = Math.round(glucoseLevels.reduce((sum, level) => sum + level, 0) / glucoseLevels.length)

    const oxygenLevels = allData.map((d) => d.oxygenSaturation)
    const avgOxygen = Math.round(oxygenLevels.reduce((sum, level) => sum + level, 0) / oxygenLevels.length)

    // Get the current values from most recent data
    const current = recentData.length > 0 ? recentData[0] : null

    return {
      vitalSigns: {
        heartRate: {
          current: current?.heartRate || 0,
          average: avgHeartRate,
          alert: current?.heartRateAlert || false,
        },
        bloodPressure: {
          current: current?.bloodPressure || "0/0",
          alert: current?.bloodPressureAlert || false,
        },
        bloodGlucose: {
          current: current?.glucoseLevels || 0,
          average: avgGlucose,
          alert: current?.glucoseLevelsAlert || false,
        },
        oxygenSaturation: {
          current: current?.oxygenSaturation || 0,
          average: avgOxygen,
          alert: current?.oxygenSaturationAlert || false,
        },
      },
      recentAlerts: await db.getHealthAlerts(5),
    }
  }

  async analyzeHealthTrends() {
    const allData = await db.getHealthData(undefined, 50)

    const { text: trendsAnalysis } = await generateText({
      model: openai("gpt-4o"),
      prompt: `
        Analyze the following health data trends:
        ${JSON.stringify(allData)}
        
        Provide insights on:
        1. Overall health status based on vital signs
        2. Any concerning patterns or trends
        3. Recommendations for improving health metrics
        4. Specific areas that need monitoring
      `,
    })

    return trendsAnalysis
  }
}

