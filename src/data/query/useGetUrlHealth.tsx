import customAxios from "@/api";
import { useQuery } from "@tanstack/react-query";

const fetchProjectUrls = async ({ queryKey }) => {
  const [_, __, urlId, { date, isLive }] = queryKey;

  // Fetch data using the customAxios instance
  const { data } = await customAxios.get(
    isLive
      ? `/health/live?url=${urlId}`
      : `/health?url=${urlId}&createdAt=${date}`
  );

  let aggregatedData = {};

  if (Array.isArray(data.data)) {
    if (data.data.length === 0) {
      return {};
    }

    aggregatedData = data.data.reduce((accumulatedData, currentItem) => {
      // Accumulate retries, timeouts, and cron runs
      accumulatedData["numberOfRetries"] =
        (accumulatedData["numberOfRetries"] || 0) +
        Number(currentItem.numberOfRetries);
      accumulatedData["numberOfTimeouts"] =
        (accumulatedData["numberOfTimeouts"] || 0) +
        Number(currentItem.numberOfTimeouts);
      accumulatedData["numberOfCronruns"] =
        (accumulatedData["numberOfCronruns"] || 0) +
        Number(currentItem.numberOfCronruns);

      // Flatten the latestResponse array if it exists
      accumulatedData["latestResponse"] =
        accumulatedData["latestResponse"] || [];
      if (Array.isArray(currentItem.latestResponse)) {
        // Flatten the array of arrays into a single array
        accumulatedData["latestResponse"] = accumulatedData[
          "latestResponse"
        ].concat(currentItem.latestResponse);
      }

      return accumulatedData;
    }, {});
  } else {
    aggregatedData = data.data;
  }

  return aggregatedData;
};
const useGetUrlHealth = ({
  urlId,
  date,
  isLive,
}: {
  urlId: string;
  date: number;
  isLive: boolean;
}) => {
  const KEY = [
    "urls",
    "health",
    urlId,
    {
      date,
      isLive,
    },
  ];

  const q = useQuery({
    queryKey: KEY,
    queryFn: fetchProjectUrls,
    enabled: !!urlId,
  });
  return q;
};

export default useGetUrlHealth;
