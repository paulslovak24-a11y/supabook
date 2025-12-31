import React, { useState, useEffect } from 'react'
import ReactDOM from 'react-dom/client'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://qebchzrttfhkaufuolrt.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFlYmNoenJ0dGZoa2F1ZnVvbHJ0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjY3Mzg4NDAsImV4cCI6MjA4MjMxNDg0MH0.6eWlFuvxAVkFKOCzxs7jgkqijMoKQt5jMG0eESa0Uj0'

const supabase = createClient(supabaseUrl, supabaseAnonKey)

function App() {
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('feed'); 
  const [posts, setPosts] = useState([]);
  const [dms, setDms] = useState([]);
  const [inputText, setInputText] = useState('');
  const [recipient, setRecipient] = useState('');
  const [email, setEmail] = useState('');

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) { fetchAll(session.user.email); }
    });
  }, []);

  async function fetchAll(myEmail) {
    const { data: postData } = await supabase.from('posts').select('*').order('created_at', { ascending: false });
    if (postData) setPosts(postData);
    
    const { data: dmData } = await supabase.from('messages')
      .select('*')
      .or(`sender_email.eq.${myEmail.toLowerCase()},receiver_email.eq.${myEmail.toLowerCase()}`)
      .order('created_at', { ascending: true });
    if (dmData) setDms(dmData);
  }

  const handlePost = async (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    await supabase.from('posts').insert([{ user_email: user.email.toLowerCase(), content: inputText }]);
    setInputText('');
    fetchAll(user.email);
  }

  const handleDeletePost = async (postId) => {
    if (!window.confirm("Delete this post?")) return;
    await supabase.from('posts').delete().eq('id', postId);
    fetchAll(user.email);
  }

  const handleSendDM = async (e) => {
    e.preventDefault();
    if (!inputText.trim() || !recipient.trim()) return;
    await supabase.from('messages').insert([{ 
      sender_email: user.email.toLowerCase(), 
      receiver_email: recipient.toLowerCase().trim(), 
      message_content: inputText 
    }]);
    setInputText('');
    setRecipient('');
    fetchAll(user.email);
    alert("Message sent!");
  }

  const CircuitHeader = () => (
    <div style={{ width: '100%', background: '#0f172a', padding: '20px 0', textAlign: 'center', borderBottom: '3px solid #38bdf8' }}>
      <h1 style={{ color: '#38bdf8', margin: 0, fontSize: '1.8rem', fontWeight: 'bold' }}>⚡ Circuitburst</h1>
    </div>
  );

  if (!user) {
    return (
      <div style={{ backgroundColor: '#0f172a', color: 'white', minHeight: '100vh', fontFamily: 'sans-serif' }}>
        <CircuitHeader />
        <center style={{ marginTop: '50px' }}>
          <form onSubmit={async (e) => { e.preventDefault(); await supabase.auth.signInWithOtp({ email }); alert("Check email for login link!"); }}>
            <input type="email" placeholder="Email" onChange={e => setEmail(e.target.value)} style={{ padding: '12px', borderRadius: '8px', border: 'none', width: '220px' }} />
            <button type="submit" style={{ padding: '12px 20px', marginLeft: '5px', background: '#38bdf8', border: 'none', borderRadius: '8px', fontWeight: 'bold' }}>Login</button>
          </form>
        </center>
      </div>
    )
  }

  return (
    <div style={{ backgroundColor: '#0f172a', color: 'white', minHeight: '100vh', fontFamily: 'sans-serif' }}>
      <CircuitHeader />
      
      <nav style={{ display: 'flex', justifyContent: 'center', gap: '10px', padding: '15px' }}>
        <button onClick={() => setActiveTab('feed')} style={{ background: activeTab === 'feed' ? '#38bdf8' : '#1e293b', color: activeTab === 'feed' ? '#000' : '#fff', padding: '10px 15px', border: 'none', borderRadius: '5px
