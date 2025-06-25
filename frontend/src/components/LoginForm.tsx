"use client"

import { useRouter } from 'next/navigation';
import { useState, useEffect } from "react"
import styles from '@/styles/LoginForm.module.css';
import { useLogin } from '@/hooks/use/useLogin';

export default function LoginForm(){
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const router = useRouter();
    const {
      email, 
      setEmail, 
      password, 
      setPassword, 
      error, 
      loading, 
      handleSubmit  
    } = useLogin();

    //トークンを残したいのでuseEffectを採用
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token){
            router.push('/')
        }
    }, [router])

    //e.preventDefault()を使ってリロードを防ぐ
    //e.preventDefault()を使うためにはeが必要なのでonsubmitを噛ませている
    const onSubmit = async (e: React.FormEvent): Promise<void> => {
      //リロードを防ぐ
        e.preventDefault();
        await handleSubmit({ email, password });
    }

   return (
    <div className={styles.container}>
      <div className={styles.backgroundPattern}></div>
      <div className={styles.loginCard}>
        <div className={styles.cardHeader}>
          <div className={styles.logoContainer}>
            <div className={styles.logo}>
              <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                <circle cx="16" cy="16" r="12" fill="url(#gradient)" />
                <path d="M12 16L15 19L20 13" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <defs>
                  <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#667eea" />
                    <stop offset="100%" stopColor="#764ba2" />
                  </linearGradient>
                </defs>
              </svg>
            </div>
          </div>
          <h1 className={styles.title}>ようこそ</h1>
          <p className={styles.subtitle}>アカウントにログインしてください</p>
        </div>
        
        <form onSubmit={onSubmit} className={styles.form}>
          <div className={styles.inputGroup}>
            <label htmlFor="email" className={styles.label}>メールアドレス</label>
            <div className={styles.inputWrapper}>
              <svg className={styles.inputIcon} width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M3.33335 3.33334H16.6667C17.5834 3.33334 18.3334 4.08334 18.3334 5.00001V15C18.3334 15.9167 17.5834 16.6667 16.6667 16.6667H3.33335C2.41669 16.6667 1.66669 15.9167 1.66669 15V5.00001C1.66669 4.08334 2.41669 3.33334 3.33335 3.33334Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M18.3334 5L10 10.8333L1.66669 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className={styles.input}
                placeholder="your@email.com"
              />
            </div>
          </div>
          
          <div className={styles.inputGroup}>
            <label htmlFor="password" className={styles.label}>パスワード</label>
            <div className={styles.inputWrapper}>
              <svg className={styles.inputIcon} width="20" height="20" viewBox="0 0 20 20" fill="none">
                <rect x="3.33335" y="9.16666" width="13.3333" height="7.5" rx="2" stroke="currentColor" strokeWidth="1.5"/>
                <path d="M6.66669 9.16666V6.66666C6.66669 4.82574 8.15907 3.33333 10 3.33333C11.8409 3.33333 13.3334 4.82574 13.3334 6.66666V9.16666" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className={styles.input}
                placeholder="••••••••"
              />
              <button
                type="button"
                className={styles.passwordToggle}
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path d="M12.9833 12.9833C12.441 13.5256 11.7256 13.8333 10.9583 13.8333C9.42497 13.8333 8.12497 12.5333 8.12497 11C8.12497 10.2327 8.43264 9.51735 8.97497 8.975M15.35 15.35C13.975 16.4833 12.075 17.5 10 17.5C6.66664 17.5 3.33331 15 1.66664 10C2.60831 7.975 4.02497 6.3 5.65831 5.35M8.25831 3.53333C8.82497 3.39167 9.40831 3.33333 10 3.33333C13.3333 3.33333 16.6666 5.83333 18.3333 10.8333C17.6916 12.2667 16.7416 13.4833 15.35 15.35Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M1.66664 1.66667L18.3333 18.3333" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                ) : (
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path d="M1.66664 10S4.99997 3.33333 10 3.33333C15 3.33333 18.3333 10 18.3333 10S15 16.6667 10 16.6667C4.99997 16.6667 1.66664 10 1.66664 10Z" stroke="currentColor" strokeWidth="1.5"/>
                    <circle cx="10" cy="10" r="3" stroke="currentColor" strokeWidth="1.5"/>
                  </svg>
                )}
              </button>
            </div>
          </div>
          
          {error && (
            <div className={styles.errorMessage}>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.5"/>
                <path d="M8 5V8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                <circle cx="8" cy="11" r="0.5" fill="currentColor"/>
              </svg>
              {error}
            </div>
          )}
          
          <button
            type="submit"
            disabled={loading}
            className={`${styles.submitButton} ${loading ? styles.loading : ''}`}
          >
            <span className={styles.buttonText}>
              {loading ? 'ログイン中...' : 'ログイン'}
            </span>
            {loading && <div className={styles.spinner}></div>}
          </button>
        </form>
        
        <div className={styles.cardFooter}>
          <p className={styles.footerText}>
            アカウントをお持ちでない方は <a href="/user_regist/newuser" className={styles.link}>新規登録</a>
          </p>
        </div>
      </div>
    </div>
  );
}