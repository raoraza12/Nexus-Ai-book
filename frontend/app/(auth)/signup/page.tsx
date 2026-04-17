import { AuthForm } from "@/components/auth-form";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Sign Up",
  description: "Create your AI Book Platform account",
};

export default function SignupPage() {
  return (
    <main className="auth-page">
      <div className="auth-bg-gradient" />
      <div className="auth-container">
        <AuthForm mode="signup" />
      </div>
    </main>
  );
}
