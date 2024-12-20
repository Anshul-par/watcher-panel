import customAxios from "@/api";
import { useQuery } from "@tanstack/react-query";

const fetchProjects = async ({ queryKey }) => {
  const [_, id] = queryKey;
  const { data } = await customAxios.get(
    id ? `/project?_id=${id}` : "/project"
  );
  return data;
};

const useGetProjects = (id?: string) => {
  const KEY = id ? ["projects"] : ["projects", id];
  const q = useQuery({
    queryKey: KEY,
    queryFn: fetchProjects,
  });
  return q;
};

export default useGetProjects;
