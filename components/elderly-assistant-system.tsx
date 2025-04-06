"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { HealthMonitoring } from "@/components/health-monitoring"
import { SafetyMonitoring } from "@/components/safety-monitoring"
import { ReminderSystem } from "@/components/reminder-system"
import { AgentLogs } from "@/components/agent-logs"
import { ChatbotInterface } from "@/components/chatbot-interface"
import { BehavioralPatternMonitoring } from "@/components/behavioral-pattern-monitoring"
import { Pill, CalendarCheck, Droplet, Brain } from "lucide-react"

export function ElderlyAssistantSystem() {
  const [logs, setLogs] = useState<string[]>([])

  const addLog = (log: string) => {
    setLogs((prevLogs) => [...prevLogs, `[${new Date().toLocaleTimeString()}] ${log}`])
  }

  return (
    <div className="w-full space-y-4">
      <Tabs defaultValue="dashboard" className="w-full">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="health">Health</TabsTrigger>
          <TabsTrigger value="safety">Safety</TabsTrigger>
          <TabsTrigger value="reminders">Reminders</TabsTrigger>
          <TabsTrigger value="behavior">Behavior</TabsTrigger>
          <TabsTrigger value="chatbot">Chatbot</TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle>System Status</CardTitle>
                <CardDescription>All agents are operational</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-green-500">✓ Health Monitoring Agent</p>
                <p className="text-sm text-green-500">✓ Safety Monitoring Agent</p>
                <p className="text-sm text-green-500">✓ Enhanced Reminder Agent</p>
                <p className="text-sm text-green-500">✓ Behavioral Pattern Agent</p>
                <p className="text-sm text-green-500">✓ Orchestrator Agent</p>
                <p className="text-sm text-green-500">✓ Chatbot Interface</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recent Alerts</CardTitle>
                <CardDescription>Last 24 hours</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="p-2 bg-red-50 rounded border border-red-200 text-sm">
                    <p className="font-medium">Fall Detected - D1022</p>
                    <p className="text-xs text-muted-foreground">1/19/2025 19:46 - Bathroom</p>
                  </div>
                  <div className="p-2 bg-amber-50 rounded border border-amber-200 text-sm">
                    <p className="font-medium">High Glucose - D1016</p>
                    <p className="text-xs text-muted-foreground">1/24/2025 20:01 - 147 mg/dL</p>
                  </div>
                  <div className="p-2 bg-blue-50 rounded border border-blue-200 text-sm">
                    <p className="font-medium">High Blood Pressure - D1000</p>
                    <p className="text-xs text-muted-foreground">1/22/2025 20:42 - 136/79 mmHg</p>
                  </div>
                  <div className="p-2 bg-purple-50 rounded border border-purple-200 text-sm">
                    <p className="font-medium">Unusual Inactivity - Bathroom</p>
                    <p className="text-xs text-muted-foreground">Today 10:15 - No activity for 6 hours</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Upcoming Reminders</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <div className="bg-primary/10 p-1 rounded-full">
                      <Pill className="h-3 w-3" />
                    </div>
                    <div>
                      <p className="text-sm">Blood pressure medication - after breakfast</p>
                      <p className="text-xs text-muted-foreground">D1004</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="bg-primary/10 p-1 rounded-full">
                      <CalendarCheck className="h-3 w-3" />
                    </div>
                    <div>
                      <p className="text-sm">Doctor appointment - 1:30 PM</p>
                      <p className="text-xs text-muted-foreground">D1002</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="bg-primary/10 p-1 rounded-full">
                      <Droplet className="h-3 w-3" />
                    </div>
                    <div>
                      <p className="text-sm">Hydration reminder - afternoon</p>
                      <p className="text-xs text-muted-foreground">D1005</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="bg-primary/10 p-1 rounded-full">
                      <Brain className="h-3 w-3" />
                    </div>
                    <div>
                      <p className="text-sm">Cognitive exercise - after lunch</p>
                      <p className="text-xs text-muted-foreground">D1008</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <ChatbotInterface addLog={addLog} />
            <AgentLogs logs={logs} />
          </div>
        </TabsContent>

        <TabsContent value="health">
          <HealthMonitoring addLog={addLog} />
        </TabsContent>

        <TabsContent value="safety">
          <SafetyMonitoring addLog={addLog} />
        </TabsContent>

        <TabsContent value="reminders">
          <ReminderSystem addLog={addLog} />
        </TabsContent>

        <TabsContent value="behavior">
          <BehavioralPatternMonitoring addLog={addLog} />
        </TabsContent>

        <TabsContent value="chatbot">
          <div className="grid gap-4 md:grid-cols-2">
            <ChatbotInterface addLog={addLog} />
            <Card>
              <CardHeader>
                <CardTitle>Chatbot Capabilities</CardTitle>
                <CardDescription>What you can ask the assistant</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium">Health Information</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      "What's my heart rate today?" <br />
                      "How has my blood pressure been this week?" <br />
                      "Are there any health concerns I should know about?"
                    </p>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium">Safety Monitoring</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      "Has there been any unusual activity?" <br />
                      "What's my current fall risk?" <br />
                      "Show me my movement patterns today"
                    </p>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium">Reminders</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      "Remind me to take my medication after breakfast" <br />
                      "What reminders do I have today?" <br />
                      "Schedule a doctor appointment for next Tuesday at 2pm"
                    </p>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium">Behavioral Insights</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      "What's my daily routine like?" <br />
                      "Have there been any changes in my sleep pattern?" <br />
                      "Suggest an optimized schedule for my medications"
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

