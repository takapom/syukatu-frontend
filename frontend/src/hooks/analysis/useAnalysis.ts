export const useAnalysis = () => {

    const FetchDate = async () => {
        try{
            const res = await fetch("http://localhost/v1");
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