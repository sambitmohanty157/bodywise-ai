import { useEffect, useState } from 'react';

import { useInView } from '../hooks/useInView';

import { supabase } from '../lib/supabase';

import { Check, Zap, Crown, Shield } from 'lucide-react';

declare global {
  interface Window {
    Razorpay: any;
    gtag?: (
      command: string,
      eventName: string,
      params?: Record<string, any>
    ) => void;
  }
}

const plans = [
  {
    name: '1 Month',
    icon: Zap,
    price: '₹199',
    paymentAmount: 199,
    period: '/month',
    desc: 'Try BodyWise Pro and start your personalized fitness journey.',
    features: [
      'Personalized AI workout plan',
      'Personalized nutrition plan',
      'Calorie & protein targets',
      'Workout & food logging',
      'Recovery recommendations',
      'Weight & progress tracking',
      'AI plan updates',
    ],
    cta: 'Start Pro',
    popular: false,
  },
  {
    name: '3 Months',
    icon: Zap,
    price: '₹499',
    paymentAmount: 499,
    period: '/3 months',
    desc: 'Build consistency and make meaningful progress with BodyWise.',
    features: [
      'Personalized AI workout plan',
      'Personalized nutrition plan',
      'Calorie & protein targets',
      'Workout & food logging',
      'Recovery recommendations',
      'Weight & progress tracking',
      'AI plan updates',
    ],
    cta: 'Start Pro',
    popular: true,
  },
  {
    name: '6 Months',
    icon: Crown,
    price: '₹899',
    paymentAmount: 899,
    period: '/6 months',
    desc: 'Stay consistent and work toward a stronger, healthier body.',
    features: [
      'Personalized AI workout plan',
      'Personalized nutrition plan',
      'Calorie & protein targets',
      'Workout & food logging',
      'Recovery recommendations',
      'Weight & progress tracking',
      'AI plan updates',
    ],
    cta: 'Start Pro',
    popular: false,
  },
  {
    name: '1 Year',
    icon: Crown,
    price: '₹1,499',
    paymentAmount: 1499,
    period: '/year',
    desc: 'Get the best value for your complete fitness transformation.',
    features: [
      'Personalized AI workout plan',
      'Personalized nutrition plan',
      'Calorie & protein targets',
      'Workout & food logging',
      'Recovery recommendations',
      'Weight & progress tracking',
      'AI plan updates',
    ],
    cta: 'Start Pro',
    popular: false,
  },
];

export default function Pricing() {
  const { ref, isInView } = useInView(0.05);
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);

  useEffect(() => {
    const script = document.createElement('script');

    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;

    document.body.appendChild(script);

    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, []);

  const handlePayment = async (planName: string) => {
    try {
      setSelectedPlan(planName);

      // Make sure the user is logged in
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        alert('Please log in before purchasing a plan.');
        return;
      }

      // Make sure Razorpay Checkout has loaded
      if (!window.Razorpay) {
        alert('Payment system is still loading. Please try again.');
        return;
      }

      // Create Razorpay order through Supabase Edge Function
      const { data, error } = await supabase.functions.invoke(
        'create-razorpay-order',
        {
          body: {
            planName,
          },
        }
      );

      if (error) {
        console.error('Create order error:', error);
        alert('Unable to start payment. Please try again.');
        return;
      }

      if (!data?.success || !data?.orderId) {
        console.error('Invalid order response:', data);
        alert('Unable to create payment order.');
        return;
      }

      // Open Razorpay Checkout
      const options = {
        key: data.razorpayKeyId,
        amount: data.amount,
        currency: data.currency,
        name: 'BodyWise AI',
        description: `${data.planName} BodyWise Pro`,
        order_id: data.orderId,

        handler: async (response: any) => {
          console.log('RAZORPAY FINAL RESPONSE', {
            paymentId: response.razorpay_payment_id,
            orderId: response.razorpay_order_id,
            signature: response.razorpay_signature,
          });

          // Verify payment through Supabase Edge Function
          const {
            data: verificationData,
            error: verificationError,
          } = await supabase.functions.invoke(
            'verify-razorpay-payment',
            {
              body: {
                razorpay_payment_id:
                  response.razorpay_payment_id,
                razorpay_order_id:
                  response.razorpay_order_id,
                razorpay_signature:
                  response.razorpay_signature,
                planName,
              },
            }
          );

          if (verificationError) {
            console.error(
              'Payment verification error:',
              verificationError
            );

            alert(
              'Payment received, but verification failed. Please contact support.'
            );

            return;
          }

          if (!verificationData?.success) {
            console.error(
              'Verification failed:',
              verificationData
            );

            alert(
              verificationData?.error ||
                'Payment verification failed.'
            );

            return;
          }

          /* =========================================
             GA4 — PURCHASE
             Track ONLY after successful verification
          ========================================= */
          if (
            typeof window !== 'undefined' &&
            typeof window.gtag === 'function'
          ) {
            const purchaseValue = Number(data?.amount || 0) / 100;

            window.gtag('event', 'purchase', {
              transaction_id:
                response.razorpay_payment_id ||
                response.razorpay_order_id,
              value: purchaseValue,
              currency: data?.currency || 'INR',
              items: [
                {
                  item_id: planName,
                  item_name: `BodyWise Pro - ${planName}`,
                  item_category: 'Subscription',
                  price: purchaseValue,
                  quantity: 1,
                },
              ],
            });

            console.log('GA4 purchase event sent', {
              transaction_id: response.razorpay_payment_id,
              value: purchaseValue,
              currency: data?.currency || 'INR',
              planName,
            });
          }

          alert(
            `🎉 Payment successful! Your ${planName} BodyWise Pro plan is now active.`
          );
        },

        modal: {
          ondismiss: () => {
            console.log('Razorpay checkout closed.');
          },
        },

        theme: {
          color: '#E53935',
        },
      };

      console.log('RAZORPAY CHECKOUT OPTIONS', {
        key: options.key,
        order_id: options.order_id,
        amount: options.amount,
        currency: options.currency,
      });

      const razorpay = new window.Razorpay(options);

      razorpay.on(
        'payment.failed',
        (response: any) => {
          console.error(
            'Razorpay payment failed:',
            response.error
          );

          alert(
            response.error?.description ||
              'Payment failed. Please try again.'
          );
        }
      );

      razorpay.open();
    } catch (error) {
      console.error('Payment error:', error);
      alert('Something went wrong. Please try again.');
    }
  };

  return (
    <section id="pricing" className="relative py-28 overflow-hidden">
      <div className="absolute inset-0 bg-surface-gray-950" />

      <div className="absolute inset-0 bg-grid opacity-10" />

      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-brand-red/3 rounded-full blur-[200px]" />

      <div ref={ref} className="section-container relative z-10">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-20">
          <div className="inline-flex items-center gap-2 bg-brand-red/10 border border-brand-red/20 rounded-full px-4 py-2 mb-6">
            <Shield className="w-4 h-4 text-brand-red" />

            <span className="text-xs font-semibold tracking-wide text-brand-red uppercase">
              Simple Pricing
            </span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black leading-tight mb-5">
            Choose Your{' '}
            <span className="text-gradient">Power Level</span>
          </h2>

          <p className="text-surface-gray-400 text-lg leading-relaxed">
            Simple pricing. No hidden fees. Choose the plan that fits your
            fitness journey.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 items-stretch max-w-6xl mx-auto">
          {plans.map((plan, i) => (
            <div
              key={plan.name}
              className={`relative rounded-2xl p-8 flex flex-col transition-all duration-300 hover:-translate-y-1 ${
                plan.popular
                  ? 'bg-surface-gray-800/80 border-2 border-brand-red/50 shadow-[0_0_60px_rgba(229,57,53,0.1)]'
                  : 'bg-surface-gray-900/60 border border-white/[0.05] backdrop-blur-sm'
              } ${isInView ? 'animate-fade-in-up' : 'opacity-0'}`}
              style={{ animationDelay: `${i * 150}ms` }}
            >
              {/* Popular Badge */}
              {plan.popular && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-brand-red text-white text-[10px] font-bold uppercase tracking-widest px-5 py-1.5 rounded-full shadow-[0_0_20px_rgba(229,57,53,0.4)]">
                  Most Popular
                </div>
              )}

              {/* Plan Header */}
              <div className="flex items-center gap-3 mb-5">
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                    plan.popular
                      ? 'bg-brand-red/20'
                      : 'bg-surface-gray-700'
                  }`}
                >
                  <plan.icon
                    className={`w-5 h-5 ${
                      plan.popular
                        ? 'text-brand-red'
                        : 'text-surface-gray-400'
                    }`}
                  />
                </div>

                <h3 className="text-lg font-bold">
                  {plan.name}
                </h3>
              </div>

              {/* Description */}
              <p className="text-sm text-surface-gray-500 leading-relaxed mb-6">
                {plan.desc}
              </p>

              {/* Price */}
              <div className="mb-8">
                <span className="text-4xl font-black tracking-tight">
                  {plan.price}
                </span>

                <span className="text-surface-gray-500 text-sm">
                  {plan.period}
                </span>
              </div>

              {/* Features */}
              <ul className="flex flex-col gap-3 mb-8 flex-1">
                {plan.features.map((feature) => (
                  <li
                    key={feature}
                    className="flex items-start gap-2.5 text-sm"
                  >
                    <div
                      className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                        plan.popular
                          ? 'bg-brand-red/15'
                          : 'bg-surface-gray-700'
                      }`}
                    >
                      <Check
                        className={`w-3 h-3 ${
                          plan.popular
                            ? 'text-brand-red'
                            : 'text-surface-gray-400'
                        }`}
                      />
                    </div>

                    <span className="text-surface-gray-300">
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>

              {/* CTA */}
              <button
                type="button"
                onClick={() => handlePayment(plan.name)}
                className={`w-full text-center py-3.5 rounded-xl font-semibold transition-all duration-300 block ${
                  plan.popular
                    ? 'bg-brand-red hover:bg-brand-red-hover text-white shadow-[0_0_20px_rgba(229,57,53,0.3)] hover:shadow-[0_0_30px_rgba(229,57,53,0.5)]'
                    : 'bg-surface-gray-700/80 hover:bg-surface-gray-600 text-white border border-white/[0.05]'
                }`}
              >
                {plan.cta}
              </button>
            </div>
          ))}
        </div>

        {/* Trust Message */}
        <div className="text-center mt-12">
          <div className="inline-flex items-center gap-2 text-sm text-surface-gray-500">
            <Shield className="w-4 h-4 text-surface-gray-500" />
            Simple pricing. No hidden fees.
          </div>
        </div>
      </div>
    </section>
  );
}
