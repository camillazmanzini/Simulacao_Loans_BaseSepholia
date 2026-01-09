import { BaseSepoliaSupplyRepository } from "./base-sepolia/BaseSepoliaSupplyRepository";
import { Hex } from "viem";
import { BorrowResult } from "@/domain/types/BorrowResult";


export interface ISupplyRepository {
  execute(
    amount: string,
    assetAddress: Hex,
    userAddress: Hex,
    chainId: number
  ): Promise<BorrowResult>;
}

export class SupplyRepositoryFactory {
  static create(chainId: number): ISupplyRepository {
    switch (chainId) {
      case 84532: 
        return new BaseSepoliaSupplyRepository()
      default:
        throw new Error(`Unsupported chainId: ${chainId}`);
    }
  }
}