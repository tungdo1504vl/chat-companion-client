'use client';

import {
  Check,
  Globe,
  MessageCircle,
  Sparkles,
  Sun,
  Moon,
  Sunrise,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';

// Zodiac symbols mapping
const zodiacSymbols: Record<string, string> = {
  Scorpio: '♏',
  Gemini: '♊',
  Libra: '♎',
  Sagittarius: '♐',
  Virgo: '♍',
  Pisces: '♓',
  Aquarius: '♒',
};

// Planet symbols mapping
const planetSymbols: Record<string, string> = {
  Mercury: '☿',
  Venus: '♀',
  Mars: '♂',
  Jupiter: '♃',
  Saturn: '♄',
};

// Zodiac colors mapping
const zodiacColors: Record<string, string> = {
  Scorpio: 'bg-teal-500',
  Gemini: 'bg-orange-500',
  Libra: 'bg-green-500',
  Sagittarius: 'bg-blue-500',
  Virgo: 'bg-lime-500',
  Pisces: 'bg-pink-500',
  Aquarius: 'bg-purple-500',
};

interface BigThreeCardProps {
  title: string;
  sign: string;
  icon: React.ReactNode;
  iconColor: string;
}

function BigThreeCard({ title, sign, icon, iconColor }: BigThreeCardProps) {
  const symbolColor = zodiacColors[sign] || 'bg-gray-500';

  return (
    <div className="flex flex-col items-center p-4 bg-white rounded-lg border border-gray-200 shadow-sm">
      <div className={`${iconColor} mb-2`}>{icon}</div>
      <div className="text-xs font-semibold text-gray-500 mb-1">{title}</div>
      <div className="text-2xl font-bold mb-2">{sign}</div>
      <div
        className={`w-12 h-12 rounded-full ${symbolColor} flex items-center justify-center text-white text-2xl`}
      >
        {zodiacSymbols[sign]}
      </div>
    </div>
  );
}

interface PlanetaryPosition {
  planet: string;
  sign: string;
  degree: string;
}

function BirthChart() {
  const bigThree = [
    {
      title: 'SUN',
      sign: 'Scorpio',
      icon: <Sun className="h-5 w-5 text-orange-500" />,
      iconColor: 'text-orange-500',
    },
    {
      title: 'MOON',
      sign: 'Gemini',
      icon: <Moon className="h-5 w-5 text-gray-500" />,
      iconColor: 'text-gray-500',
    },
    {
      title: 'RISING',
      sign: 'Libra',
      icon: <Sunrise className="h-5 w-5 text-gray-500" />,
      iconColor: 'text-gray-500',
    },
  ];

  const planetaryPositions: PlanetaryPosition[] = [
    { planet: 'Mercury', sign: 'Scorpio', degree: "12° 45'" },
    { planet: 'Venus', sign: 'Sagittarius', degree: "04° 10'" },
    { planet: 'Mars', sign: 'Virgo', degree: "22° 15'" },
    { planet: 'Jupiter', sign: 'Pisces', degree: "08° 30'" },
    { planet: 'Saturn', sign: 'Aquarius', degree: "19° 05'" },
  ];

  return (
    <div className="w-full space-y-6">
      {/* Relationship Seeker Badge */}
      <div className="flex justify-center">
        <Badge
          variant="outline"
          className="bg-pink-100 text-pink-700 border-pink-200 px-3 py-1 rounded-full"
        >
          Relationship Seeker
        </Badge>
      </div>

      {/* AI Chart Analysis Banner */}
      <div className="bg-red-500 rounded-lg p-4 flex items-center justify-between text-white">
        <div className="flex-1">
          <p className="font-medium text-sm">
            Discover compatibility insights based on your planetary positions.
          </p>
        </div>
        <div className="ml-4 bg-white/20 rounded-full p-2">
          <Sparkles className="h-5 w-5 text-white" />
        </div>
      </div>

      {/* The Big Three Section */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Check className="h-4 w-4 text-red-500" />
          <h3 className="text-lg font-semibold">The Big Three</h3>
        </div>
        <div className="grid grid-cols-3 gap-3">
          {bigThree.map((item) => (
            <BigThreeCard
              key={item.title}
              title={item.title}
              sign={item.sign}
              icon={item.icon}
              iconColor={item.iconColor}
            />
          ))}
        </div>
      </div>

      {/* Planetary Positions Section */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Globe className="h-4 w-4 text-red-500" />
          <h3 className="text-lg font-semibold">Planetary Positions</h3>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    PLANET
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    SIGN
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    DEGREE
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {planetaryPositions.map((position) => {
                  const symbolColor =
                    zodiacColors[position.sign] || 'bg-gray-500';
                  return (
                    <tr key={position.planet} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm">
                        <div className="flex items-center gap-2">
                          <span className="text-lg">
                            {planetSymbols[position.planet]}
                          </span>
                          <span className="font-medium">{position.planet}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm">
                        <div className="flex items-center gap-2">
                          <span>{position.sign}</span>
                          <span
                            className={`w-6 h-6 rounded-full ${symbolColor} flex items-center justify-center text-white text-xs`}
                          >
                            {zodiacSymbols[position.sign]}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm font-medium">
                        {position.degree}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Chart Insights Section */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <MessageCircle className="h-4 w-4 text-red-500" />
          <h3 className="text-lg font-semibold">Chart Insights</h3>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4 space-y-3">
          <p className="text-sm text-gray-700 leading-relaxed">
            Your chart reveals a soul of intense depth and passion, guided by
            your Scorpio Sun. You feel things profoundly, yet your Gemini Moon
            gifts you with a lightness and curiosity that helps you articulate
            these complex emotions.
          </p>
          <p className="text-sm text-gray-700 leading-relaxed">
            With Libra Rising, you approach the world with a grace that draws
            others in, constantly seeking balance and harmony in your
            relationships. You are a natural mediator who values authentic
            connection and beauty in all forms.
          </p>
        </div>
      </div>
    </div>
  );
}

export default BirthChart;
