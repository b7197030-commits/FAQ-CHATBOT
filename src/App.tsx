/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Send, Bot, User, Loader2, X, MessageSquare, ChevronDown, Globe, Smartphone, Laptop } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { getChatSession } from './services/gemini';
import { cn } from './lib/utils';

interface Message {
  role: 'user' | 'model';
  text: string;
  id: string;
}

const SYSTEM_INSTRUCTION = `
You are a helpful and professional FAQ Chatbot. 
Your goal is to provide clear, concise, and accurate answers to user questions.
If you don't know the answer, politely say so and offer to connect them with a human representative.
Keep your tone friendly and supportive.
You are designed to work across web, mobile, and desktop platforms.
`;

export default function App() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'model',
      text: "Hello! I'm your FAQ assistant. How can I help you today?",
      id: 'initial-msg'
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(true);
  const chatRef = useRef<any>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!chatRef.current) {
      chatRef.current = getChatSession(SYSTEM_INSTRUCTION);
    }
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      role: 'user',
      text: input,
      id: Date.now().toString()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const result = await chatRef.current.sendMessage({ message: input });
      const botMessage: Message = {
        role: 'model',
        text: result.text || "I'm sorry, I couldn't process that request.",
        id: (Date.now() + 1).toString()
      };
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error("Error sending message:", error);
      setMessages(prev => [...prev, {
        role: 'model',
        text: "Sorry, I encountered an error. Please try again later.",
        id: (Date.now() + 1).toString()
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] font-sans text-[#202124] selection:bg-blue-100">
      {/* Hero Section */}
      <header className="px-6 py-12 md:py-24 max-w-7xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
            Intelligent FAQ Support <br />
            <span className="text-blue-600">Everywhere You Are</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto mb-10">
            Our AI-powered chatbot provides instant, accurate answers across web, mobile, and desktop. 
            Seamless integration, zero friction.
          </p>
          
          <div className="flex flex-wrap justify-center gap-8 text-gray-400">
            <div className="flex items-center gap-2">
              <Globe size={20} />
              <span className="text-sm font-medium uppercase tracking-wider">Web</span>
            </div>
            <div className="flex items-center gap-2">
              <Smartphone size={20} />
              <span className="text-sm font-medium uppercase tracking-wider">Mobile</span>
            </div>
            <div className="flex items-center gap-2">
              <Laptop size={20} />
              <span className="text-sm font-medium uppercase tracking-wider">Desktop</span>
            </div>
          </div>
        </motion.div>
      </header>

      {/* Main Content / Features */}
      <main className="max-w-7xl mx-auto px-6 pb-24">
        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              title: "Instant Responses",
              desc: "No more waiting in queues. Get answers to common questions in milliseconds.",
              icon: <Bot className="text-blue-600" />
            },
            {
              title: "Platform Agnostic",
              desc: "Works seamlessly as a widget, a standalone page, or embedded in your native apps.",
              icon: <Globe className="text-blue-600" />
            },
            {
              title: "AI Powered",
              desc: "Leverages Gemini 3 Flash for high-speed, accurate, and context-aware conversations.",
              icon: <MessageSquare className="text-blue-600" />
            }
          ].map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + i * 0.1 }}
              className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center mb-6">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
              <p className="text-gray-600 leading-relaxed">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </main>

      {/* Chat Widget */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20, transformOrigin: 'bottom right' }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="w-[90vw] sm:w-[400px] h-[600px] max-h-[80vh] bg-white rounded-3xl shadow-2xl border border-gray-100 flex flex-col overflow-hidden mb-4"
            >
              {/* Chat Header */}
              <div className="bg-blue-600 p-5 text-white flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                    <Bot size={24} />
                  </div>
                  <div>
                    <h2 className="font-semibold text-lg leading-tight">FAQ Assistant</h2>
                    <div className="flex items-center gap-1.5">
                      <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                      <span className="text-xs text-blue-100">Online</span>
                    </div>
                  </div>
                </div>
                <button 
                  onClick={() => setIsOpen(false)}
                  className="p-2 hover:bg-white/10 rounded-full transition-colors"
                >
                  <ChevronDown size={24} />
                </button>
              </div>

              {/* Chat Messages */}
              <div 
                ref={scrollRef}
                className="flex-1 overflow-y-auto p-5 space-y-4 scroll-smooth"
              >
                {messages.map((msg) => (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, x: msg.role === 'user' ? 10 : -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className={cn(
                      "flex gap-3 max-w-[85%]",
                      msg.role === 'user' ? "ml-auto flex-row-reverse" : "mr-auto"
                    )}
                  >
                    <div className={cn(
                      "w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-1",
                      msg.role === 'user' ? "bg-blue-100 text-blue-600" : "bg-gray-100 text-gray-600"
                    )}>
                      {msg.role === 'user' ? <User size={16} /> : <Bot size={16} />}
                    </div>
                    <div className={cn(
                      "p-3.5 rounded-2xl text-sm leading-relaxed",
                      msg.role === 'user' 
                        ? "bg-blue-600 text-white rounded-tr-none" 
                        : "bg-gray-100 text-gray-800 rounded-tl-none"
                    )}>
                      <div className="prose prose-sm prose-invert max-w-none">
                        <ReactMarkdown>{msg.text}</ReactMarkdown>
                      </div>
                    </div>
                  </motion.div>
                ))}
                {isLoading && (
                  <div className="flex gap-3 mr-auto max-w-[85%]">
                    <div className="w-8 h-8 rounded-full bg-gray-100 text-gray-600 flex items-center justify-center flex-shrink-0">
                      <Bot size={16} />
                    </div>
                    <div className="bg-gray-100 p-3.5 rounded-2xl rounded-tl-none flex items-center gap-2">
                      <Loader2 size={16} className="animate-spin text-gray-400" />
                      <span className="text-xs text-gray-400 font-medium">Thinking...</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Chat Input */}
              <div className="p-4 border-t border-gray-100 bg-gray-50/50">
                <div className="relative flex items-center">
                  <textarea
                    rows={1}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyPress}
                    placeholder="Type your question..."
                    className="w-full bg-white border border-gray-200 rounded-2xl py-3 px-4 pr-12 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all resize-none"
                  />
                  <button
                    onClick={handleSend}
                    disabled={!input.trim() || isLoading}
                    className="absolute right-2 p-2 text-blue-600 hover:bg-blue-50 rounded-xl disabled:opacity-50 disabled:hover:bg-transparent transition-all"
                  >
                    <Send size={20} />
                  </button>
                </div>
                <p className="text-[10px] text-center text-gray-400 mt-3">
                  Powered by Google Gemini AI
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsOpen(!isOpen)}
          className={cn(
            "w-16 h-16 rounded-full shadow-xl flex items-center justify-center transition-all duration-300",
            isOpen ? "bg-white text-gray-600 rotate-90" : "bg-blue-600 text-white"
          )}
        >
          {isOpen ? <X size={28} /> : <MessageSquare size={28} />}
        </motion.button>
      </div>
    </div>
  );
}
