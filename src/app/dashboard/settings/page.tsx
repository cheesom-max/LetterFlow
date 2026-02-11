"use client";

import { useState, useEffect, useRef } from "react";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Input from "@/components/ui/Input";
import Badge from "@/components/ui/Badge";
import Modal from "@/components/ui/Modal";
import { useUser } from "@/hooks/useUser";
import type { Profile, PlatformConnection } from "@/lib/database.types";
import { PLATFORM_META } from "@/lib/constants";
import { PLAN_LIMITS, type Plan } from "@/lib/plan-limits";

export default function SettingsPage() {
  const { supabase, user } = useUser();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [connections, setConnections] = useState<PlatformConnection[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Profile form
  const [fullName, setFullName] = useState("");
  const [newsletterName, setNewsletterName] = useState("");

  // Connect modal
  const [connectModalOpen, setConnectModalOpen] = useState(false);
  const [connectPlatform, setConnectPlatform] = useState<"beehiiv" | "substack" | "kit">("beehiiv");
  const [apiKey, setApiKey] = useState("");
  const [publicationId, setPublicationId] = useState("");
  const [connecting, setConnecting] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  // Style learning
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [styleLoading, setStyleLoading] = useState(false);
  const [styleError, setStyleError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;

    const fetchData = async () => {
      const [profileRes, connectionsRes] = await Promise.all([
        supabase.from("profiles").select("*").eq("id", user.id).single(),
        supabase.from("platform_connections").select("*").eq("user_id", user.id),
      ]);

      if (profileRes.data) {
        setProfile(profileRes.data);
        setFullName(profileRes.data.full_name || "");
        setNewsletterName(profileRes.data.newsletter_name || "");
      }

      setConnections(connectionsRes.data || []);
      setLoading(false);
    };

    fetchData();
  }, [supabase, user]);

  const handleSaveProfile = async () => {
    if (!user) return;
    setSaving(true);
    setSaveError(null);
    const { error } = await supabase.from("profiles").update({
      full_name: fullName,
      newsletter_name: newsletterName,
    }).eq("id", user.id);
    setSaving(false);
    if (error) {
      setSaveError("Failed to save profile");
      return;
    }
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2000);
  };

  const handleConnect = async () => {
    if (!user || !apiKey) return;
    setConnecting(true);
    setSaveError(null);

    // Check platform connection limit
    const userPlan = (profile?.plan as Plan) || "free";
    const platformLimit = PLAN_LIMITS[userPlan].platforms as number;
    const activeConnections = connections.filter((c) => c.is_active).length;
    if (platformLimit !== -1 && activeConnections >= platformLimit) {
      setSaveError(`Platform limit reached (${activeConnections}/${platformLimit}). Upgrade your plan to connect more platforms.`);
      setConnecting(false);
      return;
    }

    const { error } = await supabase.from("platform_connections").insert({
      user_id: user.id,
      platform: connectPlatform,
      api_key: apiKey,
      publication_id: publicationId || null,
      is_active: true,
    });
    if (error) {
      setSaveError("Failed to connect platform");
      setConnecting(false);
      return;
    }
    const { data } = await supabase.from("platform_connections").select("*").eq("user_id", user.id);
    setConnections(data || []);
    setConnecting(false);
    setConnectModalOpen(false);
    setApiKey("");
    setPublicationId("");
  };

  const handleStyleUpload = async (files: FileList | null) => {
    if (!files?.length || !user) return;
    setStyleLoading(true);
    setStyleError(null);

    const formData = new FormData();
    for (let i = 0; i < files.length; i++) {
      formData.append("files", files[i]);
    }

    try {
      const res = await fetch("/api/learn-style", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) {
        setStyleError(data.error || "Failed to analyze style");
        return;
      }
      setProfile((prev) => prev ? { ...prev, style_profile: data.styleProfile } : prev);
    } catch {
      setStyleError("Failed to upload files");
    } finally {
      setStyleLoading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleDisconnect = async (id: string) => {
    if (!confirm("Disconnect this platform?")) return;
    const { error } = await supabase.from("platform_connections").delete().eq("id", id).eq("user_id", user!.id);
    if (error) {
      setSaveError("Failed to disconnect platform");
      return;
    }
    setConnections((prev) => prev.filter((c) => c.id !== id));
  };

  const openConnectModal = (platform: "beehiiv" | "substack" | "kit") => {
    setConnectPlatform(platform);
    setApiKey("");
    setPublicationId("");
    setConnectModalOpen(true);
  };

  const getConnection = (platform: string) =>
    connections.find((c) => c.platform === platform && c.is_active);

  if (loading) {
    return (
      <div className="max-w-3xl space-y-8">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-48 bg-gray-100 rounded-2xl animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div className="max-w-3xl space-y-8">
      {/* Profile */}
      <Card>
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Profile</h3>
        <div className="space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Full Name</label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>
            <Input label="Email" type="email" value={user?.email || ""} disabled />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Newsletter Name</label>
            <input
              type="text"
              value={newsletterName}
              onChange={(e) => setNewsletterName(e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              placeholder="My Weekly Newsletter"
            />
          </div>
          <div className="pt-2 flex items-center gap-3">
            <Button onClick={handleSaveProfile} disabled={saving}>
              {saving ? "Saving..." : "Save Changes"}
            </Button>
            {saveSuccess && <span className="text-sm text-green-600">Saved!</span>}
            {saveError && <span className="text-sm text-red-600">{saveError}</span>}
          </div>
        </div>
      </Card>

      {/* Style Learning */}
      <Card>
        <div className="flex items-center gap-3 mb-2">
          <h3 className="text-lg font-semibold text-gray-900">
            Writing Style Learning
          </h3>
          {((profile?.plan as Plan) || "free") === "free" && (
            <span className="px-2 py-0.5 text-xs font-medium bg-amber-100 text-amber-600 rounded-full">Starter+</span>
          )}
        </div>
        <p className="text-sm text-gray-500 mb-6">
          Upload 5-10 of your past newsletters so AI can learn your tone,
          structure, and style.
        </p>

        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept=".txt,.md,.html"
          className="hidden"
          onChange={(e) => handleStyleUpload(e.target.files)}
        />
        <div
          className={`border-2 border-dashed border-gray-200 rounded-xl p-8 text-center transition-colors ${
            styleLoading ? "opacity-60 pointer-events-none" : "hover:border-indigo-300 cursor-pointer"
          }`}
          onClick={() => fileInputRef.current?.click()}
        >
          <svg className="w-10 h-10 text-gray-300 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
          </svg>
          <p className="text-sm text-gray-600 font-medium">
            {styleLoading ? "Analyzing your writing style..." : "Drop files here or click to upload"}
          </p>
          <p className="text-xs text-gray-400 mt-1">
            Supports .txt, .md, .html (max 10 files)
          </p>
        </div>

        {styleError && (
          <p className="mt-3 text-sm text-red-600">{styleError}</p>
        )}

        {profile?.style_profile && (
          <div className="mt-4 p-4 bg-indigo-50 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-sm font-semibold text-indigo-700">Style Profile Active</span>
            </div>
            <p className="text-xs text-indigo-600">{profile.style_profile}</p>
          </div>
        )}
      </Card>

      {/* Platform Integrations */}
      <Card>
        <h3 className="text-lg font-semibold text-gray-900 mb-6">
          Platform Integrations
        </h3>
        <div className="space-y-4">
          {(["beehiiv", "substack", "kit"] as const).map((platform) => {
            const meta = PLATFORM_META[platform];
            const conn = getConnection(platform);
            return (
              <div
                key={platform}
                className="flex items-center justify-between p-4 border border-gray-200 rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 ${meta.color} rounded-lg flex items-center justify-center`}>
                    <span className="text-white font-bold text-xs">
                      {meta.label.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {meta.label}
                    </p>
                    <p className="text-xs text-gray-500">{meta.description}</p>
                  </div>
                </div>
                {platform === "substack" ? (
                  <Badge variant="default">Coming Soon</Badge>
                ) : conn ? (
                  <div className="flex items-center gap-2">
                    <Badge variant="success">Connected</Badge>
                    <button
                      onClick={() => handleDisconnect(conn.id)}
                      className="text-xs text-gray-400 hover:text-red-500 cursor-pointer"
                    >
                      Disconnect
                    </button>
                  </div>
                ) : (
                  <Button variant="secondary" size="sm" onClick={() => openConnectModal(platform)}>
                    Connect
                  </Button>
                )}
              </div>
            );
          })}
        </div>
      </Card>

      {/* Connect Platform Modal */}
      <Modal
        isOpen={connectModalOpen}
        onClose={() => setConnectModalOpen(false)}
        title={`Connect ${PLATFORM_META[connectPlatform]?.label}`}
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">API Key</label>
            <input
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              placeholder="Enter your API key"
              required
            />
          </div>
          {connectPlatform === "beehiiv" && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Publication ID</label>
              <input
                type="text"
                value={publicationId}
                onChange={(e) => setPublicationId(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="pub_xxxxxxxx"
              />
            </div>
          )}
          <div className="flex gap-3 pt-2">
            <Button variant="secondary" onClick={() => setConnectModalOpen(false)} className="flex-1">
              Cancel
            </Button>
            <Button onClick={handleConnect} disabled={connecting || !apiKey} className="flex-1">
              {connecting ? "Connecting..." : "Connect"}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
