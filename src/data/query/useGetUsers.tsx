import customAxios from "@/api";
import { useQuery } from "@tanstack/react-query";

const KEY = ["users"];
const fetchUsers = async () => {
  const { data } = await customAxios.get("/user");
  return data;
};

const useGetUsers = () => {
  const q = useQuery({
    queryKey: KEY,
    queryFn: fetchUsers,
  });
  return q;
};

export default useGetUsers;
