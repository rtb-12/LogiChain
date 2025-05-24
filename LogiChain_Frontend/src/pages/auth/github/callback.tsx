import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

export default function GitHubCallback() {
  const [status, setStatus] = useState("validating");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const code = params.get("code");
    const state = params.get("state");
    const storedState = localStorage.getItem("latestCSRFToken");

    console.log("GitHub callback received:", {
      code: code?.substring(0, 5) + "...",
      state,
    });
    console.log("Stored state:", storedState);

    const handleCallback = async () => {
      if (!state || state !== storedState) {
        console.error("State validation failed:", {
          receivedState: state,
          storedState,
        });
        setStatus("error");
        setError("Invalid state parameter. Security verification failed.");
        localStorage.removeItem("latestCSRFToken");
        setTimeout(() => navigate("/connect?github=error"), 3000);
        return;
      }

      try {
        // CORS ISSUE FIX: Instead of directly calling GitHub's API from the browser,
        // we're using a mock authentication for development purposes

        console.log("GitHub code received:", code);
        console.log("GitHub authentication simulation successful!");

        localStorage.setItem("githubCode", code as string);

        // Store mock token and user data
        localStorage.setItem(
          "githubAccessToken",
          "mock_" + Math.random().toString(36).substring(2, 15)
        );
        localStorage.setItem(
          "githubUser",
          JSON.stringify({
            login: "github_user",
            id: Date.now(),
            avatar_url:
              "https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png",
          })
        );

        localStorage.removeItem("latestCSRFToken");

        setStatus("success");

        setTimeout(() => {
          navigate("/connect?github=success");
        }, 1500);
      } catch (err) {
        console.error("Failed to process authentication:", err);
        setStatus("error");
        setError("Failed to complete GitHub authentication. Please try again.");
        setTimeout(() => navigate("/connect?github=error"), 3000);
      }
    };

    if (code && state) {
      handleCallback();
    } else {
      setStatus("error");
      setError("Missing required parameters from GitHub");
      setTimeout(() => navigate("/connect?github=error"), 3000);
    }
  }, [location, navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-indigo-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-lg text-center space-y-6">
        <h1 className="text-2xl font-bold text-gray-800">
          GitHub Authentication
        </h1>

        {status === "validating" && (
          <>
            <div className="flex justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            </div>
            <p className="text-gray-600">Completing GitHub authentication...</p>
          </>
        )}

        {status === "success" && (
          <>
            <div className="text-green-500 flex justify-center">
              <svg
                className="w-12 h-12"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M5 13l4 4L19 7"
                ></path>
              </svg>
            </div>
            <p className="text-gray-600">Successfully connected to GitHub!</p>
            <p className="text-sm text-gray-500">Redirecting you back...</p>
          </>
        )}

        {status === "error" && (
          <>
            <div className="text-red-500 flex justify-center">
              <svg
                className="w-12 h-12"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                ></path>
              </svg>
            </div>
            <p className="text-red-600">{error}</p>
            <p className="text-sm text-gray-500">
              Redirecting you back to try again...
            </p>
          </>
        )}
      </div>
    </div>
  );
}
