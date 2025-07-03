import React from 'react'
import styles from '@/styles/board/board.module.css'

interface BoardSidebarProps {
  totalPosts: number
}

const BoardSidebar: React.FC<BoardSidebarProps> = ({ totalPosts }) => {
  return (
    <aside className={styles.sidebar}>
      <AnnouncementCard />
      <PopularTopicsCard />
      <StatisticsCard totalPosts={totalPosts} />
    </aside>
  )
}

const AnnouncementCard: React.FC = () => {
  return (
    <div className={styles.sidebarCard}>
      <h3>お知らせ</h3>
      <p>新しく掲示板を作成しました！！</p>
    </div>
  )
}

const PopularTopicsCard: React.FC = () => {
  const topics = [
    '就活情報',
    'インターン体験談',
    'ES添削',
    '面接対策'
  ]

  return (
    <div className={styles.sidebarCard}>
      <h3>人気のトピック</h3>
      <ul>
        {topics.map((topic, index) => (
          <li key={index}>{topic}</li>
        ))}
      </ul>
    </div>
  )
}

interface StatisticsCardProps {
  totalPosts: number
}

const StatisticsCard: React.FC<StatisticsCardProps> = ({ totalPosts }) => {
  // ダミーデータ（後で実際のデータに置き換え可能）
  const todayPosts = 5
  const activeUsers = 23

  return (
    <div className={styles.sidebarCard}>
      <h3>統計情報</h3>
      <p>総投稿数: {totalPosts}件</p>
      <p>今日の投稿: {todayPosts}件</p>
      <p>アクティブユーザー: {activeUsers}人</p>
    </div>
  )
}

export default BoardSidebar