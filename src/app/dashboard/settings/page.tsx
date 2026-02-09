import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Input from "@/components/ui/Input";
import Badge from "@/components/ui/Badge";

const platforms = [
  {
    name: "Beehiiv",
    description: "Connect your Beehiiv account to publish directly",
    connected: true,
    color: "bg-amber-500",
  },
  {
    name: "Substack",
    description: "Publish newsletters to your Substack",
    connected: false,
    color: "bg-orange-500",
  },
  {
    name: "Kit (ConvertKit)",
    description: "Send newsletters via Kit email platform",
    connected: false,
    color: "bg-blue-500",
  },
];

export default function SettingsPage() {
  return (
    <div className="max-w-3xl space-y-8">
      {/* Profile */}
      <Card>
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Profile</h3>
        <div className="space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <Input label="Full Name" defaultValue="John Doe" />
            <Input label="Email" type="email" defaultValue="john@example.com" />
          </div>
          <Input label="Newsletter Name" defaultValue="The Weekly Digest" />
          <div className="pt-2">
            <Button>Save Changes</Button>
          </div>
        </div>
      </Card>

      {/* Style Learning */}
      <Card>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Writing Style Learning
        </h3>
        <p className="text-sm text-gray-500 mb-6">
          Upload 5-10 of your past newsletters so AI can learn your tone,
          structure, and style.
        </p>

        <div className="border-2 border-dashed border-gray-200 rounded-xl p-8 text-center hover:border-indigo-300 transition-colors cursor-pointer">
          <svg className="w-10 h-10 text-gray-300 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
          </svg>
          <p className="text-sm text-gray-600 font-medium">
            Drop files here or click to upload
          </p>
          <p className="text-xs text-gray-400 mt-1">
            Supports .txt, .md, .html, .pdf (max 10 files)
          </p>
        </div>

        <div className="mt-4 space-y-2">
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-3">
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <div>
                <p className="text-sm font-medium text-gray-700">weekly-ai-roundup-jan.md</p>
                <p className="text-xs text-gray-400">Uploaded 3 days ago</p>
              </div>
            </div>
            <Badge variant="success">Analyzed</Badge>
          </div>
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-3">
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <div>
                <p className="text-sm font-medium text-gray-700">saas-metrics-dec.md</p>
                <p className="text-xs text-gray-400">Uploaded 3 days ago</p>
              </div>
            </div>
            <Badge variant="success">Analyzed</Badge>
          </div>
        </div>

        <div className="mt-4 p-4 bg-indigo-50 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-sm font-semibold text-indigo-700">Style Profile Active</span>
          </div>
          <p className="text-xs text-indigo-600">
            Detected: Conversational tone, short paragraphs, bold key takeaways,
            uses &ldquo;you&rdquo; frequently. Match confidence: 94%.
          </p>
        </div>
      </Card>

      {/* Platform Integrations */}
      <Card>
        <h3 className="text-lg font-semibold text-gray-900 mb-6">
          Platform Integrations
        </h3>
        <div className="space-y-4">
          {platforms.map((platform) => (
            <div
              key={platform.name}
              className="flex items-center justify-between p-4 border border-gray-200 rounded-lg"
            >
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 ${platform.color} rounded-lg flex items-center justify-center`}>
                  <span className="text-white font-bold text-xs">
                    {platform.name.charAt(0)}
                  </span>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {platform.name}
                  </p>
                  <p className="text-xs text-gray-500">{platform.description}</p>
                </div>
              </div>
              {platform.connected ? (
                <div className="flex items-center gap-2">
                  <Badge variant="success">Connected</Badge>
                  <button className="text-xs text-gray-400 hover:text-red-500">
                    Disconnect
                  </button>
                </div>
              ) : (
                <Button variant="secondary" size="sm">
                  Connect
                </Button>
              )}
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
