import { z } from "zod";

export function requiredText(message: string) {
  return z.string().trim().min(1, message);
}
