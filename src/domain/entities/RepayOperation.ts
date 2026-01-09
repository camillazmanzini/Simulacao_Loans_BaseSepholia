import { Hex } from "viem";

export class RepayOperation {
  constructor(
    public readonly amount: string,
    public readonly assetAddress: Hex,
    public readonly userAddress: Hex,
    public readonly chainId: number
  ) {
    this.validate();
  }

  private validate(): void {
    if (!this.amount) {
      throw new Error("Amount é obrigatório");
    }

    const amountNum = parseFloat(this.amount);
    if (isNaN(amountNum) && this.amount !== "-1") {
      throw new Error("Amount deve ser um número válido ou '-1' para pagar tudo");
    }

    if (!this.assetAddress.startsWith("0x")) {
      throw new Error("Endereço de asset inválido");
    }

    if (!this.userAddress.startsWith("0x")) {
      throw new Error("Endereço de usuário inválido");
    }
  }
}