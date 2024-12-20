import { Bar, BarChart, CartesianGrid, Cell, XAxis } from "recharts";
import { Card, CardContent } from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
} from "@/components/ui/chart";

export const description = "An interactive bar chart";

const chartConfig = {
  views: {
    label: "Page Views",
  },
} satisfies ChartConfig;

const getColor = (isSuccess: string, isTimeout: string): string => {
  if (isSuccess) return "#66bb6a"; // Vibrant pastel green for success
  if (isTimeout) return "#ffb74d"; // Vibrant pastel orange for timeout
  if (!isSuccess && !isTimeout) return "#f57c00"; // Warm orange-red for failure
  return "#90a4ae"; // Muted blue-grey for unknown or default
};

const tooltip = (props) => {
  const { payload, active } = props;
  if (!active || !payload) return null;

  return (
    <Card>
      <CardContent className="p-4 max-w-[300px] overflow-clip">
        {payload.map(({ payload: { detail } }, index) => (
          <div className="grid grid-cols-2 gap-2" key={index}>
            <div className="font-bold">URL:</div>
            <div className="truncate">{detail.url}</div>
            <div className="font-bold">Timestamp:</div>
            <div>{new Date(parseInt(detail.timestamp)).toLocaleString()}</div>
            <div className="font-bold">Response Time:</div>
            <div>{detail.responseTime} ms</div>
            <div className="font-bold">Status Code:</div>
            <div>{detail.statusCode}</div>
            <div className="font-bold">Success:</div>
            <div>{detail.isSuccess}</div>
            <div className="font-bold">Response Size:</div>
            <div>{detail.responseSize} bytes</div>
            <div className="font-bold">Content Type:</div>
            <div>{detail.contentType}</div>
            <div className="font-bold">Request Method:</div>
            <div>{detail.requestMethod}</div>
            <div className="font-bold">Timeout:</div>
            <div>{detail.isTimeout}</div>
            <div className="font-bold">Inspection Time:</div>
            <div>{detail.inspection_time}</div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

const UptimeIndicator = ({
  data,
  setTooltipPos,
  tooltipPos,
}: {
  data: any;
  tooltipPos: any;
  setTooltipPos: any;
}) => {
  return (
    <div>
      <ChartContainer
        config={chartConfig}
        className="aspect-auto h-[250px] w-full"
      >
        <BarChart
          accessibilityLayer
          data={data}
          onMouseMove={(state) => {
            if (state.isTooltipActive) {
              const x = state.chartX;
              if (x !== undefined) {
                setTooltipPos({ x });
              }
            } else {
              setTooltipPos({ x: 0 });
            }
          }}
          margin={{
            left: 12,
            right: 12,
          }}
        >
          <CartesianGrid vertical={false} />
          <XAxis
            dataKey="date"
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            minTickGap={20}
            tickFormatter={(value) => {
              // Try parsing the date string
              let date;

              // Check if the value is in ISO format or close to it
              if (!isNaN(Date.parse(value))) {
                date = new Date(value);
              } else {
                // Fallback for formats like "December 19, 2024 at 03:09:28 PM GMT+5:30"
                date = new Date(value.replace(" at ", " ")); // Replace " at " with a space for parsing
              }

              // Ensure the date is valid
              if (isNaN(date.getTime())) {
                return "Invalid Date";
              }

              // Format the date to "Dec 19"
              return date.toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
              });
            }}
          />
          <ChartTooltip
            content={tooltip}
            position={{
              x: Math.min(tooltipPos?.x, 100),
              y: 250,
            }}
          />
          <Bar dataKey="barLength" maxBarSize={20}>
            {data.map((d, index) => (
              <Cell
                key={`cell-${index}`}
                radius={5}
                fill={getColor(d.isSuccess, d.isTimeout)}
              />
            ))}
          </Bar>
        </BarChart>
      </ChartContainer>
    </div>
  );
};

export default UptimeIndicator;
