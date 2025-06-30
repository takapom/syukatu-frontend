"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import CompanyCard from "./CompanyCard"
import styles from "@/styles/list/company-list.module.css"
import { API_URL } from "@/lib/api"

interface Company {
  id: number
  company: string
  occupation: string
  member: number
  selection: string
  intern: boolean
}

interface CompanyListProps {
  initialCompanies: Company[]
}

export default function CompanyList({ initialCompanies }: CompanyListProps) {
  const [companies, setCompanies] = useState(initialCompanies)
  const router = useRouter()

  const handleDelete = async (id: number) => {
    try {
      const token = localStorage.getItem("token")
      if (!token) {
        throw new Error("ログインが必要です！")
      }

      const res = await fetch(`${API_URL}/company_lists/${id}`, {
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

      setCompanies(prev => prev.filter(company => company.id !== id))
      alert('企業情報を削除しました')
      router.refresh()
    } catch (err) {
      alert(err instanceof Error ? err.message : '削除に失敗しました')
      throw err
    }
  }

  return (
    <div className={styles.grid}>
      {companies.length > 0 ? (
        companies.map((company) => (
          <CompanyCard
            key={company.id}
            company={company}
            onDelete={handleDelete}
          />
        ))
      ) : (
        <div className={styles.emptyState}>
          <div className={styles.emptyCard}>
            <p>企業情報が登録されていません</p>
          </div>
        </div>
      )}
    </div>
  )
}