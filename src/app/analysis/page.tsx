"use client"

import Header from "@/components/Header"
import headerStyles from "@/styles/Header.module.css"
import styles from "@/styles/analysis/analysis.module.css"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useDifyAnalysis } from "@/hooks/use/useDifyAnalysis"

type AnalysisType = 'self' | 'motivation'

export default function Analysis() {
  const router = useRouter()
  const { analyzeText, loading, error } = useDifyAnalysis()
  const [analysisType, setAnalysisType] = useState<AnalysisType>('self')
  const [inputText, setInputText] = useState('')
  const [result, setResult] = useState<string>('')
  const [history, setHistory] = useState<{ type: AnalysisType, input: string, result: string }[]>([])

  useEffect(() => {
    // トークンチェック
    const checkToken = () => {
      const token = localStorage.getItem('token')
      if (!token) {
        router.push('/')
        return
      }

      try {
        const payload = JSON.parse(atob(token.split('.')[1]))
        const expirationTime = payload.exp * 1000
        
        if (Date.now() >= expirationTime) {
          localStorage.removeItem('token')
          router.push('/')
        }
      } catch {
        localStorage.removeItem('token')
        router.push('/')
      }
    }

    checkToken()

    // 履歴の読み込み
    const savedHistory = localStorage.getItem('analysisHistory')
    if (savedHistory) {
      setHistory(JSON.parse(savedHistory))
    }
  }, [router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!inputText.trim()) {
      alert('テキストを入力してください')
      return
    }

    try {
      const prompt = analysisType === 'self' 
        ? `以下の内容から自己分析を行い、強みや特徴を整理してください：\n${inputText}`
        : `以下の内容から志望動機を整理し、より説得力のある形にしてください：\n${inputText}`

      const response = await analyzeText(prompt)
      setResult(response)

      // 履歴に追加
      const newEntry = { type: analysisType, input: inputText, result: response }
      const newHistory = [...history, newEntry].slice(-5) // 最新5件のみ保持
      setHistory(newHistory)
      localStorage.setItem('analysisHistory', JSON.stringify(newHistory))
    } catch (err) {
      console.error('Analysis error:', err)
      alert(err instanceof Error ? err.message : '分析中にエラーが発生しました')
    }
  }

  const handleClear = () => {
    setInputText('')
    setResult('')
  }

  const handleHistorySelect = (item: typeof history[0]) => {
    setAnalysisType(item.type)
    setInputText(item.input)
    setResult(item.result)
  }

  return (
    <>
      <Header />
      <div className={headerStyles.headerSpacer} />
      <div className={styles.background}>
        <div className={styles.container}>
          <div className={styles.mainCard}>
            <h1 className={styles.title}>自己分析・志望動機作成</h1>
            <p className={styles.subtitle}>
              あなたの経験や思いを整理して、効果的な自己PRや志望動機を作成しましょう
            </p>

            <div className={styles.typeSelector}>
              <button
                className={`${styles.typeButton} ${analysisType === 'self' ? styles.active : ''}`}
                onClick={() => setAnalysisType('self')}
              >
                自己分析
              </button>
              <button
                className={`${styles.typeButton} ${analysisType === 'motivation' ? styles.active : ''}`}
                onClick={() => setAnalysisType('motivation')}
              >
                志望動機
              </button>
            </div>

            <form onSubmit={handleSubmit} className={styles.form}>
              <div className={styles.inputSection}>
                <label className={styles.label}>
                  {analysisType === 'self' 
                    ? 'あなたの経験、強み、価値観などを自由に書いてください'
                    : '志望する企業や職種、その理由を自由に書いてください'
                  }
                </label>
                <textarea
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  className={styles.textarea}
                  placeholder={
                    analysisType === 'self'
                      ? '例：大学時代はプログラミングサークルでWebアプリケーションを開発していました。チームリーダーとして...'
                      : '例：貴社の〇〇という理念に共感し、私の△△という経験を活かして...'
                  }
                  rows={8}
                />
              </div>

              <div className={styles.buttonGroup}>
                <button
                  type="submit"
                  disabled={loading || !inputText.trim()}
                  className={`${styles.button} ${styles.primaryButton}`}
                >
                  {loading ? '分析中...' : '分析する'}
                </button>
                <button
                  type="button"
                  onClick={handleClear}
                  className={`${styles.button} ${styles.secondaryButton}`}
                >
                  クリア
                </button>
              </div>
            </form>

            {error && (
              <div className={styles.errorMessage}>
                {error}
              </div>
            )}

            {result && (
              <div className={styles.resultSection}>
                <h2 className={styles.resultTitle}>分析結果</h2>
                <div className={styles.resultContent}>
                  {result.split('\n').map((line, index) => (
                    <p key={index} className={styles.resultLine}>
                      {line}
                    </p>
                  ))}
                </div>
              </div>
            )}

            {history.length > 0 && (
              <div className={styles.historySection}>
                <h3 className={styles.historyTitle}>最近の分析履歴</h3>
                <div className={styles.historyList}>
                  {history.map((item, index) => (
                    <button
                      key={index}
                      onClick={() => handleHistorySelect(item)}
                      className={styles.historyItem}
                    >
                      <span className={styles.historyType}>
                        {item.type === 'self' ? '自己分析' : '志望動機'}
                      </span>
                      <span className={styles.historyPreview}>
                        {item.input.substring(0, 30)}...
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className={styles.tips}>
              <h3 className={styles.tipsTitle}>💡 効果的な分析のコツ</h3>
              <ul className={styles.tipsList}>
                <li>具体的なエピソードや数字を含めましょう</li>
                <li>自分の感情や思考プロセスも記述しましょう</li>
                <li>成功体験だけでなく、失敗から学んだことも書きましょう</li>
                <li>なぜその経験が重要だったのかを説明しましょう</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}