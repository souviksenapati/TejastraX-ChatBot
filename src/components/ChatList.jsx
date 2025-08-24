import React, { useState, useEffect } from 'react';
import { useMutation, useQuery } from '@apollo/client';
import { GET_CHATS_QUERY } from '../graphql/queries';
import { CREATE_CHAT_MUTATION, UPDATE_CHAT_TITLE_MUTATION, DELETE_CHAT_MUTATION } from '../graphql/mutations';
import { useSignOut, useUserData } from '@nhost/react';
import { Loader2, PlusCircle, MoreHorizontal, LogOut, Trash2, Pencil, Sun, Moon } from 'lucide-react';
import clsx from 'clsx';
import { Toaster, toast } from 'react-hot-toast';
import { Menu } from '@headlessui/react';
import { motion } from 'framer-motion';
import ConfirmationModal from './ConfirmationModal';
import Avatar from './Avatar';

// ---------------- Theme Toggle ----------------
const ThemeToggle = () => {
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'light');

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => setTheme(theme === 'light' ? 'dark' : 'light');

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-md text-gray-500 dark:text-muted-foreground 
                 hover:bg-gray-200 dark:hover:bg-accent hover:text-gray-800 dark:hover:text-accent-foreground 
                 transition-colors"
    >
      {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
    </button>
  );
};

// ---------------- Chat List ----------------
const ChatList = ({ selectedChatId, onSelectChat }) => {
  const { data, loading, error } = useQuery(GET_CHATS_QUERY);
  const userData = useUserData();
  const { signOut } = useSignOut();

  const [editingChatId, setEditingChatId] = useState(null);
  const [newTitle, setNewTitle] = useState('');
  const [chatToDelete, setChatToDelete] = useState(null);

  const [createChat, { loading: creatingChat }] = useMutation(CREATE_CHAT_MUTATION, {
    refetchQueries: [{ query: GET_CHATS_QUERY }],
    awaitRefetchQueries: true,
    onCompleted: (data) => {
      onSelectChat(data.insert_chats_one.id);
      toast.success('New chat created!');
    },
    onError: (err) => toast.error(`Error creating chat: ${err.message}`),
  });

  const [updateChatTitle] = useMutation(UPDATE_CHAT_TITLE_MUTATION, {
    onError: (err) => toast.error(`Error renaming chat: ${err.message}`),
  });

  const [deleteChat] = useMutation(DELETE_CHAT_MUTATION, {
    update(cache, { data: { delete_chats_by_pk } }) {
      cache.modify({
        fields: {
          chats(existingChats = [], { readField }) {
            return existingChats.filter(
              (chatRef) => delete_chats_by_pk.id !== readField('id', chatRef)
            );
          },
        },
      });
    },
    onCompleted: () => {
      if (selectedChatId === chatToDelete?.id) {
        onSelectChat(null);
      }
      toast.success('Chat deleted!');
      setChatToDelete(null);
    },
    onError: (err) => toast.error(`Error deleting chat: ${err.message}`),
  });

  // ---------------- Handlers ----------------
  const handleNewChat = () => {
    const newChatTitle = `New Chat - ${new Date().toLocaleTimeString()}`;
    createChat({ variables: { title: newChatTitle } });
  };

  const handleStartEditing = (chat) => {
    setEditingChatId(chat.id);
    setNewTitle(chat.title);
  };

  const handleTitleSubmit = (chatId) => {
    if (newTitle.trim()) {
      updateChatTitle({ variables: { id: chatId, title: newTitle } });
    }
    setEditingChatId(null);
  };

  const handleDeleteConfirm = () => {
    if (chatToDelete) {
      deleteChat({ variables: { id: chatToDelete.id } });
    }
  };

  // ---------------- Render States ----------------
  if (loading) {
    return (
      <div className="p-4 w-full max-w-xs bg-gray-50 dark:bg-secondary/50">
        <Loader2 className="animate-spin text-gray-400 dark:text-muted-foreground" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 w-full max-w-xs bg-gray-50 dark:bg-secondary/50 text-red-500 dark:text-destructive">
        Error: {error.message}
      </div>
    );
  }

  // ---------------- Main Render ----------------
  return (
    <>
      {/* Delete Confirmation */}
      <ConfirmationModal
        isOpen={!!chatToDelete}
        onClose={() => setChatToDelete(null)}
        onConfirm={handleDeleteConfirm}
        title="Delete Chat"
      >
        Are you sure you want to delete the chat "{chatToDelete?.title}"? This action cannot be undone.
      </ConfirmationModal>

  <div className="w-[280px] shrink-0 bg-white dark:bg-secondary/50 backdrop-blur-lg border-r border-gray-200 dark:border-border h-screen flex flex-col">
        <Toaster />

        {/* Header */}
        <div className="p-4 border-b border-gray-200 dark:border-border flex justify-between items-center flex-shrink-0">
          <button
            onClick={() => onSelectChat(null)}
            className="text-left text-lg font-semibold text-gray-900 dark:text-foreground hover:opacity-80 focus:outline-none"
            title="Go to Home"
          >
            TejastraX
          </button>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <button
              onClick={handleNewChat}
              disabled={creatingChat}
              className="p-2 rounded-md text-gray-500 dark:text-muted-foreground 
                         hover:bg-gray-200 dark:hover:bg-accent hover:text-gray-800 dark:hover:text-accent-foreground 
                         disabled:opacity-50 transition-colors"
            >
              {creatingChat ? <Loader2 className="animate-spin" /> : <PlusCircle size={20} />}
            </button>
          </div>
        </div>

        {/* Chat List */}
        <div className="overflow-y-auto flex-grow p-2">
          {data?.chats.map((chat) => (
            <div
              key={chat.id}
              onClick={() => editingChatId !== chat.id && onSelectChat(chat.id)}
              className={clsx(
                'group p-3 my-1 flex justify-between items-center cursor-pointer rounded-lg transition-all duration-200',
                {
                  'bg-gray-100 text-gray-900 dark:bg-blue-600 dark:text-white shadow-lg dark:animate-subtle-glow':
                    selectedChatId === chat.id && editingChatId !== chat.id,
                  'hover:bg-gray-100 dark:hover:bg-accent text-gray-800 dark:text-accent-foreground':
                    selectedChatId !== chat.id,
                }
              )}
            >
              {editingChatId === chat.id ? (
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  onBlur={() => handleTitleSubmit(chat.id)}
                  onKeyDown={(e) => e.key === 'Enter' && handleTitleSubmit(chat.id)}
                  autoFocus
                  className="w-full bg-transparent outline-none text-sm font-medium text-gray-800 dark:text-foreground"
                />
              ) : (
                <>
                  <p className="font-medium text-sm truncate">{chat.title}</p>
                  <div className="flex items-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleStartEditing(chat);
                      }}
                      className="p-1 rounded text-gray-500 dark:text-muted-foreground hover:bg-black/10 dark:hover:bg-white/10"
                    >
                      <Pencil size={14} />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setChatToDelete(chat);
                      }}
                      className="p-1 rounded text-red-500 hover:bg-black/10 dark:hover:bg-white/10"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>

        {/* User Menu */}
        <div className="p-2 border-t border-gray-200 dark:border-border flex-shrink-0">
          <Menu as="div" className="relative">
            <Menu.Button className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-accent transition-colors">
              <div className="flex items-center gap-2 overflow-hidden">
                <Avatar role="user" userData={userData} />
                <span className="text-sm font-medium text-gray-800 dark:text-foreground truncate">
                  {userData?.displayName || userData?.email}
                </span>
              </div>
              <MoreHorizontal size={20} className="text-gray-500 dark:text-muted-foreground" />
            </Menu.Button>
            <Menu.Items
              as={motion.div}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.1 }}
              className="absolute bottom-full left-0 mb-2 w-full origin-bottom-left bg-white dark:bg-secondary 
                         rounded-md shadow-lg ring-1 ring-black/5 dark:ring-border focus:outline-none z-10"
            >
              <div className="p-1">
                <Menu.Item>
                  {({ active }) => (
                    <button
                      onClick={signOut}
                      className={clsx(
                        'w-full flex items-center gap-3 px-3 py-2 text-sm rounded-md',
                        {
                          'bg-gray-100 dark:bg-accent text-gray-900 dark:text-accent-foreground': active,
                          'text-gray-700 dark:text-muted-foreground': !active,
                        }
                      )}
                    >
                      <LogOut size={16} />
                      Sign Out
                    </button>
                  )}
                </Menu.Item>
              </div>
            </Menu.Items>
          </Menu>
        </div>
      </div>
    </>
  );
};

export default ChatList;
