'use client';

import { useState } from 'react';
import { ArrowLeft, Home, Mic, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

interface Message {
  id: string;
  text: string;
  sender: 'aura' | 'user';
  timestamp: Date;
}

const initialMessages: Message[] = [
  {
    id: '1',
    text: 'I am Aura. I will help you create a strategy to win Leo, your crush. It will definitely work well.',
    sender: 'aura',
    timestamp: new Date(),
  },
  {
    id: '2',
    text: 'Based on your compatibility, the best approach is to build a strong friendship first, showing genuine interest in his hobbies.',
    sender: 'aura',
    timestamp: new Date(),
  },
  {
    id: '3',
    text: 'That sounds good, tell me more.',
    sender: 'user',
    timestamp: new Date(),
  },
];

export default function HistoryPage() {
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [inputValue, setInputValue] = useState('');

  const handleSend = () => {
    if (inputValue.trim()) {
      const newMessage: Message = {
        id: Date.now().toString(),
        text: inputValue.trim(),
        sender: 'user',
        timestamp: new Date(),
      };
      setMessages([...messages, newMessage]);
      setInputValue('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-full relative overflow-hidden">
      {/* Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-purple-100 via-blue-100 to-pink-100 -z-10" />

      {/* Header */}
      <div className="px-4 pt-4 pb-2 bg-transparent z-10">
        <div className="w-full flex items-center justify-between">
          <Button
            variant="ghost"
            size="icon"
            className="shrink-0"
            onClick={() => {
              router.push('/assistant');
            }}
          >
            <ArrowLeft className="size-5" />
          </Button>
          <h1 className="flex-1 text-center text-lg font-semibold">
            Strategy for a successful crush
          </h1>
          <Button
            variant="ghost"
            size="icon"
            className="shrink-0"
            onClick={() => {
              router.push('/assistant');
            }}
          >
            <Home className="size-5" />
          </Button>
        </div>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        {messages.map((message, index) => {
          const isAura = message.sender === 'aura';
          const showMascot = isAura && index === 0;

          return (
            <div
              key={message.id}
              className={`flex items-start gap-3 ${
                isAura ? 'justify-start' : 'justify-end'
              }`}
            >
              {isAura && (
                <div className="flex items-start gap-2">
                  {showMascot && (
                    <div className="relative w-12 h-12 shrink-0">
                      <div className="absolute inset-0 rounded-full bg-gradient-to-br from-green-400 via-orange-400 to-green-500 animate-pulse blur-sm opacity-50" />
                      <Image
                        src="/mascot/mascot-removebg-preview.png"
                        alt="Aura"
                        fill
                        className="object-contain relative z-10"
                      />
                    </div>
                  )}
                  {!showMascot && <div className="w-12" />}
                  <div
                    className={`max-w-[80%] rounded-2xl px-4 py-2 ${
                      index === 0
                        ? 'bg-purple-200 text-foreground'
                        : 'bg-blue-200 text-foreground'
                    }`}
                  >
                    <p className="text-sm leading-relaxed">{message.text}</p>
                  </div>
                </div>
              )}

              {!isAura && (
                <div className="max-w-[80%] rounded-2xl px-4 py-2 bg-gray-200 text-foreground">
                  <p className="text-sm leading-relaxed">{message.text}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Input Bar */}
      <div className="px-4 pb-4 pt-2 bg-transparent z-10">
        <div className="flex items-center gap-2">
          <div className="flex-1 relative">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-200 via-pink-200 to-purple-200 rounded-full blur-sm opacity-50" />
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your message..."
              className="relative z-10 w-full rounded-full border-0 bg-white/80 backdrop-blur-sm pr-12 focus-visible:ring-2 focus-visible:ring-primary/50"
            />
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-1 top-1/2 -translate-y-1/2 z-20 h-8 w-8"
            >
              <Mic className="size-4 text-muted-foreground" />
            </Button>
          </div>
          <Button
            onClick={handleSend}
            disabled={!inputValue.trim()}
            className="rounded-full bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-6 shrink-0"
          >
            <Send className="size-4" />
            Send
          </Button>
        </div>
      </div>
    </div>
  );
}
