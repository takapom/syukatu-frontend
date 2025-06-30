"use client"

import { useRouter } from 'next/navigation'
import styles from '@/styles/board/board.module.css'

export default function NewPostButton() {
  const router = useRouter()

  return (
    <button 
      className={styles.newPostButton}
      onClick={() => router.push('/board/new')}
    >
      新規投稿
    </button>
  )
}