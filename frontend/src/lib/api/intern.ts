import { API_URL } from "@/lib/api"
import { cookies } from "next/headers"

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

interface ResponseIntern {
  ID: number
  Title: string
  Company: string
  Dailystart: number
  Dailyfinish: number
  Content: string
  Selection: string
  Joined: boolean
}

export async function fetchInternships(): Promise<Intern[]> {
  const cookieStore = await cookies()
  const token = cookieStore.get('token')?.value

  if (!token) {
    throw new Error("ログインが必要です！")
  }

  const res = await fetch(`${API_URL}/internships`, {
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json"
    },
    cache: 'no-store'
  })

  if (!res.ok) {
    if (res.status === 401) {
      throw new Error("認証に失敗しました。再度ログインしてください。")
    }
    const errorData = await res.json().catch(() => ({}))
    throw new Error(errorData.error || `HTTP error! status: ${res.status}`)
  }

  const data = await res.json()

  const validatedData = data.map((item: ResponseIntern) => ({
    id: item.ID,
    title: item.Title,
    company: item.Company,
    dailystart: item.Dailystart,
    dailyfinish: item.Dailyfinish,
    content: item.Content,
    selection: item.Selection,
    joined: item.Joined,
  }))

  return validatedData
}

export async function deleteInternship(id: number): Promise<void> {
  const cookieStore = await cookies()
  const token = cookieStore.get('token')?.value

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
      throw new Error("認証に失敗しました。再度ログインしてください。")
    }
    const errorData = await res.json().catch(() => ({}))
    throw new Error(errorData.error || `削除に失敗しました: ${res.status}`)
  }
}