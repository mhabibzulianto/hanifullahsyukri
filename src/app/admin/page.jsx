"use client";

import { useEffect, useState } from "react";
import AdminDashboard from "@/AdminDashboard";
import LoadingScreen from "@/components/LoadingScreen";
import { getSupabaseClient, hasSupabaseConfig } from "@/lib/supabase";
import { useSupabaseSession } from "@/lib/use-supabase-session";

function openNewArticleEditor() {
  window.localStorage.setItem("hs-admin-active-tab", "artikel");
  window.sessionStorage.removeItem("hs-editor-draft");
  window.location.assign("/admin/editor");
}

export default function AdminRoute() {
  const { session, authReady, authError, setAuthError } = useSupabaseSession();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  useEffect(() => {
    if (authReady && !session) {
      window.location.assign("/login");
    }
  }, [authReady, session]);

  async function handleLogout() {
    if (!hasSupabaseConfig) {
      window.location.assign("/login");
      return;
    }

    setIsLoggingOut(true);
    const supabase = getSupabaseClient();
    const { error } = await supabase.auth.signOut();

    if (error) {
      setAuthError(error.message);
    }

    setIsLoggingOut(false);
    window.location.assign("/login");
  }

  if (!authReady) {
    return <LoadingScreen message="Memeriksa session login yang tersimpan di browser Anda." />;
  }

  if (!session) {
    return <LoadingScreen message={authError || "Mengalihkan Anda ke halaman login admin."} />;
  }

  return (
    <AdminDashboard
      currentUser={session.user}
      onLogout={handleLogout}
      isLoggingOut={isLoggingOut}
      onCreateArticle={openNewArticleEditor}
    />
  );
}
