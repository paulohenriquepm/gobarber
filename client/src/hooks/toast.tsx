import React, { createContext, useContext, useCallback, useState } from 'react';
import { uuid } from 'uuidv4';

import Toast from '../components/ToastContainer';

export interface IToastMessage {
  id: string;
  type?: 'success' | 'error' | 'info';
  title: string;
  description?: string;
}

interface IToastContext {
  addToast(message: Omit<IToastMessage, 'id'>): void;
  removeToast(id: string): void;
}

const ToastContext = createContext<IToastContext>({} as IToastContext);

const ToastProvider: React.FC = ({ children }) => {
  const [messages, setMessages] = useState<IToastMessage[]>([]);

  const addToast = useCallback(
    ({ type, title, description }: Omit<IToastMessage, 'id'>) => {
      const id = uuid();

      const toast = {
        id,
        type,
        title,
        description,
      };

      setMessages((oldMessages) => [...oldMessages, toast]);
    },
    [],
  );

  const removeToast = useCallback((id: string) => {
    setMessages((oldMessages) =>
      oldMessages.filter((message) => message.id !== id),
    );
  }, []);

  return (
    <ToastContext.Provider value={{ addToast, removeToast }}>
      {children}
      <Toast messages={messages} />
    </ToastContext.Provider>
  );
};

function useToast(): IToastContext {
  const context = useContext(ToastContext);

  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }

  return context;
}

export { ToastProvider, useToast };
