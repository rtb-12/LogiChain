import { useState } from "react";
import {
  Search,
  FileEarmark,
  Download,
  Hash,
} from "react-bootstrap-icons";
import { Link } from "react-router-dom";

const AttestationsPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedAttestation, setSelectedAttestation] = useState(null);
  const [statusFilter, setStatusFilter] = useState("all");
  const [chainFilter, setChainFilter] = useState("all");


  const attestations = [
    {
      id: "ATT-0x1a2b...c3d4",
      repository: "logichain/core",
      commit: "a1b2c3d4",
      pipelineStep: "build",
      runner: "0x8923...a1b2",
      timestamp: "2024-03-15 14:30:00",
      status: "verified",
      outputHash: "QmXyZ...1234",
      artifactLink: "ipfs://QmXyZ...1234",
      chain: "Sui",
      signature: "0x1234...5678",
      verificationMethod: "zkProof",
      metadata: "Production build v1.2.3",
    },

  ];

  const filteredAttestations = attestations.filter((att) => {
    const matchesSearch =
      att.id.includes(searchQuery) ||
      att.repository.includes(searchQuery) ||
      att.commit.includes(searchQuery);
    const matchesStatus = statusFilter === "all" || att.status === statusFilter;
    const matchesChain = chainFilter === "all" || att.chain === chainFilter;
    return matchesSearch && matchesStatus && matchesChain;
  });

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <FileEarmark className="text-indigo-600" /> Build Attestations
          </h1>
          <button
            className="bg-indigo-600 text-white px-6 py-2 rounded-md flex items-center gap-2"
            onClick={() => alert("Exporting CSV...")}
          >
            <Download /> Export CSV
          </button>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 text-gray-400" />
            <input
              type="text"
              placeholder="Search attestations..."
              className="w-full pl-10 pr-4 py-2 border rounded-md"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <select
            className="bg-white border rounded-md px-4 py-2"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">All Statuses</option>
            <option value="verified">Verified</option>
            <option value="pending">Pending</option>
            <option value="failed">Failed</option>
          </select>
          <select
            className="bg-white border rounded-md px-4 py-2"
            value={chainFilter}
            onChange={(e) => setChainFilter(e.target.value)}
          >
            <option value="all">All Chains</option>
            <option value="Sui">Sui</option>
            <option value="Ethereum">Ethereum</option>
            <option value="Polygon">Polygon</option>
          </select>
        </div>

        {/* Attestations Table */}
        <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-medium">
                    Attestation ID
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-medium">
                    Repository
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-medium">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-medium">
                    Chain
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-medium">
                    Timestamp
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredAttestations.map((att) => (
                  <tr
                    key={att.id}
                    className="hover:bg-gray-50 cursor-pointer"
                    onClick={() => setSelectedAttestation(att)}
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Hash className="text-gray-400" />
                        <span className="font-mono text-sm">{att.id}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <Link
                        to={`https://github.com/${att.repository}`}
                        target="_blank"
                        className="text-indigo-600 hover:underline"
                      >
                        {att.repository}
                      </Link>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-2 py-1 rounded-full text-sm ${
                          att.status === "verified"
                            ? "bg-green-100 text-green-800"
                            : att.status === "pending"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {att.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">{att.chain}</td>
                    <td className="px-6 py-4">
                      {new Date(att.timestamp).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination */}
        <div className="mt-6 flex justify-center">
          <nav className="flex gap-2">
            <button className="px-3 py-1 rounded-md bg-gray-100">1</button>
            <button className="px-3 py-1 rounded-md hover:bg-gray-100">
              2
            </button>
            <button className="px-3 py-1 rounded-md hover:bg-gray-100">
              3
            </button>
          </nav>
        </div>

        {/* Detail Modal */}
        {selectedAttestation && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-start mb-6">
                <h2 className="text-2xl font-bold">Attestation Details</h2>
                <button
                  className="text-gray-500 hover:text-gray-700"
                  onClick={() => setSelectedAttestation(null)}
                >
                  ✕
                </button>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                {/* Left Column */}
                <div className="space-y-4">
                  <div>
                    <h3 className="font-medium mb-2">Attestation Overview</h3>
                    <dl className="space-y-2">
                      <div>
                        <dt className="text-sm text-gray-600">ID:</dt>
                        <dd className="font-mono text-sm break-all">
                          {selectedAttestation.id}
                        </dd>
                      </div>
                      <div>
                        <dt className="text-sm text-gray-600">Commit Hash:</dt>
                        <dd className="font-mono text-sm">
                          {selectedAttestation.commit}
                        </dd>
                      </div>
                      <div>
                        <dt className="text-sm text-gray-600">
                          Runner Address:
                        </dt>
                        <dd className="font-mono text-sm break-all">
                          {selectedAttestation.runner}
                        </dd>
                      </div>
                    </dl>
                  </div>

                  <div>
                    <h3 className="font-medium mb-2">Execution Details</h3>
                    <dl className="space-y-2">
                      <div>
                        <dt className="text-sm text-gray-600">
                          Pipeline Step:
                        </dt>
                        <dd className="text-sm capitalize">
                          {selectedAttestation.pipelineStep}
                        </dd>
                      </div>
                      <div>
                        <dt className="text-sm text-gray-600">Artifact:</dt>
                        <dd className="text-sm break-all">
                          <Link
                            to={selectedAttestation.artifactLink}
                            target="_blank"
                            className="text-indigo-600 hover:underline"
                          >
                            {selectedAttestation.artifactLink}
                          </Link>
                        </dd>
                      </div>
                    </dl>
                  </div>
                </div>

                {/* Right Column */}
                <div className="space-y-4">
                  <div>
                    <h3 className="font-medium mb-2">Verification Info</h3>
                    <dl className="space-y-2">
                      <div>
                        <dt className="text-sm text-gray-600">Signature:</dt>
                        <dd className="font-mono text-sm break-all">
                          {selectedAttestation.signature}
                        </dd>
                      </div>
                      <div>
                        <dt className="text-sm text-gray-600">Method:</dt>
                        <dd className="text-sm">
                          {selectedAttestation.verificationMethod}
                        </dd>
                      </div>
                    </dl>
                  </div>

                  <div>
                    <h3 className="font-medium mb-2">Additional Metadata</h3>
                    <p className="text-sm text-gray-600">
                      {selectedAttestation.metadata || "No additional metadata"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AttestationsPage;
