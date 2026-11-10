
import { Zap, ArrowRight } from 'lucide-react';

const footerLinks = {
  Product: ['Features', 'Pricing', 'Dashboard'],
  Resources: ['Workout Library', 'Nutrition Guide'],
  Company: ['About Us', 'Contact'],
  Legal: [
    'Privacy Policy',
    'Terms of Service',
    'Refund & Cancellation Policy',
  ],
};

export default function Footer({
  onRefundPolicy,
  onPrivacyPolicy,
  onAboutUs,
  onContact,
  onTermsOfService,
  onDashboard,
}: {
  onRefundPolicy?: () => void;
  onPrivacyPolicy?: () => void;
  onAboutUs?: () => void;
  onContact?: () => void;
  onTermsOfService?: () => void;
  onDashboard?: () => void;
}) {
  const handleFooterLink = (
    e: React.MouseEvent<HTMLAnchorElement>,
    link: string
  ) => {
    switch (link) {
      case 'Dashboard':
        e.preventDefault();
        onDashboard?.();
        break;

      case 'Refund & Cancellation Policy':
        e.preventDefault();
        onRefundPolicy?.();
        break;

      case 'Privacy Policy':
        e.preventDefault();
        onPrivacyPolicy?.();
        break;

      case 'About Us':
        e.preventDefault();
        onAboutUs?.();
        break;

      case 'Contact':
        e.preventDefault();
        onContact?.();
        break;

      case 'Terms of Service':
        e.preventDefault();
        onTermsOfService?.();
        break;

      case 'Pricing':
        e.preventDefault();
        document.getElementById('pricing')?.scrollIntoView({
          behavior: 'smooth',
        });
        break;

      case 'Features':
        e.preventDefault();
        document.getElementById('features')?.scrollIntoView({
          behavior: 'smooth',
        });
        break;

      default:
        break;
    }
  };

  return (
    <footer className="relative pt-24 pb-8 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-surface-gray-950" />
      <div className="absolute inset-0 bg-grid opacity-8" />

      {/* Top Divider */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-brand-red/30 to-transparent" />

      <div className="section-container relative z-10">

        {/* CTA Banner */}
        <div className="rounded-2xl bg-gradient-to-r from-brand-red/20 via-brand-red/10 to-surface-gray-900/60 border border-brand-red/20 p-8 sm:p-12 mb-20 backdrop-blur-sm">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8">

            <div className="max-w-lg text-center lg:text-left">
              <h3 className="text-2xl sm:text-3xl font-black mb-3">
                Ready to Transform?
              </h3>

              <p className="text-surface-gray-400 text-sm leading-relaxed">
                Take control of your fitness journey with BodyWise AI.
                Get personalized workouts, smart nutrition guidance,
                and progress tracking designed around your goals.
                Start your free trial today.
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

        {/* Footer Content */}
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

            <p className="text-surface-gray-500 text-sm leading-relaxed max-w-sm">
              Your AI-powered fitness companion. Build smarter workout
              routines, follow personalized nutrition guidance, and
              track your fitness journey with BodyWise AI.
            </p>

          </div>

          {/* Footer Navigation */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>

              <h4 className="text-sm font-bold mb-5 text-white uppercase tracking-wider">
                {title}
              </h4>

              <ul className="flex flex-col gap-3">
                {links.map((link) => (
                  <li key={link}>
                    <a
                      href={
                        link === 'Pricing'
                          ? '#pricing'
                          : link === 'Features'
                            ? '#features'
                            : '#'
                      }
                      onClick={(e) => handleFooterLink(e, link)}
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

        {/* Bottom Bar */}
        <div className="border-t border-white/[0.05] pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">

          <p className="text-sm text-surface-gray-600 text-center sm:text-left">
            &copy; {new Date().getFullYear()} BodyWise AI. All rights reserved.
          </p>

          <p className="text-xs text-surface-gray-600">
            Built for your fitness journey.
          </p>

        </div>

      </div>
    </footer>
  );
}
