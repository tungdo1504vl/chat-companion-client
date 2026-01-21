'use client';

import { cn } from '@/libs/tailwind/utils';
import { Pause, Play, X } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';

interface AudioPlayerProps {
  src: string; // Base64 string or URL
  onRemove?: () => void;
  className?: string;
  hasBg?: boolean;
}

const AudioPlayer: React.FC<AudioPlayerProps> = ({
  src,
  onRemove,
  hasBg = false,
  className = '',
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);

  // Generate waveform bars (fake static visualization)
  // Using a seed based on src to keep bars consistent
  const seed = src.length;
  const waveformBars = Array.from({ length: 10 }, (_, i) => {
    const pseudoRandom = Math.sin((i + seed) * 12.9898) * 43758.5453;
    const height = (Math.abs(pseudoRandom) % 0.6) + 0.2;
    // Randomly assign color (some bars coral pink, some light pink)
    const isCoral = Math.abs(pseudoRandom) % 2 < 1;
    return { height, isCoral };
  });

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateDuration = () => setDuration(audio.duration);
    const handleEnded = () => setIsPlaying(false);

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
    } else {
      audio.play();
    }
    setIsPlaying(!isPlaying);
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
        'bg-[#fce7f3] rounded-lg': hasBg,
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

      {/* Waveform Visualization */}
      <div className="flex-1 flex items-center gap-1 h-8">
        {waveformBars.map((bar, index) => (
          <div
            key={index}
            className={`flex-1 w-1 rounded-sm ${
              bar.isCoral ? 'bg-[#ec4899]' : 'bg-[#f9a8d4]'
            }`}
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

      {/* Remove Button */}
      {onRemove && hasBg && (
        <button
          onClick={onRemove}
          className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-gray-500 hover:bg-destructive/90 transition-colors flex items-center justify-center p-0 focus:outline-none focus:ring-2 focus:ring-destructive/50"
          type="button"
          aria-label="Remove audio"
        >
          <X className="size-3 text-white" />
        </button>
      )}

      {/* Hidden Audio Element */}
      <audio ref={audioRef} src={src} preload="metadata" />
    </div>
  );
};

export default AudioPlayer;
