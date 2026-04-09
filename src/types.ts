export interface VaultItem {
  id: string;
  title: string;
  summary: string;
  source: string;
  sourceType: 'url' | 'text' | 'image';
  tags: string[];
  notes?: string;
  createdAt: string;
  priority: 'Low' | 'Medium' | 'High';
  type: 'bookmark' | 'task' | 'note';
  category: string;
  pinned: boolean;
  completed: boolean;
  dueDate?: string;
  imageUrl?: string;
}

export interface AppSettings {
  apiKey: string;
  aiEnabled: boolean;
}
