"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { AlertTriangle, CheckCircle, Activity } from "lucide-react"

interface SafetyMonitoringProps {
  addLog: (log: string) => void
}

export function SafetyMonitoring({ addLog }: SafetyMonitoringProps) {
  const [rooms, setRooms] = useState([
    { id: 1, name: "Living Room", status: "normal", lastActivity: "10 minutes ago" },
    { id: 2, name: "Kitchen", status: "normal", lastActivity: "25 minutes ago" },
    { id: 3, name: "Bedroom", status: "normal", lastActivity: "1 hour ago" },
    { id: 4, name: "Bathroom", status: "normal", lastActivity: "45 minutes ago" },
  ])

  const [fallEvents, setFallEvents] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Fetch safety data
  useEffect(() => {
    const fetchData = async () => {
      try {
        // In a real app, this would be an API call
        // For now, we'll simulate with the data we have

        // Mock room data based on the CSV
        const mockRooms = [
          { id: 1, name: "Living Room", status: "normal", lastActivity: "1/20/2025 15:45", movementType: "Lying" },
          { id: 2, name: "Kitchen", status: "normal", lastActivity: "1/10/2025 23:56", movementType: "Sitting" },
          { id: 3, name: "Bedroom", status: "normal", lastActivity: "1/29/2025 1:59", movementType: "Walking" },
          { id: 4, name: "Bathroom", status: "alert", lastActivity: "1/19/2025 19:46", movementType: "No Movement" },
        ]

        // Mock fall event from the CSV
        const mockFallEvents = [
          {
            deviceId: "D1022",
            timestamp: "1/19/2025 19:46",
            location: "Bathroom",
            impactForceLevel: "Medium",
            postFallInactivityDuration: 463,
            alertTriggered: true,
            caregiverNotified: true,
          },
        ]

        setRooms(mockRooms)
        setFallEvents(mockFallEvents)
        setIsLoading(false)
      } catch (error) {
        console.error("Error fetching safety data:", error)
        addLog("Safety Monitoring Agent: Error fetching safety data")
        setIsLoading(false)
      }
    }

    fetchData()
  }, [addLog])

  const simulateAlert = (roomId: number) => {
    setRooms(rooms.map((room) => (room.id === roomId ? { ...room, status: "alert" } : room)))

    const room = rooms.find((r) => r.id === roomId)
    addLog(`Safety Monitoring Agent: Unusual inactivity detected in ${room?.name}`)

    // Simulate orchestrator agent response
    setTimeout(() => {
      addLog("Orchestrator Agent: Initiating safety check protocol")
    }, 1000)

    // Simulate resolution
    setTimeout(() => {
      setRooms(
        rooms.map((room) => (room.id === roomId ? { ...room, status: "normal", lastActivity: "just now" } : room)),
      )
      addLog(`Safety Monitoring Agent: Alert resolved - Activity detected in ${room?.name}`)
    }, 5000)
  }

  const runSafetyCheck = () => {
    addLog("Safety Monitoring Agent: Running comprehensive safety check")

    // Simulate processing
    setTimeout(() => {
      if (fallEvents.length > 0) {
        addLog("Safety Monitoring Agent: Safety check complete - Fall event detected")
        addLog(
          `Safety Monitoring Agent: Fall occurred in ${fallEvents[0].location} with ${fallEvents[0].impactForceLevel} impact`,
        )
      } else {
        addLog("Safety Monitoring Agent: Safety check complete - No issues detected")
      }
    }, 2000)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "alert":
        return "border-red-500 bg-red-50"
      case "warning":
        return "border-yellow-500 bg-yellow-50"
      default:
        return ""
    }
  }

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle>Home Safety Monitoring</CardTitle>
          <CardDescription>Real-time activity monitoring across the home</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="h-[200px] flex items-center justify-center">
              <p>Loading safety data...</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {rooms.map((room) => (
                <Card key={room.id} className={`${getStatusColor(room.status)}`}>
                  <CardHeader className="p-4">
                    <div className="flex justify-between items-center">
                      <CardTitle className="text-sm">{room.name}</CardTitle>
                      {room.status === "alert" ? (
                        <AlertTriangle className="h-5 w-5 text-red-500" />
                      ) : (
                        <CheckCircle className="h-5 w-5 text-green-500" />
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="p-4 pt-0">
                    <p className="text-xs text-muted-foreground">Last activity: {room.lastActivity}</p>
                    {room.movementType && (
                      <p className="text-xs text-muted-foreground">Activity: {room.movementType}</p>
                    )}
                    <div className="mt-2">
                      <Badge variant={room.status === "alert" ? "destructive" : "outline"} className="text-xs">
                        {room.status === "alert" ? "Needs attention" : "Normal"}
                      </Badge>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="mt-2 w-full text-xs"
                      onClick={() => simulateAlert(room.id)}
                    >
                      Simulate Alert
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          <div className="mt-4 flex justify-end">
            <Button onClick={runSafetyCheck}>Run Safety Check</Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Fall Detection</CardTitle>
          <CardDescription>Recent fall events</CardDescription>
        </CardHeader>
        <CardContent>
          {fallEvents.length > 0 ? (
            <div className="space-y-3">
              {fallEvents.map((event, index) => (
                <div key={index} className="p-3 border rounded-lg bg-red-50">
                  <div className="flex items-center space-x-2">
                    <AlertTriangle className="h-5 w-5 text-red-500" />
                    <p className="font-medium">Fall Detected - {event.deviceId}</p>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">{new Date(event.timestamp).toLocaleString()}</p>
                  <div className="mt-2 space-y-1">
                    <p className="text-sm">
                      <span className="font-medium">Location:</span> {event.location}
                    </p>
                    <p className="text-sm">
                      <span className="font-medium">Impact Level:</span> {event.impactForceLevel}
                    </p>
                    <p className="text-sm">
                      <span className="font-medium">Inactivity Duration:</span> {event.postFallInactivityDuration}{" "}
                      seconds
                    </p>
                    <p className="text-sm">
                      <span className="font-medium">Alert Status:</span>{" "}
                      {event.alertTriggered ? "Triggered" : "Not Triggered"}
                    </p>
                    <p className="text-sm">
                      <span className="font-medium">Caregiver Notified:</span> {event.caregiverNotified ? "Yes" : "No"}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-green-500">No falls detected in the last 24 hours</p>
          )}
          <p className="text-xs text-muted-foreground mt-2">Last system check: 1 hour ago</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Movement Analysis</CardTitle>
          <CardDescription>Activity patterns</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Activity className="h-4 w-4 text-blue-500" />
                <span className="text-sm font-medium">Walking</span>
              </div>
              <span className="text-sm">4 instances</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Activity className="h-4 w-4 text-amber-500" />
                <span className="text-sm font-medium">Sitting</span>
              </div>
              <span className="text-sm">6 instances</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Activity className="h-4 w-4 text-purple-500" />
                <span className="text-sm font-medium">Lying</span>
              </div>
              <span className="text-sm">4 instances</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Activity className="h-4 w-4 text-red-500" />
                <span className="text-sm font-medium">No Movement</span>
              </div>
              <span className="text-sm">5 instances</span>
            </div>
          </div>
          <div className="mt-4">
            <p className="text-sm font-medium">Safety Insights:</p>
            <p className="text-sm mt-1">Extended periods of no movement detected in Bathroom - potential risk area</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

