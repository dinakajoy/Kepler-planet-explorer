import React, { useEffect, useMemo, useRef, useState } from "react";
import Header from "@/components/Header";
import { IPlanet } from "@/types/planet.type";
import {
  ExoplanetCard,
  ExoplanetCardWithoutHabitabilityChecker,
} from "@/components/ExoplanetGrid";
import { useHabitablePlanetsData } from "../utils/helpers";
import PageLoader from "@/components/PageLoader";
import ScrollToTop from "@/components/ScroolToTopBtn";

enum types {
  HABITABLE = "habitable",
  NONHABITABLE = "non_habitable",
  HABITABLE_PLANETS_BY_SCORE = "habitable_planets_by_score",
  ALL = "all",
}

const HabitableChecker = () => {
  const { data, error, isLoading } = useHabitablePlanetsData();

  const observerRef = useRef<HTMLDivElement | null>(null);
  const [displyType, setDisplyType] = useState<string>(types.ALL);
  const [visibleItems, setVisibleItems] = useState(24);

  const visibleGridPlanets = useMemo(() => {
    return data?.planets ? data.planets.slice(0, visibleItems) : [];
  }, [data, visibleItems]);

  const loadMore = () => {
    setVisibleItems((prev) => prev + 24);
  };

  useEffect(() => {
    if (!observerRef.current) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          loadMore();
        }
      },
      { threshold: 1.0 }
    );

    observer.observe(observerRef.current);
    return () => observer.disconnect();
  }, []);

  if (isLoading) return <PageLoader />;
  if (error)
    return (
      <p className="flex items-center justify-center h-screen">
        Error: {error.message}
      </p>
    );

  return (
    <>
      <Header />
      <div className="my-12 mx-8">
        <div className="flex flex-col sm:flex-row min-w-[20%] gap-4 mr-auto">
          <button
            onClick={() => setDisplyType(types.ALL)}
            disabled={displyType === types.ALL}
            className={`${
              displyType === types.ALL ? "px-6 py-2 rounded-md bg-gray-800" : ""
            }`}
          >
            All Planets
          </button>
          <button
            onClick={() => setDisplyType(types.HABITABLE)}
            disabled={displyType === types.HABITABLE}
            className={`${
              displyType === types.HABITABLE
                ? "px-6 py-2 rounded-md bg-gray-800"
                : ""
            }`}
          >
            Habitable Planets
          </button>
        </div>

        {displyType === types.ALL && data && data.planets && (
          <>
            <h2 className="border border-gray-600 max-w-[600px] rounded-xl text-2xl font-bold my-8 p-2">
              Planets By Habitability Score in Ascending Order
            </h2>
            <div className="w-[100%] grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 justify-items-center">
              {visibleGridPlanets &&
                visibleGridPlanets.map((planet: IPlanet, index: number) => (
                  <ExoplanetCard key={index} planet={planet} />
                ))}
              <div
                ref={observerRef}
                style={{ height: 20, background: "transparent" }}
              />
            </div>
          </>
        )}
        {displyType === types.HABITABLE && data && data.habitablePlanets && (
          <>
            <h2 className="border border-gray-600 max-w-[500px] rounded-xl text-2xl font-bold my-8 p-2">
              List of Habitable Planets
            </h2>
            <div className="w-[100%] grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 justify-items-center">
              {data.habitablePlanets &&
                data.habitablePlanets.map((planet: IPlanet, index: number) => (
                  <ExoplanetCardWithoutHabitabilityChecker
                    key={index}
                    planet={planet}
                  />
                ))}
            </div>
          </>
        )}
      </div>
      <ScrollToTop />
    </>
  );
};

export default HabitableChecker;
