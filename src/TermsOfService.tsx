export default function TermsOfService({ onBack }: { onBack: () => void }) {
  return (
    <div className="min-h-screen bg-surface-black text-white">
      <div className="section-container py-16 sm:py-24">
        <button
          onClick={onBack}
          className="mb-8 text-sm text-surface-gray-400 hover:text-white transition-colors"
        >
          ← Back to Home
        </button>

        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl sm:text-5xl font-black mb-4">
            Terms of Service
          </h1>

          <p className="text-sm text-surface-gray-500 mb-10">
            Effective Date: September 23, 2026
          </p>

          <div className="space-y-8 text-surface-gray-300 leading-relaxed">
            <section>
              <h2 className="text-xl sm:text-2xl font-bold text-white mb-3">
                1. Acceptance of Terms
              </h2>
              <p>
                By accessing or using BodyWise AI, you agree to these Terms of
                Service. If you do not agree with these terms, please do not
                use the service.
              </p>
            </section>

            <section>
              <h2 className="text-xl sm:text-2xl font-bold text-white mb-3">
                2. Description of Service
              </h2>
              <p>
                BodyWise AI provides AI-powered fitness and nutrition
                recommendations based on information provided by the user.
                Features may include personalized workout plans, nutrition
                guidance, progress tracking, and related fitness tools.
              </p>
            </section>

            <section>
              <h2 className="text-xl sm:text-2xl font-bold text-white mb-3">
                3. Fitness and Nutrition Disclaimer
              </h2>
              <p>
                BodyWise AI provides general fitness and nutrition information
                and is not a substitute for professional medical, nutritional,
                or fitness advice.
              </p>
              <p className="mt-3">
                You should consult an appropriately qualified healthcare or
                fitness professional before beginning a new exercise program,
                changing your diet, or using recommendations that may affect
                your health.
              </p>
            </section>

            <section>
              <h2 className="text-xl sm:text-2xl font-bold text-white mb-3">
                4. User Information
              </h2>
              <p>
                You are responsible for providing accurate and up-to-date
                information when creating your profile and using BodyWise AI.
                Recommendations may depend on the accuracy of the information
                you provide.
              </p>
            </section>

            <section>
              <h2 className="text-xl sm:text-2xl font-bold text-white mb-3">
                5. AI-Generated Recommendations
              </h2>
              <p>
                BodyWise AI uses automated and AI-powered systems to generate
                recommendations. These recommendations are intended to provide
                general guidance and may not always be appropriate for every
                individual or situation.
              </p>
              <p className="mt-3">
                You are responsible for evaluating whether a recommendation is
                appropriate for you and for stopping any activity that causes
                pain, discomfort, or other concerning symptoms.
              </p>
            </section>

            <section>
              <h2 className="text-xl sm:text-2xl font-bold text-white mb-3">
                6. Subscriptions and Payments
              </h2>
              <p>
                Certain BodyWise AI features may require a paid subscription.
                Subscription prices and available plans are displayed on the
                Pricing page at the time of purchase.
              </p>
              <p className="mt-3">
                Payments are processed through our payment service provider.
                By purchasing a subscription, you authorize the applicable
                payment according to the selected plan.
              </p>
            </section>

            <section>
              <h2 className="text-xl sm:text-2xl font-bold text-white mb-3">
                7. Refunds and Cancellations
              </h2>
              <p>
                Refunds and cancellations are governed by our Refund &
                Cancellation Policy. Please review that policy before
                purchasing a subscription.
              </p>
            </section>

            <section>
              <h2 className="text-xl sm:text-2xl font-bold text-white mb-3">
                8. Account Security
              </h2>
              <p>
                You are responsible for maintaining the security of your
                account credentials and for activity conducted through your
                account. If you believe your account has been accessed without
                authorization, please contact us promptly.
              </p>
            </section>

            <section>
              <h2 className="text-xl sm:text-2xl font-bold text-white mb-3">
                9. Acceptable Use
              </h2>
              <p>
                You agree not to misuse BodyWise AI, attempt to gain
                unauthorized access to the service, interfere with its
                operation, or use the service for unlawful purposes.
              </p>
            </section>

            <section>
              <h2 className="text-xl sm:text-2xl font-bold text-white mb-3">
                10. Intellectual Property
              </h2>
              <p>
                BodyWise AI and its associated software, design, branding,
                content, and functionality are protected by applicable
                intellectual property laws. You may not reproduce, distribute,
                or commercially exploit these materials without appropriate
                authorization.
              </p>
            </section>

            <section>
              <h2 className="text-xl sm:text-2xl font-bold text-white mb-3">
                11. Service Availability
              </h2>
              <p>
                We aim to keep BodyWise AI available and reliable, but we do
                not guarantee that the service will always be uninterrupted,
                error-free, or available at all times.
              </p>
            </section>

            <section>
              <h2 className="text-xl sm:text-2xl font-bold text-white mb-3">
                12. Limitation of Responsibility
              </h2>
              <p>
                To the extent permitted by applicable law, BodyWise AI is not
                responsible for decisions or actions taken solely on the basis
                of AI-generated fitness or nutrition recommendations.
              </p>
            </section>

            <section>
              <h2 className="text-xl sm:text-2xl font-bold text-white mb-3">
                13. Changes to These Terms
              </h2>
              <p>
                We may update these Terms of Service from time to time. Any
                updated version will be posted on this page with a revised
                effective date.
              </p>
            </section>

            <section>
              <h2 className="text-xl sm:text-2xl font-bold text-white mb-3">
                14. Contact Us
              </h2>
              <p>
                If you have questions about these Terms of Service, contact
                BodyWise AI at:
              </p>

              <p className="mt-4">
                <a
                  href="mailto:bodywiseai.help@gmail.com"
                  className="text-white font-semibold hover:underline"
                >
                  bodywiseai.help@gmail.com
                </a>
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}