import { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Features from './components/Features';
import Dashboard from './components/Dashboard';
import Transformations from './components/Transformations';
import BMICalculator from './components/BMICalculator';
import CalorieCalculator from './components/CalorieCalculator';
import Pricing from './components/Pricing';
import Testimonials from './components/Testimonials';
import Footer from './components/Footer';
import AuthModal from './components/AuthModal';
import ProfileSetup from './components/ProfileSetup';
import { supabase } from './lib/supabase';
import type { User } from '@supabase/supabase-js';
import UserDashboard from './components/UserDashboard';

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authDefaultTab, setAuthDefaultTab] = useState<'login' | 'signup'>('signup');
  const [showProfileSetup, setShowProfileSetup] = useState(false);
  const [showDashboard, setShowDashboard] = useState(false);

  useEffect(() => {
    if (!supabase) return;

    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  function openAuth(tab: 'login' | 'signup' = 'signup') {
    setAuthDefaultTab(tab);
    setAuthModalOpen(true);
  }

  async function handleLogout() {
    if (supabase) {
      await supabase.auth.signOut();
    }
  }
  
 if (showDashboard) {
  return <UserDashboard user={user} />;
}

  if (showProfileSetup) {
    return (
      <div className="bg-surface-black text-white overflow-x-hidden">
        <ProfileSetup
          user={user}
          onBack={() => setShowProfileSetup(false)}
        />
      </div>
    );
  }

  return (
    <div className="bg-surface-black text<think> overflow-x-hidden">
<Navbar
  user={user}
  onSignUp={() => openAuth('signup')}
  onLogin={() => openAuth('login')}
  onLogout={handleLogout}
  onProfile={() => setShowProfileSetup(true)}
  onDashboard={() => setShowDashboard(true)}
/>
      <Hero onSignUp={() => openAuth('signup')} />
      <Features />
      {user && <UserDashboard user={user} />}
      <BMICalculator />
      <CalorieCalculator />
      <Transformations />
      <Pricing />
      <Testimonials />
      <Footer />
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => {
          setAuthModalOpen(false);
          if (user) setShowProfileSetup(true);
        }}
        defaultTab={authDefaultTab}
      />
    </div>
  );
}
