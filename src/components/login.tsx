import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm, SubmitHandler } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { Eye, EyeOff, TowerControl } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import customAxios from "@/api";
import { useEffect, useState } from "react";

type FormInputs = {
  name: string;
  password: string;
};
const LoginForm = ({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"form">) => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const form = useForm<FormInputs>({
    values: {
      name: "",
      password: "",
    },
  });

  const onSubmit: SubmitHandler<FormInputs> = async (values) => {
    try {
      const { data } = await customAxios.post("/auth/login", values);
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      toast("Login Successful", {
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
        message: error.response?.data?.message || "An error occurred",
      });
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
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
          <h1 className="text-2xl font-bold">Login to your account</h1>
          <p className="text-balance text-sm text-muted-foreground">
            Enter your details below to login to your account
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
                    <Input placeholder="Enter your name" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
          <div className="grid gap-2">
            <div className="flex items-center">
              <Label htmlFor="password">Password</Label>
            </div>
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <div className="relative">
                      <Input
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter your password"
                        {...field}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-2 top-1/2 -translate-y-1/2"
                        onClick={togglePasswordVisibility}
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                        <span className="sr-only">
                          {showPassword ? "Hide password" : "Show password"}
                        </span>
                      </Button>
                    </div>
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
            Login
          </Button>
        </div>
      </form>
    </Form>
  );
};

export const LoginPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const validateToken = async () => {
      try {
        await customAxios.get("/auth/validate");
        navigate("/app");
      } catch (error) {
        console.error("Token is invalid", error);
      }
    };

    validateToken();
  }, []);

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
            <LoginForm />
          </div>
        </div>
      </div>
      <div className="relative bg-muted md:block lg:block sm:hidden">
        <img
          src="https://res.cloudinary.com/dmi8xdkrq/image/upload/v1734767446/DALL_E_2024-12-21_13.20.12_-_A_black-and-white_artistic_view_from_the_top_of_a_lighthouse_overlooking_a_dramatic_coastline_with_rocky_cliffs_and_rolling_waves._The_scene_includes_unlrwl.webp"
          alt="Image"
          className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
        />
      </div>
    </div>
  );
};
