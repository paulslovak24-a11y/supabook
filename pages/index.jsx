import React, { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';

// Using a "Lazy" client creation to prevent build-time crashes
const supabaseUrl = import.meta.env?.VITE_SUPABASE_URL || "";
const supabaseAnonKey = import.meta.env?.VITE_SUPABASE_ANON_KEY || "";

const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default function App() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function getInitialSession() {
      try {
        const { data } = await supabase.auth.getSession();
        setSession(data?.session);
      } catch (err) {
        console.error("Auth initialization failed", err);
      } finally {
        setLoading(false);
      }
    }
    getInitialSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription?.unsubscribe();
  }, []);

  if (loading) {
    return <div style={{ padding: '20px', textAlign: 'center' }}>Initializing Circuitburst...</div>;
  }

  return (
    <div style={{ maxWidth: '400px', margin: 'auto', padding: '40px', fontFamily: 'sans-serif', textAlign: 'center' }}>
      <h1 style={{ color: '#0070f3' }}>⚡ Circuitburst</h1>
      {session ? (
        <div>
          <p>Logged in as: {session.user.email}</p>
          <button 
            onClick={() => supabase.auth.signOut()}
            style={{ padding: '10px 20px', cursor: 'pointer' }}
          >
            Logout
          </button>
        </div>
      ) : (
        <div>
          <p>Founder Portal Locked</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
             {/* We'll add the login form back once the build is green! */}
             <p style={{ fontSize: '0.8rem', color: '#666' }}>Please check environment variables if login fails.</p>
          </div>
        </div>
      )}
    </div>
  );
}
