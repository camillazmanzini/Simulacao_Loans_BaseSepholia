import { Hex } from "viem";

export interface BorrowResult {
  txHash: Hex;
  status: "success" | "failed";
  blockNumber: string; 
  gasUsed?: string;
  message?: string;
}