import { logger } from "@/lib/logger";

/**
 * GET /api/health
 * App Runner / CloudFront のヘルスチェックエンドポイント。
 * Dockerfile の HEALTHCHECK コマンドもここを使用します。
 */
export async function GET() {
  logger.info("api/health", "ヘルスチェック OK");
  return Response.json({
    status: "ok",
    timestamp: new Date().toISOString(),
    version: process.env.npm_package_version ?? "0.1.0",
  });
}
