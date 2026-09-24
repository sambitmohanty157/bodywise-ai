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
import RefundPolicy from './RefundPolicy';
import PrivacyPolicy from './PrivacyPolicy';
import AboutUs from './AboutUs';
import Contact from './Contact';
import TermsOfService from './TermsOfService';

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authDefaultTab, setAuthDefaultTab] = useState<'login' | 'signup'>('signup');
  const [showProfileSetup, setShowProfileSetup] = useState(false);
  const [showDashboard, setShowDashboard] = useState(false);
  const [showRefundPolicy, setShowRefundPolicy] = useState(false);
  const [showPrivacyPolicy, setShowPrivacyPolicy] = useState(false);
  const [showAboutUs, setShowAboutUs] = useState(false);
  const [showContact, setShowContact] = useState(false);
  const [showTermsOfService, setShowTermsOfService] = useState(false);

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
 
  if (showRefundPolicy) {
  return <RefundPolicy onBack={() => setShowRefundPolicy(false)} />;
}

if (showPrivacyPolicy) {
  return <PrivacyPolicy onBack={() => setShowPrivacyPolicy(false)} />;
}

if (showAboutUs) {
  return <AboutUs onBack={() => setShowAboutUs(false)} />;
}

if (showContact) {
  return <Contact onBack={() => setShowContact(false)} />;
}

if (showTermsOfService) {
  return (
    <TermsOfService
      onBack={() => setShowTermsOfService(false)}
    />
  );
}

 if (showDashboard) {
  return (
    <div className="relative">
      <button
        onClick={() => setShowDashboard(false)}
        className="fixed top-5 left-5 z-50 flex items-center gap-2 px-4 py-2.5 bg-surface-gray-900/90 border border-white/[0.08] rounded-lg text-sm font-semibold text-white hover:bg-surface-gray-800 transition-all backdrop-blur-md"
      >
        ← Back to Home
      </button>

      <UserDashboard user={user} />
    </div>
  );
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
      <Footer
      onRefundPolicy={() => setShowRefundPolicy(true)}
      onPrivacyPolicy={() => setShowPrivacyPolicy(true)}
      onAboutUs={() => setShowAboutUs(true)}
      onContact={() => setShowContact(true)}
      onTermsOfService={() => setShowTermsOfService(true)}
      onDashboard={() => setShowDashboard(true)}
/>
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
