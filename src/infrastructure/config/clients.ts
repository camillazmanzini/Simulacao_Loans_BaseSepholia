import { AaveClient } from "@aave/client";
import { createPublicClient, http, createWalletClient, Hex } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { baseSepolia } from "viem/chains";

const privateKey = process.env.PRIVATE_KEY as Hex;
const rpcUrl = process.env.BASE_SEPOLIA_RPC_URL;

if (!privateKey || !rpcUrl) {
  throw new Error(
    "PRIVATE_KEY e BASE_SEPOLIA_RPC_URL devem ser definidos no arquivo .env"
  );
}

if (!privateKey.startsWith("0x")) {
  throw new Error(
    "PRIVATE_KEY deve começar com '0x'. Exemplo: 0x1234567890abcdef..."
  );
}

if (privateKey.length !== 66) {
  throw new Error(
    `PRIVATE_KEY deve ter 66 caracteres (0x + 64 caracteres hex). Atual: ${privateKey.length} caracteres`
  );
}

export const publicClient = createPublicClient({
  chain: baseSepolia,
  transport: http(rpcUrl),
});

const account = privateKeyToAccount(privateKey);

// WalletClient configurado para assinar transações localmente
// Quando passa 'account', o Viem automaticamente:
// 1. Assina a transação localmente com sua chave privada
// 2. Envia usando eth_sendRawTransaction
// 3. Não depende do RPC para gerenciar suas chaves
export const walletClient = createWalletClient({
  account,
  chain: baseSepolia,
  transport: http(rpcUrl),
});

export const aaveClient = AaveClient.create({});

