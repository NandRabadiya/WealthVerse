import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useAuth } from "../../auth/AuthContext";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { User } from "lucide-react";

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data) => {
    // If data is passed directly from a demo account button
    const email = data.email || "";
    const password = data.password || "";

    const result = await login(email, password);
    if (!result.success) {
      setError(result.error || "Invalid email or password");
      return;
    }
    navigate("/");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
      <div className="w-full max-w-md bg-gray-800 p-8 rounded-xl shadow-lg">
        <h1 className="text-2xl font-bold text-center mb-6 text-green-400">
          Login
        </h1>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div>
            <label className="block mb-1 text-sm text-gray-300">Email</label>
            <Input
              {...register("email")}
              placeholder="Enter your email"
              error={errors.email?.message}
            />
          </div>
          <div>
            <label className="block mb-1 text-sm text-gray-300">Password</label>
            <Input
              type="password"
              {...register("password")}
              placeholder="Enter your password"
              error={errors.password?.message}
            />
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <Button
            type="submit"
            className="w-full bg-green-400 text-black hover:bg-green-500"
          >
            Login
          </Button>
          <div className="text-center mt-6">
            <p className="text-sm text-gray-400 mb-3">
              OR use any of below accounts
            </p>
            <div className="flex justify-center gap-6">
              {[
                {
                  name: "Venu",
                  email: "venupatel004@gmail.com",
                  password: "Venu@123",
                },
                {
                  name: "Nand",
                  email: "nandrabadiya2003@gmail.com",
                  password: "Nand@123",
                },
                {
                  name: "Shaily",
                  email: "shaily@gmail.com",
                  password: "Shaily@123",
                },
                {
                  name: "Kunj",
                  email: "kunjvasoya03@gmail.com",
                  password: "Kunj@123",
                },
              ].map((account, index) => (
                <div
                  key={index}
                  onClick={() => onSubmit(account)}
                  className="flex flex-col items-center cursor-pointer"
                >
                  <div className="flex justify-center items-center w-12 h-12 bg-blue-900 rounded-full hover:opacity-90 transition-opacity mb-1">
                    <User className="text-white w-6 h-6" />
                  </div>
                  <span className="text-xs text-gray-400">{account.name}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-400">
              Don't have an account?{" "}
              <Link to="/signup" className="text-green-400 hover:underline">
                Sign Up
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
