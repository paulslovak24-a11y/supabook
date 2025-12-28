import React from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL || "",
  import.meta.env.VITE_SUPABASE_ANON_KEY || ""
);

export default function App() {
  return (
    <div style={{ padding: '40px', textAlign: 'center', fontFamily: 'sans-serif' }}>
      <h1 style={{ color: '#0070f3' }}>⚡ Circuitburst</h1>
      <p>System Online</p>
      <div style={{ marginTop: '20px', fontSize: '0.9rem', color: '#666' }}>
        Connection: {import.meta.env.VITE_SUPABASE_URL ? "Linked" : "Missing Keys"}
      </div>
    </div>
  );
}
