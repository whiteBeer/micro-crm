import type {UserState} from '@/types/user';
import type {ClientState} from '@/types/clients';
import type {Task, TaskState} from '@/types/tasks';

export interface RootState {
    user: UserState;
    clients: ClientState;
    tasks: TaskState;
}

export interface DraggableChangeEvent {
    added?: {
        element: Task;
    };
}