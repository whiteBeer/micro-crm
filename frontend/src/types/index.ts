import type {UserState} from '@/types/user';
import type {ClientState} from '@/types/clients';

export interface RootState {
    user: UserState;
    clients: ClientState;
}