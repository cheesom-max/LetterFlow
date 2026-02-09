"use client";

import { useState, useEffect } from "react";
import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";
import type { Topic } from "@/lib/database.types";

interface TopicModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: {
    name: string;
    keywords: string[];
    rss_urls: string[];
    category: string;
    is_active: boolean;
  }) => Promise<unknown>;
  topic?: Topic | null;
}

const categories = ["Technology", "Business", "Creator", "Marketing", "Finance", "Other"];

export default function TopicModal({ isOpen, onClose, onSubmit, topic }: TopicModalProps) {
  const [name, setName] = useState("");
  const [keywords, setKeywords] = useState("");
  const [rssUrls, setRssUrls] = useState("");
  const [category, setCategory] = useState("Technology");
  const [isActive, setIsActive] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (topic) {
      setName(topic.name);
      setKeywords(topic.keywords.join(", "));
      setRssUrls(topic.rss_urls.join("\n"));
      setCategory(topic.category);
      setIsActive(topic.is_active);
    } else {
      setName("");
      setKeywords("");
      setRssUrls("");
      setCategory("Technology");
      setIsActive(true);
    }
  }, [topic, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    await onSubmit({
      name,
      keywords: keywords.split(",").map((k) => k.trim()).filter(Boolean),
      rss_urls: rssUrls.split("\n").map((u) => u.trim()).filter(Boolean),
      category,
      is_active: isActive,
    });
    setSaving(false);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={topic ? "Edit Topic" : "Add Topic"}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Topic Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            placeholder="e.g. AI & Machine Learning"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Keywords <span className="text-gray-400 font-normal">(comma separated)</span>
          </label>
          <input
            type="text"
            value={keywords}
            onChange={(e) => setKeywords(e.target.value)}
            className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            placeholder="e.g. artificial intelligence, LLM, GPT"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            RSS Feed URLs <span className="text-gray-400 font-normal">(one per line)</span>
          </label>
          <textarea
            value={rssUrls}
            onChange={(e) => setRssUrls(e.target.value)}
            className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
            rows={3}
            placeholder={"https://techcrunch.com/feed/\nhttps://news.ycombinator.com/rss"}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Category</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white"
          >
            {categories.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setIsActive(!isActive)}
            className={`relative w-10 h-5 rounded-full transition-colors cursor-pointer ${
              isActive ? "bg-indigo-600" : "bg-gray-300"
            }`}
          >
            <span
              className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition-transform shadow-sm ${
                isActive ? "translate-x-5" : ""
              }`}
            />
          </button>
          <span className="text-sm text-gray-700">Active monitoring</span>
        </div>

        <div className="flex gap-3 pt-2">
          <Button type="button" variant="secondary" onClick={onClose} className="flex-1">
            Cancel
          </Button>
          <Button type="submit" className="flex-1" disabled={saving}>
            {saving ? "Saving..." : topic ? "Save Changes" : "Add Topic"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
