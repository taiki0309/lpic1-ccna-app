import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Standalone output for Docker / AWS App Runner deployment
  output: "standalone",

  // AWS Amplify Hosting のスタンドアロン環境で環境変数が確実にサーバー実行環境へ渡るよう設定
  env: {
    APP_AWS_REGION: process.env.APP_AWS_REGION || "ap-northeast-1",
    APP_AWS_ACCESS_KEY_ID:
      process.env.APP_AWS_ACCESS_KEY_ID ||
      process.env.MY_AWS_ACCESS_KEY_ID ||
      "",
    APP_AWS_SECRET_ACCESS_KEY:
      process.env.APP_AWS_SECRET_ACCESS_KEY ||
      process.env.MY_AWS_SECRET_ACCESS_KEY ||
      "",
    MY_AWS_ACCESS_KEY_ID:
      process.env.MY_AWS_ACCESS_KEY_ID ||
      process.env.APP_AWS_ACCESS_KEY_ID ||
      "",
    MY_AWS_SECRET_ACCESS_KEY:
      process.env.MY_AWS_SECRET_ACCESS_KEY ||
      process.env.APP_AWS_SECRET_ACCESS_KEY ||
      "",
    DYNAMODB_TABLE_NAME: process.env.DYNAMODB_TABLE_NAME || "Questions",
    DYNAMODB_USER_ANSWERS_TABLE:
      process.env.DYNAMODB_USER_ANSWERS_TABLE || "UserAnswers",
  },

  // Allow images from S3 (for future asset hosting)
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.s3.ap-northeast-1.amazonaws.com",
      },
      {
        protocol: "https",
        hostname: "*.s3.amazonaws.com",
      },
    ],
  },

  // ─── CloudFront / 配信 CDN での最大パフォーマンス最適化 ───────────
  compress: true, // gzip / brotli 圧縮を有効化してレスポンスサイズを削減
  async headers() {
    return [
      {
        // 静的ファイル・画像・フォントのCDNエッジキャッシュを1年間有効化
        source: "/(.*)\\.(ico|png|jpg|jpeg|svg|woff|woff2|css|js)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      {
        // 解説・学習ガイドはCDNエッジで最大1時間キャッシュして瞬時レスポンス（stale-while-revalidate適用）
        source: "/(lpic1|ccna)/guide/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=60, s-maxage=3600, stale-while-revalidate=86400",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
