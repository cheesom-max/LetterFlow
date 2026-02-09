import Link from "next/link";

export default function Footer() {
  return (
    <footer className="relative bg-gray-900 text-gray-400 pt-20 pb-12 px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-40 bg-indigo-600 opacity-5 blur-3xl rounded-full" />

      <div className="max-w-7xl mx-auto relative">
        {/* CTA banner */}
        <div className="bg-gradient-to-r from-indigo-600 to-violet-600 rounded-2xl p-10 -mt-32 mb-16 shadow-2xl shadow-indigo-500/20 text-center">
          <h3 className="text-2xl sm:text-3xl font-extrabold text-white">
            Stop burning 3 hours. Start publishing in 15 minutes.
          </h3>
          <p className="mt-3 text-indigo-200 max-w-lg mx-auto">
            Join creators who broke free from the content hamster wheel with AI-powered curation and writing.
          </p>
          <Link href="/dashboard">
            <button className="mt-6 px-8 py-3.5 bg-white text-indigo-700 font-semibold rounded-xl text-base hover:bg-gray-50 transition-colors shadow-lg cursor-pointer">
              Start My First AI Newsletter &mdash; Free
            </button>
          </Link>
        </div>

        <div className="grid md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="w-9 h-9 bg-gradient-to-br from-indigo-500 to-violet-500 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-sm">LF</span>
              </div>
              <span className="text-xl font-bold text-white">LetterFlow</span>
            </Link>
            <p className="mt-4 text-sm leading-relaxed max-w-md text-gray-500">
              AI-powered newsletter curation and writing tool. Curate trending
              content, generate style-matched drafts, and publish in minutes.
            </p>
          </div>

          <div>
            <h4 className="text-white font-semibold text-sm mb-4">Product</h4>
            <ul className="space-y-3 text-sm">
              <li><a href="#features" className="hover:text-white transition-colors">Features</a></li>
              <li><a href="#pricing" className="hover:text-white transition-colors">Pricing</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Changelog</a></li>
              <li><a href="#" className="hover:text-white transition-colors">API Docs</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold text-sm mb-4">Company</h4>
            <ul className="space-y-3 text-sm">
              <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
              <li><a href="mailto:hello@letterflow.com" className="hover:text-white transition-colors">Contact</a></li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-800 text-sm text-center text-gray-600">
          &copy; {new Date().getFullYear()} LetterFlow. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
