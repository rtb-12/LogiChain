import {
  Globe,
  Server,
  Beaker,
  ShieldCheck,
  CurrencyDollar,
  Code,
} from "react-bootstrap-icons";
import { Link } from "react-router-dom";

export default function HomePage() {
  const features = [
    {
      title: "Decentralized Runners",
      desc: "Host and monetize build capacity by staking LogiToken and joining a global network of CI/CD nodes.",
      icon: <Globe className="w-8 h-8 mb-4 text-indigo-600" />,
    },
    {
      title: "Multichain Dispatch",
      desc: "Trigger pipelines on Sui and relay jobs across 17+ blockchains with Wormhole Messaging.",
      icon: <Server className="w-8 h-8 mb-4 text-indigo-600" />,
    },
    {
      title: "Native Billing",
      desc: "Pay and get paid instantly in LogiToken on your preferred chain via Wormhole NTT.",
      icon: <CurrencyDollar className="w-8 h-8 mb-4 text-indigo-600" />,
    },
    {
      title: "Build Provenance",
      desc: "Ensure tamper-proof logs with auditor co-signatures through Wormhole Custom Attestation.",
      icon: <ShieldCheck className="w-8 h-8 mb-4 text-indigo-600" />,
    },
    {
      title: "On-Chain SLAs",
      desc: "Enforce repository and organization-level concurrency limits transparently via smart contracts.",
      icon: <Code className="w-8 h-8 mb-4 text-indigo-600" />,
    },
    {
      title: "DAO Governance",
      desc: "Govern pricing, policies, and auditor selection across chains with Wormhole MultiGov.",
      icon: <Beaker className="w-8 h-8 mb-4 text-indigo-600" />,
    },
  ];

  return (
    <div className="min-h-screen relative">
      {/* Background Elements */}
      <div className="fixed inset-0 z-0">
        {/* Main gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-gray-50 to-indigo-50"></div>

        {/* Decorative grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.15]"
          style={{
            backgroundImage: `
              linear-gradient(#6366f1 1px, transparent 1px),
              linear-gradient(to right, #6366f1 1px, transparent 1px)
            `,
            backgroundSize: "50px 50px",
          }}
        ></div>

        {/* Decorative floating circles */}
        <div className="absolute top-20 right-[10%] w-64 h-64 rounded-full bg-pink-200 mix-blend-multiply opacity-20 filter blur-xl animate-pulse"></div>
        <div className="absolute top-40 left-[5%] w-96 h-96 rounded-full bg-indigo-200 mix-blend-multiply opacity-20 filter blur-xl"></div>
        <div className="absolute bottom-20 right-[20%] w-72 h-72 rounded-full bg-purple-200 mix-blend-multiply opacity-20 filter blur-xl animate-pulse delay-700"></div>

        {/* Polygon decoration */}
        <svg
          className="absolute top-1/4 left-1/3 w-96 h-96 text-indigo-100 opacity-30 rotate-12"
          viewBox="0 0 200 200"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fill="currentColor"
            d="M44.7,-76.4C58.8,-69.2,71.9,-59.1,79.4,-45.8C86.9,-32.6,89,-16.3,88.2,-0.5C87.4,15.4,83.8,30.8,76.6,44.9C69.4,59,58.6,71.8,44.5,79.1C30.4,86.4,13,88.2,-3.9,84.6C-20.9,80.9,-37.2,71.9,-50.8,60.8C-64.4,49.8,-75.4,36.9,-80.7,21.9C-86,6.9,-85.7,-10.2,-79.3,-24C-72.8,-37.8,-60.2,-48.4,-46.4,-55.6C-32.6,-62.8,-17.8,-66.7,-1.7,-64.1C14.3,-61.4,30.6,-52.3,44.7,-76.4Z"
            transform="translate(100 100)"
          />
        </svg>
      </div>

      {/* Content */}
      <div className="relative z-10">
        {/* Hero Section */}
        <header className="relative pt-20 pb-24 overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="relative z-10">
              <h2 className="text-4xl sm:text-5xl font-extrabold text-gray-900 mb-6 animate-fade-in-up">
                <span className="block">Decentralized CI/CD.</span>
                <span className="block mt-2 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  Reimagined
                </span>
              </h2>
              <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                Welcome to LogiChain, the world's first decentralized,
                multichain CI/CD orchestration platform. Empower your team with
                global runner networks, transparent on-chain billing, and
                verifiable build integrity.
              </p>
              <div className="mt-8">
                <Link
                  to="/connect"
                  className="inline-flex items-center px-8 py-4 border border-transparent text-lg font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-indigo-200"
                >
                  Get Started for Free
                </Link>
              </div>
            </div>
          </div>
        </header>

        {/* Features Section - with slightly enhanced shadow for better contrast against the background */}
        <section className="py-16 relative z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h3 className="text-3xl font-extrabold text-gray-900">
                Enterprise-Grade Features
              </h3>
              <p className="mt-4 max-w-2xl text-xl text-gray-600 mx-auto">
                Built for modern development teams needing security, scale, and
                cross-chain flexibility
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="bg-white/90 backdrop-blur-sm rounded-xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300 group hover:border-indigo-500 border border-transparent relative overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-white to-indigo-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="relative">
                    {feature.icon}
                    <h4 className="text-xl font-semibold text-gray-900 mb-3">
                      {feature.title}
                    </h4>
                    <p className="text-gray-600 leading-relaxed">
                      {feature.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="py-16 bg-white/80 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h3 className="text-3xl font-extrabold text-gray-900">
                Simple Integration
              </h3>
              <p className="mt-4 max-w-2xl text-xl text-gray-600 mx-auto">
                Connect your existing workflow in four easy steps
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              {[
                {
                  step: "1. Link Repo",
                  desc: "Connect GitHub/GitLab in minutes",
                },
                {
                  step: "2. Stake & Register",
                  desc: "Secure network with LogiToken",
                },
                {
                  step: "3. Run Pipelines",
                  desc: "Global nodes execute builds",
                },
                { step: "4. Get Paid", desc: "Cross-chain payments via NTT" },
              ].map((item, index) => (
                <div
                  key={index}
                  className="p-6 bg-indigo-50 rounded-lg border border-indigo-100 hover:border-indigo-300 transition-colors duration-300 relative group shadow-md"
                >
                  <div className="absolute -top-4 right-4 w-8 h-8 bg-indigo-600 text-white rounded-full flex items-center justify-center font-bold">
                    {index + 1}
                  </div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">
                    {item.step}
                  </h4>
                  <p className="text-gray-600">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-gradient-to-r from-indigo-600 to-purple-600 relative overflow-hidden shadow-xl">
          {/* CTA background decorations */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute -left-10 -top-10 w-40 h-40 rounded-full bg-white opacity-10"></div>
            <div className="absolute right-0 bottom-0 w-80 h-80 rounded-full bg-white opacity-10 transform translate-x-1/3 translate-y-1/3"></div>
            <div className="absolute left-1/2 top-1/2 w-60 h-60 rounded-full bg-white opacity-5 transform -translate-x-1/2 -translate-y-1/2"></div>
          </div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
            <h3 className="text-3xl font-extrabold text-white mb-4">
              Ready to revolutionize your CI/CD?
            </h3>
            <p className="text-xl text-indigo-100 mb-8 max-w-2xl mx-auto">
              Join hundreds of teams already building faster with decentralized
              infrastructure
            </p>
            <div className="space-x-4">
              <button className="inline-flex items-center px-8 py-3 border border-transparent text-lg font-medium rounded-md text-indigo-600 bg-white hover:bg-gray-100 transition-colors duration-300 shadow-lg hover:shadow-xl">
                Start Building Now
              </button>
              <button className="inline-flex items-center px-8 py-3 border border-white text-lg font-medium rounded-md text-white hover:bg-white/10 transition-colors duration-300">
                Schedule Demo
              </button>
            </div>
          </div>
        </section>

        {/* Footer - unchanged */}
        <footer className="bg-gray-900 text-gray-400 py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div>
                <h5 className="text-white font-semibold mb-4">LogiChain</h5>
                <p className="text-sm">
                  Decentralized CI/CD infrastructure powered by Sui and Wormhole
                </p>
              </div>
              <div>
                <h5 className="text-white font-semibold mb-4">Product</h5>
                <ul className="space-y-2 text-sm">
                  <li>
                    <a href="#" className="hover:text-white transition-colors">
                      Features
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:text-white transition-colors">
                      Documentation
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:text-white transition-colors">
                      Status
                    </a>
                  </li>
                </ul>
              </div>
              <div>
                <h5 className="text-white font-semibold mb-4">Company</h5>
                <ul className="space-y-2 text-sm">
                  <li>
                    <a href="#" className="hover:text-white transition-colors">
                      About
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:text-white transition-colors">
                      Blog
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:text-white transition-colors">
                      Careers
                    </a>
                  </li>
                </ul>
              </div>
              <div>
                <h5 className="text-white font-semibold mb-4">Connect</h5>
                <ul className="space-y-2 text-sm">
                  <li>
                    <a href="#" className="hover:text-white transition-colors">
                      GitHub
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:text-white transition-colors">
                      Twitter
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:text-white transition-colors">
                      Discord
                    </a>
                  </li>
                </ul>
              </div>
            </div>
            <div className="border-t border-gray-800 mt-12 pt-8 text-center text-sm">
              <p>
                © {new Date().getFullYear()} LogiChain. All rights reserved.
              </p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
