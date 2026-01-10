import type { TNatalChart, TPlanetPosition } from "../types";
import { planetDisplayOrder } from "../const";

/**
 * Big Three configuration for birth chart display
 */
export interface BigThreeItem {
  title: string;
  sign: string;
  planet: string;
}

/**
 * Planetary position for display
 */
export interface PlanetaryPositionDisplay {
  planet: string;
  sign: string;
  degree: string;
  retrograde: boolean;
}

/**
 * Extracts the Big Three (Sun, Moon, Rising/Ascendant) from natal chart
 * @param natalChart - The natal chart data
 * @returns Array of Big Three items or null if data is incomplete
 */
export function extractBigThree(
  natalChart: TNatalChart | null | undefined
): BigThreeItem[] | null {
  if (!natalChart?.chart) {
    return null;
  }

  const { planets, digest } = natalChart.chart;
  const sun = planets.Sun;
  const moon = planets.Moon;
  const rising = digest?.asc;

  if (!sun || !moon || !rising) {
    return null;
  }

  return [
    {
      title: "SUN",
      sign: sun.sign,
      planet: "Sun",
    },
    {
      title: "MOON",
      sign: moon.sign,
      planet: "Moon",
    },
    {
      title: "RISING",
      sign: rising,
      planet: "Ascendant",
    },
  ];
}

/**
 * Converts decimal degrees to "DD° MM'" format
 * @param degree - Decimal degree value
 * @returns Formatted degree string (e.g., "22° 12'")
 */
export function formatDegree(degree: number): string {
  const degrees = Math.floor(degree);
  const minutes = Math.floor((degree - degrees) * 60);
  return `${degrees}° ${minutes.toString().padStart(2, "0")}'`;
}

/**
 * Extracts and transforms planetary positions from natal chart
 * @param natalChart - The natal chart data
 * @returns Array of planetary positions in display format, ordered by planetDisplayOrder
 */
export function extractPlanetaryPositions(
  natalChart: TNatalChart | null | undefined
): PlanetaryPositionDisplay[] {
  if (!natalChart?.chart?.planets) {
    return [];
  }

  const { planets } = natalChart.chart;
  const positions: PlanetaryPositionDisplay[] = [];

  // Iterate through planets in display order
  for (const planetName of planetDisplayOrder) {
    const planetData = planets[planetName] as TPlanetPosition | undefined;

    if (planetData) {
      positions.push({
        planet: planetName,
        sign: planetData.sign,
        degree: formatDegree(planetData.degree),
        retrograde: planetData.retrograde || false,
      });
    }
  }

  return positions;
}
