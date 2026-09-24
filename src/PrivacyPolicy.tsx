
export default function PrivacyPolicy({ onBack }: { onBack: () => void }) {
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
            Privacy Policy
          </h1>

          <p className="text-sm text-surface-gray-500 mb-10">
            Effective Date: September 23, 2026
          </p>

          <div className="space-y-8 text-surface-gray-300 leading-relaxed">
            <section>
              <h2 className="text-xl sm:text-2xl font-bold text-white mb-3">
                1. Information We Collect
              </h2>
              <p className="mb-3">
                When you use BodyWise AI, we may collect information that you
                provide when creating an account and using our fitness
                services.
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Name and account information.</li>
                <li>Age, gender, height, and weight.</li>
                <li>Fitness goals and activity information.</li>
                <li>Nutrition preferences and dietary information.</li>
                <li>Workout, food, weight, and progress data.</li>
                <li>Transformation photos that you choose to upload.</li>
                <li>Payment and subscription information.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl sm:text-2xl font-bold text-white mb-3">
                2. How We Use Your Information
              </h2>
              <p className="mb-3">
                We use the information we collect to provide and improve the
                BodyWise AI service, including:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Creating personalized workout recommendations.</li>
                <li>Generating personalized nutrition recommendations.</li>
                <li>Tracking fitness and progress information.</li>
                <li>Providing AI-powered coaching features.</li>
                <li>Processing subscriptions and payments.</li>
                <li>Maintaining and improving our services.</li>
                <li>Providing customer support.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl sm:text-2xl font-bold text-white mb-3">
                3. AI-Powered Recommendations
              </h2>
              <p>
                BodyWise AI uses information you provide to generate
                personalized fitness and nutrition recommendations. These
                recommendations are intended for general wellness and fitness
                purposes and should not be treated as medical advice,
                diagnosis, or treatment.
              </p>
            </section>

            <section>
              <h2 className="text-xl sm:text-2xl font-bold text-white mb-3">
                4. Payment Information
              </h2>
              <p>
                Payments for BodyWise AI subscriptions are processed through
                our payment provider, Razorpay. We do not intentionally store
                your complete card, UPI, or banking credentials on our
                application servers. Payment processing is handled by the
                applicable payment provider according to its own policies and
                security practices.
              </p>
            </section>

            <section>
              <h2 className="text-xl sm:text-2xl font-bold text-white mb-3">
                5. Data Storage and Security
              </h2>
              <p>
                We use reasonable technical and organizational measures to
                protect information stored through our services. However, no
                internet-based service can guarantee absolute security.
              </p>
            </section>

            <section>
              <h2 className="text-xl sm:text-2xl font-bold text-white mb-3">
                6. Data Sharing
              </h2>
              <p>
                We may use trusted service providers that help us operate
                BodyWise AI, such as hosting, database, authentication,
                analytics, AI, and payment service providers. We share
                information with such providers only as reasonably necessary
                to provide and operate the service, subject to applicable
                requirements.
              </p>
            </section>

            <section>
              <h2 className="text-xl sm:text-2xl font-bold text-white mb-3">
                7. Your Account and Data
              </h2>
              <p>
                You are responsible for keeping your account credentials
                secure. You should provide accurate information and notify us
                if you believe your account has been accessed without
                authorization.
              </p>
            </section>

            <section>
              <h2 className="text-xl sm:text-2xl font-bold text-white mb-3">
                8. Data Retention
              </h2>
              <p>
                We retain information for as long as reasonably necessary to
                provide our services, maintain account records, meet legal or
                regulatory requirements, resolve disputes, and enforce
                applicable agreements.
              </p>
            </section>

            <section>
              <h2 className="text-xl sm:text-2xl font-bold text-white mb-3">
                9. Your Privacy Rights
              </h2>
              <p>
                Depending on applicable law, you may have rights relating to
                your personal information, including rights to access,
                correction, deletion, restriction, or other applicable
                privacy requests.
              </p>
              <p className="mt-3">
                To make a privacy-related request, please contact BodyWise AI
                through the contact information provided on our website.
              </p>
            </section>

            <section>
              <h2 className="text-xl sm:text-2xl font-bold text-white mb-3">
                10. Cookies and Similar Technologies
              </h2>
              <p>
                BodyWise AI may use cookies or similar technologies where
                necessary for authentication, security, functionality, and
                service improvement. Additional information may be provided in
                our Cookie Policy.
              </p>
            </section>

            <section>
              <h2 className="text-xl sm:text-2xl font-bold text-white mb-3">
                11. Children's Privacy
              </h2>
              <p>
                BodyWise AI is not intended for children under the minimum age
                permitted under applicable law. We do not knowingly collect
                personal information from children in violation of applicable
                legal requirements.
              </p>
            </section>

            <section>
              <h2 className="text-xl sm:text-2xl font-bold text-white mb-3">
                12. Changes to This Privacy Policy
              </h2>
              <p>
                We may update this Privacy Policy from time to time. Any
                material changes will be reflected on this page with an updated
                effective date.
              </p>
            </section>

            <section>
              <h2 className="text-xl sm:text-2xl font-bold text-white mb-3">
                13. Contact Us
              </h2>
              <p>
                For privacy questions or requests, please contact BodyWise AI
                through the contact information provided on our website.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
