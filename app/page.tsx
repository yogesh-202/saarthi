import { ElderlyAssistantSystem } from "@/components/elderly-assistant-system"

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-4 md:p-24">
      <div className="z-10 w-full max-w-5xl items-center justify-between font-mono text-sm">
        <h1 className="text-3xl font-bold text-center mb-8">SAARTHI - Elderly Care Assistant System</h1>
        <ElderlyAssistantSystem />
      </div>
    </main>
  )
}

