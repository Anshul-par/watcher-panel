import { useMutation, useQueryClient } from "@tanstack/react-query";
import customAxios from "@/api";
import { toast } from "sonner";

export const useCreateUser = () => {
  const queryClient = useQueryClient();

  const mutate = useMutation({
    mutationFn: async ({ data }: { data: any }) => {
      const response = await customAxios.post(`user`, data);
      return response.data;
    },
    onSuccess: () => {
      toast("User Created Successfully", {
        description: `${new Intl.DateTimeFormat("en-GB", {
          dateStyle: "full",
          timeStyle: "long",
          timeZone: "Asia/Kolkata",
        }).format(Date.now())}`,
      });
      return queryClient.invalidateQueries({
        queryKey: ["users"],
      });
    },
  });

  return mutate;
};
