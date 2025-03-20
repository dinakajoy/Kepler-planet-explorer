import type { NextApiRequest, NextApiResponse } from "next";
import fs from "fs";
import { parse } from "csv-parse";
import {
  IPlanet,
  KoiDisposition,
  PlanetsByDisposition,
} from "../../types/planet.type";
import {
  IAPIErrorResponse,
  IAPIResponseForPlanetCharts,
} from "../../types/apiResponse.type";

const isHabitablePlanet = (planet: IPlanet) => {
  return (
    planet["koi_disposition"] === "CONFIRMED" &&
    planet["koi_insol"] > 0.36 &&
    planet["koi_insol"] < 1.11 &&
    planet["koi_prad"] < 1.6
  );
};

const isEarthLikePlanet = (planet: IPlanet) => {
  return (
    planet["koi_prad"] >= 0.8 &&
    planet["koi_prad"] <= 1.5 &&
    planet["koi_teq"] >= 200 &&
    planet["koi_teq"] <= 350
  );
};

const doesPlanetRecieveSunlightLikeEarth = (planet: IPlanet) => {
  return (
    planet["koi_prad"] >= 0.8 &&
    planet["koi_prad"] <= 1.5 &&
    planet["koi_insol"] >= 0.4 &&
    planet["koi_insol"] <= 1.6
  );
};

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<IAPIResponseForPlanetCharts | IAPIErrorResponse>
) {
  const planets: IPlanet[] = [];
  const habitablePlanets: IPlanet[] = [];
  const earthLikePlanets: IPlanet[] = [];
  const recievesSunlightLikeEarth: IPlanet[] = [];
  const planetsByDisposition: PlanetsByDisposition[] = [
    { name: "Candidate", planets: 0 },
    { name: "Confirmed", planets: 0 },
    { name: "False Positive", planets: 0 },
  ];

  fs.createReadStream(process.cwd() + "/src/kepler_data.csv", "utf8")
    .pipe(
      parse({
        comment: "#",
        columns: true,
      })
    )
    .on("data", (data: IPlanet) => {
      planets.push(data);

      // Classify Planets that are Habitable
      if (data && isHabitablePlanet(data)) {
        habitablePlanets.push(data);
      }

      // Classify Planets that are Earth like
      if (isEarthLikePlanet(data)) {
        earthLikePlanets.push(data);
      }

      // Classify Planets that recieves sunlight similar to Earth
      if (doesPlanetRecieveSunlightLikeEarth(data)) {
        recievesSunlightLikeEarth.push(data);
      }

      // Classify Planets by Disposition
      if (data.koi_disposition === KoiDisposition.candidate) {
        planetsByDisposition[0].planets += 1;
      } else if (data.koi_disposition === KoiDisposition.confirmed) {
        planetsByDisposition[1].planets += 1;
      } else if (data.koi_disposition === KoiDisposition.false_positive) {
        planetsByDisposition[2].planets += 1;
      }
    })
    .on("end", () => {
      return res.status(200).json({
        planets,
        habitablePlanets,
        earthLikePlanets,
        recievesSunlightLikeEarth,
        planetsByDisposition,
      });
    })
    .on("error", (err) => {
      console.error(err);
      return res.status(500).json({ error: "Server Error" });
    });
}
