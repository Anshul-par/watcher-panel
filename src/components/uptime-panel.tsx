import { useState } from "react";
import { cn } from "@/lib/utils";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Calendar } from "./ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Button } from "./ui/button";
import { CalendarIcon } from "lucide-react";
import UptimeIndicator from "./uptime-indicator";
import { format } from "date-fns";
import { Spinner } from "./ui/spinner";
import { useParams } from "react-router-dom";
import { JSONPreview } from "./json-preview";
import { makeAPIRequest } from "@/helper/makeAPIRequest";
import { LiveIndicatorButton } from "./live-indicator";
import useGetUrl from "@/data/query/useGetUrl";
import useGetUrlHealth from "@/data/query/useGetUrlHealth";
import { TimezoneService } from "@/service/timeZone.service";

export const UptimePanel = () => {
  const [date, setDate] = useState<number>(
    TimezoneService.getCurrentTimestamp()
  );
  const [isLive, setIsLive] = useState(true);
  const [tooltipPos, setTooltipPos] = useState({ x: 0 });
  const [liveApiCall, setLiveApiCall] = useState<{
    isLoading: boolean;
    json: any;
  }>({
    isLoading: false,
    json: {
      message: "The response will be shown here.",
    },
  });

  const { id } = useParams<{ id: string }>();
  const { data, isLoading } = useGetUrlHealth({
    urlId: id || "",
    date: date,
    isLive: isLive,
  });
  const { data: urlData } = useGetUrl({
    urlId: id || "",
  });

  if (isLoading)
    return (
      <div className="flex justify-center items-center h-64">
        <Spinner size="sm" className="bg-black dark:bg-white" />
      </div>
    );

  const handleAPICall = async () => {
    try {
      setLiveApiCall((p) => ({
        ...p,
        isLoading: true,
        json: { message: "Loading..." },
      }));
      const JSON = await makeAPIRequest({
        url: urlData.data[0].url,
        method: urlData.data[0].method,
        headers: urlData.data[0].headers || {},
        data: urlData.data[0].body || {},
        timeout: Number(urlData.data[0].timeout) * 1000 || 5000,
      });
      setLiveApiCall((p) => ({ ...p, json: JSON }));
    } catch (error) {
      console.log("Error while making Live API Request", error);
    } finally {
      setLiveApiCall((p) => ({ ...p, isLoading: false }));
    }
  };

  const chartData =
    //@ts-ignore
    data?.latestResponse?.map((item: any) => ({
      date: item.inspection_time,
      barLength: 100,
      isSuccess: item.isSuccess === "true",
      isTimeout: item.isTimeout === "true",
      detail: item,
    })) || [];

  return (
    <Card>
      <CardHeader className="flex flex-col items-stretch space-y-0 border-b p-0 sm:flex-row">
        <div className="flex flex-1 flex-col justify-center gap-1 px-6 py-5 sm:py-6">
          <CardTitle>UptimeData - Interactive</CardTitle>
          <CardDescription>
            Showing total number of cron runs on the server
          </CardDescription>
        </div>
        <div className="flex">
          <button className="relative z-30 flex flex-1 flex-col justify-center gap-1 border-t px-6 py-4 text-left even:border-l data-[active=true]:bg-muted/50 sm:border-l sm:border-t-0 sm:px-8 sm:py-6">
            <span className="text-md font-medium text-muted-foreground">
              Crons
            </span>
            <span className="text-lg font-bold leading-none sm:text-3xl">
              {/* @ts-ignore */}
              {data.numberOfCronruns}
            </span>
          </button>
          <button className="relative z-30 flex flex-1 flex-col justify-center gap-1 border-t px-6 py-4 text-left even:border-l data-[active=true]:bg-muted/50 sm:border-l sm:border-t-0 sm:px-8 sm:py-6">
            <span className="text-md font-medium text-muted-foreground">
              Timout(s)
            </span>
            <span className="text-lg font-bold leading-none sm:text-3xl">
              {/* @ts-ignore */}
              {data.numberOfTimeouts}
            </span>
          </button>

          <button className="relative z-30 flex flex-1 flex-col justify-center gap-1 border-t px-6 py-4 text-left even:border-l data-[active=true]:bg-muted/50 sm:border-l sm:border-t-0 sm:px-8 sm:py-6">
            <span className="text-md font-medium text-muted-foreground">
              Retry(s)
            </span>
            <span className="text-lg font-bold leading-none sm:text-3xl">
              {/* @ts-ignore */}
              {data.numberOfRetries}
            </span>
          </button>
        </div>
      </CardHeader>
      <CardDescription className="py-5 px-3 flex items-center justify-between">
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant={"outline"}
              disabled={isLive}
              className={cn(
                "w-[280px] justify-start text-left font-normal",
                !date && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {date ? (
                format(new Date(date * 1000), "PPP")
              ) : (
                <span>Pick a date</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={new Date(date * 1000)}
              disabled={{ after: new Date() }}
              onSelect={(data) => setDate(TimezoneService.dateToUnix(data))}
              initialFocus
            />
          </PopoverContent>
        </Popover>

        {isLive ? (
          <LiveIndicatorButton text="Live" onClick={() => setIsLive(false)} />
        ) : (
          <LiveIndicatorButton
            text="Offline"
            onClick={() => setIsLive(true)}
            isLive={false}
          />
        )}
      </CardDescription>
      <CardContent className="px-2 sm:p-6">
        <UptimeIndicator
          data={chartData}
          setTooltipPos={setTooltipPos}
          tooltipPos={tooltipPos}
        />
      </CardContent>
      <CardContent className="px-2 sm:p-6 space-y-4">
        <JSONPreview data={liveApiCall.json} />
        <Button onClick={handleAPICall} disabled={liveApiCall.isLoading}>
          {"Make API Request"}
        </Button>
      </CardContent>
    </Card>
  );
};
