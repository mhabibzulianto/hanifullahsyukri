"use client";

import { useEffect, useState } from "react";
import LoginPage from "@/LoginPage";
import LoadingScreen from "@/components/LoadingScreen";
import { getSupabaseClient, hasSupabaseConfig } from "@/lib/supabase";
import { useSupabaseSession } from "@/lib/use-supabase-session";

export default function LoginRoute() {
  const { session, authReady, authError, setAuthError } = useSupabaseSession();
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (authReady && session) {
      window.location.assign("/admin");
    }
  }, [authReady, session]);

  async function handleLogin({ email, password }) {
    if (!hasSupabaseConfig) {
      setAuthError("Supabase belum dikonfigurasi untuk login.");
      return;
    }

    setIsSubmitting(true);
    setAuthError("");

    const supabase = getSupabaseClient();
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setAuthError(error.message);
    }

    setIsSubmitting(false);
  }

  if (session) {
    return <LoadingScreen message="Mengalihkan Anda ke dashboard admin." />;
  }

  return (
    <LoginPage
      authError={authError}
      isSubmitting={isSubmitting}
      onLogin={handleLogin}
    />
  );
}
