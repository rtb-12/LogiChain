const { SuiClient, getFullnodeUrl } = require("@mysten/sui.js/client");
const { TransactionBlock } = require("@mysten/sui.js/transactions");
const { Ed25519Keypair } = require("@mysten/sui.js/keypairs/ed25519");
const { fromB64, toB64 } = require("@mysten/sui.js/utils");
require("dotenv").config();

const SUI_SECRET_KEY = process.env.SUI_SECRET_KEY;
const PACKAGE_ID = process.env.SUI_PACKAGE_ID;
const MODULE_NAME = process.env.SUI_MODULE_NAME;
const FUNCTION_NAME = process.env.SUI_FUNCTION_NAME;
const NETWORK = process.env.SUI_NETWORK || "testnet";

const keypair = Ed25519Keypair.fromSecretKey(fromB64(SUI_SECRET_KEY));
const client = new SuiClient({ url: getFullnodeUrl(NETWORK) });

async function storeAttestationOnChain(jobId, attestation) {
  try {
    const tx = new TransactionBlock();

    tx.moveCall({
      target: `${PACKAGE_ID}::${MODULE_NAME}::${FUNCTION_NAME}`,
      arguments: [
        tx.pure(jobId),
        tx.pure(attestation),
      ],
    });

    const result = await client.signAndExecuteTransactionBlock({
      transactionBlock: tx,
      signer: keypair,
      options: { showEffects: true },
    });

    if (result.effects.status.status !== "success") {
      throw new Error("Transaction failed: " + JSON.stringify(result.effects.status));
    }

    return result;
  } catch (err) {
    console.error("Failed to store attestation on Sui:", err);
    throw err;
  }
}

module.exports = {
  storeAttestationOnChain,
};
