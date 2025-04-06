import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"

interface AgentLogsProps {
  logs: string[]
}

export function AgentLogs({ logs }: AgentLogsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Agent Activity Logs</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[200px] w-full rounded-md border p-4">
          {logs.length > 0 ? (
            logs.map((log, index) => (
              <div key={index} className="text-sm mb-1">
                {log}
              </div>
            ))
          ) : (
            <div className="text-sm text-muted-foreground">No agent activity recorded yet.</div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  )
}

