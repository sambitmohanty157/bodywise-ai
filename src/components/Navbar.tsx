import { useState, useEffect } from 'react';
import { Menu, X, Zap, LogOut, User } from 'lucide-react';
import type { AuthUser } from '@supabase/supabase-js';

interface NavbarProps {
  user: AuthUser | null;
  onSignUp: () => void;
  onLogin: () => void;
  onLogout: () => void;
  onProfile?: () => void;
  onDashboard?: () => void;
}
export default function Navbar({
  user,
  onSignUp,
  onLogin,
  onLogout,
  onProfile,
  onDashboard
}: NavbarProps) {


  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const links = [
    { label: 'Features', href: '#features' },
    { label: 'Dashboard', href: '#dashboard' },
    { label: 'Transformations', href: '#transformations' },
    { label: 'Pricing', href: '#pricing' },
    { label: 'Testimonials', href: '#testimonials' },
  ];

  const displayName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'User';

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-surface-black/80 backdrop-blur-xl border-b border-white/[0.04] shadow-lg shadow-black/30'
          : 'bg-transparent'
      }`}
    >
      <div className="section-container flex items-center justify-between h-16 py-4">
        <a href="#" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 bg-brand-red rounded-lg flex items-center justify-center group-hover:shadow-[0_0_20px_rgba(229,57,53,0.4)] transition-shadow duration-300">
            <Zap className="w-4 h-4 text-white" />
          </div>
          <span className="text-lg font-extrabold tracking-tight">
            Body<span className="text-brand-red">Wise</span> AI
          </span>
        </a>

        <div className="hidden md:flex items-center gap-7">
          {links.map((l) => (
            <a
  key={l.href}
  href={l.href}
  onClick={(e) => {
    if (l.label === 'Dashboard' && user) {
      e.preventDefault();
      onDashboard?.();
    }
  }}
  className="text-[13px] font-medium text-surface-gray-400 hover:text-white transition-colors duration-200 relative after:absolute after:bottom-[-6px] after:left-0 after:w-0 after:h-[2px] after:bg-brand-red after:transition-all after:duration-200 hover:after:w-full"
>
  {l.label}
</a>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-4">
          {user ? (
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 bg-surface-gray-800/60 border border-white/[0.06] rounded-lg px-3 py-1.5">
                <User className="w-3.5 h-3.5 text-brand-red" />
                <span className="text-xs font-medium text-surface-gray-300 max-w-[120px] truncate">
                  {displayName}
                </span>
              </div>
              <button
                onClick={onProfile}
                className="flex items-center gap-1.5 text-[13px] font-medium text-surface-gray-400 hover:text-brand-red transition-colors duration-200"
              >
                <User className="w-3.5 h-3.5" />
                Profile
              </button>
              <button
                onClick={onLogout}
                className="flex items-center gap-1.5 text-[13px] font-medium text-surface-gray-400 hover:text-brand-red transition-colors duration-200"
              >
                <LogOut className="w-3.5 h-3.5" />
                Sign Out
              </button>
            </div>
          ) : (
            <>
              <button
                onClick={onLogin}
                className="text-[13px] font-medium text-surface-gray-400 hover:text-white transition-colors duration-200"
              >
                Sign In
              </button>
              <button
                onClick={onSignUp}
                className="bg-brand-red hover:bg-brand-red-hover text-white text-[13px] font-semibold px-5 py-2.5 rounded-lg transition-all duration-200 hover:shadow-[0_0_20px_rgba(229,57,53,0.3)]"
              >
                Get Started
              </button>
            </>
          )}
        </div>

        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden text-white p-2"
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {mobileOpen && (
        <div className="md:hidden bg-surface-gray-950/95 backdrop-blur-xl border-t border-white/[0.04]">
          <div className="section-container py-6 flex flex-col gap-4">
            {links.map((l) => (
     <a
  key={l.href}
  href={l.href}
  onClick={(e) => {
    setMobileOpen(false);

    if (l.label === 'Dashboard' && user) {
      e.preventDefault();
      onDashboard?.();
    }
  }}
  className="text-base font-medium text-surface-gray-400 hover:text-white transition-colors"
>
  {l.label}
</a>
            ))}
            <div className="border-t border-white/[0.06] pt-4 flex flex-col gap-3">
              {user ? (
                <>
                  <div className="flex items-center gap-2 px-1">
                    <User className="w-4 h-4 text-brand-red" />
                    <span className="text-sm font-medium text-surface-gray-300">{displayName}</span>
                  </div>
                  <button
                    onClick={() => { setMobileOpen(false); onProfile?.(); }}
                    className="flex items-center gap-2 text-base font-medium text-surface-gray-400 hover:text-brand-red transition-colors"
                  >
                    <User className="w-4 h-4" />
                    Profile
                  </button>
                  <button
                    onClick={() => { setMobileOpen(false); onLogout(); }}
                    className="flex items-center gap-2 text-base font-medium text-surface-gray-400 hover:text-brand-red transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    Sign Out
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => { setMobileOpen(false); onLogin(); }}
                    className="text-base font-medium text-surface-gray-400 text-left"
                  >
                    Sign In
                  </button>
                  <button
                    onClick={() => { setMobileOpen(false); onSignUp(); }}
                    className="bg-brand-red text-white text-center font-semibold px-5 py-3 rounded-lg"
                  >
                    Get Started
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
