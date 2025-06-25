'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Header from '@/components/Header'
import headerStyles from '@/styles/Header.module.css'
import styles from '@/styles/board/new-post.module.css'

export default function NewPostPage() {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [displayName, setDisplayName] = useState('')
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<{ [key: string]: string }>({})
  const router = useRouter()

  const validate = () => {
    const newErrors: { [key: string]: string } = {}
    
    if (!title.trim()) {
      newErrors.title = 'タイトルを入力してください'
    }
    
    if (!content.trim()) {
      newErrors.content = '本文を入力してください'
    }
    
    if (!displayName.trim()) {
      newErrors.displayName = 'ユーザー名を入力してください'
    } else if (displayName.length > 20) {
      newErrors.displayName = 'ユーザー名は20文字以内で入力してください'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validate()) {
      return
    }
    
    setLoading(true)
    
    try {
      const token = localStorage.getItem('token')
      if (!token) {
        router.push('/')
        return
      }

      const response = await fetch('http://localhost:8080/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          title: title.trim(),
          content: content.trim(),
          display_name: displayName.trim()
        })
      })

      if (!response.ok) {
        throw new Error('Failed to create post')
      }

      router.push('/board')
    } catch (error) {
      console.error('Error creating post:', error)
      alert('投稿の作成に失敗しました')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={styles.container}>
      <Header />
      <div className={headerStyles.headerSpacer} />
      <main className={styles.main}>
        <h1>新規投稿</h1>
        
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGroup}>
            <label htmlFor="displayName">ユーザー名</label>
            <input
              id="displayName"
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="表示用のユーザー名（20文字以内）"
              className={errors.displayName ? styles.error : ''}
              disabled={loading}
            />
            {errors.displayName && (
              <span className={styles.errorMessage}>{errors.displayName}</span>
            )}
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="title">タイトル</label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="投稿のタイトル"
              className={errors.title ? styles.error : ''}
              disabled={loading}
            />
            {errors.title && (
              <span className={styles.errorMessage}>{errors.title}</span>
            )}
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="content">本文</label>
            <textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="投稿の内容"
              rows={10}
              className={errors.content ? styles.error : ''}
              disabled={loading}
            />
            {errors.content && (
              <span className={styles.errorMessage}>{errors.content}</span>
            )}
          </div>

          <div className={styles.actions}>
            <button
              type="button"
              onClick={() => router.push('/board')}
              className={styles.cancelButton}
              disabled={loading}
            >
              キャンセル
            </button>
            <button
              type="submit"
              className={styles.submitButton}
              disabled={loading}
            >
              {loading ? '投稿中...' : '投稿する'}
            </button>
          </div>
        </form>
      </main>
    </div>
  )
}