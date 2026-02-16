export const getStatusColor = (status: string) => {
    switch (status) {
        case 'pending': return 'orange';
        case 'in_progress': return 'blue';
        case 'completed': return 'green';
        default: return 'grey';
    }
};