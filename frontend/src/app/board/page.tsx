import Header from '@/components/Header'
import BoardClient from '@/components/board/BoardClient'
import NewPostButton from '@/components/board/NewPostButton'
import headerStyles from '@/styles/Header.module.css'
import styles from '@/styles/board/board.module.css'
import { fetchPosts, type Post } from '@/lib/api/board'

export default async function BoardPage() {
  let posts: Post[] = []
  let error: string | null = null

  try {
    posts = await fetchPosts(20, 0)
  } catch (err) {
    error = err instanceof Error ? err.message : 'Failed to fetch posts'
  }

  if (error) {
    return (
      <div className={styles.container}>
        <Header />
        <div className={headerStyles.headerSpacer} />
        <main className={styles.main}>
          <div className={styles.errorCard}>
            <p>エラー: {error}</p>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className={styles.container}>
      <Header />
      <div className={headerStyles.headerSpacer} />
      <main className={styles.main}>
        <div className={styles.header}>
          <h1>掲示板</h1>
          <NewPostButton />
        </div>
        <BoardClient initialPosts={posts} />
      </main>
    </div>
  )
}