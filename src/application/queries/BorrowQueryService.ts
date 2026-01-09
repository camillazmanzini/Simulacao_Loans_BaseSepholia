import { Hex, formatUnits } from "viem";
import type { PublicClient } from "viem";
import {
  BASE_SEPOLIA_AAVE,
  AAVE_V3_POOL_ABI,
} from "@/infrastructure/config/constants";
import { getAssetPrice, calculateAssetLimit } from "@/application/aaveHelpers";

type BorrowLimitsBase = {
  hasCollateral: boolean;
  totalCollateralUSD: string;
  totalDebtUSD: string;
  availableBorrowsUSD: string;
  healthFactor: string;
};

type BaseSepoliaLimitsResult = BorrowLimitsBase & {
  assetLimits: {
    USDC: string;
    WETH: string;
  };
};

export class BorrowQueryService {
  constructor(private publicClient: PublicClient) {}

  async getAvailableBorrowLimitsForBaseSepolia(
    userAddress: Hex
  ): Promise<BaseSepoliaLimitsResult> {
    const accountData = await this.getUserAccountData(
      BASE_SEPOLIA_AAVE.POOL,
      userAddress
    );

    if (accountData.totalCollateralBase === 0n) {
      return this.emptyBaseSepoliaLimits();
    }

    const availableBorrowsUSDValue = formatUnits(
      accountData.availableBorrowsBase,
      8
    );
    const assets = BASE_SEPOLIA_AAVE.ASSETS;

    const [usdcPrice, wethPrice] = await Promise.all([
      getAssetPrice(
        this.publicClient,
        BASE_SEPOLIA_AAVE.ORACLE,
        assets.USDC.UNDERLYING
      ),
      getAssetPrice(
        this.publicClient,
        BASE_SEPOLIA_AAVE.ORACLE,
        assets.WETH.UNDERLYING
      ),
    ]);

    const usdcLimit = calculateAssetLimit(
      accountData.availableBorrowsBase,
      usdcPrice,
      assets.USDC.decimals
    );
    const wethLimit = calculateAssetLimit(
      accountData.availableBorrowsBase,
      wethPrice,
      assets.WETH.decimals
    );

    return {
      hasCollateral: true,
      totalCollateralUSD: formatUnits(accountData.totalCollateralBase, 8),
      totalDebtUSD: formatUnits(accountData.totalDebtBase, 8),
      availableBorrowsUSD: availableBorrowsUSDValue,
      healthFactor: formatUnits(accountData.healthFactor, 18),
      assetLimits: {
        USDC: usdcLimit,
        WETH: wethLimit,
      },
    };
  }

  private async getUserAccountData(poolAddress: Hex, userAddress: Hex) {
    const accountData = (await this.publicClient.readContract({
      address: poolAddress,
      abi: AAVE_V3_POOL_ABI,
      functionName: "getUserAccountData",
      args: [userAddress],
    })) as readonly [bigint, bigint, bigint, bigint, bigint, bigint];

    const [
      totalCollateralBase,
      totalDebtBase,
      availableBorrowsBase,
      currentLiquidationThreshold,
      ltv,
      healthFactor,
    ] = accountData;

    return {
      totalCollateralBase,
      totalDebtBase,
      availableBorrowsBase,
      currentLiquidationThreshold,
      ltv,
      healthFactor,
    };
  }

  private emptyBaseSepoliaLimits(): BaseSepoliaLimitsResult {
    return {
      hasCollateral: false,
      totalCollateralUSD: "0",
      totalDebtUSD: "0",
      availableBorrowsUSD: "0",
      healthFactor: "0",
      assetLimits: {
        USDC: "0",
        WETH: "0",
      },
    };
  }
}