import cors from 'cors';

export const corsConfig = () => {
    return cors({
        origin: [
            "https://mastermind-registration-pwa.vercel.app",
            "http://localhost:5173",
            "http://127.0.0.1:5500"
        ],
        methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
        allowedHeaders: ["Content-Type", "Authorization"],
        credentials: true,
    });
};
