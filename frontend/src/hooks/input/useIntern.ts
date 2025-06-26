//インターンリスト追加
"use client"

import { useState } from "react";
import { API_URL } from "@/lib/api";

//送信するデータの型定義
interface InternData {
    title: string;
    company: string;
    dailystart: number;
    dailyfinish: number;
    content: string;
    selection: string;
    joined: boolean;
}

export default function useIntern() {
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    // const router = useRouter();

    const addIntern = async (data: InternData) => {
        setError(null);
        setLoading(true);
        //トークンチェック
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                throw new Error("ログインしてください！");
            }
            const response = await fetch(`${API_URL}/internships`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(data)
            });
            if (!response.ok) {
                throw new Error("インターン情報の追加に失敗しました");
            }
            return await response.json();
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : "予期せぬエラーが発生しました";
            setError(errorMessage);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    return { addIntern, error, loading };
}
