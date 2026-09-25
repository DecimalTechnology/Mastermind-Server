import cors from 'cors';

export const corsConfig = () => {
    return cors({
        origin: '*',
        methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
        allowedHeaders: ["Content-Type", "Authorization"],
        credentials: true,
    });
};
