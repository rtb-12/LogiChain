import { useState } from "react";
import {
  Server,
  Cpu,
  Hdd,
  Wallet,
  BarChart,
  Lightning,
  Clock,
  CurrencyDollar,
  Search,
  X,
  PlusCircle,
  Activity,
} from "react-bootstrap-icons";
import { LineChart} from "@mui/x-charts";
import Editor from "@monaco-editor/react";

interface RunnerJob {
  id: number;
  status: string;
  duration: string;
  project: string;
}

interface Runner {
  id: string;
  status: string;
  specs: {
    cpu: string;
    ram: string;
    storage: string;
  };
  executor: string;
  tags: string[];
  staked: number;
  rewards: number;
  jobs: RunnerJob[];
}

const RunnersPage = () => {
  const [showStakeModal, setShowStakeModal] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [selectedRunner, setSelectedRunner] = useState<Runner | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState("all");
  const [stakeAmount, setStakeAmount] = useState("");

  
  const runners = [
    {
      id: "RUNNER-01",
      status: "active",
      specs: { cpu: "8 cores", ram: "32GB", storage: "512GB SSD" },
      executor: "docker",
      tags: ["high-mem", "gpu-enabled"],
      staked: 2500,
      rewards: 45.2,
      jobs: [
        { id: 1, status: "success", duration: "2m", project: "web-app" },
        { id: 2, status: "running", duration: "1m", project: "api-service" },
      ],
    },
    {
      id: "RUNNER-02",
      status: "idle",
      specs: { cpu: "4 cores", ram: "16GB", storage: "256GB SSD" },
      executor: "kubernetes",
      tags: ["arm64", "low-power"],
      staked: 1000,
      rewards: 12.8,
      jobs: [
        { id: 3, status: "success", duration: "5m", project: "mobile-app" },
        { id: 4, status: "failed", duration: "3m", project: "auth-service" },
      ],
    },
    {
      id: "RUNNER-03",
      status: "active",
      specs: { cpu: "16 cores", ram: "64GB", storage: "1TB NVMe" },
      executor: "docker",
      tags: ["gpu-enabled", "high-performance", "ml-ready"],
      staked: 5000,
      rewards: 78.5,
      jobs: [
        { id: 5, status: "success", duration: "10m", project: "ml-training" },
        { id: 6, status: "running", duration: "45m", project: "data-pipeline" },
      ],
    },
  ];

  const operatorStats = {
    totalStaked: 8500,
    totalRewards: 136.5,
    activeRunners: 2,
    totalJobs: 27,
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Server className="text-indigo-600" /> Compute Runners
          </h1>
          <div className="flex gap-4">
            <button
              className="bg-indigo-600 text-white px-6 py-2 rounded-md flex items-center gap-2 hover:bg-indigo-700 transition-colors"
              onClick={() => setShowStakeModal(true)}
            >
              <Wallet /> Stake SUI
            </button>
            <button
              className="bg-green-600 text-white px-6 py-2 rounded-md flex items-center gap-2 hover:bg-green-700 transition-colors"
              onClick={() => setShowRegisterModal(true)}
            >
              <PlusCircle /> Add New Runner
            </button>
          </div>
        </div>

        {/* Stats & Filters */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-4 rounded-xl shadow-sm border">
            <div className="flex items-center gap-3">
              <CurrencyDollar className="text-green-600 w-5 h-5" />
              <div>
                <p className="text-sm text-gray-600">Total Staked</p>
                <p className="text-xl font-bold">
                  {operatorStats.totalStaked} SUI
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-xl shadow-sm border">
            <div className="flex items-center gap-3">
              <Activity className="text-blue-600 w-5 h-5" />
              <div>
                <p className="text-sm text-gray-600">Active Runners</p>
                <p className="text-xl font-bold">
                  {operatorStats.activeRunners}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-xl shadow-sm border">
            <div className="flex items-center gap-3">
              <Clock className="text-purple-600 w-5 h-5" />
              <div>
                <p className="text-sm text-gray-600">Total Jobs</p>
                <p className="text-xl font-bold">{operatorStats.totalJobs}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-xl shadow-sm border">
            <div className="flex items-center gap-3">
              <Lightning className="text-amber-600 w-5 h-5" />
              <div>
                <p className="text-sm text-gray-600">Total Rewards</p>
                <p className="text-xl font-bold">
                  {operatorStats.totalRewards} SUI
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Search & Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Search runners..."
              className="w-full pl-10 pr-4 py-2 border rounded-md"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Search className="absolute left-3 top-3 text-gray-400" />
          </div>
          <select
            className="bg-white border rounded-md px-4 py-2"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="all">All Runners</option>
            <option value="active">Active</option>
            <option value="idle">Idle</option>
          </select>
        </div>

        {/* Runners Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {runners
            .filter((runner) => filter === "all" || runner.status === filter)
            .filter(
              (runner) =>
                searchQuery === "" ||
                runner.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                runner.tags.some((tag) =>
                  tag.toLowerCase().includes(searchQuery.toLowerCase())
                )
            )
            .map((runner) => (
              <div
                key={runner.id}
                className="bg-white rounded-xl shadow-sm border p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-semibold flex items-center gap-2">
                      <span
                        className={`w-2 h-2 rounded-full ${
                          runner.status === "active"
                            ? "bg-green-500"
                            : "bg-red-500"
                        }`}
                      />
                      {runner.id}
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">
                      {runner.executor.toUpperCase()} Executor
                    </p>
                  </div>
                  <button
                    className="text-indigo-600 hover:bg-indigo-50 p-2 rounded-md"
                    onClick={() => setSelectedRunner(runner)}
                  >
                    <BarChart />
                  </button>
                </div>

                <div className="space-y-3 mb-6">
                  <div className="flex items-center gap-2 text-sm">
                    <Cpu className="text-gray-500" />
                    <span>{runner.specs.cpu}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Hdd className="text-gray-500" />
                    <span>
                      {runner.specs.ram} / {runner.specs.storage}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <CurrencyDollar className="text-gray-500" />
                    <span>Staked: {runner.staked} SUI</span>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <div className="flex flex-wrap gap-2">
                    {runner.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-1 bg-gray-100 rounded-md text-sm"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
        </div>

        {/* Empty state when no runners match filters */}
        {runners.filter(
          (runner) =>
            (filter === "all" || runner.status === filter) &&
            (searchQuery === "" ||
              runner.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
              runner.tags.some((tag) =>
                tag.toLowerCase().includes(searchQuery.toLowerCase())
              ))
        ).length === 0 && (
          <div className="text-center py-12 bg-white rounded-xl border">
            <Server className="mx-auto text-gray-400 w-12 h-12 mb-4" />
            <h3 className="text-xl font-medium text-gray-700">
              No runners found
            </h3>
            <p className="text-gray-500 mt-2">
              Try adjusting your search or filters
            </p>
          </div>
        )}

        {/* Stake Modal */}
        {showStakeModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl p-6 max-w-md w-full">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Wallet /> Stake SUI Tokens
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block mb-2">Amount to Stake</label>
                  <input
                    type="number"
                    className="w-full p-2 border rounded-md"
                    value={stakeAmount}
                    onChange={(e) => setStakeAmount(e.target.value)}
                    placeholder="Enter SUI amount"
                  />
                </div>
                <div className="flex gap-4">
                  <button
                    className="flex-1 px-4 py-2 border rounded-md hover:bg-gray-50 transition-colors"
                    onClick={() => setShowStakeModal(false)}
                  >
                    Cancel
                  </button>
                  <button className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors">
                    Confirm Stake
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Runner Detail Modal */}
        {selectedRunner && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-start mb-6">
                <h2 className="text-2xl font-bold">{selectedRunner.id}</h2>
                <button
                  className="text-gray-500 hover:text-gray-700"
                  onClick={() => setSelectedRunner(null)}
                >
                  <X />
                </button>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-medium mb-4 flex items-center gap-2">
                    <Lightning /> System Specs
                  </h3>
                  <div className="space-y-2">
                    <p>CPU: {selectedRunner.specs.cpu}</p>
                    <p>RAM: {selectedRunner.specs.ram}</p>
                    <p>Storage: {selectedRunner.specs.storage}</p>
                  </div>
                </div>

                <div>
                  <h3 className="font-medium mb-4 flex items-center gap-2">
                    <BarChart /> Performance
                  </h3>
                  <LineChart
                    series={[{ data: [80, 85, 82, 90, 88] }]}
                    height={200}
                    xAxis={[
                      {
                        data: [
                          "Week 1",
                          "Week 2",
                          "Week 3",
                          "Week 4",
                          "Week 5",
                        ],
                      },
                    ]}
                  />
                </div>
              </div>

              <div className="mt-6">
                <h3 className="font-medium mb-4 flex items-center gap-2">
                  <Clock /> Recent Jobs
                </h3>
                <div className="space-y-2">
                  {selectedRunner.jobs.map((job) => (
                    <div
                      key={job.id}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-md"
                    >
                      <div>
                        <p className="font-medium">{job.project}</p>
                        <p className="text-sm text-gray-600">{job.duration}</p>
                      </div>
                      <span
                        className={`px-2 py-1 rounded-full text-sm ${
                          job.status === "success"
                            ? "bg-green-100 text-green-800"
                            : job.status === "running"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {job.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Register Runner Modal */}
        {showRegisterModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl p-6 max-w-2xl w-full">
              <div className="flex justify-between items-start mb-6">
                <h2 className="text-2xl font-bold">Register New Runner</h2>
                <button
                  className="text-gray-500 hover:text-gray-700"
                  onClick={() => setShowRegisterModal(false)}
                >
                  <X />
                </button>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block mb-2">Executor Type</label>
                  <select className="w-full p-2 border rounded-md">
                    <option value="docker">Docker</option>
                    <option value="kubernetes">Kubernetes</option>
                    <option value="shell">Shell</option>
                  </select>
                </div>

                <div>
                  <label className="block mb-2">SUI to Stake</label>
                  <input
                    type="number"
                    className="w-full p-2 border rounded-md"
                    placeholder="Minimum 1000 SUI"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block mb-2">Runner Tags</label>
                  <input
                    type="text"
                    className="w-full p-2 border rounded-md"
                    placeholder="gpu, high-mem, arm64"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block mb-2">Advanced Configuration</label>
                  <div className="border rounded-md overflow-hidden h-48">
                    <Editor
                      height="100%"
                      defaultLanguage="yaml"
                      options={{ minimap: { enabled: false } }}
                    />
                  </div>
                </div>
              </div>

              <div className="mt-6 flex gap-4">
                <button
                  className="flex-1 px-4 py-2 border rounded-md hover:bg-gray-50 transition-colors"
                  onClick={() => setShowRegisterModal(false)}
                >
                  Cancel
                </button>
                <button className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors">
                  Register Runner
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RunnersPage;
