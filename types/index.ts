export interface User {
    id: string;
    email: string;
    username: string;
    password: string;
    createdAt: string;
}

export interface Note {
    id: string;
    userId: string;
    title: string;
    content: string;
    category: NoteCategory;
    createdAt: string;
    updatedAt: string | null;
}

export type NoteCategory = 'work' | 'study' | 'personal';

export interface AuthContextType {
    user: User | null;
    isLoading: boolean;
    login: (email: string, password: string) => Promise<boolean>;
    register: (email: string, password: string, username: string) => Promise<boolean>;
    logout: () => Promise<void>;
    updateProfile: (updates: Partial<Pick<User, 'email' | 'username' | 'password'>>) => Promise<boolean>;
}

export interface NotesContextType {
    notes: Note[];
    isLoading: boolean;
    addNote: (note: Omit<Note, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => Promise<boolean>;
    updateNote: (id: string, updates: Partial<Omit<Note, 'id' | 'userId' | 'createdAt'>>) => Promise<boolean>;
    deleteNote: (id: string) => Promise<boolean>;
    searchNotes: (query: string) => Note[];
    sortNotes: (order: 'asc' | 'desc') => Note[];
    getNotesByCategory: (category: NoteCategory) => Note[];
}

export type SortOrder = 'asc' | 'desc';
