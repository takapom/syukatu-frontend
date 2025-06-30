import Header from "@/components/Header"
import headerStyles from "@/styles/Header.module.css"
import Link from "next/link"
import styles from "@/styles/list/intern-list.module.css"
import { fetchInternships } from "@/lib/api/intern"
import InternListClient from "@/components/intern/InternListClient"

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

export default async function InternList() {
  let internships: Intern[] = []
  let error: string | null = null

  try {
    internships = await fetchInternships()
  } catch (err) {
    error = err instanceof Error ? err.message : 'An error occurred while fetching internships'
  }

  if (error) {
    return (
      <>
        <Header />
        <div className={headerStyles.headerSpacer} />
        <div className={styles.background}>
          <div className={styles.container}>
            <div className={styles.errorCard}>
              <p>エラー: {error}</p>
            </div>
          </div>
        </div>
      </>
    )
  }

  return (
    <>
      <Header />
      <div className={styles.background}>
        <div className={styles.container}>
          <div className={styles.header}>
            <h1 className={styles.title}></h1>
            <Link href="/AddIntern" className={styles.addButtonLink}>
              <button className={styles.addButton}>追加</button>
            </Link>
          </div>
          <InternListClient initialInternships={internships} />
        </div>
      </div>
    </>
  )
}
