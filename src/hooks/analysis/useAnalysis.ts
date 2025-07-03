import { API_URL } from '@/lib/api';

export const useAnalysis = () => {

    const FetchDate = async () => {
        try{
            const res = await fetch(`${API_URL}/v1`);
            if (!res.ok){
                throw new Error("Failed to fetch data");
            }
            const data = await res.json();
            return data;
        } catch (error) {
            console.error("Error fetching data:", error);
            throw error;
        }
    }
    return {
        FetchDate
    }
}