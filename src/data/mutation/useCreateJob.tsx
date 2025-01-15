import { useMutation } from "@tanstack/react-query";
import customAxios from "@/api";
import { toast } from "sonner";

export const useCreateJob = () => {
  const mutate = useMutation({
    mutationFn: async ({ data }: { data: any }) => {
      const response = await customAxios.post(`job`, data);
      return response.data;
    },
    onSuccess: () => {
      toast("Job Created Successfully", {
        description: `${new Intl.DateTimeFormat("en-GB", {
          dateStyle: "full",
          timeStyle: "long",
          timeZone: "Asia/Kolkata",
        }).format(Date.now())}`,
      });
    },
  });

  return mutate;
};
