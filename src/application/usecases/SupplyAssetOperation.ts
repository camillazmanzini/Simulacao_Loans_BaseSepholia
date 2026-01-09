import { Hex } from "viem";
import { BorrowResult } from "@/domain/types/BorrowResult";
import { ISupplyRepository } from "@/infrastructure/config/repositories/SupplyRepositoryFactory";
import { SupplyOperation } from "@/domain/entities/SupplyOperation";

export class SupplyAssetOperation {
  constructor(private readonly supplyRepository: ISupplyRepository) {}

  async execute(
    amount: string,
    assetAddress: Hex,
    userAddress: Hex,
    chainId: number
  ): Promise<BorrowResult> {
    const supplyOperation = new SupplyOperation(
      amount,
      assetAddress,
      userAddress,
      chainId
    );

    const result = await this.supplyRepository.execute(
      supplyOperation.amount,
      supplyOperation.assetAddress,
      supplyOperation.userAddress,
      supplyOperation.chainId
    );

    return result;
  }
}
