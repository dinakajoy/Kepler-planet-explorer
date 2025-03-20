import React, { useEffect, useRef, useState } from "react";
import LoadingButton from "./LoadingButton";
import { IPlanet } from "@/types/planet.type";
import { ScoredPlanet } from "@/types/apiResponse.type";

export const ExoplanetCard = ({ planet }: { planet: ScoredPlanet }) => {
  const [loading, setLoading] = useState(false);
  const [showBubbles, setShowBubbles] = useState(false);
  const [shake, setShake] = useState(false);

  const isHabitablePlanet = (planet: ScoredPlanet) => {
    return (
      planet?.koi_disposition === "CONFIRMED" &&
      planet?.koi_insol > 0.36 &&
      planet?.koi_insol < 1.11 &&
      planet?.koi_prad < 1.6 &&
      (planet?.koi_teq ? planet.koi_teq > 180 && planet.koi_teq < 310 : true)
    );
  };

  const handleClick = () => {
    setLoading(true);

    setTimeout(() => {
      const isHabitable = isHabitablePlanet(planet);
      setLoading(false);

      if (isHabitable) {
        setShowBubbles(true);
      } else {
        setShake(true);
      }

      // Reset after 3 seconds
      setTimeout(() => {
        setShowBubbles(false);
        setShake(false);
      }, 3000);
    }, 3000);
  };

  return (
    <div className="align-center bg-gray-800 shadow-md rounded-2xl p-4 w-full max-w-sm">
      <div className="flex justify-between">
        <div className="mt-4">
          <h2 className="text-xl font-bold">
            {planet.kepler_name || planet.kepoi_name}
          </h2>
          <p className="text-sm text-gray-500">
            Status: {planet.koi_disposition}
          </p>
          <p className="text-sm text-gray-500">
            Radius: {planet.koi_prad} Earth radii
          </p>
          <p className="text-sm text-gray-500">
            Temperature: {planet.koi_teq}K
          </p>
          {planet.score && (
            <p className="text-sm text-gray-300 font-semibold">
              Score: {planet.score}%
            </p>
          )}
        </div>
        <div>
          <img
            src="/planet.webp"
            alt="Rotating Planet"
            className="w-20 h-20 md:w-30 md:h-30 animate-spin-slow rounded-full"
          />
          <style>
            {`
          @keyframes spin-slow {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
          .animate-spin-slow {
            animation: spin-slow 10s linear infinite;
          }
        `}
          </style>
        </div>
      </div>
      <div className="relative flex justify-center">
        <button
          className={`mt-3 w-full bg-blue-600 text-white text-center m-auto py-2 rounded-lg transition flex items-center justify-center
          ${shake ? "animate-shake bg-red-600" : ""}
          ${showBubbles ? "bg-green-600" : ""}
        `}
          onClick={handleClick}
        >
          {loading ? (
            <LoadingButton />
          ) : showBubbles ? (
            "Is Habitable"
          ) : shake ? (
            "Is Not Habitable"
          ) : (
            "Check Habitability"
          )}
        </button>

        {/* Green Bubbles Effect */}
        {showBubbles && (
          <div className="absolute top-0 flex justify-between gap-8">
            <span className="w-3 h-3 bg-green-400 rounded-full animate-bubble delay-3000"></span>
            <span className="w-2 h-2 bg-green-400 rounded-full animate-bubble delay-500"></span>
            <span className="w-4 h-4 bg-green-600 rounded-full animate-bubble delay-7000"></span>
            <span className="w-3 h-3 bg-green-400 rounded-full animate-bubble delay-1500"></span>
            <span className="w-5 h-5 bg-green-400 rounded-full animate-bubble delay-100"></span>
            <span className="w-2 h-2 bg-green-500 rounded-full animate-bubble delay-200"></span>
          </div>
        )}

        {/* Tailwind Animations */}
        <style>
          {`
          @keyframes shake {
            0%, 100% { transform: translateX(0); }
            20%, 60% { transform: translateX(-5px); }
            40%, 80% { transform: translateX(5px); }
          }
          .animate-shake { animation: shake 0.4s ease-in-out; }

          @keyframes bubble {
            0% { opacity: 0; transform: translateY(0) scale(.4); }
            20% { opacity: 1; transform: translateY(-20px) scale(.7); }
            100% { opacity: 0; transform: translateY(-50px) scale(1.2); }
          }
          .animate-bubble { animation: bubble 4s ease-out forwards; }
        `}
        </style>
      </div>
    </div>
  );
};

export const ExoplanetCardWithoutHabitabilityChecker = ({
  planet,
}: {
  planet: ScoredPlanet;
}) => {
  return (
    <div className="align-center bg-gray-800 shadow-md rounded-2xl p-4 w-full max-w-sm">
      <div className="flex justify-between">
        <div className="mt-4">
          <h2 className="text-xl font-bold">
            {planet.kepler_name || planet.kepoi_name}
          </h2>
          <p className="text-sm text-gray-500">
            Status: {planet.koi_disposition}
          </p>
          <p className="text-sm text-gray-500">
            Radius: {planet.koi_prad} Earth radii
          </p>
          <p className="text-sm text-gray-500">
            Temperature: {planet.koi_teq}K
          </p>
          {planet.score && (
            <p className="text-sm text-gray-300 font-semibold">
              Score: {planet.score}%
            </p>
          )}
        </div>
        <div>
          <img
            src="/planet.webp"
            alt="Rotating Planet"
            className="w-20 h-20 md:w-30 md:h-30 animate-spin-slow rounded-full"
          />
          <style>
            {`
          @keyframes spin-slow {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
          .animate-spin-slow {
            animation: spin-slow 10s linear infinite;
          }
        `}
          </style>
        </div>
      </div>
    </div>
  );
};

const ExoplanetGrid = ({
  filteredPlanets,
  loadMore,
}: {
  filteredPlanets: IPlanet[];
  loadMore: () => void;
}) => {
  const observerRef = useRef<HTMLDivElement | null>(null);

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

  return (
    <div className="p-6 min-h-screen">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 justify-items-center">
        {filteredPlanets.map((planet, index) => (
          <ExoplanetCard key={index} planet={planet} />
        ))}
      </div>
      {/* Invisible div that triggers loading more items when it enters viewport */}
      <div
        ref={observerRef}
        style={{ height: 20, background: "transparent" }}
      />
    </div>
  );
};

export default ExoplanetGrid;
