import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export function useAnonAuth() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let mounted = true;

    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      if (mounted && session) setReady(true);
    });

    (async () => {
      const { data } = await supabase.auth.getSession();
      if (!mounted) return;
      if (data.session) {
        setReady(true);
      } else {
        const { error } = await supabase.auth.signInAnonymously();
        if (error) console.error("Anon sign-in failed:", error);
      }
    })();

    return () => {
      mounted = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  return ready;
}
