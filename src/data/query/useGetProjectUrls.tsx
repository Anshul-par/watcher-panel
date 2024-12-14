import customAxios from "@/api";
import { useQuery } from "@tanstack/react-query";

const fetchProjectUrls = async ({ queryKey }) => {
  const [_, __, project] = queryKey;
  const { data } = await customAxios.get(`/url?project=${project}`);
  return data;
};

const useGetProjectUrls = ({ project }: { project: string }) => {
  const KEY = ["projects", "urls", project];
  const q = useQuery({
    queryKey: KEY,
    queryFn: fetchProjectUrls,
    enabled: !!project,
  });
  return q;
};

export default useGetProjectUrls;
