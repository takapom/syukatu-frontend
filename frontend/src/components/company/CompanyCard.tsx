"use client"

import { useState } from "react"
import styles from "@/styles/list/company-list.module.css"

interface CompanyCardProps {
  company: {
    id: number
    company: string
    occupation: string
    member: number
    selection: string
    intern: boolean
  }
  onDelete: (id: number, companyName: string) => Promise<void>
}

export default function CompanyCard({ company, onDelete }: CompanyCardProps) {
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async () => {
    if (!confirm(`「${company.company}」を削除してもよろしいですか？`)) {
      return
    }

    setIsDeleting(true)
    try {
      await onDelete(company.id, company.company)
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <div className={styles.card}>
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
          onClick={handleDelete}
          disabled={isDeleting}
          className={styles.deleteButton}
        >
          {isDeleting ? '削除中...' : '削除'}
        </button>
      </div>
    </div>
  )
}