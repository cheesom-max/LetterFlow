"use client";

import { useState } from "react";
import Button from "@/components/ui/Button";
import TopicCard from "@/components/topics/TopicCard";
import TopicModal from "@/components/topics/TopicModal";
import { useTopics, type TopicWithCount } from "@/hooks/useTopics";
import type { Topic } from "@/lib/database.types";

export default function TopicsPage() {
  const { topics, loading, addTopic, updateTopic, deleteTopic } = useTopics();
  const [modalOpen, setModalOpen] = useState(false);
  const [editingTopic, setEditingTopic] = useState<Topic | null>(null);

  const handleSubmit = async (data: {
    name: string;
    keywords: string[];
    rss_urls: string[];
    category: string;
    is_active: boolean;
  }) => {
    if (editingTopic) {
      return updateTopic(editingTopic.id, data);
    }
    return addTopic(data);
  };

  const handleEdit = (topic: TopicWithCount) => {
    setEditingTopic(topic);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setEditingTopic(null);
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="h-5 w-40 bg-gray-200 rounded animate-pulse" />
          <div className="h-10 w-32 bg-gray-200 rounded-xl animate-pulse" />
        </div>
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-48 bg-gray-100 rounded-2xl animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500">
            {topics.length} topics &middot; {topics.filter((t) => t.is_active).length} active
          </p>
        </div>
        <Button onClick={() => setModalOpen(true)}>
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Add Topic
        </Button>
      </div>

      {topics.length === 0 ? (
        <div className="text-center py-16">
          <div className="w-16 h-16 bg-indigo-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-1">No topics yet</h3>
          <p className="text-sm text-gray-500 mb-6">Add your first topic to start curating content for your newsletter.</p>
          <Button onClick={() => setModalOpen(true)}>Add Your First Topic</Button>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
          {topics.map((topic) => (
            <TopicCard
              key={topic.id}
              topic={topic}
              onEdit={handleEdit}
              onDelete={deleteTopic}
            />
          ))}
        </div>
      )}

      <TopicModal
        isOpen={modalOpen}
        onClose={handleCloseModal}
        onSubmit={handleSubmit}
        topic={editingTopic}
      />
    </div>
  );
}
