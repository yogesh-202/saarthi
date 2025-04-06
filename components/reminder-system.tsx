"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import { CalendarIcon, Clock, Pill, CalendarCheck, Dumbbell, Droplet } from "lucide-react"

interface ReminderSystemProps {
  addLog: (log: string) => void
}

export function ReminderSystem({ addLog }: ReminderSystemProps) {
  const [date, setDate] = useState<Date | undefined>(new Date())
  const [reminders, setReminders] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [stats, setStats] = useState<any>(null)
  const [newReminder, setNewReminder] = useState({
    title: "",
    type: "Medication",
    deviceId: "D1000",
    date: new Date(),
    time: "08:00",
  });

  const handleInputChange = (field: string, value: string | Date) => {
    setNewReminder((prev) => ({ ...prev, [field]: value }));
  };

  // Fetch reminder data
  useEffect(() => {
    const fetchData = async () => {
      try {
        // In a real app, this would be an API call
        // For now, we'll simulate with the data we have

        // Mock reminders based on the CSV
        const mockReminders = [
          {
            id: 1,
            deviceId: "D1004",
            timestamp: "1/1/2025 4:20",
            type: "Medication",
            title: "Blood Pressure Medication",
            time: "11:30:00",
            reminderSent: false,
            acknowledged: false,
          },
          {
            id: 2,
            deviceId: "D1006",
            timestamp: "1/25/2025 10:05",
            type: "Medication",
            title: "Vitamin D Supplement",
            time: "15:30:00",
            reminderSent: false,
            acknowledged: false,
          },
          {
            id: 3,
            deviceId: "D1008",
            timestamp: "1/21/2025 15:25",
            type: "Medication",
            title: "Cholesterol Medication",
            time: "12:30:00",
            reminderSent: false,
            acknowledged: false,
          },
          {
            id: 4,
            deviceId: "D1002",
            timestamp: "1/8/2025 13:50",
            type: "Appointment",
            title: "Doctor Appointment",
            time: "13:30:00",
            reminderSent: false,
            acknowledged: false,
          },
          {
            id: 5,
            deviceId: "D1012",
            timestamp: "1/25/2025 1:18",
            type: "Appointment",
            title: "Physical Therapy",
            time: "10:30:00",
            reminderSent: false,
            acknowledged: false,
          },
          {
            id: 6,
            deviceId: "D1000",
            timestamp: "1/2/2025 11:25",
            type: "Exercise",
            title: "Morning Walk",
            time: "13:00:00",
            reminderSent: false,
            acknowledged: false,
          },
          {
            id: 7,
            deviceId: "D1003",
            timestamp: "1/5/2025 5:16",
            type: "Exercise",
            title: "Stretching Routine",
            time: "8:00:00",
            reminderSent: false,
            acknowledged: false,
          },
          {
            id: 8,
            deviceId: "D1001",
            timestamp: "1/3/2025 2:52",
            type: "Hydration",
            title: "Drink Water",
            time: "13:00:00",
            reminderSent: true,
            acknowledged: true,
          },
          {
            id: 9,
            deviceId: "D1005",
            timestamp: "1/20/2025 10:39",
            type: "Hydration",
            title: "Drink Water",
            time: "14:30:00",
            reminderSent: false,
            acknowledged: false,
          },
        ]

        // Calculate stats
        const total = 18 // From the CSV
        const sent = 6 // From the CSV
        const acknowledged = 5 // From the CSV

        const mockStats = {
          total,
          sent,
          acknowledged,
          sentPercentage: Math.round((sent / total) * 100),
          acknowledgedPercentage: Math.round((acknowledged / sent) * 100),
          typeBreakdown: {
            Medication: 4,
            Appointment: 6,
            Exercise: 4,
            Hydration: 4,
          },
        }

        setReminders(mockReminders)
        setStats(mockStats)
        setIsLoading(false)
      } catch (error) {
        console.error("Error fetching reminder data:", error)
        addLog("Reminder Agent: Error fetching reminder data")
        setIsLoading(false)
      }
    }

    fetchData()
  }, [addLog])

  const completeReminder = (id: number) => {
    setReminders((prevReminders) => {
      const updatedReminders = prevReminders.map((reminder) =>
        reminder.id === id ? { ...reminder, reminderSent: true, acknowledged: true } : reminder
      );

      const completedReminder = updatedReminders.find((r) => r.id === id);
      if (completedReminder) {
        // Defer the addLog call
        setTimeout(() => {
          addLog(`Reminder Agent: Marked "${completedReminder.title}" as completed`);
        }, 0);
      }

      return updatedReminders;
    });
  };

  const addReminder = () => {
    const reminder = {
      id: reminders.length + 1,
      deviceId: newReminder.deviceId,
      timestamp: newReminder.date.toISOString(),
      type: newReminder.type,
      title: newReminder.title,
      time: newReminder.time,
      reminderSent: false,
      acknowledged: false,
    };

    setReminders((prevReminders) => [...prevReminders, reminder]);

    // Defer the addLog call
    setTimeout(() => {
      addLog(`Reminder Agent: New reminder "${newReminder.title}" created`);
    }, 0);

    // Reset the form
    setNewReminder({
      title: "",
      type: "Medication",
      deviceId: "D1000",
      date: new Date(),
      time: "08:00",
    });

    console.log("Updated reminders:", reminders);
    console.log("New reminder:", newReminder);
  };

  const getIconForType = (type: string) => {
    switch (type) {
      case "Medication":
        return <Pill className="h-4 w-4" />
      case "Appointment":
        return <CalendarCheck className="h-4 w-4" />
      case "Exercise":
        return <Dumbbell className="h-4 w-4" />
      case "Hydration":
        return <Droplet className="h-4 w-4" />
      default:
        return <Clock className="h-4 w-4" />
    }
  }

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Today's Reminders</CardTitle>
          <CardDescription>{format(new Date(), "EEEE, MMMM do, yyyy")}</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="h-[200px] flex items-center justify-center">
              <p>Loading reminder data...</p>
            </div>
          ) : (
            <div className="space-y-4">
              {reminders.map((reminder) => (
                <div
                  key={reminder.id}
                  className={`flex items-center justify-between p-3 rounded-lg border ${
                    reminder.acknowledged ? "bg-muted" : ""
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className="bg-primary/10 p-2 rounded-full">{getIconForType(reminder.type)}</div>
                    <div>
                      <p
                        className={`text-sm font-medium ${reminder.acknowledged ? "line-through text-muted-foreground" : ""}`}
                      >
                        {reminder.title}
                      </p>
                      <p className="text-xs text-muted-foreground">{reminder.time}</p>
                      <p className="text-xs text-muted-foreground">{reminder.deviceId}</p>
                    </div>
                  </div>
                  {!reminder.acknowledged && (
                    <Button variant="outline" size="sm" onClick={() => completeReminder(reminder.id)}>
                      Complete
                    </Button>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Add New Reminder</CardTitle>
          <CardDescription>Create a new reminder for medication, appointments, or activities</CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Reminder Title</Label>
              <Input
                id="title"
                placeholder="Enter reminder title"
                value={newReminder.title}
                onChange={(e) => handleInputChange("title", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="type">Reminder Type</Label>
              <Select
                defaultValue={newReminder.type}
                onValueChange={(value) => handleInputChange("type", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Medication">Medication</SelectItem>
                  <SelectItem value="Appointment">Appointment</SelectItem>
                  <SelectItem value="Exercise">Exercise</SelectItem>
                  <SelectItem value="Hydration">Hydration</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="deviceId">Device ID</Label>
              <Select
                defaultValue={newReminder.deviceId}
                onValueChange={(value) => handleInputChange("deviceId", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select device" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="D1000">D1000</SelectItem>
                  <SelectItem value="D1001">D1001</SelectItem>
                  <SelectItem value="D1002">D1002</SelectItem>
                  <SelectItem value="D1003">D1003</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start text-left font-normal">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {newReminder.date ? format(newReminder.date, "PPP") : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={newReminder.date}
                      onSelect={(date) => handleInputChange("date", date)}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-2">
                <Label htmlFor="time">Time</Label>
                <Select
                  defaultValue={newReminder.time}
                  onValueChange={(value) => handleInputChange("time", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select time" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="08:00">8:00 AM</SelectItem>
                    <SelectItem value="12:00">12:00 PM</SelectItem>
                    <SelectItem value="14:00">2:00 PM</SelectItem>
                    <SelectItem value="16:00">4:00 PM</SelectItem>
                    <SelectItem value="20:00">8:00 PM</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </form>
        </CardContent>
        <CardFooter>
          <Button className="w-full" onClick={addReminder}>
            Add Reminder
          </Button>
        </CardFooter>
      </Card>

      <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle>Reminder Statistics</CardTitle>
          <CardDescription>Compliance and effectiveness metrics</CardDescription>
        </CardHeader>
        <CardContent>
          {stats && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-4 border rounded-lg">
                <p className="text-sm text-muted-foreground">Total Reminders</p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
              <div className="p-4 border rounded-lg">
                <p className="text-sm text-muted-foreground">Sent</p>
                <p className="text-2xl font-bold">{stats.sentPercentage}%</p>
                <p className="text-xs text-muted-foreground">
                  {stats.sent} of {stats.total}
                </p>
              </div>
              <div className="p-4 border rounded-lg">
                <p className="text-sm text-muted-foreground">Acknowledged</p>
                <p className="text-2xl font-bold">{stats.acknowledgedPercentage}%</p>
                <p className="text-xs text-muted-foreground">
                  {stats.acknowledged} of {stats.sent}
                </p>
              </div>
              <div className="p-4 border rounded-lg">
                <p className="text-sm text-muted-foreground">Most Common</p>
                <p className="text-2xl font-bold">Appointment</p>
                <p className="text-xs text-muted-foreground">{stats.typeBreakdown.Appointment} reminders</p>
              </div>
            </div>
          )}

          <div className="mt-6">
            <h3 className="text-sm font-medium mb-2">Reminder Type Breakdown</h3>
            <div className="space-y-2">
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div
                  className="bg-blue-600 h-2.5 rounded-full"
                  style={{ width: `${(stats?.typeBreakdown.Medication / stats?.total) * 100}%` }}
                ></div>
              </div>
              <div className="flex justify-between text-xs">
                <span>Medication ({stats?.typeBreakdown.Medication})</span>
                <span>{Math.round((stats?.typeBreakdown.Medication / stats?.total) * 100)}%</span>
              </div>

              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div
                  className="bg-green-600 h-2.5 rounded-full"
                  style={{ width: `${(stats?.typeBreakdown.Appointment / stats?.total) * 100}%` }}
                ></div>
              </div>
              <div className="flex justify-between text-xs">
                <span>Appointment ({stats?.typeBreakdown.Appointment})</span>
                <span>{Math.round((stats?.typeBreakdown.Appointment / stats?.total) * 100)}%</span>
              </div>

              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div
                  className="bg-yellow-600 h-2.5 rounded-full"
                  style={{ width: `${(stats?.typeBreakdown.Exercise / stats?.total) * 100}%` }}
                ></div>
              </div>
              <div className="flex justify-between text-xs">
                <span>Exercise ({stats?.typeBreakdown.Exercise})</span>
                <span>{Math.round((stats?.typeBreakdown.Exercise / stats?.total) * 100)}%</span>
              </div>

              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div
                  className="bg-purple-600 h-2.5 rounded-full"
                  style={{ width: `${(stats?.typeBreakdown.Hydration / stats?.total) * 100}%` }}
                ></div>
              </div>
              <div className="flex justify-between text-xs">
                <span>Hydration ({stats?.typeBreakdown.Hydration})</span>
                <span>{Math.round((stats?.typeBreakdown.Hydration / stats?.total) * 100)}%</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

