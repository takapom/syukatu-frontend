"use client"

import useIntern from "@/hooks/input/useIntern"
import Header from "@/components/Header"
import headerStyles from "@/styles/Header.module.css"
import styles from "@/styles/list/interninput.module.css"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

interface InternData {
  title: string;
  company: string;
  dailystart: number;
  dailyfinish: number;
  content: string;
  selection: string;
  joined: boolean;
}

export default function AddIntern() {
  const { addIntern, error, loading } = useIntern()
  const [formData, setFormData] = useState<InternData>({
    title: "",
    company: "",
    dailystart: 0,
    dailyfinish: 0,
    content: "",
    selection: "",
    joined: false,
  })
  const router = useRouter();

    //JWT認証のトークン確認処理
    useEffect(() => {
      const checkToken = () => {
        const token = localStorage.getItem('token');
        if (!token) {
          router.push("/")
          return;
        }

        //JWTトークンの有効性確認
        try{
          const payload = JSON.parse(atob(token.split('.')[1]));
          const expirationTime = payload.exp * 1000; // ミリ秒に変換
          
          if (Date.now() >= expirationTime) {
              // トークンが期限切れの場合
              localStorage.removeItem('token');
              router.push('/');
          }
      } catch {
          // トークンのデコードに失敗した場合
          localStorage.removeItem('token');
          router.push('/');
        }
      };

      //初回チェック
      checkToken()
  
    })
  ///フォーム送信時の処理関数
  const handleSubmit = async (data: InternData) => {
    try{
    const submitData = {
      ...data,
      dailystart: Number(data.dailystart),
      dailyfinish: Number(data.dailyfinish),
      selection: data.selection,
      joined: data.joined,
    }
    await addIntern(submitData)
    alert("インターン情報を追加しました！")
    router.push("/InternList")
  }catch(err: unknown){
    if(err instanceof Error){
      alert(err.message)
    }else{
      alert("予期せぬエラーが発生しました")
    }
  }
  }

  //入力値が変化した時の処理関数
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }))
  }


  //addInternに入力した値を渡す処理（おそらくどこかに組み込む）

  return (
    <>
      <Header />
      <div className={headerStyles.headerSpacer} />
      <div className={styles.background}>
        <div className={styles.container}>
          <div className={styles.formCard}>
            <h1 className={styles.title}>インターン情報追加</h1>

            {error && (
              <div className={styles.errorAlert}>
                <p>{error}</p>
              </div>
            )}

            <form 
              className={styles.form} 
              onSubmit={(e) => {
                e.preventDefault();
                handleSubmit(formData);
              }}
            >
              <div className={styles.inputGroup}>
                <label className={styles.label}>
                  タイトル <span className={styles.required}>*</span>
                </label>
                <input 
                  name="title" 
                  type="text" 
                  placeholder="例: サマーインターン" 
                  className={styles.input} 
                  value={formData.title}
                  onChange={handleChange}
                />
              </div>

              <div className={styles.inputGroup}>
                <label className={styles.label}>
                  企業名 <span className={styles.required}>*</span>
                </label>
                <input 
                  name="company" 
                  type="text" 
                  placeholder="企業名" 
                  className={styles.input} 
                  value={formData.company}
                  onChange={handleChange}
                />
              </div>

              <div className={styles.inputRow}>
                <div className={styles.inputGroup}>
                  <label className={styles.label}>開始時間</label>
                  <input 
                    name="dailystart" 
                    type="number" 
                    placeholder="9" 
                    className={styles.input} 
                    min="0" 
                    max="23" 
                    value={formData.dailystart}
                    onChange={handleChange}
                  />
                </div>
                <div className={styles.inputGroup}>
                  <label className={styles.label}>終了時間</label>
                  <input 
                    name="dailyfinish" 
                    type="number" 
                    placeholder="17" 
                    className={styles.input} 
                    min="0" 
                    max="23" 
                    value={formData.dailyfinish}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className={styles.inputGroup}>
                <label className={styles.label}>内容</label>
                <textarea 
                  name="content" 
                  placeholder="インターンの詳細内容を入力してください" 
                  className={styles.textarea} 
                  rows={4} 
                  value={formData.content}
                  onChange={handleChange}
                />
              </div>

              <div className={styles.inputGroup}>
                <label className={styles.label}>選考ステータス</label>
                <select 
                  name="selection" 
                  className={styles.select} 
                  value={formData.selection}
                  onChange={handleChange}
                >
                  <option value="">選択してください</option>
                  <option value="応募前">応募前</option>
                  <option value="書類選考">書類選考</option>
                  <option value="面接">面接</option>
                  <option value="合格">合格</option>
                  <option value="不合格">不合格</option>
                </select>
              </div>

              <div className={styles.inputGroup}>
                <label className={styles.label}>参加済み</label>
                <input 
                  name="joined" 
                  type="checkbox" 
                  className={styles.checkbox} 
                  checked={formData.joined}
                  onChange={handleChange}
                />
              </div>

              <button type="submit" className={styles.submitButton} disabled={loading}>
                {loading ? "追加中..." : "追加"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  )
}



