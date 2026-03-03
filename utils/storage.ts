import AsyncStorage from '@react-native-async-storage/async-storage';

const USERS_KEY = '@notes_app_users';
const CURRENT_USER_KEY = '@notes_app_current_user';
const NOTES_KEY = '@notes_app_notes';
const LAST_EMAIL_KEY = '@notes_app_last_email';

export const StorageKeys = {
    USERS: USERS_KEY,
    CURRENT_USER: CURRENT_USER_KEY,
    NOTES: NOTES_KEY,
    LAST_EMAIL: LAST_EMAIL_KEY,
};

export const storage = {
    async get<T>(key: string): Promise<T | null> {
        try {
            const data = await AsyncStorage.getItem(key);
            return data ? JSON.parse(data) : null;
        } catch {
            return null;
        }
    },

    async set<T>(key: string, value: T): Promise<boolean> {
        try {
            await AsyncStorage.setItem(key, JSON.stringify(value));
            return true;
        } catch {
            return false;
        }
    },

    async remove(key: string): Promise<boolean> {
        try {
            await AsyncStorage.removeItem(key);
            return true;
        } catch {
            return false;
        }
    },

    async clear(): Promise<boolean> {
        try {
            await AsyncStorage.clear();
            return true;
        } catch {
            return false;
        }
    },
};
