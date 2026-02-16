import type {UserState} from '@/types/user';
import type {ClientState} from '@/types/clients';
import type {TaskState} from '@/types/tasks';

export interface RootState {
    user: UserState;
    clients: ClientState;
    tasks: TaskState;
}