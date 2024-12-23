import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Activity, CalendarIcon, Clock, RefreshCcw } from "lucide-react";
import { useState } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { Calendar } from "./ui/calendar";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "./ui/hover-card";
import { LiveIndicatorButton } from "./live-indicator";
import { Separator } from "./ui/separator";
import useGetUrl from "@/data/query/useGetUrl";
import { Spinner } from "./ui/spinner";
import { ErrorMessage } from "./layout/errormessage";
import { useParams } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { AxiosRequestConfig } from "axios";
import { parseJSON } from "@/helper/parseJSON";
import { makeAPIRequest } from "@/helper/makeAPIRequest";
import useGetUrlHealth from "@/data/query/useGetUrlHealth";
import { TimezoneService } from "@/service/timeZone.service";
import { Badge } from "./ui/badge";

interface UptimeMetric {
  label: string;
  value: number;
  key: string;
  icon: React.ReactNode;
}

interface DateSelectorProps {
  date: number;
  onDateChange: (date: Date) => void;
  disabled?: boolean;
}

type StatusType = "ok" | "exc" | "err";

interface StatusIndicatorProps {
  status: number;
}

const getStatusType = (status: number): StatusType => {
  if (status >= 200 && status < 400) return "ok";
  if (status >= 400 && status < 500) return "exc";
  return "err";
};

const statusConfig: Record<StatusType, { label: string; className: string }> = {
  ok: {
    label: "OK",
    className: "bg-green-100 text-green-800 hover:bg-green-200",
  },
  exc: {
    label: "EXC",
    className: "bg-yellow-100 text-yellow-800 hover:bg-yellow-200",
  },
  err: { label: "ERR", className: "bg-red-100 text-red-800 hover:bg-red-200" },
};

export function StatusIndicator({ status }: StatusIndicatorProps) {
  const statusType = getStatusType(status);
  const { label, className } = statusConfig[statusType];

  return (
    <div className="flex items-center justify-between text-sm">
      <Badge variant="outline" className={className}>
        {label} {status}
      </Badge>
    </div>
  );
}

const DateSelector = ({
  date,
  onDateChange,
  disabled = false,
}: DateSelectorProps) => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          disabled={disabled}
          variant="outline"
          className="w-[240px] justify-start text-left font-normal"
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {format(new Date(date * 1000), "PPP")}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={new Date(date * 1000)}
          disabled={{ after: new Date() }}
          onSelect={(newDate) => newDate && onDateChange(newDate)}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  );
};

const getBarColor = (success: boolean, timeout: boolean) => {
  const status = success ? "active" : timeout ? "timeout" : "error";

  switch (status) {
    case "active":
      return "bg-green-500 hover:bg-green-600";
    case "timeout":
      return "bg-yellow-500 hover:bg-yellow-600";
    case "error":
      return "bg-red-500 hover:bg-red-600";
  }
};

const MakeAPIRequest = ({ urlId }: { urlId: string }) => {
  const { isLoading, isError, error, data } = useGetUrl({
    urlId,
  });
  const { mutate, isPending } = useMutation({
    mutationFn: async ({ data }: { data: AxiosRequestConfig }) => {
      return await makeAPIRequest({
        url: data.url,
        method: data.method,
        headers: data.headers,
        //@ts-ignore
        data: data.body,
        timeout: Number(data.timeout) * 1000 || 5000,
      });
    },
    onSuccess: (data) => {
      setJSONResponse(JSON.stringify(data, null, 2));
    },
    onError: (error) => {
      setJSONResponse(JSON.stringify(error, null, 2));
    },
  });

  const [JSONResponse, setJSONResponse] = useState<string>(
    '{"message": "The response will be shown here."}'
  );

  if (isError) {
    return <ErrorMessage message={(error as any)?.response?.data?.messsage} />;
  }

  if (isLoading)
    return (
      <div className="flex items-center justify-center h-32">
        <Spinner size={"sm"} className="bg-black" />
      </div>
    );
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
            console.log(data.data[0]);
            mutate({
              data: {
                ...data.data[0],
                timeout: data.data[0].timeout * 1000,
                data: parseJSON(data.data[0].body),
              },
            });
          }}
        >
          Make API Request
        </Button>
      </CardContent>
    </Card>
  );
};

const metrics: UptimeMetric[] = [
  {
    label: "Crons",
    key: "numberOfCronruns",
    value: 0,
    icon: <Activity className="h-4 w-4" />,
  },
  {
    label: "Timeout(s)",
    key: "numberOfTimeouts",
    value: 0,
    icon: <Clock className="h-4 w-4" />,
  },
  {
    label: "Retry(s)",
    key: "numberOfRetries",
    value: 0,
    icon: <RefreshCcw className="h-4 w-4" />,
  },
];

export const UptimeDashboard = () => {
  const { id } = useParams();
  const [live, setLive] = useState(true);
  const [date, setDate] = useState<number>(
    TimezoneService.getCurrentTimestamp()
  );
  const { isError, isLoading, error, data } = useGetUrlHealth({
    urlId: id || "",
    date: date,
    isLive: live,
  });

  if (isError) {
    return (
      <div className=" place-items-center self-center">
        <ErrorMessage message={(error as any)?.response?.data?.message} />
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="place-items-center self-center">
        <Spinner size="sm" className="bg-black" />
      </div>
    );
  }

  return (
    <div className="space-y-4 p-4 w-full max-w-7xl mx-auto bg-card border dark:bg-gray-800 rounded-lg shadow h-screen overflow-y-auto">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
        <div>
          <h2 className="text-2xl font-bold">UptimeData - Interactive</h2>
          <p className="text-sm text-muted-foreground">
            Showing total number of cron runs on the server
          </p>
        </div>
        <div className="flex items-center gap-2">
          <DateSelector
            date={date}
            disabled={live}
            onDateChange={(data) => setDate(TimezoneService.dateToUnix(data))}
          />
          <LiveIndicatorButton
            onClick={() => setLive((p) => !p)}
            isLive={live}
            text={live ? "Live" : "Offline"}
          />
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
              <div className="text-2xl font-bold">
                {data?.[metric.key] || metric.value}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium">Activity Graph</CardTitle>
          <CardDescription>
            {TimezoneService.formatDate(
              TimezoneService.getCurrentTimestamp()
            ).slice(
              0,
              TimezoneService.formatDate(TimezoneService.getCurrentTimestamp())
                .length - 9
            )}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[200px] sm:h-[300px] flex items-end gap-1 sm:gap-2">
            {/* @ts-ignore */}
            {data?.latestResponse?.map((data, i) => (
              <HoverCard key={i} openDelay={200} closeDelay={200}>
                <HoverCardTrigger asChild>
                  <div
                    className={`w-full max-w-3 rounded-sm cursor-pointer transition-colors ${getBarColor(
                      data.isSuccess == "true",
                      data.isTimeout == "true"
                    )}`}
                    style={{
                      height: `100%`,
                    }}
                  />
                </HoverCardTrigger>
                <HoverCardContent className="w-[400px]">
                  <div className="grid gap-2">
                    <div className="space-y-1">
                      <h4 className="text-sm font-semibold">
                        Activity Details
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        {TimezoneService.formatDate(data.timestamp / 1000)}
                      </p>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span>Content-Type</span>
                      <span className="font-medium capitalize">
                        {data.contentType}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span>InspectionTime</span>
                      <span className="font-medium capitalize">
                        {data.inspection_time.slice(
                          0,
                          data.inspection_time.length - 9
                        )}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span>HTTP Method</span>
                      <span className="font-medium">{data.requestMethod}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span>Response-Time(Estimated)</span>
                      <span className="font-medium">
                        {Math.floor(data.responseTime / 1000)} s
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span>Status</span>
                      <span>
                        <StatusIndicator status={data.statusCode} />
                      </span>
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
  );
};
