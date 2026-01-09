import { Hex } from "viem";

export class BorrowOperation {
  constructor(
    public readonly amount: string,
    public readonly assetAddress: Hex,
    public readonly userAddress: Hex,
    public readonly chainId: number
  ) {}


  validate(): void {
    if (!this.amount || parseFloat(this.amount) <= 0) {
      throw new Error("Amount deve ser maior que zero");
    }

    if (!this.assetAddress || !this.assetAddress.startsWith("0x")) {
      throw new Error("Asset address inválido");
    }

    if (!this.userAddress || !this.userAddress.startsWith("0x")) {
      throw new Error("User address inválido");
    }
  }
}