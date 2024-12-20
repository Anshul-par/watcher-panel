import customAxios from "@/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export const useDeleteUser = () => {
  const queryClient = useQueryClient();

  const mutate = useMutation({
    mutationFn: async ({ id }: { id: string }) => {
      const response = await customAxios.delete(`/user/${id}`);
      return response.data;
    },

    onSuccess: () => {
      toast("User Deleted Successfully", {
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
