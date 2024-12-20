import customAxios from "@/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export const useDeleteUrl = () => {
  const queryClient = useQueryClient();

  const mutate = useMutation({
    mutationFn: async ({ id }: { id: string }) => {
      const response = await customAxios.delete(`/url/${id}`);
      return response.data;
    },

    onSuccess: () => {
      toast("URL Deleted Successfully", {
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
