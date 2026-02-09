import { Stat } from "@/data/dummy";

const iconMap: Record<string, { gradient: string; icon: React.ReactNode }> = {
  "Monitored Topics": {
    gradient: "from-amber-500 to-orange-500",
    icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" /></svg>,
  },
  "Curated Articles": {
    gradient: "from-blue-500 to-cyan-500",
    icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" /></svg>,
  },
  "Drafts Generated": {
    gradient: "from-indigo-500 to-violet-500",
    icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>,
  },
  Published: {
    gradient: "from-emerald-500 to-teal-500",
    icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
  },
};

export default function StatsCard({ label, value, change, changeType }: Stat) {
  const changeColor =
    changeType === "up"
      ? "text-emerald-600 bg-emerald-50"
      : changeType === "down"
        ? "text-red-600 bg-red-50"
        : "text-gray-500 bg-gray-50";

  const meta = iconMap[label] || iconMap["Published"];

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-gray-400">{label}</p>
          <p className="mt-2 text-3xl font-extrabold text-gray-900">{value}</p>
        </div>
        <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${meta.gradient} flex items-center justify-center text-white shadow-lg`}>
          {meta.icon}
        </div>
      </div>
      <div className="mt-3">
        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${changeColor}`}>
          {change}
        </span>
      </div>
    </div>
  );
}
