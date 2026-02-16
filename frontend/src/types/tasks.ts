export interface Task {
    _id: string;
    title: string;
    description: string | null;
    status: 'pending' | 'in_progress' | 'completed';
    priority: 'low' | 'medium' | 'high';
    dueDate: string | null;
    client: {
        _id: string,
        name?: string
    };
    assigneeId: string;
    createdAt: string;
    updatedAt: string;
}

export interface TaskEdit extends Task {
    clientId: string;
}

export interface TaskState {
    tasks: Task[];
    total: number;
    skip: number;
    limit: number;
    search: string;
    loading: boolean;
    error: string | null;
}

export interface TaskInput {
    title: string;
    description?: string;
    status: 'pending' | 'in_progress' | 'completed';
    priority: 'low' | 'medium' | 'high';
    dueDate?: string;
}