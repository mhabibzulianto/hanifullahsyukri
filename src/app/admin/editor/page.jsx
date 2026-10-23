"use client";

import { useEffect } from "react";
import TiptapEditor from "@/components/TiptapEditor";
import LoadingScreen from "@/components/LoadingScreen";
import { useSupabaseSession } from "@/lib/use-supabase-session";

export default function AdminEditorRoute() {
  const { session, authReady } = useSupabaseSession();

  useEffect(() => {
    if (authReady && !session) {
      window.location.assign("/login");
    }
  }, [authReady, session]);

  if (!authReady) {
    return (
      <LoadingScreen message="Memeriksa session login yang tersimpan di browser Anda." />
    );
  }

  if (!session) {
    return <LoadingScreen message="Mengalihkan Anda ke halaman login admin." />;
  }

  return (
    <TiptapEditor
      currentUser={session.user}
      onBack={() => {
        window.localStorage.setItem("hs-admin-active-tab", "artikel");
        window.location.assign("/admin");
      }}
    />
  );
}
