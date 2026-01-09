import { Hex, formatUnits } from "viem";
import type { PublicClient } from "viem";
import { BASE_SEPOLIA_AAVE, AAVE_V3_POOL_ABI } from "@/infrastructure/config/constants";

type CollateralInfo = {
  hasCollateral: boolean;
  totalCollateralUSD: string;
  availableBorrowsUSD: string;
  healthFactor: string;
};

export class SupplyQueryService {
  constructor(private publicClient: PublicClient) {}

  async getUserCollateralInfo(
    poolAddress: Hex,
    userAddress: Hex
  ): Promise<CollateralInfo> {
    const accountData = (await this.publicClient.readContract({
      address: poolAddress,
      abi: AAVE_V3_POOL_ABI,
      functionName: "getUserAccountData",
      args: [userAddress],
    })) as readonly [bigint, bigint, bigint, bigint, bigint, bigint];

    const [totalCollateralBase, , availableBorrowsBase, , , healthFactor] = accountData;

    if (totalCollateralBase === 0n) {
      return {
        hasCollateral: false,
        totalCollateralUSD: "0",
        availableBorrowsUSD: "0",
        healthFactor: "0",
      };
    }

    return {
      hasCollateral: true,
      totalCollateralUSD: formatUnits(totalCollateralBase, 8),
      availableBorrowsUSD: formatUnits(availableBorrowsBase, 8),
      healthFactor: formatUnits(healthFactor, 18),
    };
  }

  async getCollateralForBaseSepolia(userAddress: Hex): Promise<CollateralInfo> {
    return this.getUserCollateralInfo(BASE_SEPOLIA_AAVE.POOL, userAddress);
  }
}