'use client';

import { cn } from '@/libs/tailwind/utils';

const InteractivePlayer = () => {
  const seed = 600;
  const waveformBars = Array.from({ length: 20 }, (_, i) => {
    const pseudoRandom = Math.sin((i + seed) * 12.9898) * 43758.5453;
    const height = (Math.abs(pseudoRandom) % 0.6) + 0.2;
    return { height };
  });

  return (
    <div
      className={cn(
        `bg-[#FFE5E9] rounded-lg relative flex items-center gap-3 px-3 py-2`,
      )}
    >
      {/* Waveform Visualization - Single color */}
      <div className="flex-1 flex items-center gap-1 h-8">
        {waveformBars.map((bar, index) => (
          <div
            key={index}
            className={cn('flex-1 w-1 rounded-sm bg-[#ec4899]')}
            style={{
              height: `${bar.height * 100}%`,
              minHeight: '4px',
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default InteractivePlayer;
