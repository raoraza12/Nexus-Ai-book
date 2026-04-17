import { AuthForm } from "@/components/auth-form";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Sign In",
  description: "Sign in to your AI Book Platform account",
};

export default function LoginPage() {
  return (
    <main className="auth-page">
      <div className="auth-bg-gradient" />
      <div className="auth-container">
        <AuthForm mode="login" />
      </div>
    </main>
  );
}
