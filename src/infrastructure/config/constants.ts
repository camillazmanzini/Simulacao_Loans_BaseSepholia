import { AaveV3BaseSepolia } from "@bgd-labs/aave-address-book";
import { Hex } from "viem";

/**
 * Constantes do Aave V3 para Base Sepolia
 */
export const BASE_SEPOLIA_AAVE = {
  POOL: AaveV3BaseSepolia.POOL as Hex,
  ORACLE: AaveV3BaseSepolia.ORACLE as Hex,

  ASSETS: {
    USDC: {
      UNDERLYING: AaveV3BaseSepolia.ASSETS.USDC.UNDERLYING as Hex,
      A_TOKEN: AaveV3BaseSepolia.ASSETS.USDC.A_TOKEN as Hex,
      V_TOKEN: AaveV3BaseSepolia.ASSETS.USDC.V_TOKEN as Hex,
      ORACLE: AaveV3BaseSepolia.ASSETS.USDC.ORACLE as Hex,
      decimals: 6,
    },
    WETH: {
      UNDERLYING: AaveV3BaseSepolia.ASSETS.WETH.UNDERLYING as Hex,
      A_TOKEN: AaveV3BaseSepolia.ASSETS.WETH.A_TOKEN as Hex,
      V_TOKEN: AaveV3BaseSepolia.ASSETS.WETH.V_TOKEN as Hex,
      ORACLE: AaveV3BaseSepolia.ASSETS.WETH.ORACLE as Hex,
      decimals: 18,
    },
  },
};

export { AAVE_V3_POOL_ABI } from "./aaveAbis";