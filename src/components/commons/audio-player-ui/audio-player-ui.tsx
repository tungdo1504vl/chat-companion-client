'use client';

import { cn } from '@/libs/tailwind/utils';
import { Pause, Play } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';

interface AudioPlayerUIProps {
  src: string; // Base64 string or URL
  className?: string;
  hasBg?: boolean;
}

// Custom event name for coordinating audio playback
const AUDIO_PLAY_EVENT = 'audioPlayerUI:play';
const AUDIO_STOP_EVENT = 'audioPlayerUI:stop';

const AudioPlayerUI: React.FC<AudioPlayerUIProps> = ({
  src,
  hasBg = false,
  className = '',
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);
  const instanceIdRef = useRef<string>(Math.random().toString(36).substring(7));

  // Generate waveform bars (fake static visualization)
  // Using a seed based on src to keep bars consistent
  const seed = src.length;
  const waveformBars = Array.from({ length: 10 }, (_, i) => {
    const pseudoRandom = Math.sin((i + seed) * 12.9898) * 43758.5453;
    const height = (Math.abs(pseudoRandom) % 0.6) + 0.2;
    return { height };
  });

  // Listen for play events from other instances
  useEffect(() => {
    const handlePlayEvent = (event: CustomEvent<string>) => {
      // If another instance is playing, pause this one
      if (event.detail !== instanceIdRef.current && isPlaying) {
        const audio = audioRef.current;
        if (audio) {
          audio.pause();
          setIsPlaying(false);
        }
      }
    };

    const handleStopEvent = () => {
      // Stop all instances
      if (isPlaying) {
        const audio = audioRef.current;
        if (audio) {
          audio.pause();
          setIsPlaying(false);
        }
      }
    };

    window.addEventListener(
      AUDIO_PLAY_EVENT as any,
      handlePlayEvent as EventListener,
    );
    window.addEventListener(
      AUDIO_STOP_EVENT as any,
      handleStopEvent as EventListener,
    );

    return () => {
      window.removeEventListener(
        AUDIO_PLAY_EVENT as any,
        handlePlayEvent as EventListener,
      );
      window.removeEventListener(
        AUDIO_STOP_EVENT as any,
        handleStopEvent as EventListener,
      );
    };
  }, [isPlaying]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateDuration = () => setDuration(audio.duration);
    const handleEnded = () => {
      setIsPlaying(false);
      // Dispatch stop event when audio ends
      window.dispatchEvent(new CustomEvent(AUDIO_STOP_EVENT));
    };

    audio.addEventListener('loadedmetadata', updateDuration);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('loadedmetadata', updateDuration);
      audio.removeEventListener('ended', handleEnded);
    };
  }, []);

  const togglePlayPause = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
      // Dispatch stop event
      window.dispatchEvent(new CustomEvent(AUDIO_STOP_EVENT));
    } else {
      // Dispatch play event to stop all other instances
      window.dispatchEvent(
        new CustomEvent(AUDIO_PLAY_EVENT, {
          detail: instanceIdRef.current,
        }),
      );
      audio.play();
      setIsPlaying(true);
    }
  };

  const formatTime = (seconds: number): string => {
    if (isNaN(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div
      className={cn(`relative flex items-center gap-3 px-3 py-2 ${className}`, {
        'bg-[#FFE5E9] rounded-lg': hasBg,
      })}
    >
      {/* Play/Pause Button */}
      <button
        onClick={togglePlayPause}
        className="flex-shrink-0 w-10 h-10 rounded-full bg-[#ec4899] hover:bg-[#db2777] transition-colors flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-[#ec4899]/50"
        type="button"
        aria-label={isPlaying ? 'Pause' : 'Play'}
      >
        {isPlaying ? (
          <Pause className="size-5 text-white" />
        ) : (
          <Play className="size-5 text-white ml-0.5" />
        )}
      </button>

      {/* Waveform Visualization - Single color */}
      <div className="flex-1 flex items-center gap-1 h-8">
        {waveformBars.map((bar, index) => (
          <div
            key={index}
            className={cn('flex-1 w-1 rounded-sm', {
              'bg-[#ec4899]': hasBg,
            })}
            style={{
              height: `${bar.height * 100}%`,
              minHeight: '4px',
            }}
          />
        ))}
      </div>

      {/* Time Display */}
      <span className="flex-shrink-0 text-sm font-medium text-[#ec4899] min-w-[2.5rem] text-right">
        {formatTime(duration)}
      </span>

      {/* Hidden Audio Element */}
      <audio ref={audioRef} src={src} preload="metadata" />
    </div>
  );
};

export default AudioPlayerUI;
