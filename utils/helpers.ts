export function generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substring(2);
}

export function formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });
}

export function validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

export function validatePassword(password: string): boolean {
    return password.length >= 6;
}

export function getCategoryColor(category: string): string {
    const colors: Record<string, string> = {
        work: '#3B82F6',
        study: '#10B981',
        personal: '#F59E0B',
    };
    return colors[category] || '#6B7280';
}

export function getCategoryIcon(category: string): string {
    const icons: Record<string, string> = {
        work: 'briefcase',
        study: 'book',
        personal: 'person',
    };
    return icons[category] || 'document-text';
}
