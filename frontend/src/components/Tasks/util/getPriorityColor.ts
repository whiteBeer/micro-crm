export const getPriorityColor = (priority: string) => {
    switch (priority) {
        case 'low': return 'grey';
        case 'medium': return 'orange';
        case 'high': return 'red';
        default: return 'grey';
    }
};