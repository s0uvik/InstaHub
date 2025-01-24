import { UseFormReturn } from "react-hook-form";

import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import Loader from "@/components/shared/Loader";
import InputField from "@/components/forms/InputField";

type SigninFormFields = {
  email: string;
  password: string;
};

type SigninFormProps = {
  form: UseFormReturn<SigninFormFields>;
  onSubmit: (values: SigninFormFields) => void;
  isPending: boolean;
  isGuestPending: boolean;
  handleGuestLogin: () => void;
};

const SigninForm = ({
  form,
  onSubmit,
  isPending,
  isGuestPending,
  handleGuestLogin,
}: SigninFormProps) => {
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-5 w-full mt-4 p-4">
        <InputField
          name="email"
          label="Email"
          placeholder="Enter your email"
          type="text"
          control={form.control}
        />
        <InputField
          name="password"
          label="Password"
          placeholder="Enter your password"
          type="password"
          control={form.control}
        />
        <Button disabled={isPending} type="submit" className="shad-button_primary">
          {isPending ? <Loader /> : "Submit"}
        </Button>
      </form>

      {isGuestPending ? (
        <Loader />
      ) : (
        <button onClick={handleGuestLogin} className="small-medium text-light-3">
          Try InstaHub as a Guest
        </button>
      )}
    </Form>
  );
};

export default SigninForm;
