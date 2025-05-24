import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ConnectPage from "./pages/connect/connect.tsx";
import "./index.css";
import App from "./App.tsx";
import Layout from "./components/layout/Layout.tsx";
import { WalletProvider } from "@suiet/wallet-kit";
import GitHubCallback from "./pages/auth/github/callback.tsx";
import OnboardingFlow from "./pages/onboarding/onboarding.tsx";
import PipelinesPage from "./pages/pipelines/Pipelines.tsx";
import RunnersPage from "./pages/runners/Runners.tsx";
import AttestationsPage from "./pages/attestation/Attestation.tsx";

createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <WalletProvider>
      <Routes>
        {/* Add this special route outside of Layout for OAuth callback */}
        <Route path="/auth/github/callback" element={<GitHubCallback />} />

        {/* The Layout serves as a wrapper for all routes */}
        <Route path="/" element={<Layout />}>
          {/* Index route (homepage) */}
          <Route index element={<App />} />

          {/* Other routes */}
          <Route path="connect" element={<ConnectPage />} />
          <Route
            path="pipelines"
            element={<PipelinesPage />}
          />
          <Route
            path="runners"
            element={<RunnersPage />}
          />
          <Route
            path="attestations"
            element={<AttestationsPage />}
          />
          <Route
            path="onboarding"
            element={<OnboardingFlow />}
          />
        </Route>
      </Routes>
    </WalletProvider>
  </BrowserRouter>
);
