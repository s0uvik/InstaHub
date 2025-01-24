import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { z } from "zod";

import { SignupValidation } from "@/lib/validation";
import { useUserContext } from "@/context/AuthContext";
import { useCreateUserAccount, useSignInAccount } from "@/lib/react-query/queriesAndMutations";

import { useToast } from "@/components/ui/use-toast";
import SignupForm from "@/components/forms/SignupForm";

const SignupPage = () => {
  const { toast } = useToast();
  const { checkAuthUser } = useUserContext();
  const navigate = useNavigate();

  const { mutateAsync: createUserAccount, isPending } = useCreateUserAccount();
  const { mutateAsync: signInAccount } = useSignInAccount();

  const form = useForm<z.infer<typeof SignupValidation>>({
    resolver: zodResolver(SignupValidation),
    defaultValues: {
      name: "",
      username: "",
      email: "",
      password: "",
    },
  });

  const handleFormSubmit = async (values: z.infer<typeof SignupValidation>) => {
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
  };

  return (
    <div className="sm:w-420 flex-center flex-col border rounded-lg p-4 border-gray-900">
      <div className="flex gap-2 item-center">
        <img src="/assets/images/logo.png" alt="logo" width={35} height={35} />
        <h3 className="text-2xl font-semibold">InstaHub</h3>
      </div>
      <h2 className="pt-5 text-xl sm:pt-8">Create a new account</h2>
      <p className="text-light-3 small-medium md:base-regular md:mt-2">
        To use InstaHub please enter your account details
      </p>

      <SignupForm form={form} isPending={isPending} onSubmit={handleFormSubmit} />

      <p className="text-small-regular text-light-2 text-center mt-2">
        Already have an account?{" "}
        <Link to="/sign-in" className="text-primary-500 font-semibold">
          Signin
        </Link>
      </p>
    </div>
  );
};

export default SignupPage;
