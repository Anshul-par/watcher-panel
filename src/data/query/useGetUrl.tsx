import customAxios from "@/api";
import { useQuery } from "@tanstack/react-query";

const fetchProjectUrls = async ({ queryKey }) => {
  const [_, id] = queryKey;
  const { data } = await customAxios.get(`/url?_id=${id}`);
  return data;
};

const useGetUrl = ({ urlId }: { urlId: string }) => {
  const KEY = ["urls", urlId];
  const q = useQuery({
    queryKey: KEY,
    queryFn: fetchProjectUrls,
    enabled: !!urlId,
  });
  return q;
};

export default useGetUrl;
