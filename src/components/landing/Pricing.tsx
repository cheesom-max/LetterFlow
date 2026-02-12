import Button from "@/components/ui/Button";
import Link from "next/link";

const plans = [
  {
    name: "Free",
    price: "$0",
    period: "forever",
    description: "Try it out with basic features",
    features: [
      "2 AI curations / month",
      "2 draft generations",
      "1 topic monitoring",
      "Basic templates",
    ],
    cta: "Get Started",
    variant: "secondary" as const,
    highlighted: false,
  },
  {
    name: "Starter",
    price: "$9",
    period: "/month",
    description: "For growing newsletter creators",
    features: [
      "8 AI curations / month",
      "8 draft generations",
      "3 topic monitoring",
      "1 platform integration",
      "Style learning",
    ],
    cta: "Start Free Trial",
    variant: "secondary" as const,
    highlighted: false,
  },
  {
    name: "Pro",
    price: "$19",
    period: "/month",
    description: "For serious newsletter operators",
    features: [
      "Unlimited curations",
      "Unlimited drafts",
      "10 topic monitoring",
      "All platform integrations",
      "A/B subject testing",
      "Advanced style customization",
      "Priority support",
    ],
    cta: "Start Free Trial",
    variant: "primary" as const,
    highlighted: true,
  },
  {
    name: "Team",
    price: "$39",
    period: "/month",
    description: "For teams & agencies",
    features: [
      "Everything in Pro",
      "Multiple newsletters",
      "Team collaboration",
      "Brand voice guide",
      "API access",
      "Dedicated support",
    ],
    cta: "Contact Us",
    variant: "secondary" as const,
    highlighted: false,
  },
];

export default function Pricing() {
  return (
    <section id="pricing" className="py-28 px-4 sm:px-6 lg:px-8 relative">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-indigo-50 text-indigo-600 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider mb-4">
            Pricing
          </div>
          <h2 className="text-4xl sm:text-5xl font-extrabold text-gray-900 tracking-tight">
            Less than the cost of one skipped newsletter
          </h2>
          <p className="mt-5 text-lg text-gray-500 max-w-2xl mx-auto">
            Every missed send costs you subscribers. Start free, upgrade when you&apos;re ready. Cancel anytime.
          </p>
        </div>

        <div className="grid md:grid-cols-4 gap-5 items-start">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative rounded-2xl p-7 transition-all duration-300 ${
                plan.highlighted
                  ? "bg-gradient-to-b from-indigo-600 to-violet-700 text-white shadow-2xl shadow-indigo-300 scale-[1.02] z-10"
                  : "bg-white border border-gray-100 shadow-sm hover:shadow-lg hover:-translate-y-0.5"
              }`}
            >
              {plan.highlighted && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-amber-400 to-orange-400 text-gray-900 text-xs font-bold px-4 py-1 rounded-full shadow-md">
                  Most Popular
                </div>
              )}

              <h3 className={`text-lg font-bold ${plan.highlighted ? "text-white" : "text-gray-900"}`}>
                {plan.name}
              </h3>
              <div className="mt-4 flex items-baseline gap-1">
                <span className={`text-4xl font-extrabold ${plan.highlighted ? "text-white" : "text-gray-900"}`}>
                  {plan.price}
                </span>
                <span className={`text-sm ${plan.highlighted ? "text-indigo-200" : "text-gray-500"}`}>
                  {plan.period}
                </span>
              </div>
              <p className={`mt-2 text-sm ${plan.highlighted ? "text-indigo-200" : "text-gray-500"}`}>
                {plan.description}
              </p>

              <Link href="/dashboard" className="block mt-6">
                {plan.highlighted ? (
                  <button className="w-full px-5 py-2.5 bg-white text-indigo-700 font-semibold rounded-xl text-sm hover:bg-gray-50 transition-colors shadow-md cursor-pointer">
                    {plan.cta}
                  </button>
                ) : (
                  <Button variant={plan.variant} className="w-full">
                    {plan.cta}
                  </Button>
                )}
              </Link>

              <ul className="mt-7 space-y-3">
                {plan.features.map((feature) => (
                  <li key={feature} className={`flex items-start gap-2.5 text-sm ${plan.highlighted ? "text-indigo-100" : "text-gray-600"}`}>
                    <svg className={`w-5 h-5 shrink-0 mt-0.5 ${plan.highlighted ? "text-indigo-300" : "text-indigo-500"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
