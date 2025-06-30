"use client"

import Header from "@/components/Header"
import headerStyles from "@/styles/Header.module.css"
import styles from "@/styles/settings/settings.module.css"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"

interface UserSettings {
  email: string;
  notifications: {
    email: boolean;
    push: boolean;
  };
  theme: 'light' | 'dark' | 'auto';
  language: 'ja' | 'en';
}

export default function Settings() {
  const router = useRouter()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [settings, setSettings] = useState<UserSettings>({
    email: '',
    notifications: {
      email: true,
      push: false,
    },
    theme: 'light',
    language: 'ja'
  })
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)

  useEffect(() => {
    // トークンチェック
    const checkToken = () => {
      const token = localStorage.getItem('token')
      if (!token) {
        setIsAuthenticated(false)
        return
      }

      try {
        const payload = JSON.parse(atob(token.split('.')[1]))
        const expirationTime = payload.exp * 1000
        
        if (Date.now() >= expirationTime) {
          localStorage.removeItem('token')
          document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT'
          setIsAuthenticated(false)
        } else {
          setIsAuthenticated(true)
        }
      } catch {
        localStorage.removeItem('token')
        setIsAuthenticated(false)
      }
    }

    checkToken()

    // ローカルストレージから設定を読み込み（仮実装）
    const savedSettings = localStorage.getItem('userSettings')
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings))
    }
  }, [])

  const handleNotificationChange = (type: 'email' | 'push') => {
    setSettings(prev => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        [type]: !prev.notifications[type]
      }
    }))
  }

  const handleThemeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSettings(prev => ({
      ...prev,
      theme: e.target.value as 'light' | 'dark' | 'auto'
    }))
  }

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSettings(prev => ({
      ...prev,
      language: e.target.value as 'ja' | 'en'
    }))
  }

  const handleSave = async () => {
    setIsLoading(true)
    setMessage(null)

    try {
      // ローカルストレージに保存（仮実装）
      localStorage.setItem('userSettings', JSON.stringify(settings))
      
      // 実際のAPIコールはここで行う
      // const token = localStorage.getItem('token')
      // const response = await fetch('http://localhost:8080/settings', {
      //   method: 'PUT',
      //   headers: {
      //     'Content-Type': 'application/json',
      //     'Authorization': `Bearer ${token}`
      //   },
      //   body: JSON.stringify(settings)
      // })

      setMessage({ type: 'success', text: '設定を保存しました' })
    } catch {
      setMessage({ type: 'error', text: '設定の保存に失敗しました' })
    } finally {
      setIsLoading(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('userSettings')
    // Remove token from cookie
    document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT'
    router.push('/')
  }

  const handleDeleteAccount = () => {
    if (confirm('本当にアカウントを削除しますか？この操作は取り消せません。')) {
      // アカウント削除処理
      localStorage.removeItem('token')
      localStorage.removeItem('userSettings')
      // Remove token from cookie
      document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT'
      router.push('/')
    }
  }

  return (
    <>
      <Header />
      <div className={headerStyles.headerSpacer} />
      <div className={styles.background}>
        <div className={styles.container}>
          <div className={styles.settingsCard}>
            <h1 className={styles.title}>設定</h1>

            {!isAuthenticated && (
              <div className={`${styles.message} ${styles.warning}`}>
                ログインが必要です。一部の機能が制限されています。
              </div>
            )}

            {message && (
              <div className={`${styles.message} ${styles[message.type]}`}>
                {message.text}
              </div>
            )}

            <div className={styles.section}>
              <h2 className={styles.sectionTitle}>アカウント情報</h2>
              <div className={styles.infoItem}>
                <span className={styles.label}>メールアドレス</span>
                <span className={styles.value}>{settings.email || 'user@example.com'}</span>
              </div>
            </div>

            <div className={styles.section}>
              <h2 className={styles.sectionTitle}>通知設定</h2>
              <div className={styles.settingItem}>
                <label className={styles.checkboxLabel}>
                  <input
                    type="checkbox"
                    checked={settings.notifications.email}
                    onChange={() => handleNotificationChange('email')}
                    className={styles.checkbox}
                  />
                  <span className={styles.checkboxText}>メール通知を受け取る</span>
                </label>
              </div>
              <div className={styles.settingItem}>
                <label className={styles.checkboxLabel}>
                  <input
                    type="checkbox"
                    checked={settings.notifications.push}
                    onChange={() => handleNotificationChange('push')}
                    className={styles.checkbox}
                  />
                  <span className={styles.checkboxText}>プッシュ通知を受け取る</span>
                </label>
              </div>
            </div>

            <div className={styles.section}>
              <h2 className={styles.sectionTitle}>表示設定</h2>
              <div className={styles.settingItem}>
                <label className={styles.selectLabel}>
                  <span className={styles.label}>テーマ</span>
                  <select
                    value={settings.theme}
                    onChange={handleThemeChange}
                    className={styles.select}
                  >
                    <option value="light">ライト</option>
                    <option value="dark">ダーク</option>
                    <option value="auto">自動</option>
                  </select>
                </label>
              </div>
              <div className={styles.settingItem}>
                <label className={styles.selectLabel}>
                  <span className={styles.label}>言語</span>
                  <select
                    value={settings.language}
                    onChange={handleLanguageChange}
                    className={styles.select}
                  >
                    <option value="ja">日本語</option>
                    <option value="en">English</option>
                  </select>
                </label>
              </div>
            </div>

            <div className={styles.buttonGroup}>
              <button
                onClick={handleSave}
                disabled={isLoading || !isAuthenticated}
                className={`${styles.button} ${styles.primaryButton}`}
              >
                {isLoading ? '保存中...' : '設定を保存'}
              </button>
            </div>

            <div className={styles.dangerSection}>
              <h2 className={styles.sectionTitle}>その他の操作</h2>
              <button
                onClick={handleLogout}
                disabled={!isAuthenticated}
                className={`${styles.button} ${styles.secondaryButton}`}
              >
                ログアウト
              </button>
              <button
                onClick={handleDeleteAccount}
                disabled={!isAuthenticated}
                className={`${styles.button} ${styles.dangerButton}`}
              >
                アカウントを削除
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}