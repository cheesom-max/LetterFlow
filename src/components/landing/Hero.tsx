import Link from "next/link";
import Button from "@/components/ui/Button";

export default function Hero() {
  return (
    <section className="relative pt-28 pb-24 px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-100 rounded-full blur-3xl opacity-40 animate-pulse-soft" />
        <div className="absolute top-20 right-1/4 w-80 h-80 bg-violet-100 rounded-full blur-3xl opacity-40 animate-pulse-soft" style={{ animationDelay: '1.5s' }} />
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-gradient-to-t from-indigo-50 to-transparent rounded-full blur-3xl opacity-50" />
      </div>

      <div className="max-w-4xl mx-auto text-center animate-fade-in-up">
        <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur border border-red-100 text-red-600 px-4 py-2 rounded-full text-sm font-medium mb-8 shadow-sm">
          <span className="w-2 h-2 bg-gradient-to-r from-red-500 to-orange-500 rounded-full animate-pulse" />
          73% of creators quit before they start
        </div>

        <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold text-gray-900 leading-[1.1] tracking-tight">
          Stop spending
          <br />
          <span className="gradient-text">3 hours</span> on every
          <br />
          <span className="relative inline-block">newsletter
            <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 200 12" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M2 8C40 2 80 2 100 6C120 10 160 4 198 4" stroke="url(#paint)" strokeWidth="3" strokeLinecap="round"/>
              <defs><linearGradient id="paint" x1="2" y1="6" x2="198" y2="6"><stop stopColor="#4f46e5"/><stop offset="1" stopColor="#a855f7"/></linearGradient></defs>
            </svg>
          </span>
        </h1>

        <p className="mt-8 text-xl text-gray-500 max-w-2xl mx-auto leading-relaxed animate-fade-in-up-delay-1">
          Manual curation and writing drain all your energy.
          LetterFlow curates, writes, and publishes your newsletter with AI
          &mdash; so you focus on what matters:{" "}
          <span className="text-gray-900 font-semibold">your voice</span>.
        </p>

        <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-up-delay-2">
          <Link href="/dashboard">
            <Button size="lg" className="text-base px-10 py-4">
              Start My First AI Newsletter &mdash; Free
              <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Button>
          </Link>
          <a href="#features">
            <Button variant="secondary" size="lg" className="text-base">
              See How It Works
            </Button>
          </a>
        </div>

        <div className="mt-8 flex items-center justify-center gap-6 text-sm text-gray-400 animate-fade-in-up-delay-3">
          <span className="flex items-center gap-1.5">
            <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/></svg>
            No credit card
          </span>
          <span className="flex items-center gap-1.5">
            <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/></svg>
            Beehiiv, Substack & Kit
          </span>
          <span className="flex items-center gap-1.5">
            <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/></svg>
            Setup in 2 min
          </span>
        </div>
      </div>

      {/* Hero visual */}
      <div className="max-w-5xl mx-auto mt-20 animate-fade-in-up-delay-3">
        <div className="relative">
          {/* Glow effect */}
          <div className="absolute -inset-4 bg-gradient-to-r from-indigo-500 via-violet-500 to-purple-500 rounded-3xl opacity-10 blur-2xl" />

          <div className="relative bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-2 shadow-2xl">
            {/* Browser chrome */}
            <div className="flex items-center gap-2 px-4 py-3 border-b border-gray-700/50">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-400/80" />
                <div className="w-3 h-3 rounded-full bg-amber-400/80" />
                <div className="w-3 h-3 rounded-full bg-green-400/80" />
              </div>
              <div className="flex-1 mx-4">
                <div className="bg-gray-700/50 rounded-lg px-4 py-1.5 text-xs text-gray-400 flex items-center gap-2 max-w-xs mx-auto">
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/></svg>
                  app.letterflow.com
                </div>
              </div>
            </div>
            {/* Mock dashboard */}
            <div className="bg-gray-50 rounded-b-xl overflow-hidden">
              <div className="flex">
                {/* Mini sidebar */}
                <div className="hidden sm:block w-48 bg-white border-r border-gray-100 p-4 space-y-3">
                  <div className="flex items-center gap-2 mb-6">
                    <div className="w-6 h-6 bg-gradient-to-br from-indigo-600 to-violet-600 rounded-md" />
                    <div className="h-3 bg-gray-200 rounded w-20" />
                  </div>
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className={`flex items-center gap-2 px-2 py-2 rounded-lg ${i === 1 ? "bg-indigo-50" : ""}`}>
                      <div className={`w-4 h-4 rounded ${i === 1 ? "bg-indigo-400" : "bg-gray-200"}`} />
                      <div className={`h-2.5 rounded w-16 ${i === 1 ? "bg-indigo-300" : "bg-gray-200"}`} />
                    </div>
                  ))}
                </div>
                {/* Content */}
                <div className="flex-1 p-6">
                  <div className="grid grid-cols-3 gap-3 mb-6">
                    {[
                      { label: "142 Articles", color: "from-emerald-500 to-teal-500", bg: "bg-emerald-50" },
                      { label: "94% Match", color: "from-indigo-500 to-violet-500", bg: "bg-indigo-50" },
                      { label: "3 Drafts", color: "from-amber-500 to-orange-500", bg: "bg-amber-50" },
                    ].map((item) => (
                      <div key={item.label} className={`${item.bg} rounded-xl p-4 text-center`}>
                        <div className={`text-lg font-bold bg-gradient-to-r ${item.color} bg-clip-text text-transparent`}>{item.label.split(" ")[0]}</div>
                        <div className="text-xs text-gray-500 mt-0.5">{item.label.split(" ")[1]}</div>
                      </div>
                    ))}
                  </div>
                  <div className="bg-white rounded-xl border border-gray-100 p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-2 h-2 rounded-full bg-indigo-500" />
                      <div className="h-3 bg-gray-300 rounded w-48" />
                    </div>
                    <div className="space-y-2">
                      <div className="h-2.5 bg-gray-100 rounded w-full" />
                      <div className="h-2.5 bg-gray-100 rounded w-5/6" />
                      <div className="h-2.5 bg-gray-100 rounded w-4/6" />
                    </div>
                    <div className="mt-4 flex gap-2">
                      <div className="px-3 py-1.5 bg-indigo-500 rounded-lg text-xs text-white font-medium">Publish</div>
                      <div className="px-3 py-1.5 bg-gray-100 rounded-lg text-xs text-gray-500 font-medium">Edit</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
