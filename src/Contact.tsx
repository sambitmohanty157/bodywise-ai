export default function Contact({ onBack }: { onBack: () => void }) {
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
            Contact BodyWise AI
          </h1>

          <p className="text-surface-gray-400 mb-10">
            Have a question, need help, or want to report an issue? We're here
            to help.
          </p>

          <div className="space-y-8 text-surface-gray-300 leading-relaxed">
            <section>
              <h2 className="text-xl sm:text-2xl font-bold text-white mb-3">
                Customer Support
              </h2>

              <p>
                For questions about your account, AI plans, subscriptions,
                payments, or any other issue, contact us at:
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

            <section>
              <h2 className="text-xl sm:text-2xl font-bold text-white mb-3">
                Refund & Payment Support
              </h2>

              <p>
                If you have a question regarding a payment or refund, please
                include your registered email address and relevant payment
                details so we can assist you efficiently.
              </p>
            </section>

            <section>
              <h2 className="text-xl sm:text-2xl font-bold text-white mb-3">
                General Questions
              </h2>

              <p>
                For general questions, feedback, or suggestions about
                BodyWise AI, you can also reach us at the same support email.
              </p>
            </section>

            <section>
              <h2 className="text-xl sm:text-2xl font-bold text-white mb-3">
                Response Time
              </h2>

              <p>
                We aim to respond to customer support requests as soon as
                reasonably possible.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}