import Card from "@/components/ui/Card";
import { recentActivity } from "@/data/dummy";

const typeIcons: Record<string, { bg: string; color: string }> = {
  curated: { bg: "bg-blue-100", color: "text-blue-600" },
  draft: { bg: "bg-indigo-100", color: "text-indigo-600" },
  published: { bg: "bg-green-100", color: "text-green-600" },
  topic: { bg: "bg-amber-100", color: "text-amber-600" },
};

export default function RecentActivity() {
  return (
    <Card>
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
      <div className="space-y-4">
        {recentActivity.map((activity, idx) => {
          const icon = typeIcons[activity.type] || typeIcons.curated;
          return (
            <div key={idx} className="flex items-start gap-3">
              <div className={`w-8 h-8 rounded-full ${icon.bg} flex items-center justify-center shrink-0 mt-0.5`}>
                <div className={`w-2 h-2 rounded-full ${icon.color.replace("text-", "bg-")}`} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-700">{activity.message}</p>
                <p className="text-xs text-gray-400 mt-0.5">{activity.time}</p>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
