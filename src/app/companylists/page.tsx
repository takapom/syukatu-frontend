"use client"

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import headerStyles from '@/styles/Header.module.css';
import { useCompanyList } from '@/hooks/input/useCompany';
import styles from '@/styles/list/companylistsinput.module.css';

interface CompanyListDate{
    company: string;
    occupation: string;
    member: number;
    selection: string;
    intern: boolean;
}

export default function InputCompanyList() {
    const router = useRouter();
    const {addCompanyList, error, resetError} = useCompanyList();
    const [formData, setFormData] = useState<CompanyListDate>({
        company: '',
        occupation: '',
        member: 1,
        selection: '',
        intern: false,
    });

    useEffect(() => {
        const checkToken = () => {
            const token = localStorage.getItem('token');
            if (!token) {
                router.push('/');
                return;
            }

            // JWTトークンをデコード
            try {
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

        // 初回チェック
        checkToken();

        // 5秒ごとにトークンをチェック
        const interval = setInterval(checkToken, 8000);

        // クリーンアップ
        return () => clearInterval(interval);
    }, [router]);

    //入力値の値を変更する関数かつバリデーション走らせる
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' 
                ? (e.target as HTMLInputElement).checked 
                : name === 'member'  // memberフィールドの場合
                    ? parseInt(value) || 1  // 数値に変換、無効な値の場合は1をデフォルト値として使用
                    : value
        }));
    };
    
    // 3. handleSubmit関数の修正
    const handleSubmit = async (date: CompanyListDate) => {
        try {
            // 送信前に数値型であることを確認(バリデーション)
            const submitData = {
                ...date,
                member: Number(date.member) || 1  // 確実に数値型に変換
            };
            await addCompanyList(submitData);
            alert("企業情報を追加しました！");
            router.push('/companylists');
        } catch (err: unknown) {
            if (err instanceof Error) {
                alert(err.message);
            } else {
                alert('予期せぬエラーが発生しました');
            }
        }
    };

    return (
        <>
            <Header />
            <div className={headerStyles.headerSpacer} />
            <div className={styles.background}>
                <div className={styles.container}>
                    <div className={styles.formCard}>
                        <h1 className={styles.title}>企業情報追加</h1>
                        {error && (
                            <div className={styles.errorAlert}>
                                <p>{error}</p>
                                <button 
                                    onClick={resetError}
                                    className={styles.closeButton}
                                >
                                    閉じる
                                </button>
                            </div>
                        )}
                        
                        <form onSubmit={(e) => {
                            e.preventDefault();
                            handleSubmit(formData);
                        }} className={styles.form}>
                            <div className={styles.inputGroup}>
                                <label htmlFor="company" className={styles.label}>
                                    企業名 <span className={styles.required}>*</span>
                                </label>
                                <input
                                    id="company"
                                    name="company"
                                    type="text"
                                    value={formData.company}
                                    onChange={handleChange}
                                    required
                                    className={styles.input}
                                />
                            </div>

                            <div className={styles.inputGroup}>
                                <label htmlFor="occupation" className={styles.label}>
                                    職種
                                </label>
                                <input
                                    id="occupation"
                                    name="occupation"
                                    type="text"
                                    value={formData.occupation}
                                    onChange={handleChange}
                                    className={styles.input}
                                />
                            </div>
                            
                            <div className={styles.inputGroup}>
                                <label htmlFor="member" className={styles.label}>
                                    人数 <span className={styles.required}>*</span>
                                </label>
                                <input
                                    id="member"
                                    name="member"
                                    type="number"
                                    value={formData.member}
                                    onChange={handleChange}
                                    required
                                    min="1"
                                    className={styles.input}
                                />
                            </div>

                            <div className={styles.inputGroup}>
                                <label htmlFor="selection" className={styles.label}>
                                    選考ステータス
                                </label>
                                <select
                                    id="selection"
                                    name="selection"
                                    value={formData.selection}
                                    onChange={handleChange}
                                    className={styles.select}
                                >
                                    <option value="">選択してください</option>
                                    <option value="一次面接">一次面接</option>
                                    <option value="二次面接">二次面接</option>
                                    <option value="最終面接">最終面接</option>
                                    <option value="内定">内定</option>
                                    <option value="不採用">不採用</option>
                                </select>
                            </div>
                            
                            <div className={styles.checkboxGroup}>
                                <input
                                    id="intern"
                                    name="intern"
                                    type="checkbox"
                                    checked={formData.intern}
                                    onChange={handleChange}
                                    className={styles.checkbox}
                                />
                                <label htmlFor="intern" className={styles.checkboxLabel}>
                                    インターン希望
                                </label>
                            </div>

                            <button
                                type="submit"
                                className={styles.submitButton}
                            >
                                確定
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
}
