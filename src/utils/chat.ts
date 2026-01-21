import { ChatInputData } from '@/components/commons/chat-input/types';
import { AUDIO_DATA_URI_REGEX, IMAGE_DATA_URI_REGEX } from '@/constants/regex';

type InputItem =
  | { type: 'text'; text: string }
  | { type: 'image'; data_base64: string; mime_type: string }
  | { type: 'audio'; data_base64: string; mime_type: string };

export function buildInputItems(input: ChatInputData): InputItem[] {
  const items: InputItem[] = [];

  // text
  if (typeof input.text === 'string' && input.text.trim() !== '') {
    items.push({
      type: 'text',
      text: input.text,
    });
  }

  // images (string[])
  if (Array.isArray(input.images)) {
    input.images.forEach((base64) => {
      if (typeof base64 === 'string' && base64.trim() !== '') {
        items.push({
          type: 'image',
          data_base64: base64,
          mime_type: 'image/png',
        });
      }
    });
  }

  // audio (string)
  if (typeof input.audio === 'string' && input.audio.trim() !== '') {
    items.push({
      type: 'audio',
      data_base64: input.audio.replace('data:audio/webm;base64,', ''),
      mime_type: 'audio/wav',
    });
  }

  return items;
}

export function formatUserInput(content: string) {
  return content.replace(/\s*\(attachments:[^)]+\)/gi, '').trim();
}

export function formatImageBase64(base64: string): string {
  const prefix = 'data:image/png;base64,';
  if (!base64) return '';

  return IMAGE_DATA_URI_REGEX.test(base64) ? base64 : prefix + base64.trim();
}

export function formatAudioBase64(base64: string): string {
  const prefix = 'data:audio/webm;base64,';
  if (!base64) return '';

  return AUDIO_DATA_URI_REGEX.test(base64) ? base64 : prefix + base64.trim();
}
