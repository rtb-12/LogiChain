import { useState } from "react";
import {
  Search,
  Plus,
  Git,
  Clock,
  PlayFill,
} from "react-bootstrap-icons";
import { LineChart, BarChart } from "@mui/x-charts";
import Editor from "@monaco-editor/react";

interface Pipeline {
  id: number;
  name: string;
  status: string;
  duration: string;
  lastRun: string;
  repo: string;
  stages: string[];
  logs: string;
}

const PipelinesPage = () => {
  const [selectedPipeline, setSelectedPipeline] = useState<Pipeline | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("all");

  
  const pipelines = [
    {
      id: 1,
      name: "Web App Deployment",
      status: "success",
      duration: "2m 14s",
      lastRun: "2024-03-15 14:30",
      repo: "logichain/web-app",
      stages: ["Build", "Test", "Deploy"],
      logs: "Build completed successfully\nTests passed: 128/128\nDeployed to production",
    },
    {
      id: 2,
      name: "API Service CI",
      status: "failed",
      duration: "1m 45s",
      lastRun: "2024-03-15 13:45",
      repo: "logichain/api-service",
      stages: ["Build", "Test"],
      logs: "Build failed: Dependency conflict detected",
    },
    {
      id: 3,
      name: "Mobile App Build",
      status: "running",
      duration: "3m 00s",
      lastRun: "2024-03-15 15:00",
      repo: "logichain/mobile-app",
      stages: ["Build"],
      logs: "Compiling assets...",
    },
  ];

  const metrics = {
    successRate: [85, 88, 90, 92, 95],
    buildTimes: [120, 115, 110, 105, 100],
  };

  const integrations = [
    { name: "GitHub", connected: true },
    { name: "GitLab", connected: false },
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Pipeline Details Modal */}
        {selectedPipeline && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-10">
            <div className="bg-white rounded-xl p-6 max-w-2xl w-full">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">{selectedPipeline.name}</h2>
                <button 
                  onClick={() => setSelectedPipeline(null)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>
              <div className="mb-4">
                <p><strong>Repository:</strong> {selectedPipeline.repo}</p>
                <p><strong>Status:</strong> {selectedPipeline.status}</p>
                <p><strong>Last Run:</strong> {selectedPipeline.lastRun}</p>
                <p><strong>Duration:</strong> {selectedPipeline.duration}</p>
              </div>
              <div className="border rounded p-4 bg-gray-50 mb-4">
                <h3 className="text-md font-semibold mb-2">Logs</h3>
                <pre className="whitespace-pre-wrap text-sm">
                  {selectedPipeline.logs}
                </pre>
              </div>
              <div className="flex justify-end">
                <button 
                  onClick={() => setSelectedPipeline(null)}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-md"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
        
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">CI/CD Pipelines</h1>
          <button className="bg-indigo-600 text-white px-6 py-2 rounded-md flex items-center gap-2">
            <Plus size={16} /> New Pipeline
          </button>
        </div>

        {/* Filters & Search */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 text-gray-400" size={16} />
            <input
              type="text"
              placeholder="Search pipelines..."
              className="w-full pl-10 pr-4 py-2 border rounded-md"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            {["all", "success", "failed", "running"].map((filter) => (
              <button
                key={filter}
                className={`px-4 py-2 rounded-md capitalize ${
                  selectedFilter === filter
                    ? "bg-indigo-600 text-white"
                    : "bg-white text-gray-600"
                }`}
                onClick={() => setSelectedFilter(filter)}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>

        {/* Pipeline Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-12">
          {pipelines.map((pipeline) => (
            <div
              key={pipeline.id}
              className="bg-white rounded-xl shadow-sm border p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-semibold">{pipeline.name}</h3>
                  <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                    <Git size={14} />
                    <span>{pipeline.repo}</span>
                  </div>
                </div>
                <span
                  className={`px-2 py-1 rounded-full text-sm ${
                    pipeline.status === "success"
                      ? "bg-green-100 text-green-800"
                      : pipeline.status === "failed"
                      ? "bg-red-100 text-red-800"
                      : "bg-blue-100 text-blue-800"
                  }`}
                >
                  {pipeline.status}
                </span>
              </div>

              <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
                <div className="flex items-center gap-1">
                  <Clock size={14} />
                  <span>{pipeline.duration}</span>
                </div>
                <span>{pipeline.lastRun}</span>
              </div>

              <div className="border-t pt-4">
                <h4 className="text-sm font-medium mb-2">Stages</h4>
                <div className="flex gap-2">
                  {pipeline.stages.map((stage) => (
                    <span
                      key={stage}
                      className="px-2 py-1 bg-gray-100 rounded-md text-sm"
                    >
                      {stage}
                    </span>
                  ))}
                </div>
              </div>

              <button
                className="mt-4 w-full flex items-center justify-center gap-2 text-indigo-600 hover:bg-indigo-50 py-2 rounded-md"
                onClick={() => setSelectedPipeline(pipeline)}
              >
                <PlayFill size={14} /> View Details
              </button>
            </div>
          ))}
        </div>

        {/* Metrics Section */}
        <div className="bg-white rounded-xl p-6 mb-8 shadow-sm border">
          <h2 className="text-xl font-semibold mb-6">Performance Metrics</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="font-medium mb-4">Success Rate Trend</h3>
              <LineChart
                series={[{ data: metrics.successRate, color: "#4F46E5" }]}
                height={300}
                xAxis={[
                  { data: ["Week 1", "Week 2", "Week 3", "Week 4", "Week 5"] },
                ]}
              />
            </div>
            <div>
              <h3 className="font-medium mb-4">Average Build Time</h3>
              <BarChart
                series={[{ data: metrics.buildTimes, color: "#4F46E5" }]}
                height={300}
                xAxis={[
                  {
                    data: [
                      "Pipeline 1",
                      "Pipeline 2",
                      "Pipeline 3",
                      "Pipeline 4",
                      "Pipeline 5",
                    ],
                  },
                ]}
              />
            </div>
          </div>
        </div>

        {/* Configuration Section */}
        <div className="bg-white rounded-xl p-6 shadow-sm border mb-8">
          <h2 className="text-xl font-semibold mb-6">Pipeline Configuration</h2>
          <div className="border rounded-lg overflow-hidden">
            <Editor
              height="400px"
              defaultLanguage="yaml"
              defaultValue="# Add your pipeline configuration here"
              options={{ minimap: { enabled: false } }}
            />
          </div>
          <div className="flex justify-end gap-4 mt-4">
            <button className="px-6 py-2 border rounded-md">Validate</button>
            <button className="px-6 py-2 bg-indigo-600 text-white rounded-md">
              Save Changes
            </button>
          </div>
        </div>

        {/* Integrations Section */}
        <div className="bg-white rounded-xl p-6 shadow-sm border">
          <h2 className="text-xl font-semibold mb-6">Integrations</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {integrations.map((integration) => (
              <div key={integration.name} className="border p-4 rounded-lg">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <span className="font-medium">{integration.name}</span>
                  </div>
                  <span
                    className={`px-2 py-1 rounded-full text-sm ${
                      integration.connected
                        ? "bg-green-100 text-green-800"
                        : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {integration.connected ? "Connected" : "Not Connected"}
                  </span>
                </div>
                <button className="w-full py-2 text-sm border rounded-md hover:bg-gray-50">
                  {integration.connected ? "Configure" : "Connect"}
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PipelinesPage;
