import { useState, useEffect } from "react";
import WormholeConnect from "@wormhole-foundation/wormhole-connect";
import type {
  WormholeConnectConfig,
  WormholeConnectTheme,
} from "@wormhole-foundation/wormhole-connect";
import {  CurrencyExchange } from "react-bootstrap-icons";

interface PaymentProps {
  onComplete?: (txHash: string) => void;
  onCancel?: () => void;
}

const PaymentComponent = ({ onComplete }: PaymentProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Wormhole configuration
  const config: WormholeConnectConfig = {
    network: "Testnet",
    chains: ["Sui", "Avalanche"],
    ui: {
      title: "LogiChain Payments",
    },
  };
  
  // Set up event listeners for Wormhole Connect events
  useEffect(() => {
    const handleTransferSuccess = (event: Event) => {
      const customEvent = event as CustomEvent<{txHash?: string}>;
      console.log("Transaction completed", customEvent.detail);
      setIsLoading(false);
      
      if (onComplete && customEvent.detail && customEvent.detail.txHash) {
        onComplete(customEvent.detail.txHash);
      }
    };
    
    const handleTransferError = (event: Event) => {
      const customEvent = event as CustomEvent<unknown>;
      console.error("Transaction failed", customEvent.detail);
      setIsLoading(false);
      setError(String(customEvent.detail));
    };

    // Add event listeners
    document.addEventListener("wormhole:transfer:success", handleTransferSuccess);
    document.addEventListener("wormhole:transfer:error", handleTransferError);

    // Clean up
    return () => {
      document.removeEventListener("wormhole:transfer:success", handleTransferSuccess);
      document.removeEventListener("wormhole:transfer:error", handleTransferError);
    };
  }, [onComplete]);


  const theme: WormholeConnectTheme = {
    mode: "light",                            
    primary: "#6366f1", 
    secondary: "#8b5cf6",
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <header className="mb-8">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold flex items-center gap-2" />
              <CurrencyExchange className="text-indigo-600" /> Cross-Chain
              Payment
          {/* Wormhole Connect Widget */}
          <div className="p-6">
            <WormholeConnect 
              config={config} 
              theme={theme} 
            />
          </div>
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
            <WormholeConnect 
              config={config} 
              theme={theme} 
            />
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
