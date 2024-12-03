import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { SignupValidation } from "@/lib/validation";
import { useUserContext } from "@/context/AuthContext";
import { useCreateUserAccount, useSignInAccount } from "@/lib/react-query/queriesAndMutations";

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

const SignupForm = () => {
  const { toast } = useToast();
  const { checkAuthUser } = useUserContext();
  const navigate = useNavigate();

  const { mutateAsync: createUserAccount, isPending: isCreatingUser } = useCreateUserAccount();
  const { mutateAsync: signInAccount } = useSignInAccount();

  // Define form.
  const form = useForm<z.infer<typeof SignupValidation>>({
    resolver: zodResolver(SignupValidation),
    defaultValues: {
      name: "",
      username: "",
      email: "",
      password: "",
    },
  });

  // Define a submit handler.
  async function onSubmit(values: z.infer<typeof SignupValidation>) {
    const newUser = await createUserAccount(values);

    if (!newUser) {
      return toast({
        title: "Sign up failed, please try again",
      });
    }

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
          <img src="/assets/images/logo.png" alt="logo" width={35} height={35} />{" "}
          <h3 className=" text-3xl font-semibold">InstaHub</h3>
        </div>
        <h2 className="pt-5 text-xl sm:pt-8">Create a new account</h2>
        <p className=" text-light-3 small-medium md:base-regular md:mt-2">
          To use InstaHub please enter your account details
        </p>

        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className=" flex flex-col gap-5 w-full mt-4 p-4"
        >
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    placeholder="Enter your name"
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
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>UserName</FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    placeholder="Enter your username"
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
          <Button type="submit" className=" shad-button_primary">
            {isCreatingUser ? <Loader /> : "Submit"}
          </Button>
          <p className=" text-small-regular text-light-2 text-center mt-2">
            Already have an account?{" "}
            <Link to="/sign-in" className=" text-primary-500 font-semibold">
              Login
            </Link>
          </p>
        </form>
      </div>
    </Form>
  );
};

export default SignupForm;
