import { useState } from 'react';

export const useDifyAnalysis = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const analyzeText = async (prompt: string): Promise<string> => {
        setLoading(true);
        setError(null);

        try {
            // Dify APIのエンドポイントとAPIキーは環境変数から取得することを推奨
            const DIFY_API_URL = process.env.NEXT_PUBLIC_DIFY_API_URL || 'https://api.dify.ai/v1/completion-messages';
            const DIFY_API_KEY = process.env.NEXT_PUBLIC_DIFY_API_KEY || 'your-api-key';

            const response = await fetch(DIFY_API_URL, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${DIFY_API_KEY}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    inputs: {},
                    query: prompt,
                    response_mode: 'blocking',
                    user: 'job-hunter-app-user',
                }),
            });

            if (!response.ok) {
                throw new Error(`API Error: ${response.status}`);
            }

            const data = await response.json();
            
            // Dify APIのレスポンス形式に基づいて調整
            if (data.answer) {
                return data.answer;
            } else if (data.text) {
                return data.text;
            } else if (data.message) {
                return data.message;
            } else {
                throw new Error('予期しないレスポンス形式です');
            }
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : '分析中にエラーが発生しました';
            setError(errorMessage);
            throw new Error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    // モックレスポンスを返す関数（Dify APIが利用できない場合の開発用）
    const analyzeTextMock = async (prompt: string): Promise<string> => {
        setLoading(true);
        setError(null);

        try {
            // 1秒の遅延をシミュレート
            await new Promise(resolve => setTimeout(resolve, 1000));

            if (prompt.includes('自己分析')) {
                return `【自己分析結果】

あなたの文章から以下の強みと特徴を抽出しました：

1. リーダーシップ能力
   - チームを率いた経験があり、メンバーをまとめる力を持っています
   - 困難な状況でも前向きに取り組む姿勢が見られます

2. 技術力とコミュニケーション力のバランス
   - プログラミングスキルを持ちながら、チーム内での調整も得意としています
   - 技術的な課題を分かりやすく説明する能力があります

3. 成長意欲
   - 新しい技術や知識を積極的に学ぶ姿勢があります
   - 失敗から学び、改善につなげる力を持っています

【今後のアピールポイント】
- 具体的な成果や数値を交えて経験を説明すると、より説得力が増します
- チームで達成した成果と、その中でのあなたの具体的な貢献を明確にしましょう`;
            } else {
                return `【志望動機の改善案】

あなたの志望動機をより効果的にするための提案：

1. 企業研究の深化
   - 企業の理念や事業内容について、より具体的に言及しましょう
   - なぜその企業でなければならないのか、独自性を強調しましょう

2. 自身の経験との関連付け
   - あなたの経験やスキルが、どのように企業に貢献できるか具体的に説明しましょう
   - 過去の成功体験を交えて、実現可能性を示しましょう

3. 将来のビジョン
   - 入社後にどのような成長を遂げたいか明確にしましょう
   - 5年後、10年後のキャリアビジョンを描きましょう

【改善例】
「貴社の〇〇という理念に共感し」→「貴社が掲げる『顧客第一主義』という理念は、私が学生時代のプロジェクトで最も大切にしてきた価値観と一致しており...」`;
            }
        } catch {
            const errorMessage = '分析中にエラーが発生しました';
            setError(errorMessage);
            throw new Error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    // 実際のAPIが利用できない場合はモックを使用
    const useRealAPI = process.env.NEXT_PUBLIC_USE_REAL_DIFY === 'true';
    
    return {
        analyzeText: useRealAPI ? analyzeText : analyzeTextMock,
        loading,
        error,
    };
};