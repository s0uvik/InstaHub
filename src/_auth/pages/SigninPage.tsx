import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { SigninValidation } from "@/lib/validation";
import { useCreateAnonymousSession, useSignInAccount } from "@/lib/react-query/queriesAndMutations";
import { useUserContext } from "@/context/AuthContext";
import { useToast } from "@/components/ui/use-toast";
import SigninForm from "@/components/forms/SigninForm";

const SigninPage = () => {
  const { toast } = useToast();
  const { checkAuthUser } = useUserContext();
  const navigate = useNavigate();

  const { mutateAsync: signInAccount, isPending } = useSignInAccount();
  const { mutateAsync: guestLogin, isPending: isGuestPending } = useCreateAnonymousSession();

  const form = useForm<z.infer<typeof SigninValidation>>({
    resolver: zodResolver(SigninValidation),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const handleFormSubmit = async (values: z.infer<typeof SigninValidation>) => {
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
    <div className="sm:w-420 flex-center flex-col border rounded-lg p-4 border-gray-900">
      <div className="flex gap-2 items-center">
        <img src="/assets/images/logo.png" alt="logo" width={35} height={35} />
        <h3 className="text-2xl font-semibold">InstaHub</h3>
      </div>
      <h2 className="pt-5 text-xl sm:pt-12">Login to your account</h2>
      <p className="text-light-3 small-medium md:base-regular md:mt-2">
        Welcome back! Please enter your details
      </p>

      <SigninForm
        form={form}
        onSubmit={handleFormSubmit}
        isPending={isPending}
        isGuestPending={isGuestPending}
        handleGuestLogin={handleGuestLogin}
      />

      <p className="text-small-regular text-light-2 text-center mt-2">
        Don't have an account?{" "}
        <Link to="/sign-up" className="text-primary-500 font-semibold">
          Signup
        </Link>
      </p>
    </div>
  );
};

export default SigninPage;
