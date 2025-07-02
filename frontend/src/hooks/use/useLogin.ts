import { useState } from "react";
import { useRouter } from "next/navigation";
import { API_URL } from "@/lib/api";

export type LoginParams = {
    email: string;
    password: string;
}

export const useLogin = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleSubmit = async ({ email, password }: LoginParams): Promise<void> => {
        setLoading(true);
        setError('');
        
        try {
            const res = await fetch(`${API_URL}/login`, {
                method: "POST",
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });
            
            const data = await res.json();
            
            if (!res.ok) {
                throw new Error(data.error ?? 'ログインに失敗しました');
            }
            
            localStorage.setItem('token', data.token);
            localStorage.setItem('userId', data.user_id.toString());
            router.push('/companylists');
        } catch (err: unknown) {
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError(String(err));
            }
        } finally {
            setLoading(false);
        }
    };

    return {
        email,
        setEmail,
        password,
        setPassword,
        error,
        loading,
        handleSubmit
    };
};