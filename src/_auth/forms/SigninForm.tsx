import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

// Define the schema using Zod for form validation
const schema = z.object({
  email: z.string().email({ message: "Invalid email" }), // Custom error message
  password: z.string().min(8, { message: "Password must be at least 8 characters" }), // Custom error message
});

// Define the form's data structure
interface FormValues {
  email: string;
  password: string;
}

const SigninForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      email: "",
      password: "",
    },
    resolver: zodResolver(schema),
  });

  const handleSignInForm = (data: FormValues) => {
    console.log(data);
  };

  return (
    <div>
      <form
        onSubmit={handleSubmit(handleSignInForm)}
        className="flex flex-col gap-3"
      >
        <input className="text-black" type="email" {...register("email")} />
        {errors.email && <p>{errors.email.message}</p>}
        <input
          className="text-black"
          type="password"
          {...register("password")}
        />
        {errors.password && <p>{errors.password.message}</p>}
        <button type="submit" className="border">
          Submit
        </button>
      </form>
    </div>
  );
};

export default SigninForm;
