import React, { useState, useEffect } from 'react';
import { Plus, X, Edit2, Eye, BarChart3, Instagram, ExternalLink, Trash2 } from 'lucide-react';

export default function TaxoLinkBio() {
  const [view, setView] = useState('admin');
  const [posts, setPosts] = useState([]);
  const [settings, setSettings] = useState({
    bioTitle: '@_Taxo_',
    bioDescription: 'Explore our curated collection',
    brandColor: '#FF6B9D',
    backgroundColor: '#0A0A0A'
  });
  const [analytics, setAnalytics] = useState({});

  useEffect(() => {
    const loadData = async () => {
      try {
        const postsData = await window.storage.get('taxo-posts', false);
        const settingsData = await window.storage.get('taxo-settings', false);
        const analyticsData = await window.storage.get('taxo-analytics', false);

        if (postsData) setPosts(JSON.parse(postsData.value));
        if (settingsData) setSettings(JSON.parse(settingsData.value));
        if (analyticsData) setAnalytics(JSON.parse(analyticsData.value));
      } catch (error) {
        console.log('No existing data, starting fresh');
      }
    };
    loadData();
  }, []);

  const saveData = async (key, data) => {
    try {
      await window.storage.set(key, JSON.stringify(data), false);
    } catch (error) {
      console.error('Error saving:', error);
    }
  };

  const addPost = (post) => {
    const newPost = { ...post, id: Date.now(), clicks: 0 };
    const updated = [...posts, newPost];
    setPosts(updated);
    saveData('taxo-posts', updated);
  };

  const updatePost = (id, updatedPost) => {
    const updated = posts.map(p => p.id === id ? { ...p, ...updatedPost } : p);
    setPosts(updated);
    saveData('taxo-posts', updated);
  };

  const deletePost = (id) => {
    const updated = posts.filter(p => p.id !== id);
    setPosts(updated);
    saveData('taxo-posts', updated);
  };

  const trackClick = (postId) => {
    const newAnalytics = { ...analytics };
    newAnalytics[postId] = (newAnalytics[postId] || 0) + 1;
    setAnalytics(newAnalytics);
    saveData('taxo-analytics', newAnalytics);

    const updated = posts.map(p => 
      p.id === postId ? { ...p, clicks: (p.clicks || 0) + 1 } : p
    );
    setPosts(updated);
    saveData('taxo-posts', updated);
  };

  const updateSettings = (newSettings) => {
    setSettings(newSettings);
    saveData('taxo-settings', newSettings);
  };

  return (
    <div style={{ 
      fontFamily: "'Archivo', sans-serif",
      minHeight: '100vh',
      background: view === 'admin' ? '#F5F5F0' : settings.backgroundColor
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Archivo:wght@400;600;700&family=Fraunces:wght@600;700&display=swap');
        
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes scaleIn {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }

        .post-card {
          animation: scaleIn 0.3s ease-out;
        }

        .post-card:hover {
          transform: translateY(-2px);
          transition: all 0.2s ease;
        }

        .link-item​​​​​​​​​​​​​​​​
