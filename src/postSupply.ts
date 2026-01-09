import { FastifyRequest } from "fastify";
import { SupplyAssetOperation } from "@/application/usecases/SupplyAssetOperation";
import { SupplyRepositoryFactory } from "@/infrastructure/config/repositories/SupplyRepositoryFactory";
import { Hex } from "viem";

interface SupplyRequestBody {
  amount: string;
  assetAddress: Hex;
  userAddress: Hex;
  chainId: number;
}

export async function postSupply(request: FastifyRequest<{ Body: SupplyRequestBody }>) {
  try {
    const { amount, assetAddress, userAddress, chainId } = request.body;

    // Cria o repositório conforme a chain
    const repository = SupplyRepositoryFactory.create(chainId);

    // Cria a operação e executa o supply real
    const operation = new SupplyAssetOperation(repository);
    const result = await operation.execute(amount, assetAddress, userAddress, chainId);

    return {
      success: true,
      ...result,
    };
  } catch (error: any) {
    console.error("❌ Erro no postSupply:", error);
    return {
      success: false,
      message: error.message || "Erro desconhecido ao realizar supply",
    };
  }
}