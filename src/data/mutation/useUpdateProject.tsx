import { useMutation, useQueryClient } from "@tanstack/react-query";
import customAxios from "@/api";
import { toast } from "sonner";

export const useUpdateProject = () => {
  const queryClient = useQueryClient();

  const mutate = useMutation({
    mutationFn: async ({
      id,
      updatedData,
    }: {
      id: string;
      updatedData: any;
    }) => {
      const response = await customAxios.patch(`project/${id}`, updatedData);
      return response.data;
    },
    onSuccess: () => {
      toast("Project Updated Successfully", {
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
