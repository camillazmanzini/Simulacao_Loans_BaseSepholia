import { Hex, isAddress } from "viem";

/**
 * Entidade de domínio: Supply Operation
 * Representa uma operação de depósito de colateral no Aave
 */
export class SupplyOperation {
  constructor(
    public readonly amount: string,
    public readonly assetAddress: Hex,
    public readonly userAddress: Hex,
    public readonly chainId: number
  ) {
    this.validate();
  }

  /**
   * Valida a operação de supply
   */
  private validate(): void {
    // Validar amount
    const amountNum = parseFloat(this.amount);
    if (isNaN(amountNum) || amountNum <= 0) {
      throw new Error("Amount deve ser um número válido maior que zero");
    }

    if (!isAddress(this.assetAddress)) {
      throw new Error("Asset address inválido");
    }

    if (!isAddress(this.userAddress)) {
      throw new Error("User address inválido");
    }
  }
}