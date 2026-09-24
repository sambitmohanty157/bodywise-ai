export default function AboutUs({ onBack }: { onBack: () => void }) {
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
            About BodyWise AI
          </h1>

          <p className="text-sm text-surface-gray-500 mb-10">
            AI-powered fitness and nutrition guidance built around you.
          </p>

          <div className="space-y-8 text-surface-gray-300 leading-relaxed">
            <section>
              <h2 className="text-xl sm:text-2xl font-bold text-white mb-3">
                Our Mission
              </h2>
              <p>
                BodyWise AI is built to make personalized fitness guidance
                simpler, more accessible, and easier to follow. We combine
                fitness tracking, personalized workout planning, nutrition
                guidance, and AI-powered recommendations in one platform.
              </p>
            </section>

            <section>
              <h2 className="text-xl sm:text-2xl font-bold text-white mb-3">
                Personalized Fitness
              </h2>
              <p>
                Everyone has different goals, schedules, activity levels, and
                preferences. BodyWise AI uses the information you provide to
                create fitness and nutrition recommendations designed around
                your individual goals and progress.
              </p>
            </section>

            <section>
              <h2 className="text-xl sm:text-2xl font-bold text-white mb-3">
                What BodyWise AI Provides
              </h2>

              <ul className="list-disc pl-6 space-y-2">
                <li>Personalized AI workout planning.</li>
                <li>Personalized nutrition guidance.</li>
                <li>Calorie and protein targets.</li>
                <li>Workout and food tracking.</li>
                <li>Weight and progress tracking.</li>
                <li>AI-powered plan updates.</li>
                <li>Fitness progress insights.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl sm:text-2xl font-bold text-white mb-3">
                Built for Your Progress
              </h2>
              <p>
                BodyWise AI is designed to help you stay consistent by bringing
                your plans, tracking, and progress into one place. As your
                information and goals change, your fitness journey can be
                updated accordingly.
              </p>
            </section>

            <section>
              <h2 className="text-xl sm:text-2xl font-bold text-white mb-3">
                Our Approach
              </h2>
              <p>
                We believe technology should make fitness easier to understand
                and follow. BodyWise AI focuses on practical recommendations,
                progress tracking, and an experience that helps users stay
                engaged with their fitness journey.
              </p>
            </section>

            <section>
              <h2 className="text-xl sm:text-2xl font-bold text-white mb-3">
                Important Note
              </h2>
              <p>
                BodyWise AI provides general fitness and nutrition guidance.
                AI-generated recommendations are not a substitute for medical
                advice, diagnosis, or treatment. If you have a medical
                condition or specific health concerns, consult an appropriately
                qualified healthcare professional.
              </p>
            </section>

            <section>
              <h2 className="text-xl sm:text-2xl font-bold text-white mb-3">
                Contact
              </h2>
              <p>
                For questions, support, or feedback, please use the contact
                information provided on the BodyWise AI website.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
