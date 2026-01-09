import { AaveClient } from "@aave/client";
import { createPublicClient, createWalletClient, http, Hex } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { baseSepolia } from "viem/chains";
import { env } from "@/env";

/**
 * Validação básica da chave privada
 */
const privateKey = env.PRIVATE_KEY as Hex;

if (!privateKey) {
  throw new Error("PRIVATE_KEY deve ser definido no arquivo .env");
}

if (!privateKey.startsWith("0x")) {
  throw new Error("PRIVATE_KEY deve começar com '0x'. Exemplo: 0x1234abcd...");
}

if (privateKey.length !== 66) {
  throw new Error(
    `PRIVATE_KEY deve ter 66 caracteres (0x + 64 hex). Atual: ${privateKey.length}`
  );
}

const account = privateKeyToAccount(privateKey);

/**
 * Configuração da rede Base Sepolia
 */
const NETWORK_CONFIG = {
  "BASE-SEPOLIA": {
    chain: baseSepolia,
    rpcUrl: env.BASE_SEPOLIA_RPC_URL,
    chainId: baseSepolia.id,
  },
} as const;

export type SupportedNetwork = keyof typeof NETWORK_CONFIG;

/**
 * Interface dos clients criados
 */
export interface NetworkClients {
  publicClient: ReturnType<typeof createPublicClient>;
  walletClient: ReturnType<typeof createWalletClient>;
  aaveClient: AaveClient;
  chainId: number;
  network: SupportedNetwork;
}

/**
 * Cria clients dinâmicos para a rede Base Sepolia
 */
export function createNetworkClients(network: SupportedNetwork): NetworkClients {
  const config = NETWORK_CONFIG[network];

  if (!config) {
    throw new Error(`Rede não suportada: ${network}`);
  }

  if (!config.rpcUrl) {
    throw new Error(
      `RPC_URL não configurado para ${network}. Adicione ${network.replace(
        "-",
        "_"
      )}_RPC_URL no .env`
    );
  }

  const publicClient = createPublicClient({
    chain: config.chain,
    transport: http(config.rpcUrl),
  });

  const walletClient = createWalletClient({
    account,
    chain: config.chain,
    transport: http(config.rpcUrl),
  });

  const aaveClient = AaveClient.create({});

  return {
    publicClient: publicClient as any,
    walletClient,
    aaveClient,
    chainId: config.chainId,
    network,
  };
}

export function getSupportedNetworks(): SupportedNetwork[] {
  return ["BASE-SEPOLIA"];
}