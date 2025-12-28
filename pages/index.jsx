import React, { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';

// Connection to your Supabase project
const supabase = createClient(
  import.meta.env?.VITE_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  import.meta.env?.VITE_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
);

export default function CircuitburstApp() {
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState('');
  const [loading, setLoading] = useState(false);

  // 1. Fetch posts from the database (Newest first)
  const fetchPosts = async () => {
    const { data, error } = await supabase
      .from('posts')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) console.error("Error fetching:", error.message);
    else setPosts(data || []);
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  // 2. Handle Submitting a New Post
  const handlePost = async () => {
    if (!newPost.trim()) return;
    setLoading(true);
    
    const { error } = await supabase.from('posts').insert([
      { 
        content: newPost, 
        username: 'Founder' // You can change this to your name!
      }
    ]);
    
    if (error) {
      alert("Error posting: " + error.message);
    } else {
      setNewPost('');
      fetchPosts();
    }
    setLoading(false);
  };

  // 3. Handle Deleting a Post
  const handleDelete = async (id) => {
    const { error } = await supabase.from('posts').delete().eq('id', id);
    if (error) alert("Error deleting: " + error.message);
    else fetchPosts();
  };

  return (
    <div style={{ 
      padding: '40px 20px', 
      maxWidth: '600px', 
      margin: '0 auto', 
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      backgroundColor: '#f9f9f9',
      minHeight: '100vh'
    }}>
      <header style={{ textAlign: 'center', marginBottom: '40px' }}>
        <h1 style={{ color: '#0070f3', fontSize: '2.5rem', margin: '0' }}>⚡ Circuitburst</h1>
        <p style={{ color: '#666' }}>Founder Portal</p>
      </header>
      
      {/* POST BOX */}
      <div style={{ 
        backgroundColor: '#fff', 
        padding: '20px', 
        borderRadius: '12px', 
        boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
        marginBottom: '30px' 
      }}>
        <textarea 
          placeholder="What's on your mind, Founder?"
          value={newPost}
          onChange={(e) => setNewPost(e.target.value)}
          style={{ 
            width: '100%', 
            height: '100px', 
            padding: '12px', 
            borderRadius: '8px', 
            border: '1px solid #ddd',
            fontSize: '16px',
            boxSizing: 'border-box',
            resize: 'none'
          }}
        />
        <button 
          onClick={handlePost}
          disabled={loading}
          style={{ 
            marginTop: '12px', 
            width: '100%',
            padding: '12px', 
            background: '#0070f3', 
            color: '#fff', 
            border: 'none', 
            borderRadius: '8px', 
            fontWeight: 'bold',
            cursor: 'pointer',
            opacity: loading ? 0.7 : 1
          }}
        >
          {loading ? 'Sending...' : 'Post to Feed'}
        </button>
      </div>

      {/* FEED */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        {posts.map(p => (
          <div key={p.id} style={{ 
            backgroundColor: '#fff', 
            padding: '20px', 
            borderRadius: '12px', 
            border: '1px solid #eee',
            position: 'relative'
          }}>
            <div style={{ marginBottom: '8px' }}>
              <span style={{ fontWeight: 'bold', color: '#333' }}>@{p.username || 'Anonymous'}</span>
              <span style={{ fontSize: '0.8rem', color: '#999', marginLeft: '10px' }}>
                {new Date(p.created_at).toLocaleTimeString()}
              </span>
            </div>
            <p style={{ margin: '0', color: '#444', lineHeight: '1.5' }}>{p.content}</p>
            
            <button 
              onClick={() => handleDelete(p.id)}
              style={{ 
                position: 'absolute', 
                top: '15px', 
                right: '15px', 
                background: 'none', 
                border: 'none', 
                color: '#ff4d4f', 
                cursor: 'pointer',
                fontSize: '0.8rem'
              }}
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
