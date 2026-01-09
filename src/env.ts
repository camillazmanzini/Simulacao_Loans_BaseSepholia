import { z } from "zod";
import dotenv from "dotenv";

dotenv.config(); 

/**
 * Schema de validação das variáveis de ambiente
 */
const envSchema = z.object({
  PRIVATE_KEY: z
    .string()
    .regex(/^0x[0-9a-fA-F]{64}$/, "PRIVATE_KEY deve ser uma chave privada válida"),
  BASE_SEPOLIA_RPC_URL: z
    .string()
    .url("BASE_SEPOLIA_RPC_URL deve ser uma URL válida"),
});

/**
 * Faz o parse e valida o .env
 */
export const env = envSchema.parse(process.env);