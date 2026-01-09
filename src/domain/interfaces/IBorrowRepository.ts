import { Hex } from "viem";
import { BorrowResult } from "@/domain/types/BorrowResult";

export interface IBorrowRepository {
  execute(
    amount: string,
    assetAddress: Hex,
    userAddress: Hex,
    chainId: number
  ): Promise<BorrowResult>;
}