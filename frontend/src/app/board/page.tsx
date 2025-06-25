'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import Header from '@/components/Header'
import headerStyles from '@/styles/Header.module.css'
import styles from '@/styles/board/board.module.css'

interface Post {
  ID: number
  title: string
  content: string
  display_name: string
  like_count: number
  comment_count: number
  is_liked: boolean
  CreatedAt: string
}

export default function BoardPage() {
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const [offset, setOffset] = useState(0)
  const router = useRouter()

  const fetchPosts = useCallback(async (currentOffset: number) => {
    if (loading) return
    
    setLoading(true)
    try {
      const token = localStorage.getItem('token')
      if (!token) {
        router.push('/')
        return
      }

      const response = await fetch(`http://localhost:8080/posts?limit=20&offset=${currentOffset}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (!response.ok) {
        throw new Error('Failed to fetch posts')
      }

      const data = await response.json()
      
      // データが配列でない場合は空配列として扱う
      const posts = Array.isArray(data) ? data : []
      
      if (posts.length < 20) {
        setHasMore(false)
      }

      if (currentOffset === 0) {
        setPosts(posts)
      } else {
        setPosts(prev => [...prev, ...posts])
      }
      
      setOffset(currentOffset + posts.length)
    } catch (error) {
      console.error('Error fetching posts:', error)
    } finally {
      setLoading(false)
    }
  }, [loading, router])

  useEffect(() => {
    const loadInitialPosts = async () => {
      setLoading(true)
      try {
        const token = localStorage.getItem('token')
        if (!token) {
          router.push('/')
          return
        }

        const response = await fetch(`http://localhost:8080/posts?limit=20&offset=0`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })

        if (!response.ok) {
          throw new Error('Failed to fetch posts')
        }

        const data = await response.json()
        
        // データが配列でない場合は空配列として扱う
        const posts = Array.isArray(data) ? data : []
        
        if (posts.length < 20) {
          setHasMore(false)
        }

        setPosts(posts)
        setOffset(posts.length)
      } catch (error) {
        console.error('Error fetching posts:', error)
      } finally {
        setLoading(false)
      }
    }

    loadInitialPosts()
  }, [router])

  const handleScroll = useCallback(() => {
    if (window.innerHeight + document.documentElement.scrollTop !== document.documentElement.offsetHeight || loading || !hasMore) {
      return
    }
    fetchPosts(offset)
  }, [fetchPosts, offset, loading, hasMore])

  useEffect(() => {
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [handleScroll])

  const handleLike = async (postId: number, isLiked: boolean) => {
    try {
      const token = localStorage.getItem('token')
      const method = isLiked ? 'DELETE' : 'POST'
      
      const response = await fetch(`http://localhost:8080/posts/${postId}/like`, {
        method,
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        setPosts(posts.map(post => 
          post.ID === postId 
            ? {
                ...post, 
                is_liked: !isLiked,
                like_count: isLiked ? post.like_count - 1 : post.like_count + 1
              }
            : post
        ))
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
    <div className={styles.container}>
      <Header />
      <div className={headerStyles.headerSpacer} />
      <main className={styles.main}>
        <div className={styles.header}>
          <h1>掲示板</h1>
          <button 
            className={styles.newPostButton}
            onClick={() => router.push('/board/new')}
          >
            新規投稿
          </button>
        </div>

        <div className={styles.postList}>
          {posts.map(post => (
            <div key={post.ID} className={styles.postCard}>
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
                  className={`${styles.likeButton} ${post.is_liked ? styles.liked : ''}`}
                  onClick={() => handleLike(post.ID, post.is_liked)}
                >
                  ❤️ {post.like_count}
                </button>
                <span className={styles.commentCount}>
                  💬 {post.comment_count}
                </span>
              </div>
            </div>
          ))}
        </div>

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
      </main>
    </div>
  )
}