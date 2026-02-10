"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/hooks/useUser";
import { INTEREST_OPTIONS } from "@/lib/constants";

export default function OnboardingPage() {
  const { supabase, user } = useUser();
  const router = useRouter();
  const [newsletterName, setNewsletterName] = useState("");
  const [interests, setInterests] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const toggleInterest = (interest: string) => {
    setInterests((prev) =>
      prev.includes(interest)
        ? prev.filter((i) => i !== interest)
        : [...prev, interest]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (interests.length === 0) {
      setError("Please select at least one interest.");
      return;
    }
    if (!user) return;

    setSaving(true);
    setError("");

    const { error: updateError } = await supabase
      .from("profiles")
      .update({
        newsletter_name: newsletterName || null,
        interests,
      })
      .eq("id", user.id);

    if (updateError) {
      setError("Failed to save profile. Please try again.");
      setSaving(false);
      return;
    }

    router.push("/dashboard");
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4">
      <div className="w-full max-w-lg">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-indigo-600 to-violet-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
            <span className="text-white text-2xl font-bold">LF</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">
            Welcome to LetterFlow!
          </h1>
          <p className="mt-2 text-sm text-gray-500">
            Let&apos;s personalize your experience. This helps us curate the
            best content for your newsletter.
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Newsletter Name{" "}
                <span className="text-gray-400 font-normal">(optional)</span>
              </label>
              <input
                type="text"
                value={newsletterName}
                onChange={(e) => setNewsletterName(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="e.g. The Weekly Byte"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Interests{" "}
                <span className="text-gray-400 font-normal">
                  (select at least 1)
                </span>
              </label>
              <div className="flex flex-wrap gap-2">
                {INTEREST_OPTIONS.map((interest) => {
                  const selected = interests.includes(interest);
                  return (
                    <button
                      key={interest}
                      type="button"
                      onClick={() => toggleInterest(interest)}
                      className={`px-3.5 py-2 rounded-full text-sm font-medium transition-all cursor-pointer ${
                        selected
                          ? "bg-indigo-600 text-white shadow-sm"
                          : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                      }`}
                    >
                      {selected && (
                        <svg
                          className="w-3.5 h-3.5 inline mr-1 -mt-0.5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2.5}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      )}
                      {interest}
                    </button>
                  );
                })}
              </div>
            </div>

            {error && (
              <p className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={saving || interests.length === 0}
              className="w-full px-4 py-3 bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-semibold rounded-xl text-sm hover:from-indigo-700 hover:to-violet-700 transition-all shadow-md shadow-indigo-200 disabled:opacity-50 cursor-pointer"
            >
              {saving ? "Saving..." : "Get Started"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
