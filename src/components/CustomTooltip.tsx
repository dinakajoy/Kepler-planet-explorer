import React from "react";

export type TCustomTooltip = {
  active: boolean;
  payload: any;
};

export const EarthLikeCustomTooltip = ({ active, payload }: TCustomTooltip) => {
  if (active && payload && payload.length) {
    const planet = payload[0].payload;
    return (
      <div className="bg-white p-4 rounded shadow-md border">
        <h4 className="font-bold text-gray-700">{planet.kepoi_name}</h4>{" "}
        <p className="text-sm text-gray-600">{`Radius: ${planet.koi_prad} Earth radii`}</p>
        <p className="text-sm text-gray-600">{`Temperature: ${planet.koi_teq} K`}</p>
      </div>
    );
  }
  return null;
};

export const EarthLikeSunlightCustomTooltip = ({ active, payload }: TCustomTooltip) => {
  if (active && payload && payload.length) {
    const planet = payload[0].payload;
    return (
      <div className="bg-white p-4 rounded shadow-md border">
        <h4 className="font-bold text-gray-700">{planet.kepoi_name}</h4>{" "}
        <p className="text-sm text-gray-600">
          {`Planetary Radius: ${planet.koi_prad} (Earth radii)`}
        </p>
        <p className="text-sm text-gray-600">{`Insolation Flux: ${planet.koi_insol} (Earth Flux)`}</p>
        <p className="text-sm text-gray-600">{`Bubble Size: ${planet.koi_prad} (Planet Size)`}</p>
      </div>
    );
  }
  return null;
};