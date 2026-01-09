import { Hex } from "viem";
import { BorrowResult } from "@/domain/types/BorrowResult";
import { BorrowRepositoryFactory } from "@/infrastructure/config/repositories/BorrowRepositoryFactory";
import { BorrowOperation } from "@/domain/entities/BorrowOperation";

/**
 * Responsável por executar a operação de borrow (empréstimo) de um ativo.
 */
export class BorrowAssetOperation {
  async execute(
    amount: string,
    assetAddress: Hex,
    userAddress: Hex,
    chainId: number
  ): Promise<BorrowResult> {
    // Instancia a operação de domínio
    const borrowOperation = new BorrowOperation(
      amount,
      assetAddress,
      userAddress,
      chainId
    );
    borrowOperation.validate();

    // Cria o repositório correto via Factory
    const repository = BorrowRepositoryFactory.create(chainId);

    //  Executa o borrow
    return repository.execute(
      borrowOperation.amount,
      borrowOperation.assetAddress,
      borrowOperation.userAddress,
      borrowOperation.chainId
    );
  }
}