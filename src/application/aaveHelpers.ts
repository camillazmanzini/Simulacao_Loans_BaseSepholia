import { Hex, formatUnits } from "viem";
import type { PublicClient } from "viem";

/**
 * Consulta o preço de um ativo no oracle da Aave.
 */
export async function getAssetPrice(
  publicClient: PublicClient,
  oracleAddress: Hex,
  assetAddress: Hex
): Promise<bigint> {
  const price = (await publicClient.readContract({
    address: oracleAddress,
    abi: [
      {
        name: "getAssetPrice",
        inputs: [{ name: "asset", type: "address" }],
        outputs: [{ name: "", type: "uint256" }],
        stateMutability: "view",
        type: "function",
      },
    ],
    functionName: "getAssetPrice",
    args: [assetAddress],
  })) as bigint;

  return price;
}

/**
 * Converte o valor de empréstimo disponível em quantidade de tokens possíveis.
 */
export function calculateAssetLimit(
  availableBorrowsBase: bigint,
  assetPrice: bigint,
  decimals: number
): string {
  if (assetPrice === 0n) return "0";
  const amount = (availableBorrowsBase * BigInt(10 ** decimals)) / assetPrice;
  return formatUnits(amount, decimals);
}

export function listAssetsByNetwork() {
  return {
    "BASE-SEPOLIA": ["USDC", "WETH"],
  };
}
