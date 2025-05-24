import { useState } from "react";
import WormholeConnect from "@wormhole-foundation/wormhole-connect";
import type {
  WormholeConnectConfig,
  WormholeConnectTheme,
} from "@wormhole-foundation/wormhole-connect";
import { ArrowLeft, CurrencyExchange } from "react-bootstrap-icons";

interface PaymentProps {
  onComplete?: (txHash: string) => void;
  onCancel?: () => void;
}

const PaymentComponent = ({ onComplete, onCancel }: PaymentProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Wormhole configuration
  const config: WormholeConnectConfig = {
    network: "Testnet",
    chains: ["Sui", "Avalanche"],
    ui: {
      title: "LogiChain Payments",
    },
   
    onSend: () => {
      console.log("Transaction initiated");
      setIsLoading(true);
    },
    onComplete: (txHash) => {
      console.log("Transaction completed", txHash);
      setIsLoading(false);
     
      if (onComplete && typeof txHash === "string") {
        onComplete(txHash);
      }
    },
    onError: (error) => {
      console.error("Transaction failed", error);
      setIsLoading(false);
      setError(error.toString());
    },
  };


  const theme: WormholeConnectTheme = {
    mode: "light",                            
    primary: "#6366f1", 
    secondary: "#8b5cf6",
    accent: "#10b981",
    background: "#ffffff",
    fontFamily: "Inter, system-ui, sans-serif",
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <header className="mb-8">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <CurrencyExchange className="text-indigo-600" /> Cross-Chain
              Payment
            </h1>
            {onCancel && (
              <button
                onClick={onCancel}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
              >
                <ArrowLeft /> Back
              </button>
            )}
          </div>
          <p className="mt-2 text-gray-600">
            Transfer tokens across different blockchains to complete your
            payment
          </p>
        </header>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
            <p className="font-medium">Transaction Error</p>
            <p className="text-sm">{error}</p>
          </div>
        )}

        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="p-6 border-b">
            <h2 className="text-xl font-semibold">Payment Details</h2>
          </div>

          {/* Wormhole Connect Widget */}
          <div className="p-6">
            <WormholeConnect config={config} theme={theme} />
          </div>

          {isLoading && (
            <div className="p-6 bg-gray-50 text-center">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600 mx-auto"></div>
              <p className="mt-2 text-gray-600">
                Processing your transaction...
              </p>
            </div>
          )}
        </div>

        <div className="text-sm text-gray-500 mt-6">
          <p>• Transfers typically complete in 1-2 minutes</p>
          <p>• A small gas fee will be charged for the transaction</p>
          <p>• Make sure you have sufficient funds in your wallet</p>
        </div>
      </div>
    </div>
  );
};

export default PaymentComponent;
