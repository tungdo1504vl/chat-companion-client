'use client';

import { useState } from 'react';
import { ArrowLeft, Home, Mic, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { ASSISTANT_ROUTES } from '@/constants/routes';

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
              router.push(ASSISTANT_ROUTES.ASSISTANT);
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
              router.push(ASSISTANT_ROUTES.ASSISTANT);
            }}
          >
            <Home className="size-5" />
          </Button>
        </div>
      </div>
    </div>
  );
}
