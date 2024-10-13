"use client";
import { use, useContext, useEffect, useState } from "react";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { set, z } from "zod";
import { Eye, EyeOff } from "lucide-react";
import { AuthContext } from "~/providers/authProvider";
import { useRouter } from "next/navigation";
import Link from "next/link";

const RegisterPage = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [secondPassword, setSecondPassword] = useState("");
  const [passswordVisible, setPasswordVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const { register, isLoggedIn } = useContext(AuthContext);
  const router = useRouter();

  useEffect(() => {
    if (isLoggedIn) {
      setError("You are already logged in");
      router.push("/");
    }
  }, [isLoggedIn]);

  const user = z.object({
    name: z.string().min(3),
    email: z.string().email(),
    password: z.string().min(6),
  });

  const handleSubmit = async () => {
    setLoading(true);
    if (password !== secondPassword) {
      setError("Passwords do not match");
      return;
    }
    try {
      const result = user.parse({ name, email, password });
      setError("");
      register(name, email, password);
      console.log(result);
    } catch (err) {
      setError(err.errors[0].message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen flex-col items-center justify-center">
      <div className="mx-auto my-auto w-[420px] rounded-3xl bg-secondary px-12 py-8">
        <div className="mb-5 text-3xl font-extrabold">Register</div>
        {error !== "" && (
          <div className="mb-3 border-l-4 border-red-600 bg-red-400 bg-opacity-25 px-4 text-white">
            {error}
          </div>
        )}
        <div className="space-y-4">
          <div>
            <Label>Name</Label>
            <Input
              type="text"
              placeholder="Enter Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div>
            <Label>Email</Label>
            <Input
              type="email"
              placeholder="Enter Email Id"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <Label>Password</Label>
            <div className="relative">
              <Input
                type={passswordVisible ? "text" : "password"}
                placeholder="Enter Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <div
                className="absolute right-2 top-2 cursor-pointer"
                onClick={() => setPasswordVisible(!passswordVisible)}
              >
                {passswordVisible ? <EyeOff size={24} /> : <Eye size={24} />}
              </div>
            </div>
          </div>
          <div>
            <Label>Confirm Password</Label>
            <Input
              type={passswordVisible ? "text" : "password"}
              placeholder="Enter Password"
              value={secondPassword}
              onChange={(e) => setSecondPassword(e.target.value)}
            />
          </div>

          <div>
            <button
              className="w-full rounded-3xl bg-primary py-2 text-black"
              onClick={handleSubmit}
              disabled={loading}
            >
              {loading ? "Loading..." : "Register"}
            </button>
            <button className="mx-auto w-full p-4 text-center hover:underline">
              <Link href={"/login"}>Already Registered? Login Here</Link>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
