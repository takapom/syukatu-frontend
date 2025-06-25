// src/hooks/useCompanyList.ts
import { useState } from 'react';

interface CompanyListData {
  company: string;
  occupation: string;
  member: number;
  selection: string;
  intern: boolean;
}

interface UseCompanyListReturn {
  addCompanyList: (data: CompanyListData) => Promise<void>;
  error: string | null;
  resetError: () => void;
}

export const useCompanyList = (): UseCompanyListReturn => {
    //POSTを送信するだけなので今回はstateは不要
  const [error, setError] = useState<string | null>(null);

  const addCompanyList = async (data: CompanyListData) => {
    setError(null);

    try {
      const token = localStorage.getItem('token');
      if (!token) {
      throw new Error('ログインしてください！');
      }

      const response = await fetch('http://localhost:8080/company_lists', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(data)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || '企業情報の追加に失敗しました');
      }

      return await response.json();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '予期せぬエラーが発生しました';
      setError(errorMessage);
      throw err;
    }
  };

  const resetError = () => {
    setError(null);
  };

  return {
    addCompanyList,
    error,
    resetError,
  };
};