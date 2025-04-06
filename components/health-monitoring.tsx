"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { AlertTriangle, Activity, Droplet, Heart } from "lucide-react"

interface HealthMonitoringProps {
  addLog: (log: string) => void
}

export function HealthMonitoring({ addLog }: HealthMonitoringProps) {
  const [selectedMetric, setSelectedMetric] = useState<"heartRate" | "bloodPressure" | "glucose" | "oxygen">(
    "heartRate",
  )
  const [healthData, setHealthData] = useState<any[]>([])
  const [healthAlerts, setHealthAlerts] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Fetch health data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true)

        // Fetch health data
        let formattedData = []
        try {
          const response = await fetch("/api/health/data")

          if (!response.ok) {
            throw new Error(`HTTP error ${response.status}`)
          }

          const data = await response.json()

          if (Array.isArray(data)) {
            // Transform data for chart
            formattedData = data.map((item: any) => ({
              time: new Date(item.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
              date: new Date(item.timestamp).toLocaleDateString(),
              heartRate: item.heartRate,
              bloodPressure: item.bloodPressure ? Number.parseInt(item.bloodPressure.split("/")[0]) : 0,
              glucose: item.glucoseLevels,
              oxygen: item.oxygenSaturation,
              deviceId: item.deviceId,
            }))

            setHealthData(formattedData)
          } else {
            throw new Error("Invalid data format")
          }
        } catch (apiError) {
          console.error("API error, falling back to mock data:", apiError)
          // Use mock data as fallback
          const mockData = [
            {
              time: "08:00",
              date: "1/22/2025",
              heartRate: 116,
              bloodPressure: 136,
              glucose: 141,
              oxygen: 98,
              deviceId: "D1000",
            },
            {
              time: "10:00",
              date: "1/16/2025",
              heartRate: 119,
              bloodPressure: 105,
              glucose: 146,
              oxygen: 93,
              deviceId: "D1001",
            },
            {
              time: "12:00",
              date: "1/10/2025",
              heartRate: 97,
              bloodPressure: 120,
              glucose: 133,
              oxygen: 97,
              deviceId: "D1002",
            },
            {
              time: "14:00",
              date: "1/10/2025",
              heartRate: 113,
              bloodPressure: 138,
              glucose: 82,
              oxygen: 98,
              deviceId: "D1003",
            },
            {
              time: "16:00",
              date: "1/3/2025",
              heartRate: 88,
              bloodPressure: 108,
              glucose: 146,
              oxygen: 97,
              deviceId: "D1004",
            },
            {
              time: "18:00",
              date: "1/5/2025",
              heartRate: 119,
              bloodPressure: 114,
              glucose: 133,
              oxygen: 91,
              deviceId: "D1005",
            },
          ]

          setHealthData(mockData)
          addLog("Health Monitoring Agent: Using fallback data due to API error")
        }

        // Get alerts
        try {
          const alertsResponse = await fetch("/api/health/alerts")

          if (!alertsResponse.ok) {
            throw new Error(`HTTP error ${alertsResponse.status}`)
          }

          const alertsData = await alertsResponse.json()

          if (Array.isArray(alertsData)) {
            setHealthAlerts(alertsData)
          } else {
            throw new Error("Invalid alerts data format")
          }
        } catch (alertsError) {
          console.error("Alerts API error, falling back to mock data:", alertsError)

          const mockAlerts = [
            {
              deviceId: "D1000",
              timestamp: "1/22/2025 20:42",
              heartRate: 116,
              heartRateAlert: true,
              bloodPressure: "136/79 mmHg",
              bloodPressureAlert: true,
              glucoseLevels: 141,
              glucoseLevelsAlert: true,
              oxygenSaturation: 98,
              oxygenSaturationAlert: false,
            },
            {
              deviceId: "D1006",
              timestamp: "1/30/2025 3:01",
              heartRate: 109,
              heartRateAlert: true,
              bloodPressure: "137/61 mmHg",
              bloodPressureAlert: true,
              glucoseLevels: 143,
              glucoseLevelsAlert: true,
              oxygenSaturation: 98,
              oxygenSaturationAlert: false,
            },
            {
              deviceId: "D1016",
              timestamp: "1/24/2025 20:01",
              heartRate: 74,
              heartRateAlert: false,
              bloodPressure: "103/67 mmHg",
              bloodPressureAlert: false,
              glucoseLevels: 147,
              glucoseLevelsAlert: true,
              oxygenSaturation: 90,
              oxygenSaturationAlert: true,
            },
          ]

          setHealthAlerts(mockAlerts)
          addLog("Health Monitoring Agent: Using fallback alerts data due to API error")
        }
      } catch (error) {
        console.error("Error in health monitoring component:", error)
        addLog("Health Monitoring Agent: Error loading health data")
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [addLog])

  const runHealthAnalysis = async () => {
    addLog("Health Monitoring Agent: Running health data analysis")

    // Simulate agent processing
    setTimeout(() => {
      if (healthAlerts.length > 0) {
        addLog("Health Monitoring Agent: Analysis complete - Found potential health concerns")
        addLog(`Health Monitoring Agent: ${healthAlerts.length} alerts detected in recent data`)
      } else {
        addLog("Health Monitoring Agent: Analysis complete - All vitals within normal range")
      }
    }, 2000)
  }

  const getMetricColor = (metric: string) => {
    switch (metric) {
      case "heartRate":
        return "#ef4444"
      case "bloodPressure":
        return "#3b82f6"
      case "glucose":
        return "#f59e0b"
      case "oxygen":
        return "#10b981"
      default:
        return "#8884d8"
    }
  }

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle>Health Metrics</CardTitle>
          <CardDescription>Real-time health data from wearable devices</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex space-x-2 mb-4">
            <Button
              variant={selectedMetric === "heartRate" ? "default" : "outline"}
              onClick={() => setSelectedMetric("heartRate")}
              className={selectedMetric === "heartRate" ? "bg-red-500 hover:bg-red-600" : ""}
            >
              <Heart className="h-4 w-4 mr-2" />
              Heart Rate
            </Button>
            <Button
              variant={selectedMetric === "bloodPressure" ? "default" : "outline"}
              onClick={() => setSelectedMetric("bloodPressure")}
              className={selectedMetric === "bloodPressure" ? "bg-blue-500 hover:bg-blue-600" : ""}
            >
              <Activity className="h-4 w-4 mr-2" />
              Blood Pressure
            </Button>
            <Button
              variant={selectedMetric === "glucose" ? "default" : "outline"}
              onClick={() => setSelectedMetric("glucose")}
              className={selectedMetric === "glucose" ? "bg-amber-500 hover:bg-amber-600" : ""}
            >
              <Droplet className="h-4 w-4 mr-2" />
              Glucose
            </Button>
            <Button
              variant={selectedMetric === "oxygen" ? "default" : "outline"}
              onClick={() => setSelectedMetric("oxygen")}
              className={selectedMetric === "oxygen" ? "bg-emerald-500 hover:bg-emerald-600" : ""}
            >
              <Activity className="h-4 w-4 mr-2" />
              Oxygen
            </Button>
          </div>

          {isLoading ? (
            <div className="h-[300px] flex items-center justify-center">
              <p>Loading health data...</p>
            </div>
          ) : (
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={healthData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="time" />
                  <YAxis />
                  <Tooltip
                    formatter={(value, name) => {
                      if (name === "bloodPressure") {
                        return [`${value} mmHg`, "Systolic BP"]
                      }
                      if (name === "glucose") {
                        return [`${value} mg/dL`, "Glucose"]
                      }
                      if (name === "oxygen") {
                        return [`${value}%`, "SpO₂"]
                      }
                      return [`${value} bpm`, "Heart Rate"]
                    }}
                    labelFormatter={(label) => `Time: ${label}`}
                  />
                  <Line
                    type="monotone"
                    dataKey={selectedMetric}
                    stroke={getMetricColor(selectedMetric)}
                    activeDot={{ r: 8 }}
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}

          <div className="mt-4 flex justify-end">
            <Button onClick={runHealthAnalysis}>Run Health Analysis</Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Health Alerts</CardTitle>
          <CardDescription>Recent health anomalies</CardDescription>
        </CardHeader>
        <CardContent>
          {healthAlerts.length > 0 ? (
            <div className="space-y-3">
              {healthAlerts.map((alert, index) => (
                <div key={index} className="p-3 border rounded-lg bg-red-50">
                  <div className="flex items-center space-x-2">
                    <AlertTriangle className="h-5 w-5 text-red-500" />
                    <p className="font-medium">Alert for {alert.deviceId}</p>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">{new Date(alert.timestamp).toLocaleString()}</p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {alert.heartRateAlert && (
                      <Badge variant="destructive" className="bg-red-500">
                        Heart Rate: {alert.heartRate} bpm
                      </Badge>
                    )}
                    {alert.bloodPressureAlert && (
                      <Badge variant="destructive" className="bg-blue-500">
                        BP: {alert.bloodPressure}
                      </Badge>
                    )}
                    {alert.glucoseLevelsAlert && (
                      <Badge variant="destructive" className="bg-amber-500">
                        Glucose: {alert.glucoseLevels} mg/dL
                      </Badge>
                    )}
                    {alert.oxygenSaturationAlert && (
                      <Badge variant="destructive" className="bg-emerald-500">
                        SpO₂: {alert.oxygenSaturation}%
                      </Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">No current health alerts</p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Health Insights</CardTitle>
          <CardDescription>AI-generated health analysis</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm">
            <p>Based on recent data, several vital signs are outside normal ranges:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Heart rate elevated in 8 readings (above 100 bpm)</li>
              <li>Blood pressure elevated in 9 readings</li>
              <li>Glucose levels elevated in 7 readings (above 140 mg/dL)</li>
              <li>Oxygen saturation below threshold in 5 readings (below 92%)</li>
            </ul>
            <p className="mt-2 font-medium">Recommendations:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Schedule follow-up with healthcare provider</li>
              <li>Monitor blood pressure more frequently</li>
              <li>Review medication compliance</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

