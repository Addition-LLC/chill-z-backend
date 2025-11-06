import type { MedusaRequest, MedusaResponse, MedusaNextFunction } from "@medusajs/framework";
import cors from "cors";

const corsMiddleware = cors({
  origin: process.env.STORE_CORS || "http://localhost:3000",
  credentials: true,
  allowedHeaders: [
    "Content-Type",
    "Authorization",
    "x-publishable-api-key",
  ],
});

export function middleware(req: MedusaRequest, res: MedusaResponse, next: MedusaNextFunction) {
  console.log(`[Middleware] Running for: ${req.method} ${req.url}`);
  
  corsMiddleware(req, res, next);
}