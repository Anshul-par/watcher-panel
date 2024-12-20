import { useMutation, useQueryClient } from "@tanstack/react-query";
import customAxios from "@/api";
import { toast } from "sonner";

export const useCreateProject = () => {
  const queryClient = useQueryClient();

  const mutate = useMutation({
    mutationFn: async ({ data }: { data: any }) => {
      const response = await customAxios.post(`project`, data);
      return response.data;
    },
    onSuccess: () => {
      toast("Project Created Successfully", {
        description: `${new Intl.DateTimeFormat("en-GB", {
          dateStyle: "full",
          timeStyle: "long",
          timeZone: "Asia/Kolkata",
        }).format(Date.now())}`,
      });
      return Promise.all([
        queryClient.invalidateQueries({
          queryKey: ["projects"],
        }),
        queryClient.invalidateQueries({
          queryKey: ["urls"],
        }),
      ]);
    },
  });

  return mutate;
};
