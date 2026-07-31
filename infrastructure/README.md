# インフラストラクチャ構成

## ディレクトリ構成

```
infrastructure/
├── iam-policy.json          # App Runner 用 IAM ポリシー（最小権限）
├── cloudwatch-alarms.yaml   # CloudWatch アラーム & ダッシュボード
├── s3-assets.yaml           # 教材配信用 S3 バケット
├── ses-reminder.yaml        # 学習リマインドメール Lambda + EventBridge
└── lambda/
    └── reminder/
        └── index.mjs        # リマインド Lambda 関数コード
```

## デプロイ手順

### 1. IAM ポリシーの適用

```bash
# App Runner 用 IAM ロールの作成
aws iam create-role \
  --role-name lpic-ccna-apprunner-role \
  --assume-role-policy-document '{"Version":"2012-10-17","Statement":[{"Effect":"Allow","Principal":{"Service":"tasks.apprunner.amazonaws.com"},"Action":"sts:AssumeRole"}]}'

# ポリシーのアタッチ
aws iam put-role-policy \
  --role-name lpic-ccna-apprunner-role \
  --policy-name lpic-ccna-policy \
  --policy-document file://iam-policy.json
```

### 2. CloudWatch アラームのデプロイ

```bash
aws cloudformation deploy \
  --template-file cloudwatch-alarms.yaml \
  --stack-name lpic-ccna-monitoring \
  --parameter-overrides AlertEmail=your-email@example.com \
  --capabilities CAPABILITY_IAM \
  --region ap-northeast-1
```

### 3. S3 教材バケットのデプロイ

```bash
aws cloudformation deploy \
  --template-file s3-assets.yaml \
  --stack-name lpic-ccna-assets \
  --parameter-overrides BucketName=lpic-ccna-assets \
  --capabilities CAPABILITY_IAM \
  --region ap-northeast-1
```

### 4. SES リマインドメールのデプロイ

事前に SES で送信元メールアドレスを検証してください：

```bash
# メールアドレス検証（検証メールが届きます）
aws sesv2 create-email-identity \
  --email-identity your-email@example.com \
  --region ap-northeast-1

# SAM でリマインド Lambda をデプロイ
sam deploy \
  --template-file ses-reminder.yaml \
  --stack-name lpic-ccna-reminder \
  --parameter-overrides SenderEmail=your-email@example.com \
  --capabilities CAPABILITY_IAM CAPABILITY_NAMED_IAM \
  --region ap-northeast-1
```

### 5. GitHub Actions Secrets の設定

GitHub リポジトリの Settings > Secrets and variables > Actions に以下を追加：

| Secret 名 | 値 |
|-----------|-----|
| `AWS_ROLE_ARN` | GitHub Actions 用 IAM ロールの ARN |
| `APP_RUNNER_ROLE_ARN` | App Runner 用 IAM ロールの ARN |
| `NEXT_PUBLIC_COGNITO_USER_POOL_ID` | Cognito ユーザープール ID |
| `NEXT_PUBLIC_COGNITO_CLIENT_ID` | Cognito クライアント ID |
| `NEXT_PUBLIC_SUBMIT_ANSWER_URL` | Lambda 関数 URL |
