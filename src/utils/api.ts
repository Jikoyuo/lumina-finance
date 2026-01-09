export const callGeminiAPI = async (prompt: string): Promise<string> => {
    const apiKey = import.meta.env.VITE_GEMINI_API_SECRET_KEY;

    if (!apiKey) {
        return "API Key belum disetting. Harap masukkan API Key Gemini di file .env";
    }

    try {
        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`,
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    contents: [{ parts: [{ text: prompt }] }],
                }),
            }
        );
        const data = await response.json();
        return (
            data.candidates?.[0]?.content?.parts?.[0]?.text ||
            "Signal interrupted. Please retry."
        );
    } catch (error) {
        console.error("Gemini API Error:", error);
        return "Connection error. Check network.";
    }
};
