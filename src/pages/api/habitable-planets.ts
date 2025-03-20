import type { NextApiRequest, NextApiResponse } from "next";
import fs from "fs";
import { parse } from "csv-parse";
import { IPlanet } from "../../types/planet.type";
import {
  IAPIResponseForHabitablePlanet,
  IAPIErrorResponse,
  ScoredPlanet,
} from "../../types/apiResponse.type";

const isHabitablePlanet = (planet: IPlanet) => {
  return (
    planet["koi_disposition"] === "CONFIRMED" &&
    planet["koi_insol"] > 0.36 &&
    planet["koi_insol"] < 1.11 &&
    planet["koi_prad"] < 1.6
  );
};

const calculateHabitabilityScore = (planet: IPlanet): number => {
  let score = 0;

  // Planetary Radius Score
  if (planet.koi_prad >= 0.8 && planet.koi_prad <= 1.5) {
    score += 30; // Best range
  } else if (planet.koi_prad > 1.5 && planet.koi_prad <= 2.5) {
    score += 15; // Super-Earths
  } else {
    score += 5; // Poor conditions
  }

  // Equilibrium Temperature Score
  if (planet.koi_teq >= 200 && planet.koi_teq <= 320) {
    score += 25;
  } else if (planet.koi_teq >= 150 && planet.koi_teq <= 400) {
    score += 10;
  }

  // Insolation Flux Score
  if (planet.koi_insol >= 0.4 && planet.koi_insol <= 1.5) {
    score += 20;
  } else if (planet.koi_insol >= 0.2 && planet.koi_insol <= 2.5) {
    score += 10;
  }

  // Orbital Period Score
  if (planet.koi_period >= 50 && planet.koi_period <= 500) {
    score += 10;
  } else if (planet.koi_period >= 10 && planet.koi_period <= 1000) {
    score += 5;
  }

  // Disposition Score
  if (planet.koi_disposition === "CONFIRMED") {
    score += 10;
  } else if (planet.koi_disposition === "CANDIDATE") {
    score += 5;
  }

  return score;
};

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<IAPIResponseForHabitablePlanet | IAPIErrorResponse>
) {
  const planets: ScoredPlanet[] = [];
  const habitablePlanets: IPlanet[] = [];

  fs.createReadStream(process.cwd() + "/src/kepler_data.csv", "utf8")
    .pipe(
      parse({
        comment: "#",
        columns: true,
      })
    )
    .on("data", (data: IPlanet) => {
      const planetScore = calculateHabitabilityScore(data);
      planets.push({ ...data, score: planetScore });
      if (data && isHabitablePlanet(data)) {
        habitablePlanets.push(data);
      }
    })
    .on("end", () => {
      return res.status(200).json({
        planets: planets.sort((a: any, b: any) => b.score - a.score),
        habitablePlanets,
      });
    })
    .on("error", (err) => {
      console.error(err);
      return res.status(500).json({ error: "Server Error" });
    });
}
