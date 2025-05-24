
import dotenv from 'dotenv';
dotenv.config();

export default {
  port: process.env.PORT || 3000,
  mongoURI: process.env.MONGO_URI || 'mongodb://localhost:27017/logichain',
  jwtSecret: process.env.JWT_SECRET || 'supersecretkey',
  suiConfig: {
    rpcUrl: process.env.SUI_RPC_URL,
    walletPrivateKey: process.env.SUI_WALLET_PRIVATE_KEY,
  },
  wormhole: {
    rpcEndpoint: process.env.WORMHOLE_RPC || 'https://wormhole-rpc.example.com',
    guardianSet: process.env.WORMHOLE_GUARDIANS || 'default-set',
  },
  github: {
    webhookSecret: process.env.GITHUB_WEBHOOK_SECRET || 'githubsecret',
  },
};
