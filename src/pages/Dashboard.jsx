import React, { useEffect, useState } from 'react';
import ChatList from '../components/ChatList';
import MessageView from '../components/MessageView';
import { motion, AnimatePresence } from 'framer-motion';
import DeveloperCredit from '../components/DeveloperCredit';

const Dashboard = () => {
  const [selectedChatId, setSelectedChatId] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth > 768);
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 768);

  useEffect(() => {
    const onResize = () => setIsDesktop(window.innerWidth >= 768);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const sidebarWidth = 320; // ~20rem (ChatList max-w-xs)

  return (
    // The `h-[100svh]` class is the key fix for mobile browser height
  <div className="flex h-[100svh] w-full bg-white dark:bg-[#0d1117] overflow-hidden relative">
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div
            key="sidebar"
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'tween', ease: [0.22, 1, 0.36, 1], duration: 0.35 }}
            className="h-full absolute top-0 left-0 z-40"
            style={{ willChange: 'transform' }}
          >
            <ChatList 
              selectedChatId={selectedChatId} 
              onSelectChat={(chatId) => {
                setSelectedChatId(chatId);
                if (window.innerWidth < 768) {
                  setIsSidebarOpen(false);
                }
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>
      
      {isSidebarOpen && (
        <div 
          onClick={() => setIsSidebarOpen(false)} 
          className="fixed inset-0 bg-black/30 z-30 md:hidden"
        ></div>
      )}

      <motion.main
        className="flex-1 h-full flex flex-col"
        animate={{ paddingLeft: isSidebarOpen && isDesktop ? sidebarWidth : 0 }}
        transition={{ type: 'tween', ease: [0.22, 1, 0.36, 1], duration: 0.35 }}
        style={{ willChange: 'padding-left' }}
      >
        <MessageView 
          chatId={selectedChatId} 
          isSidebarOpen={isSidebarOpen}
          setIsSidebarOpen={setIsSidebarOpen}
          onSelectChat={setSelectedChatId}
        />
      </motion.main>
  <DeveloperCredit isSidebarOpen={isSidebarOpen} />
    </div>
  );
};

export default Dashboard;