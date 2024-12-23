import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useForm, SubmitHandler } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { TowerControl } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import customAxios from "@/api";
import { toast } from "sonner";

type FormInputs = {
  name: string;
  slackUserId: string;
  password: string;
};

const SignupForm = ({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"form">) => {
  const navigate = useNavigate();
  const form = useForm<FormInputs>({
    values: {
      name: "",
      slackUserId: "",
      password: "",
    },
  });

  const onSubmit: SubmitHandler<FormInputs> = async (values) => {
    try {
      await customAxios.post("/auth/register", values);
      toast("Registraion Successfull", {
        description: `${new Intl.DateTimeFormat("en-GB", {
          dateStyle: "full",
          timeStyle: "long",
          timeZone: "Asia/Kolkata",
        }).format(Date.now())}`,
      });
      navigate("/app");
    } catch (error) {
      //@ts-ignore
      form.setError("formError", {
        type: "custom",
        //@ts-ignore
        message: error.response.data.message,
      });
    }
  };

  return (
    <Form {...form}>
      <form
        className={cn("flex flex-col gap-6 space-y-3", className)}
        {...props}
        onSubmit={(e) => {
          form.clearErrors();
          form.handleSubmit(onSubmit)(e);
        }}
      >
        <div className="flex flex-col items-center gap-2 text-center">
          <h1 className="text-2xl font-bold">Sign Up</h1>
          <p className="text-balance text-sm text-muted-foreground">
            Enter your details below to signup with an account
          </p>
        </div>
        <div className="grid gap-6">
          <div className="grid gap-2">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>

          <div className="grid gap-2">
            <FormField
              control={form.control}
              name="slackUserId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Slack UserID</FormLabel>
                  <FormControl>
                    <Input placeholder="" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>

          <div className="grid gap-2">
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input placeholder="" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>

          {form.formState.errors["formError"] && (
            <FormMessage className="text-[0.8rem] text-red-600 text-center">
              Error: {form.formState.errors["formError"].message}
            </FormMessage>
          )}
          <Button type="submit" className="w-full">
            Sign Up
          </Button>
        </div>

        <div className="text-center text-sm">
          Go{" "}
          <Link to="/" className="underline underline-offset-4">
            Back
          </Link>
        </div>
      </form>
    </Form>
  );
};

export const SignupPage = () => {
  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex justify-center gap-2 md:justify-start">
          <a href="#" className="flex items-center gap-2 font-medium">
            <div className="flex h-6 w-6 items-center justify-center rounded-md bg-primary text-primary-foreground">
              <TowerControl className="size-4" />
            </div>
            Watcher
          </a>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-[400px]">
            <SignupForm />
          </div>
        </div>
      </div>
      <div className="relative bg-muted md:block lg:block sm:hidden">
        <img
          src="https://res.cloudinary.com/dmi8xdkrq/image/upload/v1734767447/DALL_E_2024-12-21_13.19.10_-_A_black-and-white_artistic_view_from_the_top_of_a_lighthouse_overlooking_a_dramatic_coastline_with_rocky_cliffs_and_rolling_waves._The_perspective_ca_o5q60a.webp"
          alt="Image"
          className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
        />
      </div>
    </div>
  );
};
