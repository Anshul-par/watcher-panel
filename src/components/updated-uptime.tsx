import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Activity, CalendarIcon, Clock, RefreshCcw } from "lucide-react"
import { useState } from "react"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { format, set } from "date-fns"
import { Calendar } from "./ui/calendar"
import { HoverCard, HoverCardContent, HoverCardTrigger } from "./ui/hover-card"
import { LiveIndicatorButton } from "./live-indicator"
import { Separator } from "./ui/separator"
import useGetUrl from "@/data/query/useGetUrl"
import { Spinner } from "./ui/spinner"
import { ErrorMessage } from "./layout/errormessage"
import { useParams } from "react-router-dom"
import { useMutation } from "@tanstack/react-query"
import axios, { AxiosRequestConfig } from "axios"
import { parseJSON } from "@/helper/parseJSON"
import { makeAPIRequest } from "@/helper/makeAPIRequest"

interface UptimeMetric {
  label: string
  value: number
  icon: React.ReactNode
}

interface ActivityData {
  date: Date
  status: "active" | "timeout" | "error"
  successRate: number
  totalRuns: number
}

interface DateSelectorProps {
  date: Date
  onDateChange: (date: Date) => void
}

const DateSelector = ({ date, onDateChange }: DateSelectorProps) => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className="w-[240px] justify-start text-left font-normal"
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {format(date, "PPP")}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={date}
          onSelect={(newDate) => newDate && onDateChange(newDate)}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  )
}

const getBarColor = (status: "active" | "timeout" | "error") => {
  switch (status) {
    case "active":
      return "bg-green-500 hover:bg-green-600"
    case "timeout":
      return "bg-yellow-500 hover:bg-yellow-600"
    case "error":
      return "bg-red-500 hover:bg-red-600"
  }
}

const MakeAPIRequest = ({ urlId }: { urlId: string }) => {
  const { isLoading, isError, error, data } = useGetUrl({
    urlId,
  })
  const { mutate, isPending } = useMutation({
    mutationFn: async ({ data }: { data: AxiosRequestConfig }) => {
      return await makeAPIRequest({
        url: data.url,
        method: data.method,
        headers: data.headers,
        //@ts-ignore
        data: data.body,
        timeout: Number(data.timeout) * 1000 || 5000,
      })
    },
    onSuccess: (data) => {
      setJSONResponse(JSON.stringify(data, null, 2))
    },
    onError: (error) => {
      setJSONResponse(JSON.stringify(error, null, 2))
    },
  })

  const [JSONResponse, setJSONResponse] = useState<string>(
    '{"message": "The response will be shown here."}'
  )

  if (isError) {
    return <ErrorMessage message={(error as any)?.response?.data?.messsage} />
  }

  if (isLoading)
    return (
      <div className="flex items-center justify-center h-32">
        <Spinner size={"sm"} className="bg-black" />
      </div>
    )
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm font-medium">API Response</CardTitle>
      </CardHeader>
      <CardContent>
        {
          <pre className="bg-muted p-4 rounded-lg overflow-auto text-xs sm:text-sm">
            {isPending ? (
              <div className="flex items-center justify-center">
                <Spinner size={"sm"} className="bg-black" />
              </div>
            ) : (
              JSON.stringify(JSON.parse(JSONResponse), null, 2)
            )}
          </pre>
        }

        <Button
          className="mt-4"
          onClick={() => {
            console.log(data.data[0])
            mutate({
              data: {
                ...data.data[0],
                timeout: data.data[0].timeout * 1000,
                data: parseJSON(data.data[0].body),
              },
            })
          }}
        >
          Make API Request
        </Button>
      </CardContent>
    </Card>
  )
}

export const UptimeDashboard = () => {
  const { id } = useParams()
  const metrics: UptimeMetric[] = [
    { label: "Crons", value: 31, icon: <Activity className="h-4 w-4" /> },
    { label: "Timeout(s)", value: 0, icon: <Clock className="h-4 w-4" /> },
    { label: "Retry(s)", value: 0, icon: <RefreshCcw className="h-4 w-4" /> },
  ]

  const activityData: ActivityData[] = Array.from({ length: 31 }, (_, i) => {
    const date = new Date()
    date.setDate(date.getDate() - (30 - i))
    const random = Math.random()
    let status: "active" | "timeout" | "error"
    if (random < 0.8) status = "active"
    else if (random < 0.9) status = "timeout"
    else status = "error"
    return {
      date,
      status,
      successRate: Math.random() * 100,
      totalRuns: Math.floor(Math.random() * 100),
    }
  })

  return (
    <div className="space-y-4 p-4 w-full max-w-7xl mx-auto bg-card border dark:bg-gray-800 rounded-lg shadow col-span-2">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
        <div>
          <h2 className="text-2xl font-bold">UptimeData - Interactive</h2>
          <p className="text-sm text-muted-foreground">
            Showing total number of cron runs on the server
          </p>
        </div>
        <div className="flex items-center gap-2">
          <DateSelector date={new Date()} onDateChange={console.log} />
          <LiveIndicatorButton isLive={false} text={"Offline"} />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {metrics.map((metric) => (
          <Card key={metric.label}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">
                {metric.label}
              </CardTitle>
              {metric.icon}
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metric.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium">Activity Graph</CardTitle>
          <CardDescription>December 21st, 2024</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[200px] sm:h-[300px] flex items-end gap-1 sm:gap-2">
            {activityData.map((data, i) => (
              <HoverCard key={i} openDelay={200} closeDelay={200}>
                <HoverCardTrigger asChild>
                  <div
                    className={`w-full rounded-sm cursor-pointer transition-colors ${getBarColor(
                      data.status
                    )}`}
                    style={{
                      height: `${data.successRate}%`,
                    }}
                  />
                </HoverCardTrigger>
                <HoverCardContent className="w-48">
                  <div className="grid gap-2">
                    <div className="space-y-1">
                      <h4 className="text-sm font-semibold">
                        Activity Details
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        {data.date.toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </p>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span>Status</span>
                      <span className="font-medium capitalize">
                        {data.status}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span>Success Rate</span>
                      <span className="font-medium">
                        {Math.round(data.successRate)}%
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span>Total Runs</span>
                      <span className="font-medium">{data.totalRuns}</span>
                    </div>
                  </div>
                </HoverCardContent>
              </HoverCard>
            ))}
          </div>

          <Separator className="my-4" />

          {/* Legend */}
          <div className="flex flex-wrap justify-center items-center gap-4 mt-4">
            <div className="flex items-center">
              <div className="w-3 h-3 bg-green-500 mr-2 rounded-full"></div>
              <span className="text-sm font-medium">Active</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-yellow-500 mr-2 rounded-full"></div>
              <span className="text-sm font-medium">Timeout</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-red-500 mr-2 rounded-full"></div>
              <span className="text-sm font-medium">Error</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <MakeAPIRequest urlId={id as string} />
    </div>
  )
}
