'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Header from '@/components/Header'
import headerStyles from '@/styles/Header.module.css'
import styles from '@/styles/board/post-detail.module.css'
import { API_URL } from '@/lib/api'

interface Post {
  ID: number
  title: string
  content: string
  display_name: string
  like_count: number
  comment_count: number
  user_id: number
  CreatedAt: string
}

interface Comment {
  ID: number
  content: string
  display_name: string
  CreatedAt: string
}

export default function PostDetailPage() {
  const [post, setPost] = useState<Post | null>(null)
  const [comments, setComments] = useState<Comment[]>([])
  const [isLiked, setIsLiked] = useState(false)
  const [loading, setLoading] = useState(true)
  const [commentContent, setCommentContent] = useState('')
  const [commentDisplayName, setCommentDisplayName] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const router = useRouter()
  const params = useParams()
  const postId = params.id as string

  useEffect(() => {
    const fetchPostDetail = async () => {
      try {
        const token = localStorage.getItem('token')
        if (!token) {
          router.push('/')
          return
        }

        const response = await fetch(`${API_URL}/posts/${postId}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })

        if (!response.ok) {
          throw new Error('Failed to fetch post')
        }

        const data = await response.json()
        setPost(data.post)
        setComments(data.comments || [])
        setIsLiked(data.is_liked)
      } catch (error) {
        console.error('Error fetching post:', error)
        router.push('/board')
      } finally {
        setLoading(false)
      }
    }

    fetchPostDetail()
  }, [postId, router])


  const handleLike = async () => {
    if (!post) return

    try {
      const token = localStorage.getItem('token')
      const method = isLiked ? 'DELETE' : 'POST'
      
      const response = await fetch(`${API_URL}/posts/${postId}/like`, {
        method,
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        setIsLiked(!isLiked)
        setPost({
          ...post,
          like_count: isLiked ? post.like_count - 1 : post.like_count + 1
        })
      }
    } catch (error) {
      console.error('Error updating like:', error)
    }
  }

  const handleDelete = async () => {
    if (!confirm('この投稿を削除しますか？')) return

    try {
      const token = localStorage.getItem('token')
      const userId = localStorage.getItem('userId')
      
      if (!userId || post?.user_id !== parseInt(userId)) {
        alert('この投稿を削除する権限がありません')
        return
      }

      const response = await fetch(`${API_URL}/posts/${postId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        router.push('/board')
      } else {
        alert('投稿の削除に失敗しました')
      }
    } catch (error) {
      console.error('Error deleting post:', error)
    }
  }

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!commentContent.trim() || !commentDisplayName.trim()) {
      alert('コメントとユーザー名を入力してください')
      return
    }

    if (commentDisplayName.length > 20) {
      alert('ユーザー名は20文字以内で入力してください')
      return
    }

    setSubmitting(true)

    try {
      const token = localStorage.getItem('token')
      
      const response = await fetch(`${API_URL}/posts/${postId}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          content: commentContent.trim(),
          display_name: commentDisplayName.trim()
        })
      })

      if (response.ok) {
        const newComment = await response.json()
        setComments([...comments, newComment])
        setCommentContent('')
        setCommentDisplayName('')
        if (post) {
          setPost({ ...post, comment_count: post.comment_count + 1 })
        }
      }
    } catch (error) {
      console.error('Error creating comment:', error)
      alert('コメントの投稿に失敗しました')
    } finally {
      setSubmitting(false)
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

  const formatContent = (content: string | undefined) => {
    if (!content) {
      return ''
    }
    const urlRegex = /(https?:\/\/[^\s]+)/g
    return content.split(urlRegex).map((part, index) => {
      if (part.match(urlRegex)) {
        return (
          <a key={index} href={part} target="_blank" rel="noopener noreferrer" className={styles.link}>
            {part}
          </a>
        )
      }
      return part
    })
  }

  if (loading) {
    return (
      <div className={styles.container}>
        <Header />
        <div className={headerStyles.headerSpacer} />
        <main className={styles.main}>
          <div className={styles.loading}>読み込み中...</div>
        </main>
      </div>
    )
  }

  if (!post) {
    return null
  }

  return (
    <div className={styles.container}>
      <Header />
      <div className={headerStyles.headerSpacer} />
      <main className={styles.main}>
        <button 
          className={styles.backButton}
          onClick={() => router.push('/board')}
        >
          ← 掲示板に戻る
        </button>

        <article className={styles.post}>
          <div className={styles.postHeader}>
            <h1>{post.title || '無題'}</h1>
            {post.user_id === parseInt(localStorage.getItem('userId') || '0') && (
              <button 
                className={styles.deleteButton}
                onClick={handleDelete}
              >
                削除
              </button>
            )}
          </div>
          
          <div className={styles.postMeta}>
            <span className={styles.author}>投稿者: {post.display_name || '名無し'}</span>
            <span className={styles.date}>{post.CreatedAt ? formatDate(post.CreatedAt) : ''}</span>
          </div>

          <div className={styles.postContent}>
            {formatContent(post.content)}
          </div>

          <div className={styles.postActions}>
            <button 
              className={`${styles.likeButton} ${isLiked ? styles.liked : ''}`}
              onClick={handleLike}
            >
              ❤️ {post.like_count || 0}
            </button>
            <span className={styles.commentCount}>
              💬 {post.comment_count || 0}
            </span>
          </div>
        </article>

        <section className={styles.commentsSection}>
          <h2>コメント</h2>

          <form onSubmit={handleCommentSubmit} className={styles.commentForm}>
            <input
              type="text"
              value={commentDisplayName}
              onChange={(e) => setCommentDisplayName(e.target.value)}
              placeholder="ユーザー名（20文字以内）"
              className={styles.nameInput}
              disabled={submitting}
            />
            <textarea
              value={commentContent}
              onChange={(e) => setCommentContent(e.target.value)}
              placeholder="コメントを入力..."
              rows={3}
              className={styles.commentInput}
              disabled={submitting}
            />
            <button 
              type="submit" 
              className={styles.submitButton}
              disabled={submitting}
            >
              {submitting ? '投稿中...' : 'コメントする'}
            </button>
          </form>

          <div className={styles.commentsList}>
            {comments.length === 0 ? (
              <p className={styles.noComments}>まだコメントはありません</p>
            ) : (
              comments.map(comment => (
                <div key={comment.ID} className={styles.comment}>
                  <div className={styles.commentHeader}>
                    <span className={styles.commentAuthor}>{comment.display_name || '名無し'}</span>
                    <span className={styles.commentDate}>{comment.CreatedAt ? formatDate(comment.CreatedAt) : ''}</span>
                  </div>
                  <div className={styles.commentContent}>
                    {formatContent(comment.content)}
                  </div>
                </div>
              ))
            )}
          </div>
        </section>
      </main>
    </div>
  )
}