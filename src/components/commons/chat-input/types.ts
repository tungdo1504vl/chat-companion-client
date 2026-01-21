export interface ChatInputData {
  text: string;
  images: string[]; // Array of base64 strings
  audio: string | null; // Base64 string or null
  audioString?: string | null;
}

export interface ChatInputProps {
  inputValue: string;
  disabled?: boolean;
  onSendMessage?: (data: ChatInputData) => void;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onDataChange?: (data: ChatInputData) => void;
}

// Type definitions for Web Speech API
export interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start(): void;
  stop(): void;
  abort(): void;
  onresult: ((event: SpeechRecognitionEvent) => void) | null;
  onerror: ((event: SpeechRecognitionErrorEvent) => void) | null;
  onend: (() => void) | null;
}

export interface SpeechRecognitionEvent extends Event {
  resultIndex: number;
  results: SpeechRecognitionResultList;
}

export interface SpeechRecognitionResultList {
  length: number;
  item(index: number): SpeechRecognitionResult;
  [index: number]: SpeechRecognitionResult;
}

export interface SpeechRecognitionResult {
  length: number;
  item(index: number): SpeechRecognitionAlternative;
  [index: number]: SpeechRecognitionAlternative;
  isFinal: boolean;
}

export interface SpeechRecognitionAlternative {
  transcript: string;
  confidence: number;
}

export interface SpeechRecognitionErrorEvent extends Event {
  error: string;
  message: string;
}

export interface SpeechRecognitionConstructor {
  new (): SpeechRecognition;
}

export interface ImageFile {
  file: File;
  preview: string;
}

export interface ChatInputRef {
  resetAudio: () => void;
  resetImage: () => void;
}
