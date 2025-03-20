import type { NextApiRequest, NextApiResponse } from "next";
import fs from "fs";
import { parse } from "csv-parse";
import { IPlanet } from "../../types/planet.type";
import {
  IAPIErrorResponse,
  IAPIResponseForAllPlanets,
} from "../../types/apiResponse.type";

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<IAPIResponseForAllPlanets | IAPIErrorResponse>
) {
  const habitablePlanets: any = [];

  fs.createReadStream(process.cwd() + "/src/kepler_data.csv", "utf8")
    .pipe(
      parse({
        comment: "#",
        columns: true,
      })
    )
    .on("data", (data: IPlanet) => {
      habitablePlanets.push(data);
    })
    .on("end", () => {
      return res.status(200).json({ planets: habitablePlanets });
    })
    .on("error", (err) => {
      console.error(err);
      return res.status(500).json({ error: "Server Error" });
    });
}
