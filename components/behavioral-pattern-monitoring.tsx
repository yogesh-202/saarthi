"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { Brain, TrendingUp, AlertTriangle, Clock } from "lucide-react"

interface BehavioralPatternMonitoringProps {
  addLog: (log: string) => void
}

export function BehavioralPatternMonitoring({ addLog }: BehavioralPatternMonitoringProps) {
  const [patterns, setPatterns] = useState<any[]>([])
  const [fallRiskData, setFallRiskData] = useState<any[]>([])
  const [anomalies, setAnomalies] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Fetch behavioral pattern data
  useEffect(() => {
    const fetchData = async () => {
      try {
        // In a real app, this would be an API call
        // For now, we'll use mock data

        // Mock behavioral patterns
        const mockPatterns = [
          {
            patternType: "sleep",
            startTime: "22:00:00",
            endTime: "07:00:00",
            daysOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
            location: "Bedroom",
            confidence: 0.92,
          },
          {
            patternType: "meal",
            startTime: "08:00:00",
            endTime: "08:30:00",
            daysOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
            location: "Kitchen",
            confidence: 0.85,
          },
          {
            patternType: "meal",
            startTime: "12:30:00",
            endTime: "13:15:00",
            daysOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
            location: "Kitchen",
            confidence: 0.78,
          },
          {
            patternType: "meal",
            startTime: "18:00:00",
            endTime: "18:45:00",
            daysOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
            location: "Kitchen",
            confidence: 0.88,
          },
          {
            patternType: "bathroom",
            startTime: "07:15:00",
            endTime: "07:30:00",
            daysOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
            location: "Bathroom",
            confidence: 0.95,
          },
          {
            patternType: "bathroom",
            startTime: "13:30:00",
            endTime: "13:40:00",
            daysOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
            location: "Bathroom",
            confidence: 0.82,
          },
          {
            patternType: "bathroom",
            startTime: "19:00:00",
            endTime: "19:15:00",
            daysOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
            location: "Bathroom",
            confidence: 0.87,
          },
          {
            patternType: "activity",
            startTime: "09:30:00",
            endTime: "10:30:00",
            daysOfWeek: ["Monday", "Wednesday", "Friday"],
            location: "Living Room",
            confidence: 0.75,
          },
          {
            patternType: "activity",
            startTime: "15:00:00",
            endTime: "16:00:00",
            daysOfWeek: ["Tuesday", "Thursday", "Saturday"],
            location: "Living Room",
            confidence: 0.72,
          },
          {
            patternType: "nap",
            startTime: "14:00:00",
            endTime: "15:00:00",
            daysOfWeek: ["Monday", "Wednesday", "Friday", "Sunday"],
            location: "Bedroom",
            confidence: 0.68,
          },
        ]

        // Mock fall risk data
        const mockFallRiskData = [
          { timestamp: "1/2/2025", riskScore: 25 },
          { timestamp: "1/5/2025", riskScore: 28 },
          { timestamp: "1/9/2025", riskScore: 35 },
          { timestamp: "1/12/2025", riskScore: 42 },
          { timestamp: "1/16/2025", riskScore: 48 },
          { timestamp: "1/20/2025", riskScore: 55 },
          { timestamp: "1/24/2025", riskScore: 62 },
          { timestamp: "1/28/2025", riskScore: 70 },
        ]

        // Mock anomalies
        const mockAnomalies = [
          {
            timestamp: "1/19/2025 19:46",
            description: "Fall detected in bathroom",
            severity: "high",
            location: "Bathroom",
          },
          {
            timestamp: "1/22/2025 10:15",
            description: "Unusual inactivity - no bathroom visit for 8 hours",
            severity: "medium",
            location: "Bathroom",
          },
          {
            timestamp: "1/25/2025 03:20",
            description: "Nighttime wandering - unusual activity at 3 AM",
            severity: "medium",
            location: "Living Room",
          },
          {
            timestamp: "1/28/2025 12:00",
            description: "Missed lunch - no kitchen activity during usual mealtime",
            severity: "low",
            location: "Kitchen",
          },
        ]

        setPatterns(mockPatterns)
        setFallRiskData(mockFallRiskData)
        setAnomalies(mockAnomalies)
        setIsLoading(false)
      } catch (error) {
        console.error("Error fetching behavioral pattern data:", error)
        addLog("Behavioral Pattern Agent: Error fetching pattern data")
        setIsLoading(false)
      }
    }

    fetchData()
  }, [addLog])

  const runPatternAnalysis = () => {
    addLog("Behavioral Pattern Agent: Running pattern analysis")

    // Simulate processing
    setTimeout(() => {
      addLog("Behavioral Pattern Agent: Pattern analysis complete")
      addLog("Behavioral Pattern Agent: Detected 10 regular patterns with high confidence")
    }, 2000)
  }

  const runFallRiskAssessment = () => {
    addLog("Behavioral Pattern Agent: Running fall risk assessment")

    // Simulate processing
    setTimeout(() => {
      addLog("Behavioral Pattern Agent: Fall risk assessment complete")
      addLog("Behavioral Pattern Agent: Current fall risk score: 70 (High) - Increasing trend detected")
    }, 2000)
  }

  const getPatternTypeIcon = (type: string) => {
    switch (type) {
      case "sleep":
        return "😴"
      case "meal":
        return "🍽️"
      case "bathroom":
        return "🚿"
      case "activity":
        return "🏃"
      case "nap":
        return "💤"
      default:
        return "📋"
    }
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "high":
        return "bg-red-100 text-red-800 border-red-300"
      case "medium":
        return "bg-amber-100 text-amber-800 border-amber-300"
      case "low":
        return "bg-blue-100 text-blue-800 border-blue-300"
      default:
        return "bg-gray-100 text-gray-800 border-gray-300"
    }
  }

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle>Behavioral Pattern Analysis</CardTitle>
          <CardDescription>AI-detected patterns in daily activities</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="patterns">
            <TabsList className="mb-4">
              <TabsTrigger value="patterns">Daily Patterns</TabsTrigger>
              <TabsTrigger value="fallRisk">Fall Risk Trend</TabsTrigger>
              <TabsTrigger value="anomalies">Detected Anomalies</TabsTrigger>
            </TabsList>

            <TabsContent value="patterns">
              {isLoading ? (
                <div className="h-[300px] flex items-center justify-center">
                  <p>Loading pattern data...</p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {patterns.map((pattern, index) => (
                      <div key={index} className="border rounded-lg p-3">
                        <div className="flex items-center space-x-2">
                          <span className="text-xl">{getPatternTypeIcon(pattern.patternType)}</span>
                          <div>
                            <p className="font-medium capitalize">{pattern.patternType}</p>
                            <p className="text-sm text-muted-foreground">
                              {pattern.startTime} - {pattern.endTime} • {pattern.location}
                            </p>
                          </div>
                        </div>
                        <div className="mt-2">
                          <p className="text-xs text-muted-foreground">Days: {pattern.daysOfWeek.join(", ")}</p>
                          <div className="mt-1 flex items-center">
                            <p className="text-xs mr-2">Confidence:</p>
                            <div className="w-full bg-gray-200 rounded-full h-1.5">
                              <div
                                className="bg-primary h-1.5 rounded-full"
                                style={{ width: `${pattern.confidence * 100}%` }}
                              ></div>
                            </div>
                            <p className="text-xs ml-2">{Math.round(pattern.confidence * 100)}%</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="flex justify-end">
                    <Button onClick={runPatternAnalysis}>
                      <Brain className="h-4 w-4 mr-2" />
                      Run Pattern Analysis
                    </Button>
                  </div>
                </div>
              )}
            </TabsContent>

            <TabsContent value="fallRisk">
              {isLoading ? (
                <div className="h-[300px] flex items-center justify-center">
                  <p>Loading fall risk data...</p>
                </div>
              ) : (
                <div>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={fallRiskData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="timestamp" />
                        <YAxis domain={[0, 100]} />
                        <Tooltip
                          formatter={(value) => [`${value} (${getRiskLevel(Number(value))})`, "Risk Score"]}
                          labelFormatter={(label) => `Date: ${label}`}
                        />
                        <Line
                          type="monotone"
                          dataKey="riskScore"
                          stroke="#ef4444"
                          activeDot={{ r: 8 }}
                          strokeWidth={2}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>

                  <div className="mt-4 flex flex-wrap gap-2">
                    <Badge variant="outline" className="bg-green-100 text-green-800">
                      Low Risk: 0-30
                    </Badge>
                    <Badge variant="outline" className="bg-yellow-100 text-yellow-800">
                      Moderate Risk: 31-50
                    </Badge>
                    <Badge variant="outline" className="bg-orange-100 text-orange-800">
                      High Risk: 51-70
                    </Badge>
                    <Badge variant="outline" className="bg-red-100 text-red-800">
                      Severe Risk: 71-100
                    </Badge>
                  </div>

                  <div className="mt-4">
                    <h3 className="text-sm font-medium">Risk Factors:</h3>
                    <ul className="mt-1 text-sm text-muted-foreground list-disc pl-5 space-y-1">
                      <li>Decreasing step length (0.58m → 0.44m)</li>
                      <li>Increasing step time (0.62s → 0.82s)</li>
                      <li>Increasing step variability (0.12 → 0.28)</li>
                      <li>Decreasing walking speed (0.94m/s → 0.54m/s)</li>
                      <li>Increasing turn time (2.8s → 5.2s)</li>
                    </ul>
                  </div>

                  <div className="mt-4 flex justify-end">
                    <Button onClick={runFallRiskAssessment}>
                      <TrendingUp className="h-4 w-4 mr-2" />
                      Run Fall Risk Assessment
                    </Button>
                  </div>
                </div>
              )}
            </TabsContent>

            <TabsContent value="anomalies">
              {isLoading ? (
                <div className="h-[300px] flex items-center justify-center">
                  <p>Loading anomaly data...</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {anomalies.length > 0 ? (
                    anomalies.map((anomaly, index) => (
                      <div key={index} className={`border rounded-lg p-3 ${getSeverityColor(anomaly.severity)}`}>
                        <div className="flex items-center space-x-2">
                          <AlertTriangle className="h-5 w-5" />
                          <div>
                            <p className="font-medium">{anomaly.description}</p>
                            <p className="text-sm">
                              {new Date(anomaly.timestamp).toLocaleString()} • {anomaly.location}
                            </p>
                          </div>
                        </div>
                        <div className="mt-2 flex justify-between items-center">
                          <Badge variant="outline" className="capitalize">
                            {anomaly.severity} severity
                          </Badge>
                          <Button variant="outline" size="sm">
                            View Details
                          </Button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-center py-8 text-muted-foreground">No anomalies detected</p>
                  )}

                  <div className="flex justify-end">
                    <Button>
                      <AlertTriangle className="h-4 w-4 mr-2" />
                      Check for New Anomalies
                    </Button>
                  </div>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Daily Routine Optimization</CardTitle>
          <CardDescription>AI-suggested optimal schedule</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="border rounded-lg p-3">
              <div className="flex items-center space-x-2">
                <Clock className="h-5 w-5 text-blue-500" />
                <p className="font-medium">Morning Routine</p>
              </div>
              <ul className="mt-2 space-y-2">
                <li className="text-sm flex items-center">
                  <span className="text-muted-foreground w-16">7:00 AM</span>
                  <span>Wake up</span>
                </li>
                <li className="text-sm flex items-center">
                  <span className="text-muted-foreground w-16">7:15 AM</span>
                  <span>Bathroom visit</span>
                </li>
                <li className="text-sm flex items-center text-primary font-medium">
                  <span className="text-muted-foreground w-16">7:30 AM</span>
                  <span>Take morning medication</span>
                </li>
                <li className="text-sm flex items-center">
                  <span className="text-muted-foreground w-16">8:00 AM</span>
                  <span>Breakfast</span>
                </li>
                <li className="text-sm flex items-center">
                  <span className="text-muted-foreground w-16">9:30 AM</span>
                  <span>Morning exercise</span>
                </li>
              </ul>
            </div>

            <div className="border rounded-lg p-3">
              <div className="flex items-center space-x-2">
                <Clock className="h-5 w-5 text-amber-500" />
                <p className="font-medium">Afternoon Routine</p>
              </div>
              <ul className="mt-2 space-y-2">
                <li className="text-sm flex items-center">
                  <span className="text-muted-foreground w-16">12:30 PM</span>
                  <span>Lunch</span>
                </li>
                <li className="text-sm flex items-center text-primary font-medium">
                  <span className="text-muted-foreground w-16">1:00 PM</span>
                  <span>Take afternoon medication</span>
                </li>
                <li className="text-sm flex items-center">
                  <span className="text-muted-foreground w-16">2:00 PM</span>
                  <span>Rest/nap</span>
                </li>
                <li className="text-sm flex items-center">
                  <span className="text-muted-foreground w-16">3:00 PM</span>
                  <span>Cognitive activities</span>
                </li>
              </ul>
            </div>

            <div className="border rounded-lg p-3">
              <div className="flex items-center space-x-2">
                <Clock className="h-5 w-5 text-indigo-500" />
                <p className="font-medium">Evening Routine</p>
              </div>
              <ul className="mt-2 space-y-2">
                <li className="text-sm flex items-center">
                  <span className="text-muted-foreground w-16">6:00 PM</span>
                  <span>Dinner</span>
                </li>
                <li className="text-sm flex items-center text-primary font-medium">
                  <span className="text-muted-foreground w-16">7:00 PM</span>
                  <span>Take evening medication</span>
                </li>
                <li className="text-sm flex items-center">
                  <span className="text-muted-foreground w-16">8:00 PM</span>
                  <span>Light activity/TV</span>
                </li>
                <li className="text-sm flex items-center">
                  <span className="text-muted-foreground w-16">10:00 PM</span>
                  <span>Prepare for bed</span>
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Pattern Insights</CardTitle>
          <CardDescription>AI-generated behavioral analysis</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4 text-sm">
            <p>Based on behavioral pattern analysis, several insights have been identified:</p>

            <div>
              <h3 className="font-medium">Sleep Patterns</h3>
              <p className="text-muted-foreground mt-1">
                Consistent sleep schedule from 10 PM to 7 AM with 92% confidence. Occasional napping in the afternoon
                (2-3 PM) on Monday, Wednesday, Friday, and Sunday.
              </p>
            </div>

            <div>
              <h3 className="font-medium">Meal Patterns</h3>
              <p className="text-muted-foreground mt-1">
                Regular meal times at 8 AM, 12:30 PM, and 6 PM with high confidence. Dinner has the highest consistency
                (88%), while lunch has the lowest (78%).
              </p>
            </div>

            <div>
              <h3 className="font-medium">Bathroom Visits</h3>
              <p className="text-muted-foreground mt-1">
                Highly predictable morning bathroom routine (95% confidence) at 7:15 AM. Regular visits after meals at
                1:30 PM and 7 PM.
              </p>
            </div>

            <div>
              <h3 className="font-medium">Activity Patterns</h3>
              <p className="text-muted-foreground mt-1">
                Regular exercise on Monday, Wednesday, and Friday mornings. Afternoon activities on Tuesday, Thursday,
                and Saturday. Limited activity on Sundays except for occasional naps.
              </p>
            </div>

            <div>
              <h3 className="font-medium">Recommendations</h3>
              <ul className="list-disc pl-5 space-y-1 text-muted-foreground mt-1">
                <li>Schedule medication around consistent meal times for better adherence</li>
                <li>Monitor increasing fall risk trend - consider physical therapy</li>
                <li>Ensure hydration reminders during afternoon activities</li>
                <li>Add cognitive exercises during high-alertness morning periods</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// Helper function to determine risk level from score
function getRiskLevel(score: number): string {
  if (score <= 30) return "Low Risk"
  if (score <= 50) return "Moderate Risk"
  if (score <= 70) return "High Risk"
  return "Severe Risk"
}

