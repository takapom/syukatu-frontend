//企業リスト表示ページ
import Header from "@/components/Header"
import styles from "@/styles/list/company-list.module.css"
import headerStyles from "@/styles/Header.module.css"
import Link from "next/link"
import { fetchCompanyLists } from "@/lib/api/company"
import CompanyList from "@/components/company/CompanyList"

interface Company {
  id: number
  company: string
  occupation: string
  member: number
  selection: string
  intern: boolean
  createdAt: string
}

export default async function Company() {
  let companies: Company[] = []
  let error: string | null = null

  try {
    companies = await fetchCompanyLists()
  } catch (err) {
    error = err instanceof Error ? err.message : '予期せぬエラーが発生しました'
  }

  if (error) {
    return (
      <div className={styles.background}>
        <Header />
        <div className={headerStyles.headerSpacer} />
        <div className={styles.container}>
          <div className={styles.errorCard}>
            <p>エラー: {error}</p>
          </div>
        </div>
      </div>
    )
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
          <CompanyList initialCompanies={companies} />
        </div>
      </div>
    </>
  )
}
