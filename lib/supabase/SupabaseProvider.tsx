"use client";

import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { useSession } from "@clerk/nextjs";
import { useState, createContext, useContext, useEffect } from "react";
import { Loader } from "lucide-react";

type SupabaseContext = {
  supabase: SupabaseClient | null;
  isLoaded: boolean;
};

const Context = createContext<SupabaseContext>({
  supabase: null,
  isLoaded: false,
});

export default function SupabaseProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { session, isLoaded: isClerkLoaded } = useSession();
  const [supabase, setSupabase] = useState<SupabaseClient | null>(null);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);

  useEffect(() => {
    if (!session) return;

    const client = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        accessToken: async () => session?.getToken() ?? null,
      }
    );

    setSupabase(client);
    setIsLoaded(true);
  }, [session]);

  //show loading state only while clerk is loading
  if (!isClerkLoaded) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader className="size-10 animate-spin " />
      </div>
    );
  }

  return (
    <Context.Provider value={{ supabase, isLoaded }}>
      {/* {!isLoaded ? <div>...Loading</div> : children} */}
      {children}
    </Context.Provider>
  );
}

export const useSupabase = () => {
  const context = useContext(Context);
  if (context === undefined) {
    throw new Error("useSupabase needs to be inside the provider");
  }

  return context;
};
