export default function RefundPolicy({ onBack }: { onBack: () => void }) {
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
            Refund & Cancellation Policy
          </h1>

          <p className="text-sm text-surface-gray-500 mb-10">
            Effective Date: September 22, 2026
          </p>

          <div className="space-y-8 text-surface-gray-300 leading-relaxed">
            <section>
              <h2 className="text-xl sm:text-2xl font-bold text-white mb-3">
                1. Refund Eligibility
              </h2>
              <p>
                Paid BodyWise AI subscriptions are eligible for a refund when
                the refund request is submitted within 3 calendar days of the
                original purchase date.
              </p>
            </section>

            <section>
              <h2 className="text-xl sm:text-2xl font-bold text-white mb-3">
                2. Eligible Refund Situations
              </h2>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  Subscription purchases for which a refund is requested
                  within the 3-day refund period.
                </li>
                <li>Duplicate charges for the same subscription.</li>
                <li>
                  Incorrect charges caused by a payment or technical error.
                </li>
                <li>
                  Any other refund required under applicable law.
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl sm:text-2xl font-bold text-white mb-3">
                3. Non-Refundable Purchases
              </h2>
              <p className="mb-3">
                After the 3-calendar-day refund period has expired,
                subscription payments are generally non-refundable.
              </p>

              <ul className="list-disc pl-6 space-y-2">
                <li>Requests submitted after the 3-day refund period.</li>
                <li>Change of mind after the refund period.</li>
                <li>Unused subscription time after the refund period.</li>
                <li>
                  Failure to use the BodyWise AI service after purchase.
                </li>
                <li>
                  Requests made after a subscription has expired.
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl sm:text-2xl font-bold text-white mb-3">
                4. How to Request a Refund
              </h2>
              <p className="mb-3">
                To request a refund, contact BodyWise AI Support and provide:
              </p>

              <ul className="list-disc pl-6 space-y-2">
                <li>Your registered email address.</li>
                <li>The subscription or plan purchased.</li>
                <li>The date of purchase.</li>
                <li>
                  Your Razorpay payment or order details, if available.
                </li>
                <li>The reason for the refund request.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl sm:text-2xl font-bold text-white mb-3">
                5. Refund Processing
              </h2>
              <p>
                Once an eligible refund is approved, it will be processed
                through our payment provider, Razorpay, to the original
                payment method used for the transaction.
              </p>

              <p className="mt-3">
                You do not need to provide separate bank-account details for a
                standard refund. The time taken for the refunded amount to
                appear may depend on the payment method and the relevant
                financial institution.
              </p>
            </section>

            <section>
              <h2 className="text-xl sm:text-2xl font-bold text-white mb-3">
                6. Subscription Cancellation
              </h2>
              <p>
                You may stop using your BodyWise AI subscription at any time.
                However, cancellation does not automatically create a refund.
                Refund eligibility is determined according to the 3-day refund
                policy described above.
              </p>
            </section>

            <section>
              <h2 className="text-xl sm:text-2xl font-bold text-white mb-3">
                7. Contact Us
              </h2>
              <p>
                For refund or cancellation questions, please contact BodyWise
                AI Support through the contact information provided on our
                website.
              </p>
            </section>

            <section>
              <h2 className="text-xl sm:text-2xl font-bold text-white mb-3">
                8. Changes to This Policy
              </h2>
              <p>
                BodyWise AI may update this Refund & Cancellation Policy from
                time to time. Any changes will be posted on this page with an
                updated effective date.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}