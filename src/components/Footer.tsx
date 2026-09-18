import { Zap, Twitter, Instagram, Youtube, Linkedin, ArrowRight } from 'lucide-react';

const footerLinks = {
  Product: ['Features', 'Pricing', 'Dashboard', 'Mobile App', 'Integrations'],
  Resources: ['Blog', 'Workout Library', 'Nutrition Guide', 'Help Center', 'API Docs'],
  Company: ['About Us', 'Careers', 'Press', 'Contact', 'Partners'],
  Legal: ['Privacy Policy', 'Terms of Service', 'Cookie Policy', 'GDPR'],
};

const socials = [
  { icon: Twitter, label: 'Twitter' },
  { icon: Instagram, label: 'Instagram' },
  { icon: Youtube, label: 'YouTube' },
  { icon: Linkedin, label: 'LinkedIn' },
];

export default function Footer() {
  return (
    <footer className="relative pt-24 pb-8 overflow-hidden">
      <div className="absolute inset-0 bg-surface-gray-950" />
      <div className="absolute inset-0 bg-grid opacity-8" />

      {/* Top divider line */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-brand-red/30 to-transparent" />

      <div className="section-container relative z-10">
        {/* CTA Banner */}
        <div className="rounded-2xl bg-gradient-to-r from-brand-red/20 via-brand-red/10 to-surface-gray-900/60 border border-brand-red/20 p-8 sm:p-12 mb-20 backdrop-blur-sm">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="max-w-lg text-center lg:text-left">
              <h3 className="text-2xl sm:text-3xl font-black mb-3">Ready to Transform?</h3>
              <p className="text-surface-gray-400 text-sm leading-relaxed">
                Join 50,000+ athletes already using BodyWise AI. Start your free trial today and see the difference AI-powered fitness makes.
              </p>
            </div>
            <a
              href="#pricing"
              className="btn-primary inline-flex items-center gap-2.5 text-base shrink-0 group"
            >
              Start Free Trial
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </a>
          </div>
        </div>

        {/* Footer content */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 mb-16">
          {/* Brand */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2 mb-5">
              <div className="w-9 h-9 bg-brand-red rounded-lg flex items-center justify-center">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-extrabold">
                Body<span className="text-brand-red">Wise</span> AI
              </span>
            </div>
            <p className="text-surface-gray-500 text-sm leading-relaxed max-w-sm mb-6">
              The AI-powered fitness platform that adapts to you. Personalized workouts, smart nutrition, and real-time progress tracking for transformative results.
            </p>

            {/* Newsletter */}
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 bg-surface-gray-800/60 border border-white/[0.06] rounded-lg px-4 py-2.5 text-sm text-white placeholder-surface-gray-600 focus:outline-none focus:border-brand-red/50 transition-colors backdrop-blur-sm"
              />
              <button className="bg-brand-red hover:bg-brand-red-hover text-white text-sm font-semibold px-5 py-2.5 rounded-lg transition-all hover:shadow-[0_0_20px_rgba(229,57,53,0.3)] whitespace-nowrap">
                Subscribe
              </button>
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h4 className="text-sm font-bold mb-5 text-white uppercase tracking-wider">{title}</h4>
              <ul className="flex flex-col gap-3">
                {links.map((link) => (
                  <li key={link}>
                    <a
                      href="#"
                      className="text-sm text-surface-gray-500 hover:text-white transition-colors duration-200"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/[0.05] pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-surface-gray-600">
            &copy; {new Date().getFullYear()} BodyWise AI. All rights reserved.
          </p>
          <div className="flex gap-3">
            {socials.map((s) => (
              <a
                key={s.label}
                href="#"
                aria-label={s.label}
                className="w-9 h-9 bg-surface-gray-800/60 rounded-lg flex items-center justify-center border border-white/[0.04] hover:border-brand-red/30 hover:bg-brand-red/10 text-surface-gray-500 hover:text-brand-red transition-all duration-200"
              >
                <s.icon className="w-4 h-4" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
