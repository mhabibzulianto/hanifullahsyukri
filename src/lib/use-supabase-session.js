"use client";

import { useEffect, useState } from "react";
import { getSupabaseClient, hasSupabaseConfig } from "./supabase";

const SESSION_CHECK_TIMEOUT_MS = 2500;

function getAuthTypeFromUrl() {
  if (typeof window === "undefined") {
    return "";
  }

  const searchParams = new URLSearchParams(window.location.search);
  const hashParams = new URLSearchParams(window.location.hash.replace(/^#/, ""));

  return searchParams.get("type") || hashParams.get("type") || "";
}

export function useSupabaseSession() {
  const [session, setSession] = useState(null);
  const [authReady, setAuthReady] = useState(!hasSupabaseConfig);
  const [authError, setAuthError] = useState("");
  const [authFlowType, setAuthFlowType] = useState(getAuthTypeFromUrl());

  useEffect(() => {
    if (!hasSupabaseConfig) {
      return undefined;
    }

    const supabase = getSupabaseClient();
    let isMounted = true;
    let hasResolvedInitialSession = false;

    const finishInitialSessionCheck = ({ errorMessage = "", nextSession = null } = {}) => {
      if (!isMounted) {
        return;
      }

      hasResolvedInitialSession = true;
      setSession(nextSession);
      setAuthFlowType(getAuthTypeFromUrl());
      setAuthReady(true);

      if (errorMessage) {
        setAuthError(errorMessage);
      }
    };

    const fallbackTimer = window.setTimeout(() => {
      if (hasResolvedInitialSession || !isMounted) {
        return;
      }

      finishInitialSessionCheck({
        errorMessage:
          "Pemeriksaan sesi memakan waktu terlalu lama. Anda tetap bisa melanjutkan login.",
      });
    }, SESSION_CHECK_TIMEOUT_MS);

    supabase.auth
      .getSession()
      .then(({ data, error }) => {
        window.clearTimeout(fallbackTimer);
        finishInitialSessionCheck({
          errorMessage: error?.message || "",
          nextSession: data.session ?? null,
        });
      })
      .catch((error) => {
        window.clearTimeout(fallbackTimer);
        finishInitialSessionCheck({
          errorMessage:
            error?.message ||
            "Sesi tersimpan tidak dapat diperiksa. Silakan lanjut login manual.",
        });
      });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, nextSession) => {
      if (!isMounted) {
        return;
      }

      setSession(nextSession ?? null);
      setAuthFlowType(event === "PASSWORD_RECOVERY" ? "recovery" : getAuthTypeFromUrl());
      setAuthReady(true);
      setAuthError("");
    });

    return () => {
      isMounted = false;
      window.clearTimeout(fallbackTimer);
      subscription.unsubscribe();
    };
  }, []);

  return {
    session,
    authReady,
    authError,
    setAuthError,
    authFlowType,
  };
}
