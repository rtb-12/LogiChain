import { useState } from "react";
import {
  Github,
  Check,
  Clipboard,
  CurrencyExchange,
} from "react-bootstrap-icons";
import PaymentComponent from "./payment";
import Editor from "@monaco-editor/react";
import axios from "axios";

interface Repository {
  id: string | number;
  name: string;
  description: string;
  updated_at: string;
  visibility: string;
}

const OnboardingFlow = () => {
  const steps = [
    { title: "Connect Repos", icon: <Github size={16} /> },
    { title: "Configure Workflows", icon: <Clipboard size={16} /> },
    { title: "Set Secrets", icon: <Check size={16} /> },
    { title: "Review & Pay", icon: <CurrencyExchange size={16} /> }
  ];

  const [currentStep, setCurrentStep] = useState(0);
  const [repos, setRepos] = useState<Repository[]>([]);
  const [selectedRepos, setSelectedRepos] = useState<Array<Repository['id']>>([]);
  const [workflowConfig, setWorkflowConfig] = useState({});
  const [secrets, setSecrets] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPayment, setShowPayment] = useState(false);
  const [paymentComplete, setPaymentComplete] = useState(false);
  const [txHash, setTxHash] = useState("");

  const connectGitHub = async () => {
    try {
      const response = await axios.get("/api/github/repositories");
      setRepos(response.data);
    } catch (err) {
      setError(`Failed to fetch repositories: ${err instanceof Error ? err.message : String(err)}`);
    }
  };

  interface Repository {
    id: string | number;
    name: string;
    description: string;
    updated_at: string;
    visibility: string;
  }

  const toggleRepoSelection = (repo: Repository): void => {
    setSelectedRepos((prev: Array<Repository['id']>) =>
      prev.includes(repo.id)
        ? prev.filter((id) => id !== repo.id)
        : [...prev, repo.id]
    );
  };


  interface WorkflowConfig {
    [repoId: string | number]: string;
  }

  const handleWorkflowChange = (value: string, repoId: Repository['id']): void => {
    setWorkflowConfig((prev: WorkflowConfig) => ({
      ...prev,
      [repoId]: value,
    }));
  };


  interface Secrets {
    [key: string]: string;
  }

  const handleSecretChange = (name: string, value: string): void => {
    setSecrets((prev: Secrets) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePaymentComplete = (hash: string): void => {
    setTxHash(hash);
    setPaymentComplete(true);
    setShowPayment(false);
  };


  const finalizeSetup = async () => {
    setLoading(true);
    try {
      await axios.post("/api/setup", {
        repositories: selectedRepos,
        workflows: workflowConfig,
        secrets,
        paymentTxHash: txHash,  
      });
      setCurrentStep((prev) => prev + 1);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : String(err);
      setError(`Configuration failed: ${errorMessage}. Please check your settings.`);
    }
    setLoading(false);
  };

 
  if (showPayment) {
    return (
      <PaymentComponent
        onComplete={handlePaymentComplete}
        onCancel={() => setShowPayment(false)}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg p-8">
        {/* Progress Stepper */}
        <div className="flex justify-between mb-12">
          {steps.map((step, index) => (
            <div key={step.title} className="flex flex-col items-center w-1/4">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center 
                ${
                  index <= currentStep
                    ? "bg-indigo-600 text-white"
                    : "bg-gray-200"
                }`}
              >
                {step.icon}
              </div>
              <span
                className={`mt-2 text-sm ${
                  index <= currentStep ? "font-medium" : "text-gray-500"
                }`}
              >
                {step.title}
              </span>
            </div>
          ))}
        </div>

        {/* Step Content */}
        {currentStep === 0 && (
          <RepositorySelection
            repos={repos}
            selectedRepos={selectedRepos}
            onSelect={toggleRepoSelection}
            onConnect={connectGitHub}
          />
        )}

        {currentStep === 1 && (
          <PipelineConfiguration
            repos={repos.filter((r) => selectedRepos.includes(r.id))}
            workflowConfig={workflowConfig}
            onChange={handleWorkflowChange}
          />
        )}

        {currentStep === 2 && (
          <EnvironmentSecrets secrets={secrets} onChange={handleSecretChange} />
        )}

        {currentStep === 3 && (
          <FinalReview
            repos={repos.filter((r) => selectedRepos.includes(r.id))}
            workflows={workflowConfig}
            secrets={secrets}
            paymentComplete={paymentComplete}
            txHash={txHash}
          />
        )}

        {/* Navigation Controls */}
        <div className="mt-8 flex justify-between">
          <button
            className="px-6 py-2 border rounded-lg"
            disabled={currentStep === 0}
            onClick={() => setCurrentStep((prev) => prev - 1)}
          >
            Back
          </button>

          {currentStep < steps.length - 1 ? (
            <button
              className="px-6 py-2 bg-indigo-600 text-white rounded-lg"
              onClick={() => setCurrentStep((prev) => prev + 1)}
            >
              Continue
            </button>
          ) : paymentComplete ? (
            <button
              className="px-6 py-2 bg-green-600 text-white rounded-lg"
              onClick={finalizeSetup}
              disabled={loading}
            >
              {loading ? "Configuring..." : "Complete Setup"}
            </button>
          ) : (
            <button
              className="px-6 py-2 bg-indigo-600 text-white rounded-lg flex items-center gap-2"
              onClick={() => setShowPayment(true)}
            >
              <CurrencyExchange /> Proceed to Payment
            </button>
          )}
        </div>

        {error && <div className="mt-4 text-red-600">{error}</div>}
      </div>
    </div>
  );
};


const RepositorySelection = ({ 
  repos, 
  selectedRepos, 
  onSelect, 
  onConnect 
}: { 
  repos: Repository[]; 
  selectedRepos: Array<Repository['id']>;
  onSelect: (repo: Repository) => void;
  onConnect: () => void;
}) => (
  <div>
    <h2 className="text-2xl font-bold mb-6">Connect Repositories</h2>
    <button
      className="mb-6 flex items-center gap-2 px-4 py-2 bg-gray-800 text-white rounded-lg"
      onClick={onConnect}
    >
      <Github /> Connect GitHub Account
    </button>

    <div className="border rounded-lg p-4">
      <input
        type="text"
        placeholder="Search repositories..."
        className="w-full p-2 mb-4 border rounded"
      />

      <div className="max-h-96 overflow-y-auto">
        {repos.map((repo) => (
          <label
            key={repo.id}
            className="flex items-center p-3 hover:bg-gray-50 cursor-pointer border-b"
          >
            <input
              type="checkbox"
              checked={selectedRepos.includes(repo.id)}
              onChange={() => onSelect(repo)}
              className="mr-3"
            />
            <div>
              <div className="font-medium">{repo.name}</div>
              <div className="text-sm text-gray-600">{repo.description}</div>
              <div className="text-xs text-gray-500 mt-1">
                Updated {new Date(repo.updated_at).toLocaleDateString()} •{" "}
                {repo.visibility}
              </div>
            </div>
          </label>
        ))}
      </div>
    </div>
  </div>
);

const PipelineConfiguration = ({ 
  repos, 
  workflowConfig, 
  onChange 
}: { 
  repos: Repository[]; 
  workflowConfig: { [repoId: string | number]: string }; 
  onChange: (value: string, repoId: Repository['id']) => void;
}) => (
  <div>
    <h2 className="text-2xl font-bold mb-6">Configure Workflows</h2>
    <div className="space-y-8">
      {repos.map((repo) => (
        <div key={repo.id} className="border rounded-lg p-4">
          <h3 className="font-medium mb-4">{repo.name}</h3>
          <select className="mb-4 p-2 border rounded">
            <option>Select Workflow Template</option>
            <option>Node.js CI</option>
            <option>Python Package</option>
            <option>Docker Build</option>
          </select>

          <div className="h-64 border rounded">
            <Editor
              height="100%"
              defaultLanguage="yaml"
              value={workflowConfig[repo.id] || ""}
              onChange={(value) => onChange(value || "", repo.id)}
              options={{ minimap: { enabled: false } }}
            />
          </div>
        </div>
      ))}
    </div>
  </div>
);

const EnvironmentSecrets = ({ 
  secrets, 
  onChange 
}: { 
  secrets: { [key: string]: string }; 
  onChange: (name: string, value: string) => void;
}) => (
  <div>
    <h2 className="text-2xl font-bold mb-6">Configure Secrets</h2>
    <div className="space-y-4">
      {["DOCKER_USERNAME", "DOCKER_PASSWORD", "NPM_TOKEN"].map((secret) => (
        <div key={secret} className="border rounded-lg p-4">
          <label className="block mb-2 font-medium">{secret}</label>
          <div className="flex items-center gap-2">
            <input
              type="password"
              value={secrets[secret] || ""}
              onChange={(e) => onChange(secret, e.target.value)}
              className="flex-1 p-2 border rounded"
            />
            <button className="p-2 text-gray-500 hover:text-indigo-600">
              <Clipboard />
            </button>
          </div>
          <p className="text-sm text-gray-600 mt-2">
            {secret === "DOCKER_USERNAME" && "Your Docker Hub username"}
            {secret === "DOCKER_PASSWORD" && "Your Docker Hub access token"}
            {secret === "NPM_TOKEN" && "NPM authentication token"}
          </p>
        </div>
      ))}
    </div>
  </div>
);

const FinalReview = ({
  repos,
  workflows,
  secrets,
  paymentComplete,
  txHash,
}: {
  repos: Repository[];
  workflows: { [repoId: string | number]: string };
  secrets: { [key: string]: string };
  paymentComplete: boolean;
  txHash: string;
}) => (
  <div>
    <h2 className="text-2xl font-bold mb-6">Review Configuration</h2>
    <div className="space-y-6">
      <div className="border rounded-lg p-4">
        <h3 className="font-medium mb-4">Selected Repositories</h3>
        <ul className="list-disc pl-6">
          {repos.map((repo) => (
            <li key={repo.id} className="mb-2">
              {repo.name} ({repo.visibility})
            </li>
          ))}
        </ul>
      </div>

      <div className="border rounded-lg p-4">
        <h3 className="font-medium mb-4">Workflow Configuration</h3>
        {repos.map((repo) => (
          <div key={repo.id} className="mb-4">
            <div className="font-medium">{repo.name}</div>
            <div className="text-sm text-gray-600 overflow-x-auto">
              <pre>{workflows[repo.id]}</pre>
            </div>
          </div>
        ))}
      </div>

      <div className="border rounded-lg p-4">
        <h3 className="font-medium mb-4">Environment Secrets</h3>
        <ul className="space-y-2">
          {Object.keys(secrets).map((key) => (
            <li key={key} className="flex items-center gap-2">
              <span className="font-medium">{key}:</span>
              <span className="text-gray-600">••••••••</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Payment Status Section */}
      <div className="border rounded-lg p-4">
        <h3 className="font-medium mb-4 flex items-center gap-2">
          <CurrencyExchange className="text-indigo-600" /> Payment Status
        </h3>

        {paymentComplete ? (
          <div className="bg-green-50 p-4 rounded-md">
            <p className="text-green-700 font-medium flex items-center gap-2">
              <Check /> Payment Complete
            </p>
            <p className="text-sm text-gray-600 mt-2">
              Transaction Hash:{" "}
              <span className="font-mono">
                {txHash.substring(0, 10)}...
                {txHash.substring(txHash.length - 10)}
              </span>
            </p>
          </div>
        ) : (
          <div className="bg-yellow-50 p-4 rounded-md">
            <p className="text-yellow-700">
              Payment required to finalize setup. Please click "Proceed to
              Payment" below to continue.
            </p>
          </div>
        )}
      </div>
    </div>
  </div>
);

export default OnboardingFlow;
