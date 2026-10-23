"use client";

import { useState } from "react";
import SetPasswordPage from "@/SetPasswordPage";
import LoadingScreen from "@/components/LoadingScreen";
import { getSupabaseClient, hasSupabaseConfig } from "@/lib/supabase";
import { useSupabaseSession } from "@/lib/use-supabase-session";

export default function SetPasswordRoute() {
  const { session, authReady, authError, setAuthError, authFlowType } = useSupabaseSession();
  const [authSuccess, setAuthSuccess] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSetPassword(password) {
    if (!hasSupabaseConfig) {
      setAuthError("Supabase belum dikonfigurasi untuk mengubah password.");
      return;
    }

    if (!session) {
      setAuthError("Sesi undangan tidak ditemukan. Buka ulang link dari email terbaru.");
      return;
    }

    setIsSubmitting(true);
    setAuthError("");
    setAuthSuccess("");

    const supabase = getSupabaseClient();
    const { error } = await supabase.auth.updateUser({ password });

    if (error) {
      setAuthError(error.message);
      setIsSubmitting(false);
      return;
    }

    setAuthSuccess("Password berhasil diperbarui. Anda akan diarahkan ke dashboard admin.");
    setIsSubmitting(false);

    window.history.replaceState({}, "", "/admin");
    window.location.assign("/admin");
  }

  if (!authReady) {
    return <LoadingScreen message="Memeriksa sesi undangan Anda." />;
  }

  return (
    <SetPasswordPage
      session={session}
      authError={authError}
      authSuccess={authSuccess}
      isSubmitting={isSubmitting}
      onSubmit={handleSetPassword}
      authFlowType={authFlowType}
    />
  );
}
