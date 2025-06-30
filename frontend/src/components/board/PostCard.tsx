"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import styles from '@/styles/board/board.module.css'
import { API_URL } from '@/lib/api'
import type { Post } from '@/lib/api/board'

interface PostCardProps {
  post: Post
  onLikeUpdate: (postId: number, isLiked: boolean, newLikeCount: number) => void
}

export default function PostCard({ post, onLikeUpdate }: PostCardProps) {
  const [isLiked, setIsLiked] = useState(post.is_liked)
  const [likeCount, setLikeCount] = useState(post.like_count)
  const router = useRouter()

  const handleLike = async (e: React.MouseEvent) => {
    e.stopPropagation()
    
    try {
      const token = localStorage.getItem('token')
      const method = isLiked ? 'DELETE' : 'POST'
      
      const response = await fetch(`${API_URL}/posts/${post.ID}/like`, {
        method,
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        const newIsLiked = !isLiked
        const newLikeCount = newIsLiked ? likeCount + 1 : likeCount - 1
        
        setIsLiked(newIsLiked)
        setLikeCount(newLikeCount)
        onLikeUpdate(post.ID, newIsLiked, newLikeCount)
      }
    } catch (error) {
      console.error('Error updating like:', error)
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('ja-JP', { 
      year: 'numeric', 
      month: '2-digit', 
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <div className={styles.postCard}>
      <div 
        className={styles.postContent}
        onClick={() => router.push(`/board/${post.ID}`)}
      >
        <h2>{post.title}</h2>
        <p className={styles.displayName}>投稿者: {post.display_name}</p>
        <p className={styles.content}>{post.content}</p>
        <p className={styles.date}>{formatDate(post.CreatedAt)}</p>
      </div>
      
      <div className={styles.postActions}>
        <button 
          className={`${styles.likeButton} ${isLiked ? styles.liked : ''}`}
          onClick={handleLike}
        >
          ❤️ {likeCount}
        </button>
        <span className={styles.commentCount}>
          💬 {post.comment_count}
        </span>
      </div>
    </div>
  )
}