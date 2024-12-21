import { useParams } from "react-router-dom";
import useGetUrl from "@/data/query/useGetUrl";
import { Spinner } from "./ui/spinner";
import { UptimePanel } from "./uptime-panel";
import { UpdateDetailsForm } from "./update-url-form";
import ErrorPage from "./layout/errorpage";

export const UrlDetails = () => {
  const { id } = useParams();
  const { data, isLoading, isError, error } = useGetUrl({ urlId: id || "" });

  console.log({
    data,
    isLoading,
    isError,
    error,
  });

  if (isError) {
    return <ErrorPage error={error} />;
  }

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
