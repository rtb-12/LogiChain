import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Wallet2,
  House,
  Check2Circle,
  Laptop,
  Database,
  BoxArrowRight,
  X,
} from "react-bootstrap-icons";
import { useWallet, addressEllipsis } from "@suiet/wallet-kit";

const Navbar = () => {
  const location = useLocation();
  const wallet = useWallet();
  const [showWalletOptions, setShowWalletOptions] = useState(false);

  const handleConnectClick = async () => {
    if (wallet.status === "connected") {
      await wallet.disconnect();
    } else {
      setShowWalletOptions(true);
    }
  };

  interface WalletOption {
    name: string;
    displayName: string;
  }

  // Function to connect to a specific wallet
  const connectToWallet = async (walletName: string): Promise<void> => {
    try {
      await wallet.select(walletName);
      setShowWalletOptions(false);
    } catch (error: unknown) {
      console.error("Failed to connect to wallet:", error);
    }
  };

  // Available wallets based on the error message
  const availableWallets: WalletOption[] = [
    { name: "Suiet", displayName: "Suiet" },
    { name: "Sui Wallet", displayName: "Sui Wallet" },
    { name: "Slush", displayName: "Slush" },
    { name: "Phantom", displayName: "Phantom" },
    { name: "OKX Wallet", displayName: "OKX" },
  ];

  return (
    <nav className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex-shrink-0 flex items-center">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              LogiChain
            </h1>
          </Link>

          {/* Navigation Links (hidden on mobile) */}
          <div className="hidden md:flex space-x-1">
            {[
              { path: "/", name: "Home", icon: <House className="w-4 h-4" /> },
              {
                path: "/pipelines",
                name: "Pipelines",
                icon: <Database className="w-4 h-4" />,
              },
              {
                path: "/runners",
                name: "Runners",
                icon: <Laptop className="w-4 h-4" />,
              },
              {
                path: "/attestations",
                name: "Attestations",
                icon: <Check2Circle className="w-4 h-4" />,
              },
            ].map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`px-3 py-2 rounded-md text-sm font-medium flex items-center space-x-1 transition-colors ${
                  location.pathname === item.path
                    ? "bg-indigo-50 text-indigo-700"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                }`}
              >
                {item.icon}
                <span>{item.name}</span>
              </Link>
            ))}
          </div>

          {/* Custom Wallet Connect Button */}
          <div className="relative">
            {wallet.status === "connected" ? (
              <div className="flex items-center space-x-2">
                <div className="bg-indigo-50 px-3 py-1 rounded-md">
                  <span className="text-sm font-medium text-indigo-700">
                    {addressEllipsis(wallet.account?.address ?? "")}
                  </span>
                </div>
                <button
                  onClick={handleConnectClick}
                  className="text-gray-500 hover:text-gray-700"
                  title="Disconnect wallet"
                >
                  <BoxArrowRight className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={handleConnectClick}
                className="relative inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 transition-all duration-300 shadow-sm hover:shadow-md"
              >
                <Wallet2 className="w-4 h-4 mr-2" />
                {wallet.status === "connecting"
                  ? "Connecting..."
                  : "Connect Wallet"}
              </button>
            )}

            {/* Wallet Selection Popup */}
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
      </div>
    </nav>
  );
};

export default Navbar;
