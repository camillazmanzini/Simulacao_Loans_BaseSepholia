import { FastifyInstance, FastifyRequest } from "fastify";
import { listAssetsByNetwork } from "@/application/aaveHelpers";
import { postSupply } from "@/postSupply";
import { BaseSepoliaBorrowRepository } from "@infrastructure/config/repositories/base-sepolia/BaseSepoliaBorrowRepository";
import { BorrowResult } from "@/domain/types/BorrowResult";
import { BaseSepoliaRepayRepository } from "@infrastructure/config/repositories/base-sepolia/BaseSepoliaRepayRepository";

interface BorrowRequestBody {
  amount: string;
  assetAddress: `0x${string}`;
  userAddress: `0x${string}`;
  chainId: number;
}

export async function registerBorrowRoutes(app: FastifyInstance) {
  // POST /api/supply
  app.post(
    "/api/supply",
    async (request: FastifyRequest<{ Body: BorrowRequestBody }>, reply) => {
      const response = await postSupply(request);
      reply.send(response);
    }
  );

  // POST /api/
  app.post(
  "/api/borrow",
  async (request: FastifyRequest<{ Body: BorrowRequestBody }>, reply) => {
    try {
      const { amount, assetAddress, userAddress, chainId } = request.body;

      if (chainId !== 84532) {
        return reply.status(400).send({
          success: false,
          message: `Unsupported chainId: ${chainId}`,
        });
      }

      const repo = new BaseSepoliaBorrowRepository();
      const result = await repo.execute(amount, assetAddress, userAddress, chainId);

      // Corrige qualquer BigInt recursivamente no objeto
      const jsonSafe = JSON.parse(
        JSON.stringify(result, (_, v) =>
          typeof v === "bigint" ? v.toString() : v
        )
      );

      reply.send(jsonSafe);
    } catch (error: any) {
      console.error("❌ Borrow endpoint error:", error);
      reply.status(500).send({
        success: false,
        message: error.message || "Unknown borrow error",
      });
    }
  }
);

  app.post(
  "/api/repay",
  async (request: FastifyRequest<{ Body: BorrowRequestBody }>, reply) => {
    try {
      const { amount, assetAddress, userAddress, chainId } = request.body;

      if (chainId !== 84532) {
        return reply.status(400).send({
          success: false,
          message: `Unsupported chainId: ${chainId}`,
        });
      }

      const repo = new BaseSepoliaRepayRepository();
      const result: BorrowResult = await repo.execute(
        amount,
        assetAddress,
        userAddress,
        chainId
      );

      reply.send({
        ...result,
        blockNumber: result.blockNumber?.toString(),
        gasUsed: result.gasUsed?.toString(),
      });
    } catch (error: any) {
      console.error("❌ Repay endpoint error:", error);
      reply.status(500).send({
        success: false,
        message: error.message || "Unknown repay error",
      });
    }
  }
);

  app.get("/api/borrow/available", async () => ({
    success: true,
    available: [],
  }));

  app.get("/api/assets", async () => ({
    success: true,
    networks: listAssetsByNetwork(),
    usage:
      "Use o nome completo (ex: USDC.BASE-SEPOLIA) ou endereço direto (0x...)",
    availableNetworks: ["BASE-SEPOLIA"],
  }));

  app.get("/health", async () => ({
    status: "ok",
    timestamp: new Date().toISOString(),
    service: "Aave Borrow API (Base Sepolia)",
  }));
}