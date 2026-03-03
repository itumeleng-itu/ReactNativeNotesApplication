import { NoteCard } from '@/components/NoteCard';
import { useNotes } from '@/context/NotesContext';
import { Note, SortOrder } from '@/types';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useMemo, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    FlatList,
    Platform,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

export default function WorkScreen() {
  const router = useRouter();
  const { notes, isLoading, deleteNote, getNotesByCategory } = useNotes();
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');

  const workNotes = useMemo(() => {
    const categoryNotes = getNotesByCategory('work');
    return [...categoryNotes].sort((a, b) => {
      const dateA = new Date(a.createdAt).getTime();
      const dateB = new Date(b.createdAt).getTime();
      return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
    });
  }, [notes, sortOrder]);

  function handleNotePress(note: Note) {
    router.push({ pathname: '/note-detail', params: { id: note.id } });
  }

  function handleEditNote(note: Note) {
    router.push({ pathname: '/note-editor', params: { id: note.id } });
  }

  function handleDeleteNote(note: Note) {
    Alert.alert(
      'Delete Note',
      'Are you sure you want to delete this note?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => deleteNote(note.id),
        },
      ]
    );
  }

  function toggleSortOrder() {
    setSortOrder((prev) => (prev === 'desc' ? 'asc' : 'desc'));
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <View style={styles.iconContainer}>
            <Ionicons name="briefcase" size={24} color="#000000" />
          </View>
          <View style={styles.headerText}>
            <Text style={styles.title}>Work Notes</Text>
            <Text style={styles.subtitle}>
              {workNotes.length} {workNotes.length === 1 ? 'note' : 'notes'}
            </Text>
          </View>
        </View>

        <TouchableOpacity style={styles.sortButton} onPress={toggleSortOrder}>
          <Ionicons
            name={sortOrder === 'desc' ? 'arrow-down' : 'arrow-up'}
            size={18}
            color="#FFFFFF"
          />
          <Text style={styles.sortButtonText}>
            {sortOrder === 'desc' ? 'Newest' : 'Oldest'}
          </Text>
        </TouchableOpacity>
      </View>

      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#FFFFFF" />
        </View>
      ) : workNotes.length === 0 ? (
        <View style={styles.emptyContainer}>
          <View style={styles.emptyIconContainer}>
            <Ionicons name="briefcase-outline" size={64} color="#FFFFFF" />
          </View>
          <Text style={styles.emptyTitle}>No work notes yet</Text>
          <Text style={styles.emptySubtitle}>
            Create a new note and select the Work category
          </Text>
          <TouchableOpacity
            style={styles.createButton}
            onPress={() => router.push('/note-editor')}
          >
            <Ionicons name="add" size={20} color="#000000" />
            <Text style={styles.createButtonText}>Create Note</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={workNotes}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <NoteCard
              note={item}
              onPress={() => handleNotePress(item)}
              onEdit={() => handleEditNote(item)}
              onDelete={() => handleDeleteNote(item)}
            />
          )}
        />
      )}

      <TouchableOpacity
        style={styles.fab}
        onPress={() => router.push('/note-editor')}
      >
        <Ionicons name="add" size={28} color="#000000" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingBottom: 16,
    backgroundColor: '#111111',
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerText: {
    gap: 2,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  subtitle: {
    fontSize: 14,
    color: '#999999',
  },
  sortButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#1A1A1A',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#333333',
  },
  sortButtonText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '600',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  emptyIconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#111111',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#333333',
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#999999',
    textAlign: 'center',
    marginBottom: 24,
  },
  createButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#FFFFFF',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
  },
  createButtonText: {
    color: '#000000',
    fontSize: 16,
    fontWeight: '600',
  },
  listContent: {
    padding: 16,
    paddingBottom: 100,
  },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
  },
});
