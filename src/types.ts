export type ItemType = 'bookmark' | 'task' | 'note';
export type Priority = 'Low' | 'Medium' | 'High';
export type Category = 'Learning' | 'Work' | 'Finance' | 'Shopping' | 'Entertainment' | 'Personal';

export interface VaultItem {
  id: string;
  title: string;
  summary: string;
  source: string; // URL, text, or image path (base64 for now)
  sourceType: 'url' | 'text' | 'image';
  domain?: string;
  tags: string[];
  notes?: string;
  createdAt: string;
  priority: Priority;
  type: ItemType;
  category: Category;
  pinned: boolean;
  completed: boolean;
  dueDate?: string;
  imageUrl?: string;
}

export interface AppSettings {
  apiKey: string;
  aiEnabled: boolean;
}
