import { Hex, parseEther, createWalletClient, createPublicClient, http } from "viem";
import { baseSepolia } from "viem/chains";
import { privateKeyToAccount } from "viem/accounts";
import { BorrowResult } from "@/domain/types/BorrowResult";
import * as dotenv from "dotenv";

dotenv.config();

const AAVE_POOL_BASE_SEPOLIA =
  "0x8bAB6d1b75f19e9eD9fCe8b9BD338844fF79aE27" as const;

const POOL_ABI = [
  {
    name: "supply",
    type: "function",
    stateMutability: "nonpayable",
    inputs: [
      { name: "asset", type: "address" },
      { name: "amount", type: "uint256" },
      { name: "onBehalfOf", type: "address" },
      { name: "referralCode", type: "uint16" },
    ],
    outputs: [],
  },
] as const;

export class BaseSepoliaSupplyRepository {
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
      console.log(`💰 Executando supply de ${amount} no Pool Aave...`);

      const txHash = await this.walletClient.writeContract({
        address: AAVE_POOL_BASE_SEPOLIA,
        abi: POOL_ABI,
        functionName: "supply",
        args: [assetAddress, parsedAmount, userAddress, 0],
        chain: baseSepolia,
        account: this.walletClient.account,
      });

      const receipt = await this.publicClient.waitForTransactionReceipt({ hash: txHash });
      const success = receipt.status === "success";
      const blockNumber: string = String(receipt.blockNumber ?? 0n);
      const gasUsed: string = String(receipt.gasUsed ?? 0n);

      return {
        txHash,
        status: success ? "success" : "failed",
        blockNumber,
        gasUsed,
        message: success
          ? "✅ Supply executado com sucesso!"
          : "❌ Supply revertido.",
      };
    } catch (error: any) {
      console.error("❌ Erro no supply:", error);
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