import { signInWithEmailAndPassword } from "firebase/auth";
import React, { useState, FormEvent } from "react";
import { auth } from "../firebase";
import { toast } from "react-toastify";
import SignInwithGoogle from "./signInWithGoogle";

const Login: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      console.log("User logged in Successfully");
      window.location.href = "/homepage";
      toast.success("User logged in Successfully", {
        position: "top-center",
      });
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.log(error.message);
        toast.error(error.message, {
          position: "bottom-center",
        });
      } else {
        console.log("An unexpected error occurred");
        toast.error("An unexpected error occurred", {
          position: "bottom-center",
        });
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-400 to-rose-300 flex items-center justify-center">
      <form
        onSubmit={handleSubmit}
        className="bg-white/90 backdrop-blur-lg p-8 rounded-lg shadow-lg w-full max-w-md"
      >
        <h3 className="text-2xl font-semibold text-center text-pink-500 mb-6">
          Login Form
        </h3>

        <div className="mb-4">
          <label className="block text-sm font-medium text-pink-700 mb-2">
            Email Address
          </label>
          <input
            type="email"
            className="w-full px-4 py-2 border border-pink-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-pink-400"
            placeholder="Enter email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-pink-700 mb-2">
            Password
          </label>
          <input
            type="password"
            className="w-full px-4 py-2 border border-pink-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-pink-400"
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <div className="flex items-center mb-6">
          <input
            type="checkbox"
            className="text-pink-500 focus:ring-pink-400 focus:ring-2 h-4 w-4"
            id="remember"
          />
          <label htmlFor="remember" className="ml-2 text-sm text-pink-700">
            Remember me
          </label>
        </div>

        <button
          type="submit"
          className="w-full bg-gradient-to-r from-pink-500 to-rose-400 text-white py-2 rounded-md font-semibold hover:opacity-90 transition"
        >
          Log In
        </button>

        <p className="text-center text-sm text-pink-700 mt-4">
          Forgot password?{" "}
          <a href="#" className="text-pink-500 hover:underline">
            Click Here
          </a>
        </p>
        <p className="text-center text-sm text-pink-700 mt-2">
          Don't have an account?{" "}
          <a href="/register" className="text-pink-500 hover:underline">
            Sign up
          </a>
        </p>
        <SignInwithGoogle />
      </form>
    </div>
  );
};

export default Login;
