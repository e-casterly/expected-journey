import Link from "next/link";
import { SignUpForm } from "@/features/auth/sign-up/SignUpForm";

export default function SignUpPage() {
  return (
    <div className="flex flex-1 items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight">
            Create your account
          </h2>
          <p className="mt-2 text-sm text-zinc-600">
            Already have an account?{" "}
            <Link
              href="/signin"
              className="font-medium text-zinc-900 hover:text-zinc-700"
            >
              Sign in
            </Link>
          </p>
        </div>
        <SignUpForm />
      </div>
    </div>
  );
}
