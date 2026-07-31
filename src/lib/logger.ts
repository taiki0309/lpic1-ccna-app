/**
 * 構造化ログユーティリティ（CloudWatch Logs Insights 対応）
 *
 * CloudWatch Logs Insights は JSON ログを自動パースできるため、
 * JSON 形式で出力することでクエリ・アラームが容易になります。
 *
 * 使用例:
 *   import { logger } from "@/lib/logger";
 *   logger.info("api/progress", "データ取得成功", { userId, itemCount: 42 });
 *   logger.error("api/questions", "DynamoDB エラー", { error: err.message });
 */

type LogLevel = "DEBUG" | "INFO" | "WARN" | "ERROR";

interface LogEntry {
  timestamp: string;
  level: LogLevel;
  service: string;
  message: string;
  environment: string;
  [key: string]: unknown;
}

function log(level: LogLevel, service: string, message: string, meta: Record<string, unknown> = {}): void {
  const entry: LogEntry = {
    timestamp: new Date().toISOString(),
    level,
    service: `lpic-ccna/${service}`,
    message,
    environment: process.env.NODE_ENV ?? "development",
    ...meta,
  };

  // CloudWatch は stdout を自動収集します
  // JSON.stringify で1行にまとめることで Logs Insights が確実にパースできます
  const output = JSON.stringify(entry);

  if (level === "ERROR" || level === "WARN") {
    console.error(output);
  } else {
    console.log(output);
  }
}

export const logger = {
  debug: (service: string, message: string, meta?: Record<string, unknown>) =>
    log("DEBUG", service, message, meta),
  info: (service: string, message: string, meta?: Record<string, unknown>) =>
    log("INFO", service, message, meta),
  warn: (service: string, message: string, meta?: Record<string, unknown>) =>
    log("WARN", service, message, meta),
  error: (service: string, message: string, meta?: Record<string, unknown>) =>
    log("ERROR", service, message, meta),
};
