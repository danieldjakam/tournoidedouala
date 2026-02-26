export type User = {
    id: number;
    prenom: string;
    nom: string;
    name?: string;
    email: string;
    avatar?: string;
    telephone: string;
    role?: 'user' | 'admin';
    points?: number;
    email_verified_at: string | null;
    two_factor_enabled?: boolean;
    created_at: string;
    updated_at: string;
    [key: string]: unknown;
};

export type Auth = {
    user: User;
};

export type TwoFactorSetupData = {
    svg: string;
    url: string;
};

export type TwoFactorSecretKey = {
    secretKey: string;
};
