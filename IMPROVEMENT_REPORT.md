# フロントエンドリポジトリ改善提案レポート

## 概要

このレポートは、求人・インターンシップ管理システムのフロントエンドコードベースの包括的な分析結果と改善提案をまとめたものです。

## 現在の技術スタック

- **フレームワーク**: Next.js 15.3.3
- **UI ライブラリ**: React 19.0.0
- **言語**: TypeScript 5
- **スタイリング**: Bootstrap 5.3.6 + CSS Modules
- **開発ツール**: ESLint, Turbopack

## 主要な問題点と改善提案

### 1. セキュリティの脆弱性 🔴 重要度：高

#### 1.1 ハードコードされた API URL

**問題点**:

```typescript
// 複数のファイルで発見
const res = await fetch('http://localhost:8080/login', {...})
```

**改善案**:

```typescript
// .env.local
NEXT_PUBLIC_API_URL=http://localhost:8080

// api/client.ts
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'
```

#### 1.2 localStorage でのトークン管理

**問題点**: XSS 攻撃に対して脆弱

**改善案**:

- HTTPOnly Cookie の使用
- Next.js API Routes を経由したセキュアな認証フロー
- iron-session ライブラリの導入

#### 1.3 クライアントサイドでの JWT 検証

**問題点**:

```typescript
const validateToken = (token: string): boolean => {
  const payload = JSON.parse(atob(token.split(".")[1]));
  // クライアントサイドの検証は信頼できない
};
```

**改善案**:

- サーバーサイドでの検証に移行
- Next.js Middleware を使用した認証チェック

### 2. パフォーマンスの問題 🟡 重要度：中

#### 2.1 メモリリーク

**問題点**:

```typescript
useEffect(() => {
  checkToken(); // 依存配列なし - 毎回レンダリング時に実行
});
```

**改善案**:

```typescript
useEffect(() => {
  checkToken();
}, []); // 空の依存配列で初回のみ実行
```

#### 2.2 非効率な状態管理

**問題点**: 複数の useState による過剰な再レンダリング

**改善案**:

```typescript
// useReducerまたは単一のstateオブジェクトを使用
const [formState, setFormState] = useReducer(formReducer, initialState);
```

### 3. コード品質の問題 🟡 重要度：中

#### 3.1 大量のコード重複

**問題点**: トークン検証ロジックが複数ファイルで重複

**改善案**:

```typescript
// hooks/useAuth.ts
export const useAuth = () => {
  const checkToken = useCallback(() => {
    // 統一されたトークン検証ロジック
  }, []);

  return { checkToken, isAuthenticated };
};
```

#### 3.2 エラーハンドリングの不整合

**問題点**: エラー処理パターンが統一されていない

**改善案**:

- 統一されたエラーハンドリングフック
- エラーバウンダリの実装
- カスタムエラークラスの導入

### 4. アクセシビリティの欠如 🟠 重要度：中-高

**問題点**:

- ARIA 属性の欠如
- キーボードナビゲーションのサポート不足
- フォーム検証フィードバックの不足

**改善案**:

```typescript
<input
  aria-label="メールアドレス"
  aria-describedby="email-error"
  aria-invalid={!!error}
  // ...
/>;
{
  error && (
    <span id="email-error" role="alert">
      {error}
    </span>
  );
}
```

### 5. Next.js 機能の未活用 🟡 重要度：中

**問題点**:

- 環境変数の未使用
- Image 最適化の未使用
- API Routes の未活用
- メタデータの欠如

**改善案**:

```typescript
// app/layout.tsx
export const metadata: Metadata = {
  title: "求人管理システム",
  description: "就職活動とインターンシップの管理",
};

// next.config.ts
const nextConfig = {
  images: {
    domains: ["example.com"],
  },
  env: {
    API_URL: process.env.API_URL,
  },
};
```

## 推奨アクションプラン

### Phase 1: 緊急対応（1-2 週間）

1. **セキュリティ修正**

   - API URL の環境変数化
   - トークン検証の統一化
   - XSS 脆弱性の修正

2. **パフォーマンス修正**
   - useEffect の依存配列修正
   - メモリリークの解消

### Phase 2: 基盤改善（2-4 週間）

1. **認証システムの再構築**

   - HTTPOnly Cookie への移行
   - Next.js Middleware の実装
   - 認証用フックの作成

2. **エラーハンドリングの統一**
   - グローバルエラーハンドラー
   - エラーバウンダリの実装
   - ユーザーフレンドリーなエラーメッセージ

### Phase 3: 品質向上（1-2 ヶ月）

1. **コード品質**

   - 重複コードのリファクタリング
   - TypeScript 型の厳格化
   - ESLint ルールの強化

2. **テストの導入**

   - Jest + React Testing Library
   - E2E テスト（Playwright/Cypress）
   - CI/CD パイプラインの構築

3. **アクセシビリティ改善**
   - WCAG 2.1 準拠
   - スクリーンリーダー対応
   - キーボードナビゲーション

### Phase 4: 最適化（継続的）

1. **パフォーマンス最適化**

   - バンドルサイズの削減
   - 遅延ローディング
   - キャッシュ戦略

2. **開発体験の向上**
   - Storybook 導入
   - デザインシステムの構築
   - ドキュメント整備

## 実装例

### 統一認証サービス

```typescript
// services/auth.service.ts
class AuthService {
  private static instance: AuthService;

  static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  async login(email: string, password: string) {
    const response = await apiClient.post("/auth/login", { email, password });
    // HTTPOnly Cookieで自動的にトークンが設定される
    return response.data;
  }

  async validateSession() {
    return apiClient.get("/auth/validate");
  }
}
```

### API クライアントの実装

```typescript
// lib/api-client.ts
import axios from "axios";

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default apiClient;
```

## まとめ

このプロジェクトは基本的な機能は実装されていますが、セキュリティ、パフォーマンス、保守性の観点から多くの改善が必要です。特に認証システムの再構築とコード品質の向上は優先的に取り組むべき課題です。

段階的な改善アプローチを取ることで、システムを稼働させながら品質を向上させることが可能です。各フェーズの実装により、より安全で、高速で、保守しやすいアプリケーションへと進化させることができます。
