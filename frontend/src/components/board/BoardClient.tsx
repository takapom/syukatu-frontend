"use client"

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import BoardSidebar from '@/components/board/BoardSidebar'
import PostCard from '@/components/board/PostCard'
import styles from '@/styles/board/board.module.css'
import { API_URL } from '@/lib/api'
import type { Post } from '@/lib/api/board'

interface BoardClientProps {
  initialPosts: Post[]
}

export default function BoardClient({ initialPosts }: BoardClientProps) {
  const [posts, setPosts] = useState<Post[]>(initialPosts)
  const [loading, setLoading] = useState(false)
  const [hasMore, setHasMore] = useState(initialPosts.length === 20)
  const [offset, setOffset] = useState(initialPosts.length)
  const router = useRouter()

  const fetchMorePosts = useCallback(async () => {
    if (loading || !hasMore) return
    
    setLoading(true)
    try {
      const token = localStorage.getItem('token')
      if (!token) {
        router.push('/')
        return
      }

      const response = await fetch(`${API_URL}/posts?limit=20&offset=${offset}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (!response.ok) {
        throw new Error('Failed to fetch posts')
      }

      const data = await response.json()
      const newPosts = Array.isArray(data) ? data : []
      
      if (newPosts.length < 20) {
        setHasMore(false)
      }

      setPosts(prev => [...prev, ...newPosts])
      setOffset(prev => prev + newPosts.length)
    } catch (error) {
      console.error('Error fetching posts:', error)
    } finally {
      setLoading(false)
    }
  }, [loading, hasMore, offset, router])

  const handleScroll = useCallback(() => {
    if (window.innerHeight + document.documentElement.scrollTop !== document.documentElement.offsetHeight || loading || !hasMore) {
      return
    }
    fetchMorePosts()
  }, [fetchMorePosts, loading, hasMore])

  useEffect(() => {
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [handleScroll])

  const handleLikeUpdate = (postId: number, isLiked: boolean, newLikeCount: number) => {
    setPosts(posts.map(post => 
      post.ID === postId 
        ? { ...post, is_liked: isLiked, like_count: newLikeCount }
        : post
    ))
  }

  return (
    <div className={styles.contentWrapper}>
      <div className={styles.postList}>
        {posts.map(post => (
          <PostCard 
            key={post.ID} 
            post={post} 
            onLikeUpdate={handleLikeUpdate}
          />
        ))}
      </div>

      <BoardSidebar totalPosts={posts.length} />

      {loading && (
        <div className={styles.loading}>
          読み込み中...
        </div>
      )}

      {!hasMore && posts.length > 0 && (
        <div className={styles.noMore}>
          これ以上投稿はありません
        </div>
      )}
    </div>
  )
}