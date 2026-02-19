'use client';

// ============================================================
// FILE: frontend/src/components/ChatBot.tsx  (NEW FILE)
//
// PURPOSE: Floating chat bubble that appears on every page
//
// HOW IT WORKS:
//   1. A floating 🍔 button sits in the bottom-right corner
//   2. User clicks it → chat window slides up
//   3. User types a question and sends it
//   4. Frontend sends message + conversation history to backend
//   5. Backend fetches real menu data + calls Claude AI
//   6. AI reply appears in the chat window
//   7. Conversation history is kept in state so Claude remembers context
//
// REACT CONCEPTS USED:
//   - useState: stores messages, input text, loading state
//   - useEffect: auto-scrolls to bottom when new messages arrive
//   - useRef: references the messages container for scrolling
// ============================================================

import { useState, useEffect, useRef } from 'react';
import { PaperAirplaneIcon, XMarkIcon } from '@heroicons/react/24/outline';

// ── Types ─────────────────────────────────────────────────────
// A single chat message — either from the user or the AI
interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

// Suggested questions shown when chat first opens
const SUGGESTIONS = [
  '🥗 Show me vegetarian meals',
  '💰 What meals are under $10?',
  '🌶️ Any spicy options?',
  '⚡ Fastest meals to prepare?',
  '🍕 What categories do you have?',
];

export default function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [hasNewMessage, setHasNewMessage] = useState(false); // For the notification dot

  // useRef to scroll to bottom of messages
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll to bottom whenever new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Auto-focus input when chat opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
      setHasNewMessage(false);
    }
  }, [isOpen]);

  // Show welcome message when first opened
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages([{
        role: 'assistant',
        content: "Hey there! 👋 I'm FoodHub Assistant. I can help you find meals, answer questions about our menu, dietary options, prices, and more!\n\nWhat can I help you with today?",
        timestamp: new Date(),
      }]);
    }
  }, [isOpen, messages.length]);

  // ── Send message function ──────────────────────────────────
  const sendMessage = async (text?: string) => {
    const messageText = text || input.trim();
    if (!messageText || loading) return;

    // Add user message to chat immediately (optimistic update)
    const userMessage: Message = {
      role: 'user',
      content: messageText,
      timestamp: new Date(),
    };

    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInput('');
    setLoading(true);

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

      // Send message + full conversation history to backend
      // History lets Claude remember context (e.g., "what was that first meal?")
      const response = await fetch(`${apiUrl}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: messageText,
          // Only send role+content (not timestamps) — that's what Claude expects
          conversationHistory: updatedMessages
            .slice(0, -1) // exclude the message we just added (sent separately)
            .map((m) => ({ role: m.role, content: m.content })),
        }),
      });

      const data = await response.json();

      // Add AI reply to chat
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: data.success
            ? data.reply
            : (data.message || 'Sorry, something went wrong. Please try again.'),
          timestamp: new Date(),
        },
      ]);

      // If chat is closed, show notification dot
      if (!isOpen) setHasNewMessage(true);

    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: '⚠️ Could not connect to the assistant. Make sure your backend is running.',
          timestamp: new Date(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  // ── Render ─────────────────────────────────────────────────
  return (
    <>
      {/* ── Floating Chat Button ─────────────────────────── */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full shadow-lg flex items-center justify-center transition-all duration-300 ${
          isOpen
            ? 'bg-gray-700 dark:bg-gray-600 rotate-0 scale-95'
            : 'bg-primary-600 hover:bg-primary-700 hover:scale-110'
        }`}
        aria-label="Open chat assistant"
      >
        {isOpen ? (
          <XMarkIcon className="h-6 w-6 text-white" />
        ) : (
          <span className="text-2xl">🍔</span>
        )}

        {/* Notification dot — shows when there's a new message and chat is closed */}
        {hasNewMessage && !isOpen && (
          <span className="absolute top-0 right-0 w-3 h-3 bg-red-500 rounded-full border-2 border-white" />
        )}
      </button>

      {/* ── Chat Window ──────────────────────────────────── */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 z-50 w-80 sm:w-96 flex flex-col rounded-2xl shadow-2xl overflow-hidden border border-gray-200 dark:border-gray-700 transition-all duration-300"
          style={{ maxHeight: '520px', height: '520px' }}
        >
          {/* Header */}
          <div className="bg-primary-600 px-4 py-3 flex items-center gap-3 flex-shrink-0">
            <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center text-lg">
              🍔
            </div>
            <div className="flex-1">
              <p className="font-semibold text-white text-sm">FoodHub Assistant</p>
              <p className="text-primary-200 text-xs flex items-center gap-1">
                <span className="w-1.5 h-1.5 bg-green-400 rounded-full inline-block" />
                Online • Powered by Claude AI
              </p>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white/70 hover:text-white transition-colors p-1"
            >
              <XMarkIcon className="h-5 w-5" />
            </button>
          </div>

          {/* Messages area */}
          <div className="flex-1 overflow-y-auto bg-gray-50 dark:bg-gray-900 p-4 space-y-3">

            {/* Messages */}
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {/* AI avatar */}
                {msg.role === 'assistant' && (
                  <div className="w-7 h-7 rounded-full bg-primary-100 dark:bg-primary-900/40 flex items-center justify-center text-sm mr-2 flex-shrink-0 mt-1">
                    🍔
                  </div>
                )}

                <div
                  className={`max-w-[80%] rounded-2xl px-3 py-2 text-sm leading-relaxed ${
                    msg.role === 'user'
                      ? 'bg-primary-600 text-white rounded-tr-sm'
                      : 'bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 shadow-sm rounded-tl-sm border border-gray-100 dark:border-gray-700'
                  }`}
                >
                  {/* Render newlines as line breaks */}
                  {msg.content.split('\n').map((line, j) => (
                    <span key={j}>
                      {line}
                      {j < msg.content.split('\n').length - 1 && <br />}
                    </span>
                  ))}
                  <p className={`text-xs mt-1 ${
                    msg.role === 'user' ? 'text-primary-200' : 'text-gray-400 dark:text-gray-500'
                  }`}>
                    {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            ))}

            {/* Typing indicator — shown while waiting for AI response */}
            {loading && (
              <div className="flex justify-start">
                <div className="w-7 h-7 rounded-full bg-primary-100 dark:bg-primary-900/40 flex items-center justify-center text-sm mr-2 flex-shrink-0">
                  🍔
                </div>
                <div className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm">
                  <div className="flex gap-1 items-center">
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              </div>
            )}

            {/* Suggestion chips — shown only before user sends first message */}
            {messages.length === 1 && !loading && (
              <div className="space-y-2 pt-1">
                <p className="text-xs text-gray-400 dark:text-gray-500 text-center">
                  Try asking:
                </p>
                {SUGGESTIONS.map((s) => (
                  <button
                    key={s}
                    onClick={() => sendMessage(s)}
                    className="w-full text-left text-xs px-3 py-2 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:border-primary-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors shadow-sm"
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}

            {/* Scroll anchor — useEffect scrolls here on new messages */}
            <div ref={messagesEndRef} />
          </div>

          {/* Input area */}
          <div className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 px-3 py-3 flex-shrink-0">
            <div className="flex gap-2 items-center">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask about meals, prices, diet..."
                disabled={loading}
                className="flex-1 text-sm px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent disabled:opacity-60"
              />
              <button
                onClick={() => sendMessage()}
                disabled={loading || !input.trim()}
                className="w-9 h-9 flex-shrink-0 bg-primary-600 hover:bg-primary-700 disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-xl flex items-center justify-center transition-colors"
              >
                <PaperAirplaneIcon className="h-4 w-4" />
              </button>
            </div>
            <p className="text-center text-xs text-gray-400 dark:text-gray-500 mt-2">
              Powered by Claude AI · Knows your real menu
            </p>
          </div>
        </div>
      )}
    </>
  );
}