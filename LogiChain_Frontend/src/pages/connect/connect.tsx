import { useState, useEffect } from "react";
import { Github, Wallet2, X } from "react-bootstrap-icons";
import { useWallet, addressEllipsis } from "@suiet/wallet-kit";
import { useNavigate, useLocation } from "react-router-dom";

export default function ConnectPage() {
  const [githubConnected, setGithubConnected] = useState(false);
  const [showWalletOptions, setShowWalletOptions] = useState(false);
  const wallet = useWallet();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const githubStatus = params.get("github");

    const hasGithubToken = Boolean(localStorage.getItem("githubAccessToken"));

    if (hasGithubToken || githubStatus === "success") {
      setGithubConnected(true);
    }
  }, [location]);

  const handleWalletConnect = () => {
    if (wallet.status === "connected") {
      wallet.disconnect();
    } else {
      setShowWalletOptions(true);
    }
  };

  interface WalletName {
    name: "Suiet" | "Sui Wallet" | "Slush" | "Phantom" | "OKX Wallet";
  }

  const connectToWallet = async (walletName: WalletName["name"]): Promise<void> => {
    try {
      await wallet.select(walletName);
      setShowWalletOptions(false);
    } catch (error: unknown) {
      console.error("Failed to connect to wallet:", error);
    }
  };

  const handleGithubConnect = () => {
  
    const client_id = import.meta.env.VITE_GITHUB_CLIENT_ID;

 
    const array = new Uint8Array(16);
    window.crypto.getRandomValues(array);
    const state = Array.from(array, (byte) =>
      byte.toString(16).padStart(2, "0")
    ).join("");

    localStorage.setItem("latestCSRFToken", state);

   
    const redirectUri = encodeURIComponent(
      import.meta.env.VITE_GITHUB_REDIRECT_URI ||
        "http://localhost:5173/auth/github/callback"
    );


    const link = `https://github.com/login/oauth/authorize?client_id=${client_id}&response_type=code&scope=repo&redirect_uri=${redirectUri}&state=${state}`;
    window.location.assign(link);
  };

  const handleDisconnectGithub = () => {
    localStorage.removeItem("githubAccessToken");
    localStorage.removeItem("githubUser");
    setGithubConnected(false);
  };

  const availableWallets: { name: WalletName["name"]; displayName: string }[] = [
    { name: "Suiet", displayName: "Suiet" },
    { name: "Sui Wallet", displayName: "Sui Wallet" },
    { name: "Slush", displayName: "Slush" },
    { name: "Phantom", displayName: "Phantom" },
    { name: "OKX Wallet", displayName: "OKX" },
  ];

  const isReady = wallet.status === "connected" && githubConnected;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-indigo-50 flex items-center justify-center px-4">
      <div className="fixed inset-0 z-0">
        <div
          className="absolute inset-0 opacity-[0.08]"
          style={{
            backgroundImage: `
              linear-gradient(#4f46e5 1px, transparent 1px),
              linear-gradient(to right, #4f46e5 1px, transparent 1px)
            `,
            backgroundSize: "50px 50px",
          }}
        ></div>
        <div className="absolute top-20 right-[10%] w-64 h-64 rounded-full bg-pink-200 mix-blend-multiply opacity-20 filter blur-xl animate-pulse"></div>
        <div className="absolute bottom-20 left-[15%] w-72 h-72 rounded-full bg-indigo-200 mix-blend-multiply opacity-20 filter blur-xl"></div>
      </div>

      <div className="max-w-2xl w-full bg-white p-8 rounded-2xl shadow-lg space-y-6 relative z-10 border border-gray-100">
        <h1 className="text-3xl font-bold text-center text-gray-800">
          Connect Your Tools
        </h1>
        <p className="text-center text-gray-500">
          To get started, connect your Sui wallet and GitHub account.
        </p>

        <div className="space-y-4">
          <div className="bg-gray-50 border border-gray-200 p-6 rounded-xl flex items-center justify-between shadow-sm hover:shadow-md transition-shadow duration-200">
            <div className="flex items-center gap-3">
              <Wallet2 className="w-6 h-6 text-indigo-600" />
              <div>
                <span className="text-gray-800 font-medium">Sui Wallet</span>
                {wallet.status === "connected" && (
                  <p className="text-xs text-gray-500 mt-1">
                    {addressEllipsis(wallet.account?.address ?? "")}
                  </p>
                )}
              </div>
            </div>

            <div className="relative">
              <button
                onClick={handleWalletConnect}
                className={`px-5 py-2 text-sm font-semibold rounded-lg transition ${
                  wallet.status === "connected"
                    ? "bg-green-500 text-white"
                    : "bg-indigo-600 hover:bg-indigo-700 text-white"
                }`}
              >
                {wallet.status === "connected"
                  ? "Connected"
                  : wallet.status === "connecting"
                  ? "Connecting..."
                  : "Connect"}
              </button>

              {showWalletOptions && (
                <div className="absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 p-2 z-50">
                  <div className="flex justify-between items-center mb-2 pb-1 border-b">
                    <p className="text-sm font-medium text-gray-700">
                      Select Wallet
                    </p>
                    <button
                      onClick={() => setShowWalletOptions(false)}
                      className="text-gray-400 hover:text-gray-500"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="py-1">
                    {availableWallets.map((walletOption) => (
                      <button
                        key={walletOption.name}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 rounded"
                        onClick={() => connectToWallet(walletOption.name)}
                      >
                        {walletOption.displayName}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="bg-gray-50 border border-gray-200 p-6 rounded-xl flex items-center justify-between shadow-sm hover:shadow-md transition-shadow duration-200">
            <div className="flex items-center gap-3">
              <Github className="w-6 h-6 text-gray-800" />
              <div>
                <span className="text-gray-800 font-medium">
                  GitHub Account
                </span>
                {githubConnected && (
                  <p className="text-xs text-gray-500 mt-1">Connected</p>
                )}
              </div>
            </div>
            <button
              onClick={
                githubConnected ? handleDisconnectGithub : handleGithubConnect
              }
              className={`px-5 py-2 text-sm font-semibold rounded-lg transition ${
                githubConnected
                  ? "bg-green-500 text-white"
                  : "bg-gray-700 hover:bg-gray-800 text-white"
              }`}
            >
              {githubConnected ? "Connected" : "Connect"}
            </button>
          </div>
        </div>

        <button
          className={`w-full py-3 rounded-xl text-lg font-medium transition shadow-sm ${
            isReady
              ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:opacity-90 hover:shadow-md"
              : "bg-gray-100 text-gray-400 border border-gray-200 cursor-not-allowed"
          }`}
          disabled={!isReady}
          onClick={() => navigate("/onboarding")}
        >
          Continue
        </button>

        <p className="text-xs text-center text-gray-400 pt-4">
          Having trouble connecting?{" "}
          <a href="#" className="text-indigo-600 hover:underline">
            View help documentation
          </a>
        </p>
      </div>
    </div>
  );
}
