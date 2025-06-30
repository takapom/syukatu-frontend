"use client"

import { useState } from "react"
import styles from "@/styles/list/intern-list.module.css"

interface InternCardProps {
  intern: {
    id: number
    title: string
    company: string
    dailystart: number
    dailyfinish: number
    content: string
    selection: string
    joined: boolean
  }
  onDelete: (id: number, title: string, company: string) => Promise<void>
}

export default function InternCard({ intern, onDelete }: InternCardProps) {
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async () => {
    if (!confirm(`「${intern.title}（${intern.company}）」を削除してもよろしいですか？`)) {
      return
    }

    setIsDeleting(true)
    try {
      await onDelete(intern.id, intern.title, intern.company)
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <div className={styles.card}>
      <div className={styles.cardHeader}>
        <h3 className={styles.internTitle}>{intern.title}</h3>
        <span className={styles.company}>（{intern.company}）</span>
      </div>

      <div className={styles.infoList}>
        <div className={styles.infoItem}>
          <span className={styles.label}>時間:</span>
          <span className={styles.value}>
            {intern.dailystart}時〜{intern.dailyfinish}時
          </span>
        </div>

        <div className={styles.infoItem}>
          <span className={styles.label}>内容:</span>
          <span className={styles.value}>{intern.content}</span>
        </div>

        <div className={styles.infoItem}>
          <span className={styles.label}>選考状況:</span>
          <span className={styles.value}>{intern.selection}</span>
        </div>

        <div className={styles.infoItem}>
          <span className={styles.label}>参加:</span>
          <span className={intern.joined ? `${styles.value} ${styles.completed}` : `${styles.value} ${styles.pending}`}>
            {intern.joined ? "済" : "未"}
          </span>
        </div>
      </div>
      <div className={styles.cardFooter}>
        <button
          onClick={handleDelete}
          disabled={isDeleting}
          className={styles.deleteButton}
        >
          {isDeleting ? '削除中...' : '削除'}
        </button>
      </div>
    </div>
  )
}