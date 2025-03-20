import { IPlanet, KoiDisposition } from "@/types/planet.type";
import { useQuery } from "@tanstack/react-query";
import { useState, useMemo } from "react";

export const fetchPlanetsData = async (url: string) => {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error("Failed to fetch planets data");
  }
  return response.json();
};

export const usePlanetsData = () => {
  return useQuery({
    queryKey: ["planetsExplorerData"],
    queryFn: () => fetchPlanetsData("/api/planets"),
    staleTime: Infinity, // Never refetch automatically
  });
};

export const useHabitablePlanetsData = () => {
  return useQuery({
    queryKey: ["habitablePlanetsData"],
    queryFn: () => fetchPlanetsData("/api/habitable-planets"),
    staleTime: Infinity, // Never refetch automatically
  });
};

export const matchesRadius = (radiusRange: number[], koi_prad: number) => {
  return koi_prad >= radiusRange[0] && koi_prad <= radiusRange[1];
};

export const matchesTemperature = (
  temperatureRange: number[],
  koi_teq: number
) => {
  return koi_teq >= temperatureRange[0] && koi_teq <= temperatureRange[1];
};

export const matchesInsolationFlux = (
  insolationFluxRange: number[],
  koi_insol: number
) => {
  return (
    koi_insol >= insolationFluxRange[0] && koi_insol <= insolationFluxRange[1]
  );
};

export const matchesDisposition = (
  disposition: string,
  koi_disposition: string
) => {
  return koi_disposition === disposition;
};
