import { useMutation, useQueryClient } from "@tanstack/react-query";
import customAxios from "@/api";
import { toast } from "sonner";

export const useDeleteProject = () => {
  const queryClient = useQueryClient();

  const mutate = useMutation({
    mutationFn: async ({ id }: { id: string }) => {
      const response = await customAxios.delete(`project/${id}`);
      return response.data;
    },
    onSuccess: () => {
      toast("Project Deleted Successfully", {
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
