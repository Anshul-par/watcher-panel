import { useMutation, useQueryClient } from "@tanstack/react-query";
import customAxios from "@/api";
import { toast } from "sonner";

export const useCreateUrl = () => {
  const queryClient = useQueryClient();

  const mutate = useMutation({
    mutationFn: async ({ data }: { data: any }) => {
      const response = await customAxios.post(`url`, data);
      return response.data;
    },
    onSuccess: () => {
      toast("URL Created Successfully", {
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
