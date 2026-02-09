"use client";

import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import type { TopicWithCount } from "@/hooks/useTopics";

interface TopicCardProps {
  topic: TopicWithCount;
  onEdit: (topic: TopicWithCount) => void;
  onDelete: (id: string) => void;
}

export default function TopicCard({ topic, onEdit, onDelete }: TopicCardProps) {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h3 className="text-base font-semibold text-gray-900">{topic.name}</h3>
            <Badge variant={topic.is_active ? "success" : "default"}>
              {topic.is_active ? "Active" : "Paused"}
            </Badge>
          </div>
          <Badge variant="purple" className="mt-2">{topic.category}</Badge>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold text-gray-900">{topic.article_count}</p>
          <p className="text-xs text-gray-500">articles</p>
        </div>
      </div>

      <div className="mt-4">
        <p className="text-xs text-gray-500 mb-2">Keywords</p>
        <div className="flex flex-wrap gap-1.5">
          {topic.keywords.map((kw) => (
            <span
              key={kw}
              className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-xs"
            >
              {kw}
            </span>
          ))}
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between pt-4 border-t border-gray-100">
        <button
          onClick={() => onEdit(topic)}
          className="text-sm text-indigo-600 hover:text-indigo-800 font-medium cursor-pointer"
        >
          Edit
        </button>
        <button
          onClick={() => {
            if (confirm("Are you sure you want to remove this topic?")) {
              onDelete(topic.id);
            }
          }}
          className="text-sm text-gray-400 hover:text-red-500 cursor-pointer"
        >
          Remove
        </button>
      </div>
    </Card>
  );
}
