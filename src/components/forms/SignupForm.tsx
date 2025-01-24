import { UseFormReturn } from "react-hook-form";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import Loader from "@/components/shared/Loader";
import InputField from "@/components/forms/InputField";

type SignupFormFields = {
  name: string;
  email: string;
  username: string;
  password: string;
};

type SignupFormProps = {
  form: UseFormReturn<SignupFormFields>;
  onSubmit: (values: SignupFormFields) => void;
  isPending: boolean;
};

const SignupForm = ({ form, onSubmit, isPending }: SignupFormProps) => {
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-5 w-full mt-4 p-4">
        <InputField
          name="name"
          label="Full Name"
          placeholder="Enter your full name"
          type="text"
          control={form.control}
        />
        <InputField
          name="email"
          label="Email"
          placeholder="Enter your email"
          type="email"
          control={form.control}
        />
        <InputField
          name="username"
          label="Username"
          placeholder="Choose a username"
          type="text"
          control={form.control}
        />
        <InputField
          name="password"
          label="Password"
          placeholder="Create a password"
          type="password"
          control={form.control}
        />
        <Button disabled={isPending} type="submit" className="shad-button_primary">
          {isPending ? <Loader /> : "Submit"}
        </Button>
      </form>
    </Form>
  );
};

export default SignupForm;
