import React, { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';

// We use an empty string fallback to prevent "undefined" errors during build
const supabaseUrl = import.meta.env?.VITE_SUPABASE_URL || "";
const supabaseAnonKey = import.meta.env?.VITE_SUPABASE_ANON_KEY || "";

const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default function App() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check session safely
    const checkUser = async () => {
      try {
        const { data } = await supabase.auth.getSession();
        setSession(data?.session || null);
      } catch (e) {
        console.log("Auth not ready");
      } finally {
        setLoading(false);
      }
    };
    checkUser();
  }, []);

  if (loading) return <div style={{padding: '20px'}}>⚡ Circuitburst Loading...</div>;

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif', textAlign: 'center' }}>
      <h1>⚡ Circuitburst</h1>
      {session ? (
        <div>
          <p>Logged in as {session.user.email}</p>
          <button onClick={() => supabase.auth.signOut()}>Logout</button>
        </div>
      ) : (
        <p>System Online. Please sign in to broadcast.</p>
      )}
    </div>
  );
}
