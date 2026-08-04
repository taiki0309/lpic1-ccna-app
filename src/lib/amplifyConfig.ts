import { Amplify } from 'aws-amplify';
import { I18n } from 'aws-amplify/utils';
import { translations } from '@aws-amplify/ui-react';

const jaDict = {
  // --- 画面タブ・ボタン ---
  'Sign in': 'ログイン',
  'Sign In': 'ログイン',
  'Sign in to your account': 'アカウントにログイン',
  'Sign Out': 'ログアウト',
  'Sign out': 'ログアウト',
  'Create Account': '新規ユーザー登録',
  'Create a new account': '新規ユーザーを登録',
  'Forgot your password?': 'パスワードをお忘れの方はこちら',
  'Reset password': 'パスワードを再設定',
  'Reset your password': 'パスワードを再設定する',
  'Send code': '確認コードを送信',
  'Send Code': '確認コードを送信',
  'Resend Code': '確認コードを再送信',
  'Back to Sign In': 'ログイン画面に戻る',
  'Skip': 'スキップ',
  'Verify': '検証する',
  'Verify Contact': '連絡先の検証',
  'Account recovery requires verified contact information': 'アカウント復旧のために検証済みの連絡先情報が必要です',

  // --- 入力項目・ラベル ---
  'Username': 'メールアドレス',
  'Enter your username': 'メールアドレスを入力してください',
  'Email': 'メールアドレス',
  'Enter your email': 'メールアドレスを入力してください',
  'Password': 'パスワード',
  'Enter your password': 'パスワードを入力してください',
  'Confirm Password': 'パスワード（確認用）',
  'Please confirm your password': 'もう一度パスワードを入力してください',
  'Confirm': '確認する',
  'Confirmation Code': '確認コード',
  'Enter your code': 'メールに届いた確認コードを入力してください',
  'New password': '新しいパスワード',
  'Enter your new password': '新しいパスワードを入力してください',
  'Confirm New Password': '新しいパスワード（確認用）',
  'Please confirm your new password': 'もう一度新しいパスワードを入力してください',

  // --- 案内・エラーメッセージ ---
  'We Emailed You': '確認メールを送信しました',
  'Your code is on the way. To log in, enter the code we emailed to': 'ご登録のメールアドレスに確認コードを送信しました。メールに記載された確認コードを入力してください：',
  'It may take a minute to arrive.': 'メールの到着まで数分かかる場合があります。',
  'User does not exist.': 'このメールアドレスのユーザーは見つかりません。',
  'Incorrect username or password.': 'メールアドレスまたはパスワードが正しくありません。',
  'An account with the given email already exists.': 'このメールアドレスは既に登録されています。',
  'Password did not conform with policy: Password not long enough': 'パスワードは8文字以上である必要があります。',
  'Password must have lowercase characters': 'パスワードには小文字を含める必要があります。',
  'Password must have uppercase characters': 'パスワードには大文字を含める必要があります。',
  'Password must have numeric characters': 'パスワードには数字を含める必要があります。',
  'Password must have symbol characters': 'パスワードには記号を含める必要があります。',
  'Attempt limit exceeded, please try after some time.': '試行回数の上限に達しました。しばらく時間をおいてから再度お試しください。',
  'User is not confirmed.': 'メールアドレスの認証が完了していません。',
  'Code mismatch and/or expired.': '確認コードが正しくないか、有効期限が切れています。',
  'Please enter a valid email address': '正しいメールアドレスを入力してください',
  'Password cannot be empty': 'パスワードを入力してください',
};

export function configureAmplify() {
  Amplify.configure({
    Auth: {
      Cognito: {
        userPoolId: process.env.NEXT_PUBLIC_COGNITO_USER_POOL_ID!,
        userPoolClientId: process.env.NEXT_PUBLIC_COGNITO_CLIENT_ID!,
      },
    },
  });

  // AWS Amplify Authenticator の日本語翻訳辞書を登録
  I18n.putVocabularies(translations);
  I18n.putVocabularies({
    ja: jaDict,
  });
  I18n.setLanguage('ja');
}

