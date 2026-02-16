export interface Client {
    _id: string;
    name: string;
    email: string | null;
    phone: string | null;
    company: string | null;
    notes: string | null;
    status: 'active' | 'inactive' | 'lead';
    managerId: string;
    createdAt: string;
    updatedAt: string;
}

export interface ClientState {
    clients: Client[];
    total: number;
    skip: number;
    limit: number;
    search: string;
    loading: boolean;
    error: string | null;
}

export interface ClientInput {
    name: string;
    email?: string;
    phone?: string;
    company?: string;
    notes?: string;
    status: 'active' | 'inactive' | 'lead';
}