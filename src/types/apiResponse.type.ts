import { IPlanet, PlanetsByDisposition } from "./planet.type";

export interface IAPIResponseForPlanetCharts {
  planets: IPlanet[];
  habitablePlanets: IPlanet[];
  earthLikePlanets: IPlanet[];
  recievesSunlightLikeEarth: IPlanet[];
  planetsByDisposition: PlanetsByDisposition[];
}

export interface IAPIResponseForAllPlanets {
  planets: IPlanet[];
}

export type ScoredPlanet = IPlanet & { score?: number };

export interface IAPIResponseForHabitablePlanet {
  planets: ScoredPlanet[];
  habitablePlanets: IPlanet[];
}

export interface IAPIErrorResponse {
  error: string;
}

