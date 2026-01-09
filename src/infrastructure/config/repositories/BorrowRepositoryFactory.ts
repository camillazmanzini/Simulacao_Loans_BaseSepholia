import { BaseSepoliaBorrowRepository } from "./base-sepolia/BaseSepoliaBorrowRepository";
import { ISupplyRepository } from "./SupplyRepositoryFactory";
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

export class BorrowRepositoryFactory {
  static create(chainId: number): IBorrowRepository {
    switch (chainId) {
      case 84532: 
        return new BaseSepoliaBorrowRepository(); 
      default:
        throw new Error(`Unsupported chainId: ${chainId}`);
    }
  }
}