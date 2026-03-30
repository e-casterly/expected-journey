import Link from "next/link";
import { SignInForm } from "@/features/auth/sign-in/SignInForm";

export default function SignInPage() {

  return (
    <div className="flex flex-1 items-center justify-center px-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-zinc-900">
            Sign in to your account
          </h2>
          <p className="mt-2 text-sm text-zinc-600">
            Or{" "}
            <Link
              href="/signup"
              className="font-medium text-zinc-900 hover:text-zinc-700"
            >
              create a new account
            </Link>
          </p>
        </div>
        <SignInForm />
      </div>
    </div>
  );
}
