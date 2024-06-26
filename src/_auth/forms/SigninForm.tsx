import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SigninValidation } from "@/lib/validation";
import Loader from "@/components/shared/Loader";
import { Link, useNavigate } from "react-router-dom";
import { useSignInAccount } from "@/lib/react-query/queriesAndMutations";
import { useUserContext } from "@/context/AuthContext";

const SigninForm = () => {
  const { toast } = useToast();
  const { checkAuthUser, isLoading: isUserLoading } = useUserContext();
  const navigate = useNavigate();

  const { mutateAsync: signInAccount } = useSignInAccount();

  // Define form.
  const form = useForm<z.infer<typeof SigninValidation>>({
    resolver: zodResolver(SigninValidation),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // Define a submit handler.
  async function onSubmit(values: z.infer<typeof SigninValidation>) {
    const session = await signInAccount({
      email: values.email,
      password: values.password,
    });

    if (!session) {
      return toast({
        title: "Sign in failed, please try again",
      });
    }

    const isLoggedIn = await checkAuthUser();
    if (isLoggedIn) {
      form.reset();
      navigate("/");
    } else {
      toast({
        title: "Sign in failed, please try again",
      });
    }
  }
  return (
    <Form {...form}>
      <div className=" sm:w-420 flex-center flex-col border rounded-lg p-4 border-gray-900">
        <div className=" flex gap-2 item-center">
          <img
            src="/assets/images/logo.png"
            alt="logo"
            width={35}
            height={35}
          />{" "}
          <h3 className=" text-2xl font-semibold">InstaHub</h3>
        </div>
        <h2 className="pt-5 text-xl sm:pt-12">
          Login to your account
        </h2>
        <p className=" text-light-3 small-medium md:base-regular md:mt-2">
          Welcome back! Please enter your details
        </p>

        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className=" flex flex-col gap-5 w-full mt-4"
        >
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input type="text" className=" shad-input" {...field} />
                </FormControl>
                <FormMessage className=" text-red" />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input type="password" className=" shad-input" {...field} />
                </FormControl>
                <FormMessage className=" text-red" />
              </FormItem>
            )}
          />
          <Button type="submit" className=" shad-button_primary">
            {isUserLoading ? <Loader /> : "Submit"}
          </Button>
          <p className=" text-small-regular text-light-2 text-center mt-2">
            Don't have an account?{" "}
            <Link to="/sign-up" className=" text-primary-500 font-semibold">
              Signup
            </Link>
          </p>
        </form>
      </div>
    </Form>
  );
};

export default SigninForm;
