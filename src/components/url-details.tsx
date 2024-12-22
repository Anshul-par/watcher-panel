import { useParams } from "react-router-dom"
import useGetUrl from "@/data/query/useGetUrl"
import { Spinner } from "./ui/spinner"
// import { UptimePanel } from "./uptime-panel"
import { UpdateDetailsForm } from "./update-url-form"
import ErrorPage from "./layout/errorpage"
import { UptimeDashboard } from "./updated-uptime"

export const UrlDetails = () => {
  const { id } = useParams()
  const { data, isLoading, isError, error } = useGetUrl({ urlId: id || "" })

  if (isError) {
    return <ErrorPage error={error} />
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-96">
        <Spinner size="sm" className="bg-black dark:bg-white" />
      </div>
    )
  }

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr 1fr",
        gap: "1rem",
      }}
    >
      <UpdateDetailsForm initialData={data.data[0]} />
      <UptimeDashboard />
    </div>
  )
}
