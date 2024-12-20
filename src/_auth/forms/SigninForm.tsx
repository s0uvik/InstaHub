import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { SigninValidation } from "@/lib/validation";
import { useCreateAnonymousSession, useSignInAccount } from "@/lib/react-query/queriesAndMutations";
import { useUserContext } from "@/context/AuthContext";

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
import Loader from "@/components/shared/Loader";

const SigninForm = () => {
  const { toast } = useToast();
  const { checkAuthUser } = useUserContext();
  const navigate = useNavigate();

  const { mutateAsync: signInAccount, isPending } = useSignInAccount();
  const { mutateAsync: guestLogin, isPending: isGuestPending } = useCreateAnonymousSession();

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

  const handleGuestLogin = async () => {
    try {
      const res = await guestLogin();
      if (res) {
        navigate("/");
        location.reload();
      }
    } catch (error) {
      toast({
        title: "Guest Login failed, please try again",
      });
    }
  };
  return (
    <Form {...form}>
      <div className=" sm:w-420 flex-center flex-col border rounded-lg p-4 border-gray-900">
        <div className=" flex gap-2 item-center">
          <img src="/assets/images/logo.png" alt="logo" width={35} height={35} />{" "}
          <h3 className=" text-2xl font-semibold">InstaHub</h3>
        </div>
        <h2 className="pt-5 text-xl sm:pt-12">Login to your account</h2>
        <p className=" text-light-3 small-medium md:base-regular md:mt-2">
          Welcome back! Please enter your details
        </p>

        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className=" flex flex-col gap-5 w-full mt-4 p-4"
        >
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    placeholder="Enter your email"
                    className=" shad-input"
                    {...field}
                  />
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
                  <Input
                    type="password"
                    placeholder="Enter your password"
                    className=" shad-input"
                    {...field}
                  />
                </FormControl>
                <FormMessage className=" text-red" />
              </FormItem>
            )}
          />
          <Button disabled={isPending} type="submit" className=" shad-button_primary">
            {isPending ? <Loader /> : "Submit"}
          </Button>
          <p className=" text-small-regular text-light-2 text-center mt-2">
            Don't have an account?{" "}
            <Link to="/sign-up" className=" text-primary-500 font-semibold">
              Signup
            </Link>
          </p>
        </form>
        {isGuestPending ? (
          <Loader />
        ) : (
          <button onClick={handleGuestLogin} className=" small-medium text-light-3 ">
            Try InstaHub as a Guest
          </button>
        )}
      </div>
    </Form>
  );
};

export default SigninForm;
