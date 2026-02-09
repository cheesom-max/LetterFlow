const features = [
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
    ),
    title: "Read 100 Articles So You Don't Have To",
    description:
      "AI scans your RSS feeds and surfaces only what matters, scored by relevance. No more 45 minutes of scrolling through sources.",
    gradient: "from-blue-500 to-cyan-500",
    bgGlow: "bg-blue-500",
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
      </svg>
    ),
    title: "Writes Like You, Not a Robot",
    description:
      "Upload past newsletters and LetterFlow learns your tone, structure, and personality. Every draft sounds authentically yours.",
    gradient: "from-violet-500 to-purple-500",
    bgGlow: "bg-violet-500",
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
    title: "Beehiiv. Substack. Kit. One Click.",
    description:
      "Connect your platform, review the AI draft, and publish. No copy-pasting, no reformatting, no wasted time.",
    gradient: "from-amber-500 to-orange-500",
    bgGlow: "bg-amber-500",
  },
];

export default function Features() {
  return (
    <section id="features" className="py-28 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Subtle background */}
      <div className="absolute inset-0 bg-gradient-to-b from-gray-50/80 to-white -z-10" />

      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-2 bg-indigo-50 text-indigo-600 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider mb-4">
            How It Works
          </div>
          <h2 className="text-4xl sm:text-5xl font-extrabold text-gray-900 tracking-tight">
            3 hours of work,
            <br />
            <span className="gradient-text">done in 15 minutes</span>
          </h2>
          <p className="mt-5 text-lg text-gray-500 max-w-2xl mx-auto leading-relaxed">
            Finding content (45 min) + reading sources (60 min) + writing &amp; formatting (45 min) = 3 hours gone.
            LetterFlow does it all in three steps.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {features.map((feature, idx) => (
            <div
              key={idx}
              className="group relative bg-white rounded-2xl p-8 border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
            >
              {/* Hover glow */}
              <div className={`absolute -inset-px rounded-2xl ${feature.bgGlow} opacity-0 group-hover:opacity-5 transition-opacity duration-300 blur-xl`} />

              <div className="relative">
                {/* Step number */}
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-xs font-bold text-gray-400 group-hover:bg-indigo-100 group-hover:text-indigo-600 transition-colors">
                  {idx + 1}
                </div>

                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center text-white mb-6 shadow-lg shadow-indigo-100`}>
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-500 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Stats bar */}
        <div className="mt-24 bg-gradient-to-r from-indigo-600 to-violet-600 rounded-2xl p-10 shadow-xl shadow-indigo-200">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { value: "2.5hrs", label: "Saved per edition" },
              { value: "84%", label: "Creators already use AI" },
              { value: "15min", label: "Average time to publish" },
              { value: "61%", label: "Creators face burnout" },
            ].map((stat, idx) => (
              <div key={idx}>
                <div className="text-3xl sm:text-4xl font-extrabold text-white">{stat.value}</div>
                <div className="mt-1.5 text-sm text-indigo-200">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
