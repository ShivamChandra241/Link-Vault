import React, { createContext, useContext, useState, useEffect } from 'react';
import { VaultItem, AppSettings } from '../types';

interface VaultContextType {
  items: VaultItem[];
  settings: AppSettings;
  addItem: (item: Omit<VaultItem, 'id' | 'createdAt' | 'pinned' | 'completed'>) => void;
  updateItem: (id: string, updates: Partial<VaultItem>) => void;
  deleteItem: (id: string) => void;
  setApiKey: (key: string) => void;
  setAiEnabled: (enabled: boolean) => void;
}

const VaultContext = createContext<VaultContextType | undefined>(undefined);

export const VaultProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<VaultItem[]>(() => {
    const saved = localStorage.getItem('nv_vault_items');
    return saved ? JSON.parse(saved) : [];
  });

  const [settings, setSettings] = useState<AppSettings>(() => {
    const saved = localStorage.getItem('nv_vault_settings');
    return saved ? JSON.parse(saved) : { apiKey: '', aiEnabled: true };
  });

  useEffect(() => {
    localStorage.setItem('nv_vault_items', JSON.stringify(items));
  }, [items]);

  useEffect(() => {
    localStorage.setItem('nv_vault_settings', JSON.stringify(settings));
  }, [settings]);

  const addItem = (newItem: Omit<VaultItem, 'id' | 'createdAt' | 'pinned' | 'completed'>) => {
    const item: VaultItem = {
      ...newItem,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      pinned: false,
      completed: false,
    };
    setItems(prev => [item, ...prev]);
  };

  const updateItem = (id: string, updates: Partial<VaultItem>) => {
    setItems(prev => prev.map(item => item.id === id ? { ...item, ...updates } : item));
  };

  const deleteItem = (id: string) => {
    setItems(prev => prev.filter(item => item.id !== id));
  };

  const setApiKey = (apiKey: string) => {
    setSettings(prev => ({ ...prev, apiKey }));
  };

  const setAiEnabled = (aiEnabled: boolean) => {
    setSettings(prev => ({ ...prev, aiEnabled }));
  };

  return (
    <VaultContext.Provider value={{ items, settings, addItem, updateItem, deleteItem, setApiKey, setAiEnabled }}>
      {children}
    </VaultContext.Provider>
  );
};

export const useVault = () => {
  const context = useContext(VaultContext);
  if (!context) throw new Error('useVault must be used within a VaultProvider');
  return context;
};
