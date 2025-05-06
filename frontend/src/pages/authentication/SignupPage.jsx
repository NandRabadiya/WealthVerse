import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "../../auth/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import { z } from "zod";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useState } from "react";

const signupSchema = z
  .object({
    name: z.string().min(2, "Name is required"),
    dob: z.string().nonempty("Date of Birth is required"),
    email: z.string().email("Invalid email address").nonempty(),
    password: z.string().min(6, "Password must be at least 6 characters long"),
    confirmPassword: z
      .string()
      .min(6, "Password must be at least 6 characters long"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

const SignupPage = () => {
  const navigate = useNavigate();
  const { signup } = useAuth();
  const [error, setError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(signupSchema),
  });

  const onSubmit = async (data) => {
    console.log(data);
    const result = await signup(data.name, data.email, data.password, data.dob);
    if (!result.success) {
      setError(result.error || "Signup failed");
      return;
    }
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
      <div className="max-w-md w-full p-6 bg-gray-800 rounded-xl">
        <h2 className="text-2xl text-white mb-6 text-center">Sign Up</h2>
        {error && <p className="text-red-500 mb-4 text-center">{error}</p>}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input
            {...register("name")}
            placeholder="Full Name"
            error={errors.name?.message}
            className="mb-4"
          />
          <Input
            type="date"
            {...register("dob")}
            placeholder="Date of Birth"
            error={errors.dob?.message}
            className="mb-4"
          />
          <Input
            {...register("email")}
            placeholder="Email"
            error={errors.email?.message}
            className="mb-4"
          />
          <Input
            type="password"
            {...register("password")}
            placeholder="Password"
            error={errors.password?.message}
            className="mb-4"
          />
          <Input
            type="password"
            {...register("confirmPassword")}
            placeholder="Confirm Password"
            error={errors.confirmPassword?.message}
            className="mb-6"
          />
          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-green-400 hover:bg-green-600 text-gray-900"
          >
            {isSubmitting ? "Creating account..." : "Sign Up"}
          </Button>
          <div className="mt-4 text-center">
            <span className="text-gray-400">Already have an account? </span>
            <Link to="/login" className="text-green-400 hover:underline">
              Login
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignupPage;
