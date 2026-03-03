import { Note } from '@/types';
import { formatDate, getCategoryColor } from '@/utils/helpers';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface NoteCardProps {
  note: Note;
  onPress: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

export function NoteCard({ note, onPress, onEdit, onDelete }: NoteCardProps) {
  const categoryColor = getCategoryColor(note.category);
  const categoryIcon =
    note.category === 'work'
      ? 'briefcase'
      : note.category === 'study'
      ? 'book'
      : 'person';

  return (
    <TouchableOpacity style={styles.container} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.header}>
        <View style={[styles.categoryBadge, { backgroundColor: categoryColor }]}>
          <Ionicons name={categoryIcon as any} size={12} color="#000000" />
          <Text style={styles.categoryText}>
            {note.category.charAt(0).toUpperCase() + note.category.slice(1)}
          </Text>
        </View>
        <View style={styles.actions}>
          <TouchableOpacity style={styles.actionButton} onPress={onEdit}>
            <Ionicons name="create-outline" size={18} color="#FFFFFF" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton} onPress={onDelete}>
            <Ionicons name="trash-outline" size={18} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </View>

      {note.title ? <Text style={styles.title} numberOfLines={1}>{note.title}</Text> : null}

      <Text style={styles.content} numberOfLines={3}>
        {note.content}
      </Text>

      <View style={styles.footer}>
        <View style={styles.dateContainer}>
          <Ionicons name="calendar-outline" size={14} color="#666666" />
          <Text style={styles.dateText}>{formatDate(note.createdAt)}</Text>
        </View>
        {note.updatedAt ? (
          <View style={styles.updatedContainer}>
            <Ionicons name="time-outline" size={14} color="#999999" />
            <Text style={styles.updatedText}>Edited</Text>
          </View>
        ) : null}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#111111',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#333333',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  categoryBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 12,
  },
  categoryText: {
    color: '#000000',
    fontSize: 11,
    fontWeight: '600',
  },
  actions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: '#1A1A1A',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  content: {
    fontSize: 14,
    color: '#999999',
    lineHeight: 20,
    marginBottom: 12,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#333333',
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  dateText: {
    color: '#666666',
    fontSize: 12,
  },
  updatedContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  updatedText: {
    color: '#999999',
    fontSize: 12,
    fontWeight: '500',
  },
});
