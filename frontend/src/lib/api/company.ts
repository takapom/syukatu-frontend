import { API_URL } from "@/lib/api"
import { cookies } from "next/headers"

interface Company {
  id: number
  company: string
  occupation: string
  member: number
  selection: string
  intern: boolean
  createdAt: string
}

interface CompanyResponse {
  ID: number
  Company: string
  Occupation: string
  Member: number
  Selection: string
  Intern: boolean
  CreatedAt: string
}

export async function fetchCompanyLists(): Promise<Company[]> {
  const cookieStore = await cookies()
  const token = cookieStore.get('token')?.value

  if (!token) {
    throw new Error("ログインが必要です！")
  }

  const res = await fetch(`${API_URL}/company_lists`, {
    method: "GET",
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
  
  if (!Array.isArray(data)) {
    throw new Error("データの形式が不正です")
  }

  const validatedData = data.map((item: CompanyResponse) => ({
    id: item.ID,
    company: item.Company,
    occupation: item.Occupation || '未設定',
    member: item.Member || 1,
    selection: item.Selection || '未設定',
    intern: item.Intern,
    createdAt: item.CreatedAt
  }))

  return validatedData
}

export async function deleteCompany(id: number): Promise<void> {
  const cookieStore = await cookies()
  const token = cookieStore.get('token')?.value

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
      throw new Error("認証に失敗しました。再度ログインしてください。")
    }
    const errorData = await res.json().catch(() => ({}))
    throw new Error(errorData.error || `削除に失敗しました: ${res.status}`)
  }
}