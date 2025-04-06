// Enhanced database implementation with CSV file support and additional functionality

import fs from "fs"
import { parse } from "csv-parse/sync"
// Health data structure
export type HealthData = {
  deviceId: string
  timestamp: string
  heartRate: number
  heartRateAlert: boolean
  bloodPressure: string
  bloodPressureAlert: boolean
  glucoseLevels: number
  glucoseLevelsAlert: boolean
  oxygenSaturation: number
  oxygenSaturationAlert: boolean
  alertTriggered: boolean
  caregiverNotified: boolean
}

// Safety data structure
export type SafetyData = {
  deviceId: string
  timestamp: string
  movementActivity: string
  fallDetected: boolean
  impactForceLevel: string
  postFallInactivityDuration: number
  location: string
  alertTriggered: boolean
  caregiverNotified: boolean
}

// Reminder data structure
export type ReminderData = {
  deviceId: string
  timestamp: string
  reminderType: string
  scheduledTime: string
  reminderSent: boolean
  acknowledged: boolean
  title?: string // Optional title for the reminder
  feedback?: string // User feedback on the reminder
  contextualTrigger?: string // e.g., "after lunch", "before bedtime"
}

// Behavioral pattern data structure
export type BehavioralPattern = {
  deviceId: string
  patternType: string // e.g., "sleep", "meal", "medication", "activity"
  startTime: string
  endTime: string
  daysOfWeek: string[] // e.g., ["Monday", "Wednesday", "Friday"]
  location: string
  confidence: number // 0-1 value indicating confidence in this pattern
  lastUpdated: string
}

// Gait analysis data structure
export type GaitData = {
  deviceId: string
  timestamp: string
  stepLength: number
  stepTime: number
  stepVariability: number
  walkingSpeed: number
  turnTime: number
  riskScore: number // 0-100 score indicating fall risk
}

class Database {
  private db: any = null
  private healthData: HealthData[] = []
  private safetyData: SafetyData[] = []
  private reminderData: ReminderData[] = []
  private behavioralPatterns: BehavioralPattern[] = []
  private gaitData: GaitData[] = []

  constructor() {
    // Initialize with hardcoded data for now
    this.loadMockData()
  }

  private loadMockData() {
    // Mock health data
    this.healthData = [
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
        alertTriggered: true,
        caregiverNotified: true,
      },
      {
        deviceId: "D1001",
        timestamp: "1/16/2025 12:22",
        heartRate: 119,
        heartRateAlert: true,
        bloodPressure: "105/77 mmHg",
        bloodPressureAlert: false,
        glucoseLevels: 146,
        glucoseLevelsAlert: true,
        oxygenSaturation: 93,
        oxygenSaturationAlert: false,
        alertTriggered: true,
        caregiverNotified: true,
      },
      {
        deviceId: "D1002",
        timestamp: "1/10/2025 9:26",
        heartRate: 97,
        heartRateAlert: false,
        bloodPressure: "120/87 mmHg",
        bloodPressureAlert: true,
        glucoseLevels: 133,
        glucoseLevelsAlert: false,
        oxygenSaturation: 97,
        oxygenSaturationAlert: false,
        alertTriggered: true,
        caregiverNotified: true,
      },
      {
        deviceId: "D1003",
        timestamp: "1/10/2025 9:53",
        heartRate: 113,
        heartRateAlert: true,
        bloodPressure: "138/65 mmHg",
        bloodPressureAlert: true,
        glucoseLevels: 82,
        glucoseLevelsAlert: false,
        oxygenSaturation: 98,
        oxygenSaturationAlert: false,
        alertTriggered: true,
        caregiverNotified: true,
      },
      {
        deviceId: "D1004",
        timestamp: "1/3/2025 15:50",
        heartRate: 88,
        heartRateAlert: false,
        bloodPressure: "108/69 mmHg",
        bloodPressureAlert: false,
        glucoseLevels: 146,
        glucoseLevelsAlert: true,
        oxygenSaturation: 97,
        oxygenSaturationAlert: false,
        alertTriggered: true,
        caregiverNotified: true,
      },
      {
        deviceId: "D1005",
        timestamp: "1/5/2025 8:29",
        heartRate: 119,
        heartRateAlert: true,
        bloodPressure: "114/65 mmHg",
        bloodPressureAlert: false,
        glucoseLevels: 133,
        glucoseLevelsAlert: false,
        oxygenSaturation: 91,
        oxygenSaturationAlert: true,
        alertTriggered: true,
        caregiverNotified: true,
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
        alertTriggered: true,
        caregiverNotified: true,
      },
      {
        deviceId: "D1007",
        timestamp: "1/10/2025 16:51",
        heartRate: 114,
        heartRateAlert: true,
        bloodPressure: "119/61 mmHg",
        bloodPressureAlert: false,
        glucoseLevels: 107,
        glucoseLevelsAlert: false,
        oxygenSaturation: 99,
        oxygenSaturationAlert: false,
        alertTriggered: true,
        caregiverNotified: true,
      },
      {
        deviceId: "D1008",
        timestamp: "1/20/2025 12:22",
        heartRate: 101,
        heartRateAlert: true,
        bloodPressure: "117/61 mmHg",
        bloodPressureAlert: false,
        glucoseLevels: 134,
        glucoseLevelsAlert: false,
        oxygenSaturation: 97,
        oxygenSaturationAlert: false,
        alertTriggered: true,
        caregiverNotified: true,
      },
      {
        deviceId: "D1009",
        timestamp: "1/23/2025 16:54",
        heartRate: 88,
        heartRateAlert: false,
        bloodPressure: "101/76 mmHg",
        bloodPressureAlert: false,
        glucoseLevels: 133,
        glucoseLevelsAlert: false,
        oxygenSaturation: 94,
        oxygenSaturationAlert: false,
        alertTriggered: false,
        caregiverNotified: false,
      },
      {
        deviceId: "D1010",
        timestamp: "1/29/2025 17:52",
        heartRate: 61,
        heartRateAlert: false,
        bloodPressure: "110/61 mmHg",
        bloodPressureAlert: false,
        glucoseLevels: 72,
        glucoseLevelsAlert: true,
        oxygenSaturation: 98,
        oxygenSaturationAlert: false,
        alertTriggered: true,
        caregiverNotified: true,
      },
      {
        deviceId: "D1011",
        timestamp: "1/23/2025 15:03",
        heartRate: 89,
        heartRateAlert: false,
        bloodPressure: "121/70 mmHg",
        bloodPressureAlert: false,
        glucoseLevels: 129,
        glucoseLevelsAlert: false,
        oxygenSaturation: 91,
        oxygenSaturationAlert: true,
        alertTriggered: true,
        caregiverNotified: true,
      },
      {
        deviceId: "D1012",
        timestamp: "1/11/2025 10:32",
        heartRate: 105,
        heartRateAlert: true,
        bloodPressure: "111/74 mmHg",
        bloodPressureAlert: false,
        glucoseLevels: 145,
        glucoseLevelsAlert: true,
        oxygenSaturation: 93,
        oxygenSaturationAlert: false,
        alertTriggered: true,
        caregiverNotified: true,
      },
      {
        deviceId: "D1013",
        timestamp: "1/14/2025 19:53",
        heartRate: 69,
        heartRateAlert: false,
        bloodPressure: "127/80 mmHg",
        bloodPressureAlert: false,
        glucoseLevels: 128,
        glucoseLevelsAlert: false,
        oxygenSaturation: 95,
        oxygenSaturationAlert: false,
        alertTriggered: false,
        caregiverNotified: false,
      },
      {
        deviceId: "D1014",
        timestamp: "1/13/2025 10:53",
        heartRate: 63,
        heartRateAlert: false,
        bloodPressure: "114/82 mmHg",
        bloodPressureAlert: false,
        glucoseLevels: 140,
        glucoseLevelsAlert: false,
        oxygenSaturation: 91,
        oxygenSaturationAlert: true,
        alertTriggered: true,
        caregiverNotified: true,
      },
      {
        deviceId: "D1015",
        timestamp: "1/14/2025 5:57",
        heartRate: 63,
        heartRateAlert: false,
        bloodPressure: "136/68 mmHg",
        bloodPressureAlert: true,
        glucoseLevels: 74,
        glucoseLevelsAlert: true,
        oxygenSaturation: 99,
        oxygenSaturationAlert: false,
        alertTriggered: true,
        caregiverNotified: true,
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
        alertTriggered: true,
        caregiverNotified: true,
      },
      {
        deviceId: "D1017",
        timestamp: "1/17/2025 7:26",
        heartRate: 64,
        heartRateAlert: false,
        bloodPressure: "107/89 mmHg",
        bloodPressureAlert: true,
        glucoseLevels: 102,
        glucoseLevelsAlert: false,
        oxygenSaturation: 91,
        oxygenSaturationAlert: true,
        alertTriggered: true,
        caregiverNotified: true,
      },
      {
        deviceId: "D1018",
        timestamp: "1/6/2025 3:14",
        heartRate: 115,
        heartRateAlert: true,
        bloodPressure: "125/77 mmHg",
        bloodPressureAlert: false,
        glucoseLevels: 103,
        glucoseLevelsAlert: false,
        oxygenSaturation: 99,
        oxygenSaturationAlert: false,
        alertTriggered: true,
        caregiverNotified: true,
      },
      {
        deviceId: "D1019",
        timestamp: "1/5/2025 14:00",
        heartRate: 118,
        heartRateAlert: true,
        bloodPressure: "134/62 mmHg",
        bloodPressureAlert: true,
        glucoseLevels: 104,
        glucoseLevelsAlert: false,
        oxygenSaturation: 95,
        oxygenSaturationAlert: false,
        alertTriggered: true,
        caregiverNotified: true,
      },
      {
        deviceId: "D1020",
        timestamp: "1/20/2025 15:30",
        heartRate: 69,
        heartRateAlert: false,
        bloodPressure: "136/69 mmHg",
        bloodPressureAlert: true,
        glucoseLevels: 147,
        glucoseLevelsAlert: true,
        oxygenSaturation: 95,
        oxygenSaturationAlert: false,
        alertTriggered: true,
        caregiverNotified: true,
      },
      {
        deviceId: "D1021",
        timestamp: "1/8/2025 9:47",
        heartRate: 117,
        heartRateAlert: true,
        bloodPressure: "109/90 mmHg",
        bloodPressureAlert: true,
        glucoseLevels: 135,
        glucoseLevelsAlert: false,
        oxygenSaturation: 96,
        oxygenSaturationAlert: false,
        alertTriggered: true,
        caregiverNotified: true,
      },
    ]

    // Mock safety data
    this.safetyData = [
      {
        deviceId: "D1000",
        timestamp: "1/7/2025 16:04",
        movementActivity: "No Movement",
        fallDetected: false,
        impactForceLevel: "-",
        postFallInactivityDuration: 0,
        location: "Kitchen",
        alertTriggered: false,
        caregiverNotified: false,
      },
      {
        deviceId: "D1001",
        timestamp: "1/20/2025 15:45",
        movementActivity: "Lying",
        fallDetected: false,
        impactForceLevel: "-",
        postFallInactivityDuration: 0,
        location: "Living Room",
        alertTriggered: false,
        caregiverNotified: false,
      },
      {
        deviceId: "D1002",
        timestamp: "1/2/2025 2:42",
        movementActivity: "No Movement",
        fallDetected: false,
        impactForceLevel: "-",
        postFallInactivityDuration: 0,
        location: "Bedroom",
        alertTriggered: false,
        caregiverNotified: false,
      },
      {
        deviceId: "D1003",
        timestamp: "1/1/2025 22:36",
        movementActivity: "Lying",
        fallDetected: false,
        impactForceLevel: "-",
        postFallInactivityDuration: 0,
        location: "Kitchen",
        alertTriggered: false,
        caregiverNotified: false,
      },
      {
        deviceId: "D1004",
        timestamp: "1/3/2025 16:30",
        movementActivity: "No Movement",
        fallDetected: false,
        impactForceLevel: "-",
        postFallInactivityDuration: 0,
        location: "Bedroom",
        alertTriggered: false,
        caregiverNotified: false,
      },
      {
        deviceId: "D1005",
        timestamp: "1/19/2025 12:13",
        movementActivity: "Sitting",
        fallDetected: false,
        impactForceLevel: "-",
        postFallInactivityDuration: 0,
        location: "Bedroom",
        alertTriggered: false,
        caregiverNotified: false,
      },
      {
        deviceId: "D1006",
        timestamp: "1/4/2025 10:58",
        movementActivity: "Lying",
        fallDetected: false,
        impactForceLevel: "-",
        postFallInactivityDuration: 0,
        location: "Bathroom",
        alertTriggered: false,
        caregiverNotified: false,
      },
      {
        deviceId: "D1007",
        timestamp: "1/21/2025 7:31",
        movementActivity: "Lying",
        fallDetected: false,
        impactForceLevel: "-",
        postFallInactivityDuration: 0,
        location: "Bedroom",
        alertTriggered: false,
        caregiverNotified: false,
      },
      {
        deviceId: "D1008",
        timestamp: "1/10/2025 23:56",
        movementActivity: "Sitting",
        fallDetected: false,
        impactForceLevel: "-",
        postFallInactivityDuration: 0,
        location: "Kitchen",
        alertTriggered: false,
        caregiverNotified: false,
      },
      {
        deviceId: "D1009",
        timestamp: "1/4/2025 16:16",
        movementActivity: "Sitting",
        fallDetected: false,
        impactForceLevel: "-",
        postFallInactivityDuration: 0,
        location: "Kitchen",
        alertTriggered: false,
        caregiverNotified: false,
      },
      {
        deviceId: "D1010",
        timestamp: "1/13/2025 7:05",
        movementActivity: "Walking",
        fallDetected: false,
        impactForceLevel: "-",
        postFallInactivityDuration: 0,
        location: "Bedroom",
        alertTriggered: false,
        caregiverNotified: false,
      },
      {
        deviceId: "D1011",
        timestamp: "1/9/2025 6:32",
        movementActivity: "Sitting",
        fallDetected: false,
        impactForceLevel: "-",
        postFallInactivityDuration: 0,
        location: "Bathroom",
        alertTriggered: false,
        caregiverNotified: false,
      },
      {
        deviceId: "D1012",
        timestamp: "1/1/2025 22:34",
        movementActivity: "No Movement",
        fallDetected: false,
        impactForceLevel: "-",
        postFallInactivityDuration: 0,
        location: "Kitchen",
        alertTriggered: false,
        caregiverNotified: false,
      },
      {
        deviceId: "D1013",
        timestamp: "1/17/2025 10:52",
        movementActivity: "Walking",
        fallDetected: false,
        impactForceLevel: "-",
        postFallInactivityDuration: 0,
        location: "Living Room",
        alertTriggered: false,
        caregiverNotified: false,
      },
      {
        deviceId: "D1014",
        timestamp: "1/29/2025 1:59",
        movementActivity: "Walking",
        fallDetected: false,
        impactForceLevel: "-",
        postFallInactivityDuration: 0,
        location: "Bedroom",
        alertTriggered: false,
        caregiverNotified: false,
      },
      {
        deviceId: "D1015",
        timestamp: "1/23/2025 2:14",
        movementActivity: "Sitting",
        fallDetected: false,
        impactForceLevel: "-",
        postFallInactivityDuration: 0,
        location: "Bedroom",
        alertTriggered: false,
        caregiverNotified: false,
      },
      {
        deviceId: "D1016",
        timestamp: "1/13/2025 10:48",
        movementActivity: "Walking",
        fallDetected: false,
        impactForceLevel: "-",
        postFallInactivityDuration: 0,
        location: "Living Room",
        alertTriggered: false,
        caregiverNotified: false,
      },
      {
        deviceId: "D1017",
        timestamp: "1/4/2025 12:16",
        movementActivity: "Sitting",
        fallDetected: false,
        impactForceLevel: "-",
        postFallInactivityDuration: 0,
        location: "Bathroom",
        alertTriggered: false,
        caregiverNotified: false,
      },
      {
        deviceId: "D1018",
        timestamp: "1/6/2025 8:18",
        movementActivity: "No Movement",
        fallDetected: false,
        impactForceLevel: "-",
        postFallInactivityDuration: 0,
        location: "Living Room",
        alertTriggered: false,
        caregiverNotified: false,
      },
      {
        deviceId: "D1019",
        timestamp: "1/11/2025 21:01",
        movementActivity: "Sitting",
        fallDetected: false,
        impactForceLevel: "-",
        postFallInactivityDuration: 0,
        location: "Living Room",
        alertTriggered: false,
        caregiverNotified: false,
      },
      {
        deviceId: "D1020",
        timestamp: "1/1/2025 16:18",
        movementActivity: "Walking",
        fallDetected: false,
        impactForceLevel: "-",
        postFallInactivityDuration: 0,
        location: "Bathroom",
        alertTriggered: false,
        caregiverNotified: false,
      },
      {
        deviceId: "D1021",
        timestamp: "1/20/2025 17:34",
        movementActivity: "Walking",
        fallDetected: false,
        impactForceLevel: "-",
        postFallInactivityDuration: 0,
        location: "Living Room",
        alertTriggered: false,
        caregiverNotified: false,
      },
      {
        deviceId: "D1022",
        timestamp: "1/19/2025 19:46",
        movementActivity: "No Movement",
        fallDetected: true,
        impactForceLevel: "Medium",
        postFallInactivityDuration: 463,
        location: "Bathroom",
        alertTriggered: true,
        caregiverNotified: true,
      },
    ]

    // Mock reminder data
    this.reminderData = [
      {
        deviceId: "D1000",
        timestamp: "1/2/2025 11:25",
        reminderType: "Exercise",
        scheduledTime: "13:00:00",
        reminderSent: false,
        acknowledged: false,
        title: "Morning Walk",
        contextualTrigger: "after breakfast",
      },
      {
        deviceId: "D1001",
        timestamp: "1/3/2025 2:52",
        reminderType: "Hydration",
        scheduledTime: "13:00:00",
        reminderSent: true,
        acknowledged: true,
        title: "Drink Water",
        contextualTrigger: "after lunch",
      },
      {
        deviceId: "D1002",
        timestamp: "1/8/2025 13:50",
        reminderType: "Appointment",
        scheduledTime: "13:30:00",
        reminderSent: false,
        acknowledged: false,
        title: "Doctor Appointment",
        contextualTrigger: "specific time",
      },
      {
        deviceId: "D1003",
        timestamp: "1/5/2025 5:16",
        reminderType: "Exercise",
        scheduledTime: "8:00:00",
        reminderSent: false,
        acknowledged: false,
        title: "Stretching Routine",
        contextualTrigger: "after waking up",
      },
      {
        deviceId: "D1004",
        timestamp: "1/1/2025 4:20",
        reminderType: "Medication",
        scheduledTime: "11:30:00",
        reminderSent: false,
        acknowledged: false,
        title: "Blood Pressure Medication",
        contextualTrigger: "before lunch",
      },
      {
        deviceId: "D1005",
        timestamp: "1/20/2025 10:39",
        reminderType: "Hydration",
        scheduledTime: "14:30:00",
        reminderSent: false,
        acknowledged: false,
        title: "Drink Water",
        contextualTrigger: "afternoon",
      },
      {
        deviceId: "D1006",
        timestamp: "1/25/2025 10:05",
        reminderType: "Medication",
        scheduledTime: "15:30:00",
        reminderSent: false,
        acknowledged: false,
        title: "Heart Medication",
        contextualTrigger: "after nap",
      },
      {
        deviceId: "D1007",
        timestamp: "1/2/2025 21:13",
        reminderType: "Appointment",
        scheduledTime: "22:00:00",
        reminderSent: true,
        acknowledged: false,
        title: "Family Video Call",
        contextualTrigger: "evening",
      },
      {
        deviceId: "D1008",
        timestamp: "1/21/2025 15:25",
        reminderType: "Medication",
        scheduledTime: "12:30:00",
        reminderSent: false,
        acknowledged: false,
        title: "Diabetes Medication",
        contextualTrigger: "with lunch",
      },
      {
        deviceId: "D1009",
        timestamp: "1/15/2025 2:47",
        reminderType: "Exercise",
        scheduledTime: "20:30:00",
        reminderSent: true,
        acknowledged: true,
        title: "Evening Walk",
        contextualTrigger: "after dinner",
      },
      {
        deviceId: "D1010",
        timestamp: "1/24/2025 13:58",
        reminderType: "Appointment",
        scheduledTime: "20:00:00",
        reminderSent: true,
        acknowledged: true,
        title: "Physical Therapy",
        contextualTrigger: "specific time",
      },
      {
        deviceId: "D1011",
        timestamp: "1/10/2025 6:39",
        reminderType: "Exercise",
        scheduledTime: "12:30:00",
        reminderSent: true,
        acknowledged: true,
        title: "Yoga Session",
        contextualTrigger: "before lunch",
      },
      {
        deviceId: "D1012",
        timestamp: "1/25/2025 1:18",
        reminderType: "Appointment",
        scheduledTime: "10:30:00",
        reminderSent: false,
        acknowledged: false,
        title: "Dentist Appointment",
        contextualTrigger: "specific time",
      },
      {
        deviceId: "D1013",
        timestamp: "1/6/2025 12:23",
        reminderType: "Appointment",
        scheduledTime: "20:30:00",
        reminderSent: false,
        acknowledged: false,
        title: "Family Visit",
        contextualTrigger: "evening",
      },
      {
        deviceId: "D1014",
        timestamp: "1/26/2025 14:14",
        reminderType: "Hydration",
        scheduledTime: "13:00:00",
        reminderSent: false,
        acknowledged: false,
        title: "Drink Water",
        contextualTrigger: "afternoon",
      },
      {
        deviceId: "D1015",
        timestamp: "1/7/2025 9:45",
        reminderType: "Hydration",
        scheduledTime: "13:00:00",
        reminderSent: false,
        acknowledged: false,
        title: "Drink Water",
        contextualTrigger: "after lunch",
      },
      {
        deviceId: "D1016",
        timestamp: "1/8/2025 19:04",
        reminderType: "Appointment",
        scheduledTime: "7:30:00",
        reminderSent: true,
        acknowledged: true,
        title: "Lab Test",
        contextualTrigger: "morning",
      },
      {
        deviceId: "D1017",
        timestamp: "1/21/2025 18:14",
        reminderType: "Appointment",
        scheduledTime: "19:30:00",
        reminderSent: true,
        acknowledged: true,
        title: "Support Group",
        contextualTrigger: "evening",
      },
      {
        deviceId: "D1018",
        timestamp: "1/18/2025 22:50",
        reminderType: "Medication",
        scheduledTime: "16:00:00",
        reminderSent: false,
        acknowledged: false,
        title: "Evening Medication",
        contextualTrigger: "before dinner",
      },
    ]

    // Mock behavioral patterns
    this.behavioralPatterns = [
      {
        deviceId: "D1000",
        patternType: "sleep",
        startTime: "22:00:00",
        endTime: "07:00:00",
        daysOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
        location: "Bedroom",
        confidence: 0.92,
        lastUpdated: "1/30/2025",
      },
      {
        deviceId: "D1000",
        patternType: "meal",
        startTime: "08:00:00",
        endTime: "08:30:00",
        daysOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
        location: "Kitchen",
        confidence: 0.85,
        lastUpdated: "1/30/2025",
      },
      {
        deviceId: "D1000",
        patternType: "meal",
        startTime: "12:30:00",
        endTime: "13:15:00",
        daysOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
        location: "Kitchen",
        confidence: 0.78,
        lastUpdated: "1/30/2025",
      },
      {
        deviceId: "D1000",
        patternType: "meal",
        startTime: "18:00:00",
        endTime: "18:45:00",
        daysOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
        location: "Kitchen",
        confidence: 0.88,
        lastUpdated: "1/30/2025",
      },
      {
        deviceId: "D1000",
        patternType: "bathroom",
        startTime: "07:15:00",
        endTime: "07:30:00",
        daysOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
        location: "Bathroom",
        confidence: 0.95,
        lastUpdated: "1/30/2025",
      },
      {
        deviceId: "D1000",
        patternType: "bathroom",
        startTime: "13:30:00",
        endTime: "13:40:00",
        daysOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
        location: "Bathroom",
        confidence: 0.82,
        lastUpdated: "1/30/2025",
      },
      {
        deviceId: "D1000",
        patternType: "bathroom",
        startTime: "19:00:00",
        endTime: "19:15:00",
        daysOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
        location: "Bathroom",
        confidence: 0.87,
        lastUpdated: "1/30/2025",
      },
      {
        deviceId: "D1000",
        patternType: "activity",
        startTime: "09:30:00",
        endTime: "10:30:00",
        daysOfWeek: ["Monday", "Wednesday", "Friday"],
        location: "Living Room",
        confidence: 0.75,
        lastUpdated: "1/30/2025",
      },
      {
        deviceId: "D1000",
        patternType: "activity",
        startTime: "15:00:00",
        endTime: "16:00:00",
        daysOfWeek: ["Tuesday", "Thursday", "Saturday"],
        location: "Living Room",
        confidence: 0.72,
        lastUpdated: "1/30/2025",
      },
      {
        deviceId: "D1000",
        patternType: "nap",
        startTime: "14:00:00",
        endTime: "15:00:00",
        daysOfWeek: ["Monday", "Wednesday", "Friday", "Sunday"],
        location: "Bedroom",
        confidence: 0.68,
        lastUpdated: "1/30/2025",
      },
    ]

    // Mock gait data
    this.gaitData = [
      {
        deviceId: "D1000",
        timestamp: "1/2/2025 09:30:00",
        stepLength: 0.58,
        stepTime: 0.62,
        stepVariability: 0.12,
        walkingSpeed: 0.94,
        turnTime: 2.8,
        riskScore: 25,
      },
      {
        deviceId: "D1000",
        timestamp: "1/5/2025 10:15:00",
        stepLength: 0.56,
        stepTime: 0.65,
        stepVariability: 0.14,
        walkingSpeed: 0.86,
        turnTime: 3.1,
        riskScore: 28,
      },
      {
        deviceId: "D1000",
        timestamp: "1/9/2025 15:45:00",
        stepLength: 0.54,
        stepTime: 0.68,
        stepVariability: 0.15,
        walkingSpeed: 0.79,
        turnTime: 3.4,
        riskScore: 35,
      },
      {
        deviceId: "D1000",
        timestamp: "1/12/2025 09:20:00",
        stepLength: 0.52,
        stepTime: 0.7,
        stepVariability: 0.18,
        walkingSpeed: 0.74,
        turnTime: 3.7,
        riskScore: 42,
      },
      {
        deviceId: "D1000",
        timestamp: "1/16/2025 14:30:00",
        stepLength: 0.5,
        stepTime: 0.72,
        stepVariability: 0.2,
        walkingSpeed: 0.69,
        turnTime: 4.0,
        riskScore: 48,
      },
      {
        deviceId: "D1000",
        timestamp: "1/20/2025 10:10:00",
        stepLength: 0.48,
        stepTime: 0.75,
        stepVariability: 0.22,
        walkingSpeed: 0.64,
        turnTime: 4.3,
        riskScore: 55,
      },
      {
        deviceId: "D1000",
        timestamp: "1/24/2025 16:00:00",
        stepLength: 0.46,
        stepTime: 0.78,
        stepVariability: 0.25,
        walkingSpeed: 0.59,
        turnTime: 4.8,
        riskScore: 62,
      },
      {
        deviceId: "D1000",
        timestamp: "1/28/2025 11:45:00",
        stepLength: 0.44,
        stepTime: 0.82,
        stepVariability: 0.28,
        walkingSpeed: 0.54,
        turnTime: 5.2,
        riskScore: 70,
      },
    ]
  }

  // Initialize SQLite database
  async initializeDb() {
    // Skip database initialization in browser environment
    if (typeof window !== "undefined") {
      console.log("SQLite initialization skipped in browser environment")
      return
    }

    if (this.db) return

    try {
      this.db = await open({
        filename: "./elderly_care.db",
        driver: sqlite3.Database,
      })

      // Create tables if they don't exist
      await this.db.exec(`
        CREATE TABLE IF NOT EXISTS health_data (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          device_id TEXT NOT NULL,
          timestamp TEXT NOT NULL,
          heart_rate INTEGER,
          heart_rate_alert INTEGER,
          blood_pressure TEXT,
          blood_pressure_alert INTEGER,
          glucose_levels INTEGER,
          glucose_levels_alert INTEGER,
          oxygen_saturation INTEGER,
          oxygen_saturation_alert INTEGER,
          alert_triggered INTEGER,
          caregiver_notified INTEGER
        );
        
        CREATE TABLE IF NOT EXISTS safety_data (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          device_id TEXT NOT NULL,
          timestamp TEXT NOT NULL,
          movement_activity TEXT,
          fall_detected INTEGER,
          impact_force_level TEXT,
          post_fall_inactivity_duration INTEGER,
          location TEXT,
          alert_triggered INTEGER,
          caregiver_notified INTEGER
        );
        
        CREATE TABLE IF NOT EXISTS reminder_data (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          device_id TEXT NOT NULL,
          timestamp TEXT NOT NULL,
          reminder_type TEXT,
          scheduled_time TEXT,
          reminder_sent INTEGER,
          acknowledged INTEGER,
          title TEXT,
          feedback TEXT,
          contextual_trigger TEXT
        );
        
        CREATE TABLE IF NOT EXISTS behavioral_patterns (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          device_id TEXT NOT NULL,
          pattern_type TEXT,
          start_time TEXT,
          end_time TEXT,
          days_of_week TEXT,
          location TEXT,
          confidence REAL,
          last_updated TEXT
        );
        
        CREATE TABLE IF NOT EXISTS gait_data (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          device_id TEXT NOT NULL,
          timestamp TEXT NOT NULL,
          step_length REAL,
          step_time REAL,
          step_variability REAL,
          walking_speed REAL,
          turn_time REAL,
          risk_score INTEGER
        );
      `)

      // Import data from CSV files if available
      await this.importCsvData()
    } catch (error) {
      console.error("Error initializing SQLite database:", error)
      this.db = null
    }
  }

  // Import data from CSV files
  async importCsvData() {
    // Skip in browser environment
    if (typeof window !== "undefined" || !this.db) {
      return
    }

    try {
      // Check if CSV files exist and import them
      const csvPaths = {
        health: "./data/health.csv",
        safety: "./data/safety.csv",
        reminders: "./data/reminders.csv",
      }

      // Import health data
      if (fs.existsSync(csvPaths.health)) {
        const content = fs.readFileSync(csvPaths.health, "utf8")
        const records = parse(content, { columns: true, skip_empty_lines: true })

        for (const record of records) {
          await this.db.run(
            `
            INSERT INTO health_data (
              device_id, timestamp, heart_rate, heart_rate_alert, blood_pressure, 
              blood_pressure_alert, glucose_levels, glucose_levels_alert, 
              oxygen_saturation, oxygen_saturation_alert, alert_triggered, caregiver_notified
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
          `,
            [
              record["Device-ID/User-ID"],
              record["Timestamp"],
              Number.parseInt(record["Heart Rate"]),
              record["Heart Rate Below/Above Threshold (Yes/No)"] === "Yes" ? 1 : 0,
              record["Blood Pressure"],
              record["Blood Pressure Below/Above Threshold (Yes/No)"] === "Yes" ? 1 : 0,
              Number.parseInt(record["Glucose Levels"]),
              record["Glucose Levels Below/Above Threshold (Yes/No)"] === "Yes" ? 1 : 0,
              Number.parseInt(record["Oxygen Saturation (SpO₂%)"]),
              record["SpO₂ Below Threshold (Yes/No)"] === "Yes" ? 1 : 0,
              record["Alert Triggered (Yes/No)"] === "Yes" ? 1 : 0,
              record["Caregiver Notified (Yes/No)"] === "Yes" ? 1 : 0,
            ],
          )
        }

        console.log(`Imported ${records.length} health records from CSV`)
      }

      // Import safety data
      if (fs.existsSync(csvPaths.safety)) {
        const content = fs.readFileSync(csvPaths.safety, "utf8")
        const records = parse(content, { columns: true, skip_empty_lines: true })

        for (const record of records) {
          await this.db.run(
            `
            INSERT INTO safety_data (
              device_id, timestamp, movement_activity, fall_detected, impact_force_level,
              post_fall_inactivity_duration, location, alert_triggered, caregiver_notified
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
          `,
            [
              record["Device-ID/User-ID"],
              record["Timestamp"],
              record["Movement Activity"],
              record["Fall Detected (Yes/No)"] === "Yes" ? 1 : 0,
              record["Impact Force Level"],
              Number.parseInt(record["Post-Fall Inactivity Duration (Seconds)"] || "0"),
              record["Location"],
              record["Alert Triggered (Yes/No)"] === "Yes" ? 1 : 0,
              record["Caregiver Notified (Yes/No)"] === "Yes" ? 1 : 0,
            ],
          )
        }

        console.log(`Imported ${records.length} safety records from CSV`)
      }

      // Import reminder data
      if (fs.existsSync(csvPaths.reminders)) {
        const content = fs.readFileSync(csvPaths.reminders, "utf8")
        const records = parse(content, { columns: true, skip_empty_lines: true })

        for (const record of records) {
          await this.db.run(
            `
            INSERT INTO reminder_data (
              device_id, timestamp, reminder_type, scheduled_time, 
              reminder_sent, acknowledged
            ) VALUES (?, ?, ?, ?, ?, ?)
          `,
            [
              record["Device-ID/User-ID"],
              record["Timestamp"],
              record["Reminder Type"],
              record["Scheduled Time"],
              record["Reminder Sent (Yes/No)"] === "Yes" ? 1 : 0,
              record["Acknowledged (Yes/No)"] === "Yes" ? 1 : 0,
            ],
          )
        }

        console.log(`Imported ${records.length} reminder records from CSV`)
      }
    } catch (error) {
      console.error("Error importing CSV data:", error)
    }
  }

  // Export data to CSV files
  async exportToCsv() {
    try {
      // Create data directory if it doesn't exist
      if (!fs.existsSync("./data")) {
        fs.mkdirSync("./data")
      }

      // Export health data
      const healthData = await this.getHealthData()
      const healthCsv = [
        "Device-ID/User-ID,Timestamp,Heart Rate,Heart Rate Below/Above Threshold (Yes/No),Blood Pressure,Blood Pressure Below/Above Threshold (Yes/No),Glucose Levels,Glucose Levels Below/Above Threshold (Yes/No),Oxygen Saturation (SpO₂%),SpO₂ Below Threshold (Yes/No),Alert Triggered (Yes/No),Caregiver Notified (Yes/No)",
      ]

      healthData.forEach((data) => {
        healthCsv.push(
          `${data.deviceId},${data.timestamp},${data.heartRate},${data.heartRateAlert ? "Yes" : "No"},${data.bloodPressure},${data.bloodPressureAlert ? "Yes" : "No"},${data.glucoseLevels},${data.glucoseLevelsAlert ? "Yes" : "No"},${data.oxygenSaturation},${data.oxygenSaturationAlert ? "Yes" : "No"},${data.alertTriggered ? "Yes" : "No"},${data.caregiverNotified ? "Yes" : "No"}`,
        )
      })

      fs.writeFileSync("./data/health_export.csv", healthCsv.join("\n"))

      // Export safety data
      const safetyData = await this.getSafetyData()
      const safetyCsv = [
        "Device-ID/User-ID,Timestamp,Movement Activity,Fall Detected (Yes/No),Impact Force Level,Post-Fall Inactivity Duration (Seconds),Location,Alert Triggered (Yes/No),Caregiver Notified (Yes/No)",
      ]

      safetyData.forEach((data) => {
        safetyCsv.push(
          `${data.deviceId},${data.timestamp},${data.movementActivity},${data.fallDetected ? "Yes" : "No"},${data.impactForceLevel},${data.postFallInactivityDuration},${data.location},${data.alertTriggered ? "Yes" : "No"},${data.caregiverNotified ? "Yes" : "No"}`,
        )
      })

      fs.writeFileSync("./data/safety_export.csv", safetyCsv.join("\n"))

      // Export reminder data
      const reminderData = await this.getReminderData()
      const reminderCsv = [
        "Device-ID/User-ID,Timestamp,Reminder Type,Scheduled Time,Reminder Sent (Yes/No),Acknowledged (Yes/No),Title,Contextual Trigger",
      ]

      reminderData.forEach((data) => {
        reminderCsv.push(
          `${data.deviceId},${data.timestamp},${data.reminderType},${data.scheduledTime},${data.reminderSent ? "Yes" : "No"},${data.acknowledged ? "Yes" : "No"},${data.title || ""},${data.contextualTrigger || ""}`,
        )
      })

      fs.writeFileSync("./data/reminders_export.csv", reminderCsv.join("\n"))

      console.log("Data exported to CSV files successfully")
      return true
    } catch (error) {
      console.error("Error exporting data to CSV:", error)
      return false
    }
  }

  // Health data methods
  async getHealthData(deviceId?: string, limit = 50) {
    if (this.db) {
      // Use SQLite if initialized
      const query = deviceId
        ? `SELECT * FROM health_data WHERE device_id = ? ORDER BY timestamp DESC LIMIT ?`
        : `SELECT * FROM health_data ORDER BY timestamp DESC LIMIT ?`

      const params = deviceId ? [deviceId, limit] : [limit]
      const rows = await this.db.all(query, params)

      return rows.map((row) => ({
        deviceId: row.device_id,
        timestamp: row.timestamp,
        heartRate: row.heart_rate,
        heartRateAlert: !!row.heart_rate_alert,
        bloodPressure: row.blood_pressure,
        bloodPressureAlert: !!row.blood_pressure_alert,
        glucoseLevels: row.glucose_levels,
        glucoseLevelsAlert: !!row.glucose_levels_alert,
        oxygenSaturation: row.oxygen_saturation,
        oxygenSaturationAlert: !!row.oxygen_saturation_alert,
        alertTriggered: !!row.alert_triggered,
        caregiverNotified: !!row.caregiver_notified,
      }))
    } else {
      // Use in-memory data
      let filteredData = this.healthData

      if (deviceId) {
        filteredData = filteredData.filter((data) => data.deviceId === deviceId)
      }

      return filteredData
        .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
        .slice(0, limit)
    }
  }

  async getHealthDataByTimestamp(timestamp: string) {
    if (this.db) {
      const row = await this.db.get(`SELECT * FROM health_data WHERE timestamp = ?`, [timestamp])

      if (!row) return null

      return {
        deviceId: row.device_id,
        timestamp: row.timestamp,
        heartRate: row.heart_rate,
        heartRateAlert: !!row.heart_rate_alert,
        bloodPressure: row.blood_pressure,
        bloodPressureAlert: !!row.blood_pressure_alert,
        glucoseLevels: row.glucose_levels,
        glucoseLevelsAlert: !!row.glucose_levels_alert,
        oxygenSaturation: row.oxygen_saturation,
        oxygenSaturationAlert: !!row.oxygen_saturation_alert,
        alertTriggered: !!row.alert_triggered,
        caregiverNotified: !!row.caregiver_notified,
      }
    } else {
      const data = this.healthData.find((d) => d.timestamp === timestamp)
      return data || null
    }
  }

  async getHealthAlerts(limit = 10) {
    if (this.db) {
      const rows = await this.db.all(
        `SELECT * FROM health_data WHERE alert_triggered = 1 ORDER BY timestamp DESC LIMIT ?`,
        [limit],
      )

      return rows.map((row) => ({
        deviceId: row.device_id,
        timestamp: row.timestamp,
        heartRate: row.heart_rate,
        heartRateAlert: !!row.heart_rate_alert,
        bloodPressure: row.blood_pressure,
        bloodPressureAlert: !!row.blood_pressure_alert,
        glucoseLevels: row.glucose_levels,
        glucoseLevelsAlert: !!row.glucose_levels_alert,
        oxygenSaturation: row.oxygen_saturation,
        oxygenSaturationAlert: !!row.oxygen_saturation_alert,
        alertTriggered: !!row.alert_triggered,
        caregiverNotified: !!row.caregiver_notified,
      }))
    } else {
      return this.healthData
        .filter((data) => data.alertTriggered)
        .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
        .slice(0, limit)
    }
  }

  // Safety data methods
  async getSafetyData(deviceId?: string, limit = 50) {
    if (this.db) {
      const query = deviceId
        ? `SELECT * FROM safety_data WHERE device_id = ? ORDER BY timestamp DESC LIMIT ?`
        : `SELECT * FROM safety_data ORDER BY timestamp DESC LIMIT ?`

      const params = deviceId ? [deviceId, limit] : [limit]
      const rows = await this.db.all(query, params)

      return rows.map((row) => ({
        deviceId: row.device_id,
        timestamp: row.timestamp,
        movementActivity: row.movement_activity,
        fallDetected: !!row.fall_detected,
        impactForceLevel: row.impact_force_level,
        postFallInactivityDuration: row.post_fall_inactivity_duration,
        location: row.location,
        alertTriggered: !!row.alert_triggered,
        caregiverNotified: !!row.caregiver_notified,
      }))
    } else {
      let filteredData = this.safetyData

      if (deviceId) {
        filteredData = filteredData.filter((data) => data.deviceId === deviceId)
      }

      return filteredData
        .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
        .slice(0, limit)
    }
  }

  async getFallEvents(limit = 10) {
    if (this.db) {
      const rows = await this.db.all(
        `SELECT * FROM safety_data WHERE fall_detected = 1 ORDER BY timestamp DESC LIMIT ?`,
        [limit],
      )

      return rows.map((row) => ({
        deviceId: row.device_id,
        timestamp: row.timestamp,
        movementActivity: row.movement_activity,
        fallDetected: !!row.fall_detected,
        impactForceLevel: row.impact_force_level,
        postFallInactivityDuration: row.post_fall_inactivity_duration,
        location: row.location,
        alertTriggered: !!row.alert_triggered,
        caregiverNotified: !!row.caregiver_notified,
      }))
    } else {
      return this.safetyData
        .filter((data) => data.fallDetected)
        .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
        .slice(0, limit)
    }
  }

  async getLocationActivity() {
    const locations = ["Living Room", "Kitchen", "Bedroom", "Bathroom"]
    const result: Record<string, { count: number; lastActivity: string }> = {}

    if (this.db) {
      for (const location of locations) {
        const rows = await this.db.all(`SELECT * FROM safety_data WHERE location = ? ORDER BY timestamp DESC`, [
          location,
        ])

        result[location] = {
          count: rows.length,
          lastActivity: rows.length > 0 ? rows[0].timestamp : "No data",
        }
      }
    } else {
      for (const location of locations) {
        const locationData = this.safetyData.filter((data) => data.location === location)
        const sortedData = locationData.sort(
          (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
        )

        result[location] = {
          count: locationData.length,
          lastActivity: sortedData.length > 0 ? sortedData[0].timestamp : "No data",
        }
      }
    }

    return result
  }

  // Reminder methods
  async getReminderData(deviceId?: string, limit = 50) {
    if (this.db) {
      const query = deviceId
        ? `SELECT * FROM reminder_data WHERE device_id = ? ORDER BY timestamp DESC LIMIT ?`
        : `SELECT * FROM reminder_data ORDER BY timestamp DESC LIMIT ?`

      const params = deviceId ? [deviceId, limit] : [limit]
      const rows = await this.db.all(query, params)

      return rows.map((row) => ({
        deviceId: row.device_id,
        timestamp: row.timestamp,
        reminderType: row.reminder_type,
        scheduledTime: row.scheduled_time,
        reminderSent: !!row.reminder_sent,
        acknowledged: !!row.acknowledged,
        title: row.title,
        feedback: row.feedback,
        contextualTrigger: row.contextual_trigger,
      }))
    } else {
      let filteredData = this.reminderData

      if (deviceId) {
        filteredData = filteredData.filter((data) => data.deviceId === deviceId)
      }

      return filteredData
        .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
        .slice(0, limit)
    }
  }

  async getPendingReminders() {
    if (this.db) {
      const rows = await this.db.all(`SELECT * FROM reminder_data WHERE reminder_sent = 0 ORDER BY scheduled_time ASC`)

      return rows.map((row) => ({
        deviceId: row.device_id,
        timestamp: row.timestamp,
        reminderType: row.reminder_type,
        scheduledTime: row.scheduled_time,
        reminderSent: !!row.reminder_sent,
        acknowledged: !!row.acknowledged,
        title: row.title,
        contextualTrigger: row.contextual_trigger,
      }))
    } else {
      return this.reminderData
        .filter((data) => !data.reminderSent)
        .sort((a, b) => {
          // Sort by scheduled time
          const timeA = new Date(`${a.timestamp.split(" ")[0]} ${a.scheduledTime}`)
          const timeB = new Date(`${b.timestamp.split(" ")[0]} ${b.scheduledTime}`)
          return timeA.getTime() - timeB.getTime()
        })
    }
  }

  async getReminderStats() {
    let total = 0
    let sent = 0
    let acknowledged = 0
    const typeBreakdown: Record<string, number> = {}

    if (this.db) {
      const countResult = await this.db.get(`SELECT COUNT(*) as total FROM reminder_data`)
      total = countResult.total

      const sentResult = await this.db.get(`SELECT COUNT(*) as sent FROM reminder_data WHERE reminder_sent = 1`)
      sent = sentResult.sent

      const acknowledgedResult = await this.db.get(`SELECT COUNT(*) as ack FROM reminder_data WHERE acknowledged = 1`)
      acknowledged = acknowledgedResult.ack

      const typeResults = await this.db.all(
        `SELECT reminder_type, COUNT(*) as count FROM reminder_data GROUP BY reminder_type`,
      )
      typeResults.forEach((row) => {
        typeBreakdown[row.reminder_type] = row.count
      })
    } else {
      total = this.reminderData.length
      sent = this.reminderData.filter((r) => r.reminderSent).length
      acknowledged = this.reminderData.filter((r) => r.acknowledged).length

      this.reminderData.forEach((r) => {
        typeBreakdown[r.reminderType] = (typeBreakdown[r.reminderType] || 0) + 1
      })
    }

    return {
      total,
      sent,
      acknowledged,
      sentPercentage: Math.round((sent / total) * 100) || 0,
      acknowledgedPercentage: Math.round((acknowledged / sent) * 100) || 0,
      typeBreakdown,
    }
  }

  // Update reminder status
  async updateReminderStatus(
    deviceId: string,
    timestamp: string,
    sent: boolean,
    acknowledged: boolean,
    feedback?: string,
  ) {
    if (this.db) {
      await this.db.run(
        `UPDATE reminder_data SET reminder_sent = ?, acknowledged = ?, feedback = ? WHERE device_id = ? AND timestamp = ?`,
        [sent ? 1 : 0, acknowledged ? 1 : 0, feedback || null, deviceId, timestamp],
      )

      return true
    } else {
      const index = this.reminderData.findIndex((r) => r.deviceId === deviceId && r.timestamp === timestamp)

      if (index !== -1) {
        this.reminderData[index].reminderSent = sent
        this.reminderData[index].acknowledged = acknowledged
        if (feedback) this.reminderData[index].feedback = feedback
        return true
      }

      return false
    }
  }

  // Add a new reminder
  async addReminder(reminder: Omit<ReminderData, "id">) {
    if (this.db) {
      await this.db.run(
        `INSERT INTO reminder_data (
          device_id, timestamp, reminder_type, scheduled_time, 
          reminder_sent, acknowledged, title, contextual_trigger
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          reminder.deviceId,
          reminder.timestamp,
          reminder.reminderType,
          reminder.scheduledTime,
          reminder.reminderSent ? 1 : 0,
          reminder.acknowledged ? 1 : 0,
          reminder.title || null,
          reminder.contextualTrigger || null,
        ],
      )

      return true
    } else {
      this.reminderData.push(reminder)
      return true
    }
  }

  // Behavioral pattern methods
  async getBehavioralPatterns(deviceId?: string) {
    if (this.db) {
      const query = deviceId
        ? `SELECT * FROM behavioral_patterns WHERE device_id = ? ORDER BY pattern_type, start_time`
        : `SELECT * FROM behavioral_patterns ORDER BY device_id, pattern_type, start_time`

      const params = deviceId ? [deviceId] : []
      const rows = await this.db.all(query, params)

      return rows.map((row) => ({
        deviceId: row.device_id,
        patternType: row.pattern_type,
        startTime: row.start_time,
        endTime: row.end_time,
        daysOfWeek: row.days_of_week.split(","),
        location: row.location,
        confidence: row.confidence,
        lastUpdated: row.last_updated,
      }))
    } else {
      let filteredData = this.behavioralPatterns

      if (deviceId) {
        filteredData = filteredData.filter((data) => data.deviceId === deviceId)
      }

      return filteredData.sort((a, b) => {
        if (a.patternType !== b.patternType) {
          return a.patternType.localeCompare(b.patternType)
        }
        return a.startTime.localeCompare(b.startTime)
      })
    }
  }

  // Add or update a behavioral pattern
  async updateBehavioralPattern(pattern: BehavioralPattern) {
    if (this.db) {
      // Check if pattern exists
      const existing = await this.db.get(
        `SELECT * FROM behavioral_patterns WHERE device_id = ? AND pattern_type = ? AND start_time = ?`,
        [pattern.deviceId, pattern.patternType, pattern.startTime],
      )

      if (existing) {
        // Update existing pattern
        await this.db.run(
          `UPDATE behavioral_patterns SET 
            end_time = ?, days_of_week = ?, location = ?, confidence = ?, last_updated = ?
          WHERE device_id = ? AND pattern_type = ? AND start_time = ?`,
          [
            pattern.endTime,
            pattern.daysOfWeek.join(","),
            pattern.location,
            pattern.confidence,
            pattern.lastUpdated,
            pattern.deviceId,
            pattern.patternType,
            pattern.startTime,
          ],
        )
      } else {
        // Insert new pattern
        await this.db.run(
          `INSERT INTO behavioral_patterns (
            device_id, pattern_type, start_time, end_time, days_of_week, location, confidence, last_updated
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            pattern.deviceId,
            pattern.patternType,
            pattern.startTime,
            pattern.endTime,
            pattern.daysOfWeek.join(","),
            pattern.location,
            pattern.confidence,
            pattern.lastUpdated,
          ],
        )
      }

      return true
    } else {
      // In-memory update
      const index = this.behavioralPatterns.findIndex(
        (p) =>
          p.deviceId === pattern.deviceId && p.patternType === pattern.patternType && p.startTime === pattern.startTime,
      )

      if (index !== -1) {
        this.behavioralPatterns[index] = pattern
      } else {
        this.behavioralPatterns.push(pattern)
      }

      return true
    }
  }

  // Gait data methods
  async getGaitData(deviceId?: string, limit = 50) {
    if (this.db) {
      const query = deviceId
        ? `SELECT * FROM gait_data WHERE device_id = ? ORDER BY timestamp DESC LIMIT ?`
        : `SELECT * FROM gait_data ORDER BY timestamp DESC LIMIT ?`

      const params = deviceId ? [deviceId, limit] : [limit]
      const rows = await this.db.all(query, params)

      return rows.map((row) => ({
        deviceId: row.device_id,
        timestamp: row.timestamp,
        stepLength: row.step_length,
        stepTime: row.step_time,
        stepVariability: row.step_variability,
        walkingSpeed: row.walking_speed,
        turnTime: row.turn_time,
        riskScore: row.risk_score,
      }))
    } else {
      let filteredData = this.gaitData

      if (deviceId) {
        filteredData = filteredData.filter((data) => data.deviceId === deviceId)
      }

      return filteredData
        .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
        .slice(0, limit)
    }
  }

  // Add gait data
  async addGaitData(data: GaitData) {
    if (this.db) {
      await this.db.run(
        `INSERT INTO gait_data (
          device_id, timestamp, step_length, step_time, step_variability, walking_speed, turn_time, risk_score
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          data.deviceId,
          data.timestamp,
          data.stepLength,
          data.stepTime,
          data.stepVariability,
          data.walkingSpeed,
          data.turnTime,
          data.riskScore,
        ],
      )

      return true
    } else {
      this.gaitData.push(data)
      return true
    }
  }

  // Get fall risk trend
  async getFallRiskTrend(deviceId: string) {
    if (this.db) {
      const rows = await this.db.all(
        `SELECT timestamp, risk_score FROM gait_data WHERE device_id = ? ORDER BY timestamp ASC`,
        [deviceId],
      )

      return rows.map((row) => ({
        timestamp: row.timestamp,
        riskScore: row.risk_score,
      }))
    } else {
      return this.gaitData
        .filter((data) => data.deviceId === deviceId)
        .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())
        .map((data) => ({
          timestamp: data.timestamp,
          riskScore: data.riskScore,
        }))
    }
  }
}

// Export a singleton instance
export const db = new Database()

