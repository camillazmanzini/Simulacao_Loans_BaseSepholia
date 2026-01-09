import { IRepayRepository } from "@/domain/interfaces/IRepayRepository";
import { BaseSepoliaRepayRepository } from "@/infrastructure/config/repositories/base-sepolia/BaseSepoliaRepayRepository";

/**
 * Factory que retorna o repositório correto para a operação de Repay,
 * baseado na rede (chainId) informada.
 */
export class RepayRepositoryFactory {
  static create(chainId: number): IRepayRepository {
    switch (chainId) {
      case 84532: // Base Sepolia
        return new BaseSepoliaRepayRepository();
      default:
        throw new Error(`Unsupported chainId: ${chainId}`);
    }
  }
}