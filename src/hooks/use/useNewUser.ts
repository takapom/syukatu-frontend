import { useState } from 'react';
import { API_URL } from '@/lib/api';

interface NewUserData {
    email: string;
    password: string;
}

export const useNewUser = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);


    const createNewUser = async (userData: NewUserData) => {
        try{
            const res = await fetch(`${API_URL}/register`,{
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({email: userData.email, password: userData.password}),
            });
            if (!res.ok){
                throw new Error('ユーザー登録に失敗しました');
            }
            return res.json();
        }catch(err: unknown){
            if (err instanceof Error){
                throw new Error(err.message);
            }else{
                throw new Error('予期せぬエラーが発生しました');
            }
        }
    };
    return{
        email,
        password,
        loading,
        createNewUser,
        setEmail,
        setPassword,
        setLoading
    }
}