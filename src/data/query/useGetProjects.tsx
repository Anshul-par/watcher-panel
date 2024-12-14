import customAxios from "@/api";
import { useQuery } from "@tanstack/react-query";

const KEY = ["projects"];
const fetchProjects = async () => {
  const { data } = await customAxios.get("/project");
  return data;
};

const useGetProjects = () => {
  const q = useQuery({
    queryKey: KEY,
    queryFn: fetchProjects,
  });
  return q;
};

export default useGetProjects;
