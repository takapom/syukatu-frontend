//企業リスト表示ページ
"use client"

import useCompany from "@/hooks/get/useCompany"
import Header from "@/components/Header"
import styles from "@/styles/list/company-list.module.css"
import headerStyles from "@/styles/Header.module.css"
import Link from "next/link"
import { useState } from "react"

export default function Company() {
  const { companyLists, error, loading, deleteCompany } = useCompany()
  const [deletingId, setDeletingId] = useState<number | null>(null)

  if (loading)
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.spinner}></div>
        <p className={styles.loadingText}>読み込み中...</p>
      </div>
    )

  if (error)
    return (
      <div className={styles.background}>
        <Header />
        <div className={headerStyles.headerSpacer} />
        <div className={styles.container}>
          <div className={styles.errorCard}>
            <p>エラー: {error.message}</p>
          </div>
        </div>
      </div>
    )

  const handleDelete = async (id: number, companyName: string) => {
    if (!confirm(`「${companyName}」を削除してもよろしいですか？`)) {
      return
    }

    setDeletingId(id)
    try {
      await deleteCompany(id)
      alert('企業情報を削除しました')
    } catch (err) {
      alert(err instanceof Error ? err.message : '削除に失敗しました')
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <>
    <Header />
    <div className={headerStyles.headerSpacer} />
    <div className={styles.background}>
      <div className={styles.container}>
        <h1 className={styles.title}>企業リスト</h1>
        <Link href="/companylists">
        <button className={styles.addButton}>追加する</button>
        </Link>
        <div className={styles.grid}>
          {Array.isArray(companyLists) &&
            companyLists.map((company, index) => (
              <div key={company.id || index} className={styles.card}>
                <h3 className={styles.companyName}>{company.company}</h3>
                <div className={styles.infoList}>
                  <div className={styles.infoItem}>
                    <span className={styles.label}>職種:</span>
                    <span
                      className={company.occupation === "未設定" ? `${styles.value} ${styles.unset}` : styles.value}
                    >
                      {company.occupation}
                    </span>
                  </div>
                  <div className={styles.infoItem}>
                    <span className={styles.label}>社員数:</span>
                    <span className={company.member === 0 ? `${styles.value} ${styles.unset}` : styles.value}>
                      {company.member}人
                    </span>
                  </div>
                  <div className={styles.infoItem}>
                    <span className={styles.label}>選考状況:</span>
                    <span className={company.selection === "未設定" ? `${styles.value} ${styles.unset}` : styles.value}>
                      {company.selection}
                    </span>
                  </div>
                  <div className={styles.infoItem}>
                    <span className={styles.label}>インターン:</span>
                    <span
                      className={
                        company.intern ? `${styles.value} ${styles.positive}` : `${styles.value} ${styles.negative}`
                      }
                    >
                      {company.intern ? "希望" : "希望しない"}
                    </span>
                  </div>
                </div>
                <div className={styles.cardFooter}>
                  <button
                    onClick={() => handleDelete(company.id, company.company)}
                    disabled={deletingId === company.id}
                    className={styles.deleteButton}
                  >
                    {deletingId === company.id ? '削除中...' : '削除'}
                  </button>
                </div>
              </div>
            ))}
        </div>
        {(!Array.isArray(companyLists) || companyLists.length === 0) && (
          <div className={styles.emptyState}>
            <div className={styles.emptyCard}>
              <p>企業情報が登録されていません</p>
            </div>
          </div>
        )}
      </div>
    </div>
    </>
  )
}
