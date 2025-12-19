import { Note, NoteCategory, NotesContextType } from '@/types';
import { generateId } from '@/utils/helpers';
import { storage, StorageKeys } from '@/utils/storage';
import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { useAuth } from './AuthContext';

const NotesContext = createContext<NotesContextType | undefined>(undefined);

export function NotesProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [notes, setNotes] = useState<Note[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadNotes();
    } else {
      setNotes([]);
      setIsLoading(false);
    }
  }, [user]);

  async function loadNotes() {
    try {
      setIsLoading(true);
      const allNotes = await storage.get<Note[]>(StorageKeys.NOTES) || [];
      const userNotes = allNotes.filter((note) => note.userId === user?.id);
      setNotes(userNotes);
    } finally {
      setIsLoading(false);
    }
  }

  async function addNote(
    noteData: Omit<Note, 'id' | 'userId' | 'createdAt' | 'updatedAt'>
  ): Promise<boolean> {
    if (!user) return false;

    try {
      const newNote: Note = {
        id: generateId(),
        userId: user.id,
        ...noteData,
        createdAt: new Date().toISOString(),
        updatedAt: null,
      };

      const allNotes = await storage.get<Note[]>(StorageKeys.NOTES) || [];
      allNotes.push(newNote);
      await storage.set(StorageKeys.NOTES, allNotes);
      setNotes((prev) => [...prev, newNote]);
      return true;
    } catch {
      return false;
    }
  }

  async function updateNote(
    id: string,
    updates: Partial<Omit<Note, 'id' | 'userId' | 'createdAt'>>
  ): Promise<boolean> {
    if (!user) return false;

    try {
      const allNotes = await storage.get<Note[]>(StorageKeys.NOTES) || [];
      const noteIndex = allNotes.findIndex((n) => n.id === id && n.userId === user.id);

      if (noteIndex === -1) return false;

      allNotes[noteIndex] = {
        ...allNotes[noteIndex],
        ...updates,
        updatedAt: new Date().toISOString(),
      };

      await storage.set(StorageKeys.NOTES, allNotes);
      setNotes((prev) =>
        prev.map((note) =>
          note.id === id
            ? { ...note, ...updates, updatedAt: new Date().toISOString() }
            : note
        )
      );
      return true;
    } catch {
      return false;
    }
  }

  async function deleteNote(id: string): Promise<boolean> {
    if (!user) return false;

    try {
      const allNotes = await storage.get<Note[]>(StorageKeys.NOTES) || [];
      const filteredNotes = allNotes.filter((n) => !(n.id === id && n.userId === user.id));

      if (filteredNotes.length === allNotes.length) return false;

      await storage.set(StorageKeys.NOTES, filteredNotes);
      setNotes((prev) => prev.filter((note) => note.id !== id));
      return true;
    } catch {
      return false;
    }
  }

  function searchNotes(query: string): Note[] {
    if (!query.trim()) return notes;

    const searchTerms = query.toLowerCase().split(' ').filter(Boolean);
    return notes.filter((note) => {
      const searchText = `${note.title} ${note.content}`.toLowerCase();
      return searchTerms.some((term) => searchText.includes(term));
    });
  }

  function sortNotes(order: 'asc' | 'desc'): Note[] {
    return [...notes].sort((a, b) => {
      const dateA = new Date(a.createdAt).getTime();
      const dateB = new Date(b.createdAt).getTime();
      return order === 'asc' ? dateA - dateB : dateB - dateA;
    });
  }

  function getNotesByCategory(category: NoteCategory): Note[] {
    return notes.filter((note) => note.category === category);
  }

  return (
    <NotesContext.Provider
      value={{
        notes,
        isLoading,
        addNote,
        updateNote,
        deleteNote,
        searchNotes,
        sortNotes,
        getNotesByCategory,
      }}
    >
      {children}
    </NotesContext.Provider>
  );
}

export function useNotes() {
  const context = useContext(NotesContext);
  if (context === undefined) {
    throw new Error('useNotes must be used within a NotesProvider');
  }
  return context;
}
