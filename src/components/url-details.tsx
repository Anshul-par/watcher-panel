import { useParams } from "react-router-dom";
import { Spinner } from "./ui/spinner";
import { UpdateDetailsForm } from "./update-url-form";
import { UptimeDashboard } from "./updated-uptime";
import useGetUrl from "@/data/query/useGetUrl";
import { ErrorMessage } from "./layout/errormessage";

export const UrlDetails = () => {
  const { id } = useParams();
  const { data, isLoading, isError, error } = useGetUrl({ urlId: id || "" });

  if (isError) {
    return <ErrorMessage message={(error as any)?.response?.data?.message} />;
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
      style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: "1rem",
      }}
    >
      {Object.keys(data?.data?.[0] || {}).length ? (
        <UpdateDetailsForm initialData={data.data[0]} />
      ) : (
        <ErrorMessage />
      )}
      <UptimeDashboard />
    </div>
  );
};
