import { API_URL } from "@/lib/api"
import { cookies } from "next/headers"

export interface Post {
  ID: number
  title: string
  content: string
  display_name: string
  like_count: number
  comment_count: number
  is_liked: boolean
  CreatedAt: string
}

export async function fetchPosts(limit: number = 20, offset: number = 0): Promise<Post[]> {
  const cookieStore = await cookies()
  const token = cookieStore.get('token')?.value

  if (!token) {
    throw new Error("ログインが必要です！")
  }

  const response = await fetch(`${API_URL}/posts?limit=${limit}&offset=${offset}`, {
    headers: {
      'Authorization': `Bearer ${token}`
    },
    cache: 'no-store'
  })

  if (!response.ok) {
    throw new Error('Failed to fetch posts')
  }

  const data = await response.json()
  
  // データが配列でない場合は空配列として扱う
  const posts = Array.isArray(data) ? data : []
  
  return posts
}