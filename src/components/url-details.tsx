import { useParams } from "react-router-dom";
import useGetUrl from "@/data/query/useGetUrl";
import { Spinner } from "./ui/spinner";
import { UptimePanel } from "./uptime-panel";
import { UpdateDetailsForm } from "./update-url-form";

export const UrlDetails = () => {
  const { id } = useParams();
  const { data, isLoading } = useGetUrl({ urlId: id || "" });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-96">
        <Spinner size="sm" className="bg-black dark:bg-white" />
      </div>
    );
  }

  return (
    <div
      style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2rem" }}
    >
      <UpdateDetailsForm initialData={data.data[0]} />
      <UptimePanel />
    </div>
  );
};
