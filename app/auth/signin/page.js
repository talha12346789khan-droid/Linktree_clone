"use client";
import { signIn } from "next-auth/react";
import { useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";

function SignInContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const callbackUrl = searchParams.get("callbackUrl") || "/generate";

  const handleSignIn = async (provider) => {
    setIsLoading(true);
    await signIn(provider, { callbackUrl });
    setIsLoading(false);
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-pink-600 flex items-center justify-center p-4 ">
      <div className="bg-white rounded-lg shadow-2xl p-6 sm:p-8 max-w-sm w-full">
        <div className="text-center mb-8">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800 mb-2">
            Welcome to LinkTree
          </h1>
          <p className="text-gray-600 text-sm sm:text-base">
            Sign in to create and manage your link in bio
          </p>
        </div>

        <div className="space-y-3 sm:space-y-4">
          <button
            onClick={() => handleSignIn("github")}
            disabled={isLoading}
            className="w-full bg-gray-800 text-white font-bold py-2.5 sm:py-3 rounded-lg hover:bg-gray-900 transition disabled:opacity-50 text-sm sm:text-base"
          >
            {isLoading ? "Signing in..." : "Sign in with GitHub"}
          </button>

          <button
            onClick={() => handleSignIn("google")}
            disabled={isLoading}
            className="w-full bg-blue-600 text-white font-bold py-2.5 sm:py-3 rounded-lg hover:bg-blue-700 transition disabled:opacity-50 text-sm sm:text-base"
          >
            {isLoading ? "Signing in..." : "Sign in with Google"}
          </button>
        </div>

        <p className="text-center text-gray-600 text-xs sm:text-sm mt-6">
          By signing in, you agree to our terms of service
        </p>
      </div>
    </main>
  );
}

export default function SignIn() {
  return (
    <Suspense fallback={
      <main className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-pink-600 flex items-center justify-center">
        <div className="text-white text-lg">Loading...</div>
      </main>
    }>
      <SignInContent />
    </Suspense>
  );
}
