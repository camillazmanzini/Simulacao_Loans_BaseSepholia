import { Hex } from "viem";
import { BorrowResult } from "@/domain/types/BorrowResult";
import { RepayRepositoryFactory } from "@/infrastructure/config/repositories/RepayRepositoryFactory";
import { RepayOperation } from "@/domain/entities/RepayOperation";

/**
 * Representa a operação de repay (pagamento de dívida) de um ativo
 * no protocolo Aave, para a rede Base Sepolia.
 */
export class RepayAssetOperation {
  /**
   * Executa a operação de repay no repositório correspondente ao chainId.
   */
  async execute(
    amount: string,
    assetAddress: Hex,
    userAddress: Hex,
    chainId: number
  ): Promise<BorrowResult> {
    // ✅ Cria o repositório correto via Factory
    const repository = RepayRepositoryFactory.create(chainId);

    // Cria a operação de domínio
    const repayOperation = new RepayOperation(
      amount,
      assetAddress,
      userAddress,
      chainId
    );

    // Executa a operação
    return repository.execute(
      repayOperation.amount,
      repayOperation.assetAddress,
      repayOperation.userAddress,
      repayOperation.chainId
    );
  }
}