import {
  Hex,
  parseEther,
  createWalletClient,
  createPublicClient,
  http,
} from "viem";
import { baseSepolia } from "viem/chains";
import { privateKeyToAccount } from "viem/accounts";
import { BorrowResult } from "@/domain/types/BorrowResult";
import * as dotenv from "dotenv";

dotenv.config();

const AAVE_POOL_BASE_SEPOLIA =
  "0x8bAB6d1b75f19e9eD9fCe8b9BD338844fF79aE27" as const;
const WETH_BASE_SEPOLIA =
  "0x4200000000000000000000000000000000000006" as const;

const WETH_ABI = [
  {
    name: "approve",
    type: "function",
    stateMutability: "nonpayable",
    inputs: [
      { name: "spender", type: "address" },
      { name: "amount", type: "uint256" },
    ],
    outputs: [],
  },
] as const;

const POOL_ABI = [
  {
    name: "repay",
    type: "function",
    stateMutability: "nonpayable",
    inputs: [
      { name: "asset", type: "address" },
      { name: "amount", type: "uint256" },
      { name: "interestRateMode", type: "uint256" },
      { name: "onBehalfOf", type: "address" },
    ],
    outputs: [],
  },
] as const;

export class BaseSepoliaRepayRepository {
  private walletClient;
  private publicClient;

  constructor() {
    const privateKey = process.env.PRIVATE_KEY as Hex;
    if (!privateKey) throw new Error("❌ PRIVATE_KEY não encontrado no .env");

    const account = privateKeyToAccount(privateKey);

    this.walletClient = createWalletClient({
      account,
      chain: baseSepolia,
      transport: http(process.env.RPC_URL || "https://sepolia.base.org"),
    });

    this.publicClient = createPublicClient({
      chain: baseSepolia,
      transport: http(process.env.RPC_URL || "https://sepolia.base.org"),
    });
  }

  async execute(
    amount: string,
    assetAddress: Hex,
    userAddress: Hex,
    chainId: number
  ): Promise<BorrowResult> {
    try {
      const parsedAmount = parseEther(amount);
      console.log(`💸 Executando repay de ${amount} no Pool Aave...`);

      // 1️⃣ Aprova o Pool para gastar WETH
      console.log("🔑 Aprovando WETH para o contrato da Aave...");
      await this.walletClient.writeContract({
        address: WETH_BASE_SEPOLIA,
        abi: WETH_ABI,
        functionName: "approve",
        args: [AAVE_POOL_BASE_SEPOLIA, parsedAmount],
        chain: baseSepolia,
        account: this.walletClient.account,
      });

      // 2️⃣ Tenta repay (modo variável primeiro, depois estável)
      const interestModes = [2n, 1n];
      for (const mode of interestModes) {
        try {
          console.log(`🚀 Tentando repay com interestRateMode = ${mode}...`);
          const txHash = await this.walletClient.writeContract({
            address: AAVE_POOL_BASE_SEPOLIA,
            abi: POOL_ABI,
            functionName: "repay",
            args: [assetAddress, parsedAmount, mode, userAddress],
            chain: baseSepolia,
            account: this.walletClient.account,
          });

          const receipt = await this.publicClient.waitForTransactionReceipt({
            hash: txHash,
          });

          if (receipt.status === "success") {
            return {
              txHash,
              status: "success",
              blockNumber: (receipt.blockNumber ?? 0n).toString(),
              gasUsed: (receipt.gasUsed ?? 0n).toString(),
              message: `✅ Repay executado com sucesso! (mode=${mode})`,
            };
          } else {
            console.warn(`⚠️ Repay revertido no modo ${mode}`);
          }
        } catch (err: any) {
          console.warn(`❌ Falha no repay com mode=${mode}:`, err.shortMessage);
        }
      }

      return {
        txHash: "0x0" as Hex,
        status: "failed",
        blockNumber: "0",
        gasUsed: "0",
        message: "❌ Todas as tentativas de repay falharam (mode 2 e 1).",
      };
    } catch (error: any) {
      console.error("❌ Erro no repay:", error);
      return {
        txHash: "0x0" as Hex,
        status: "failed",
        blockNumber: "0",
        gasUsed: "0",
        message: error?.shortMessage || error?.message || "Erro desconhecido",
      };
    }
  }
}