import { useMutation, useQueryClient } from "@tanstack/react-query";
import customAxios from "@/api";
import { toast } from "sonner";

export const useUpdateUser = () => {
  const queryClient = useQueryClient();

  const mutate = useMutation({
    mutationFn: async ({
      id,
      updatedData,
    }: {
      id: string;
      updatedData: any;
    }) => {
      const response = await customAxios.patch(`user/${id}`, updatedData);
      return response.data;
    },
    onSuccess: () => {
      toast("User Updated Successfully", {
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
