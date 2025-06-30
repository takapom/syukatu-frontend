"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import InternCard from "./InternCard"
import styles from "@/styles/list/intern-list.module.css"
import { API_URL } from "@/lib/api"
import Link from "next/link"

interface Intern {
  id: number
  title: string
  company: string
  dailystart: number
  dailyfinish: number
  content: string
  selection: string
  joined: boolean
}

interface InternListClientProps {
  initialInternships: Intern[]
}

export default function InternListClient({ initialInternships }: InternListClientProps) {
  const [internships, setInternships] = useState(initialInternships)
  const router = useRouter()

  const handleDelete = async (id: number) => {
    try {
      const token = localStorage.getItem("token")
      if (!token) {
        throw new Error("ログインが必要です！")
      }

      const res = await fetch(`${API_URL}/internships/${id}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
      })

      if (!res.ok) {
        if (res.status === 401) {
          localStorage.removeItem('token')
          document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT'
          router.push('/')
          throw new Error("認証に失敗しました。再度ログインしてください。")
        }
        const errorData = await res.json().catch(() => ({}))
        throw new Error(errorData.error || `削除に失敗しました: ${res.status}`)
      }

      setInternships(prev => prev.filter(intern => intern.id !== id))
      alert('インターン情報を削除しました')
      router.refresh()
    } catch (err) {
      alert(err instanceof Error ? err.message : '削除に失敗しました')
      throw err
    }
  }

  return (
    <div className={styles.grid}>
      {internships.map((intern) => (
        <InternCard
          key={intern.id}
          intern={intern}
          onDelete={handleDelete}
        />
      ))}
      {internships.length === 0 && (
        <div className={styles.emptyState}>
          <div className={styles.emptyCard}>
            <p>インターン情報が登録されていません</p>
            <Link href="/AddIntern" className={styles.emptyAddLink}>
              <button className={styles.emptyAddButton}>最初のインターンを追加</button>
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}