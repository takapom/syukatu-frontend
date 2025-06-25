"use client"

import type React from "react"

import { useNewUser } from "@/hooks/use/useNewUser"
import { useRouter } from "next/navigation"
import { useState } from "react"
import styles from "@/styles/user/register.module.css"
import Link from "next/link"

export default function NewUser() {
  const { email, password, loading, setLoading, createNewUser, setEmail, setPassword } = useNewUser()
  const [confirmPassword, setConfirmPassword] = useState("")
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    //パスワードの一致チェック処理
    if (password !== confirmPassword) {
      alert("パスワードが一致しません")
      return
    }
    try {
      await createNewUser({ email, password })
      alert("登録が完了しました！")
      router.push("/")
    } catch (err: unknown) {
      if (err instanceof Error) {
        alert(err.message)
      } else {
        alert("予期せぬエラーが発生しました")
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.formWrapper}>
        <div className={styles.header}>
          <h1 className={styles.title}>新規会員登録</h1>
          <p className={styles.subtitle}>キャリアの第一歩を始めましょう</p>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.inputGroup}>
            <label htmlFor="email" className={styles.label}>
              メールアドレス
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={styles.input}
              placeholder="example@email.com"
              required
            />
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="password" className={styles.label}>
              パスワード
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={styles.input}
              placeholder="8文字以上で入力してください"
              required
            />
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="confirmPassword" className={styles.label}>
              パスワード確認
            </label>
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className={styles.input}
              placeholder="パスワードを再入力してください"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`${styles.submitButton} ${loading ? styles.loading : ""}`}
          >
            {loading ? (
              <>
                <span className={styles.spinner}></span>
                登録中...
              </>
            ) : (
              "登録する"
            )}
          </button>
        </form>

        <div className={styles.footer}>
          <p className={styles.footerText}>
            すでにアカウントをお持ちですか？
            <Link href="/" className={styles.link}>
              ログイン
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
