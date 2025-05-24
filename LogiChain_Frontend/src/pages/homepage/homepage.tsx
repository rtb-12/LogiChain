import React from 'react';
import { GlobeAlt, Server, Beaker, ShieldCheck, CurrencyDollar, Code } from 'react-bootstrap-icons';

export default function HomePage() {
  const features = [
    { 
      title: 'Decentralized Runners', 
      desc: 'Host and monetize build capacity by staking LogiToken and joining a global network of CI/CD nodes.',
      icon: <GlobeAlt className="w-8 h-8 mb-4 text-indigo-600" />
    },
    { 
      title: 'Multichain Dispatch', 
      desc: 'Trigger pipelines on Sui and relay jobs across 17+ blockchains with Wormhole Messaging.',
      icon: <Server className="w-8 h-8 mb-4 text-indigo-600" />
    },
    { 
      title: 'Native Billing', 
      desc: 'Pay and get paid instantly in LogiToken on your preferred chain via Wormhole NTT.',
      icon: <CurrencyDollar className="w-8 h-8 mb-4 text-indigo-600" />
    },
    { 
      title: 'Build Provenance', 
      desc: 'Ensure tamper-proof logs with auditor co-signatures through Wormhole Custom Attestation.',
      icon: <ShieldCheck className="w-8 h-8 mb-4 text-indigo-600" />
    },
    { 
      title: 'On-Chain SLAs', 
      desc: 'Enforce repository and organization-level concurrency limits transparently via smart contracts.',
      icon: <Code className="w-8 h-8 mb-4 text-indigo-600" />
    },
    { 
      title: 'DAO Governance', 
      desc: 'Govern pricing, policies, and auditor selection across chains with Wormhole MultiGov.',
      icon: <Beaker className="w-8 h-8 mb-4 text-indigo-600" />
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-indigo-50">
      {/* Navbar */}
      <nav className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex-shrink-0 flex items-center">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                LogiChain
              </h1>
            </div>
            <button className="relative inline-flex items-center px-6 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-indigo-200">
              Connect Wallet
            </button>
          </div>
        </div>
      </nav>

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
              Welcome to LogiChain, the world’s first decentralized, multichain CI/CD orchestration platform. 
              Empower your team with global runner networks, transparent on-chain billing, and verifiable build integrity.
            </p>
            <div className="mt-8">
              <button className="inline-flex items-center px-8 py-4 border border-transparent text-lg font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-indigo-200">
                Get Started for Free
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Features Section */}
      <section className="py-16 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h3 className="text-3xl font-extrabold text-gray-900">
              Enterprise-Grade Features
            </h3>
            <p className="mt-4 max-w-2xl text-xl text-gray-600 mx-auto">
              Built for modern development teams needing security, scale, and cross-chain flexibility
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div 
                key={index}
                className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300 group hover:border-indigo-500 border border-transparent relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-white to-indigo-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative">
                  {feature.icon}
                  <h4 className="text-xl font-semibold text-gray-900 mb-3">{feature.title}</h4>
                  <p className="text-gray-600 leading-relaxed">{feature.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 bg-white">
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
              { step: '1. Link Repo', desc: 'Connect GitHub/GitLab in minutes' },
              { step: '2. Stake & Register', desc: 'Secure network with LogiToken' },
              { step: '3. Run Pipelines', desc: 'Global nodes execute builds' },
              { step: '4. Get Paid', desc: 'Cross-chain payments via NTT' }
            ].map((item, index) => (
              <div 
                key={index}
                className="p-6 bg-indigo-50 rounded-lg border border-indigo-100 hover:border-indigo-300 transition-colors duration-300 relative group"
              >
                <div className="absolute -top-4 right-4 w-8 h-8 bg-indigo-600 text-white rounded-full flex items-center justify-center font-bold">
                  {index + 1}
                </div>
                <h4 className="text-lg font-semibold text-gray-900 mb-2">{item.step}</h4>
                <p className="text-gray-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-indigo-600 to-purple-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h3 className="text-3xl font-extrabold text-white mb-4">
            Ready to revolutionize your CI/CD?
          </h3>
          <p className="text-xl text-indigo-100 mb-8 max-w-2xl mx-auto">
            Join hundreds of teams already building faster with decentralized infrastructure
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

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h5 className="text-white font-semibold mb-4">LogiChain</h5>
              <p className="text-sm">Decentralized CI/CD infrastructure powered by Sui and Wormhole</p>
            </div>
            <div>
              <h5 className="text-white font-semibold mb-4">Product</h5>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Documentation</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Status</a></li>
              </ul>
            </div>
            <div>
              <h5 className="text-white font-semibold mb-4">Company</h5>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">About</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
              </ul>
            </div>
            <div>
              <h5 className="text-white font-semibold mb-4">Connect</h5>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">GitHub</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Twitter</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Discord</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-sm">
            <p>© {new Date().getFullYear()} LogiChain. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}