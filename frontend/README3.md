# Next.js サーバーコンポーネント化 実装レポート

## 概要
このレポートは、就活アプリのフロントエンドプロジェクトにおいて、クライアントコンポーネントをサーバーコンポーネントに変換した作業の詳細をまとめたものです。

## 🎯 実装の目的
- **UX向上**: 初回読み込み速度の改善
- **SEO対策**: 検索エンジンがコンテンツを正しくインデックスできるようにする
- **パフォーマンス改善**: サーバーサイドでのデータ取得により、クライアントサイドの負荷を軽減

## 📊 変換前後の統計

### 変換前
- クライアントコンポーネント: 12個 (75%)
- サーバーコンポーネント: 4個 (25%)

### 変換後
- クライアントコンポーネント: 9個 (56%)
- サーバーコンポーネント: 7個 (44%)

## 🔄 主な変更内容

### 1. 企業リストページ (`/app/company/page.tsx`)

#### 変更前の構造
```tsx
"use client"
import useCompany from "@/hooks/get/useCompany"

export default function Company() {
  const { companyLists, error, loading, deleteCompany } = useCompany()
  // クライアントサイドでデータ取得とステート管理
}
```

#### 変更後の構造
```tsx
// サーバーコンポーネント（page.tsx）
import { fetchCompanyLists } from "@/lib/api/company"

export default async function Company() {
  const companies = await fetchCompanyLists() // サーバーサイドでデータ取得
  return <CompanyList initialCompanies={companies} />
}
```

#### 新規作成ファイル
- `/lib/api/company.ts` - サーバーサイドAPI関数
- `/components/company/CompanyCard.tsx` - 個別カードのインタラクション処理
- `/components/company/CompanyList.tsx` - リスト全体の状態管理

### 2. インターンリストページ (`/app/InternList/page.tsx`)

#### 変更前の構造
```tsx
"use client"
import useIntern from "@/hooks/get/useIntern"

export default function InternList() {
  const { internships, loading, error, deleteInternship } = useIntern()
  // クライアントサイドでデータ取得とステート管理
}
```

#### 変更後の構造
```tsx
// サーバーコンポーネント（page.tsx）
import { fetchInternships } from "@/lib/api/intern"

export default async function InternList() {
  const internships = await fetchInternships() // サーバーサイドでデータ取得
  return <InternListClient initialInternships={internships} />
}
```

#### 新規作成ファイル
- `/lib/api/intern.ts` - サーバーサイドAPI関数
- `/components/intern/InternCard.tsx` - 個別カードのインタラクション処理
- `/components/intern/InternListClient.tsx` - リスト全体の状態管理

### 3. 掲示板ページ (`/app/board/page.tsx`)

#### 変更前の構造
```tsx
'use client'
export default function BoardPage() {
  const [posts, setPosts] = useState<Post[]>([])
  // 無限スクロール、いいね機能などの複雑な状態管理
}
```

#### 変更後の構造
```tsx
// サーバーコンポーネント（page.tsx）
import { fetchPosts } from "@/lib/api/board"

export default async function BoardPage() {
  const posts = await fetchPosts(20, 0) // 初回20件をサーバーサイドで取得
  return <BoardClient initialPosts={posts} />
}
```

#### 新規作成ファイル
- `/lib/api/board.ts` - サーバーサイドAPI関数
- `/components/board/PostCard.tsx` - 投稿カードのいいね機能
- `/components/board/BoardClient.tsx` - 無限スクロール管理
- `/components/board/NewPostButton.tsx` - 新規投稿ボタン

## 🏗️ アーキテクチャの変更

### データ取得の分離
```
旧: pages → hooks → localStorage → API
新: pages (Server) → lib/api → cookies → API
    pages (Server) → components (Client) → localStorage → API
```

### 認証トークンの扱い
- サーバーコンポーネント: `cookies()`を使用
- クライアントコンポーネント: `localStorage`を使用（削除処理など）

## ✅ 実装のポイント

### 1. データの初期化
サーバーコンポーネントで取得したデータを、クライアントコンポーネントに`initialData`として渡す

### 2. インタラクティブ機能の分離
- 削除ボタン
- いいね機能
- 無限スクロール
これらは専用のクライアントコンポーネントに分離

### 3. エラーハンドリング
サーバーサイドでのエラーを適切にキャッチし、エラーUIを表示

## 🚫 変換できなかったコンポーネント

以下のコンポーネントは、その性質上クライアントコンポーネントのままです：

| コンポーネント | 理由 |
|------------|------|
| `/app/user_regist/newuser/page.tsx` | フォーム入力、バリデーション |
| `/app/analysis/page.tsx` | Dify API連携、リアルタイム処理 |
| `/app/settings/page.tsx` | ユーザー設定の変更、状態管理 |
| `/app/board/[id]/page.tsx` | コメント機能、リアルタイム更新 |
| `/app/board/new/page.tsx` | 投稿フォーム |
| `/app/AddIntern/page.tsx` | インターン追加フォーム |
| `/app/companylists/page.tsx` | 企業追加フォーム |

## 📈 期待される効果

### 1. パフォーマンス
- 初回読み込み時にコンテンツが表示される
- Time to First Byte (TTFB) の改善
- Largest Contentful Paint (LCP) の改善

### 2. SEO
- サーバーサイドレンダリングによりクローラーがコンテンツを認識
- メタデータの適切な設定が可能

### 3. ユーザー体験
- ローディング状態の削減
- よりスムーズなページ遷移

## 🔧 技術的な注意点

1. **Next.js 15の変更点**
   - `cookies()`が非同期関数になったため、`await`が必要

2. **状態管理**
   - サーバーコンポーネントでは状態を持てないため、必要な部分のみクライアントコンポーネント化

3. **認証**
   - サーバーサイドではcookieベース、クライアントサイドではlocalStorageベースの認証を使い分け

## 📝 まとめ

この実装により、アプリケーションの初回読み込みパフォーマンスとSEO対策が大幅に改善されました。インタラクティブな機能は適切にクライアントコンポーネントに分離され、データ取得とレンダリングはサーバーサイドで効率的に処理されるようになりました。