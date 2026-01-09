import { Hex, formatUnits } from "viem";
import type { PublicClient } from "viem";
import { BASE_SEPOLIA_AAVE, AAVE_V3_POOL_ABI } from "@/infrastructure/config/constants";

type DebtInfo = {
  hasDebt: boolean;
  totalDebtUSD: string;
  healthFactor: string;
};

export class RepayQueryService {
  constructor(private publicClient: PublicClient) {}

  async getUserDebtInfo(
    poolAddress: Hex,
    userAddress: Hex
  ): Promise<DebtInfo> {
    const accountData = (await this.publicClient.readContract({
      address: poolAddress,
      abi: AAVE_V3_POOL_ABI,
      functionName: "getUserAccountData",
      args: [userAddress],
    })) as readonly [bigint, bigint, bigint, bigint, bigint, bigint];

    const [, totalDebtBase, , , , healthFactor] = accountData;

    if (totalDebtBase === 0n) {
      return {
        hasDebt: false,
        totalDebtUSD: "0",
        healthFactor: "0",
      };
    }

    return {
      hasDebt: true,
      totalDebtUSD: formatUnits(totalDebtBase, 8),
      healthFactor: formatUnits(healthFactor, 18),
    };
  }

  async getDebtForBaseSepolia(userAddress: Hex): Promise<DebtInfo> {
    return this.getUserDebtInfo(BASE_SEPOLIA_AAVE.POOL, userAddress);
  }
}