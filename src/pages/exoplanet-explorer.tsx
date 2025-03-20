import { useState, useMemo, useEffect } from "react";
import { useDebounce } from "use-debounce";
import { LayoutGrid, Table } from "lucide-react";
import { Range } from "react-range";
import Header from "@/components/Header";
import ExoplanetGrid from "@/components/ExoplanetGrid";
import ExoplanetTable from "@/components/ExoplanetTable";
import { IPlanet, KoiDisposition } from "@/types/planet.type";
import {
  matchesDisposition,
  matchesInsolationFlux,
  matchesRadius,
  matchesTemperature,
  usePlanetsData,
} from "../utils/helpers";
import PageLoader from "@/components/PageLoader";
import ScrollToTop from "@/components/ScroolToTopBtn";

enum types {
  CARD = "card",
  TABLE = "table",
}

export default function ExoplanetExplorer() {
  const { data, error, isLoading } = usePlanetsData();
  const [displyType, setDisplyType] = useState<string>(types.TABLE);
  const [currentPage, setCurrentPage] = useState(1);
  const [visibleItems, setVisibleItems] = useState(24);
  // Filtering state variables
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 300);
  const [radiusRange, setRadiusRange] = useState<number[] | null>(null);
  const [temperatureRange, setTemperatureRange] = useState<number[] | null>(
    null
  );
  const [insolationFluxRange, setInsolationFluxRange] = useState<
    number[] | null
  >(null);
  const [disposition, setDisposition] = useState<string | null>(null);

  const itemsPerPage = 100;
  const totalPages = data ? Math.ceil(data.planets.length / itemsPerPage) : 0;

  const filteredPlanets = useMemo(() => {
    if (!data?.planets) return [];

    let confirmedPlanets = data?.planets;

    if (debouncedSearch && String(debouncedSearch[0]).trim() !== "") {
      confirmedPlanets = confirmedPlanets.filter(
        (planet: IPlanet) =>
          planet.kepler_name &&
          planet.kepler_name
            ?.toLowerCase()
            .includes(debouncedSearch[0].toLowerCase())
      );
    }
    if (radiusRange) {
      confirmedPlanets = confirmedPlanets.filter(
        (planet: IPlanet) =>
          planet.koi_prad && matchesRadius(radiusRange, planet.koi_prad)
      );
    }
    if (temperatureRange) {
      confirmedPlanets = confirmedPlanets.filter(
        (planet: IPlanet) =>
          planet.koi_teq && matchesTemperature(temperatureRange, planet.koi_teq)
      );
    }
    if (insolationFluxRange) {
      confirmedPlanets = confirmedPlanets.filter(
        (planet: IPlanet) =>
          planet.koi_insol &&
          matchesInsolationFlux(insolationFluxRange, planet.koi_insol)
      );
    }
    if (disposition) {
      confirmedPlanets = confirmedPlanets.filter(
        (planet: IPlanet) =>
          planet.koi_disposition &&
          matchesDisposition(disposition, planet.koi_disposition)
      );
    }
    return confirmedPlanets;
  }, [
    debouncedSearch,
    radiusRange,
    temperatureRange,
    insolationFluxRange,
    disposition,
    data?.planets,
  ]);

  useEffect(() => {
    setCurrentPage(1); // Reset pagination when search changes
  }, [debouncedSearch]);

  const paginatedPlanets = useMemo(() => {
    if (!filteredPlanets) return [];
    const start = (currentPage - 1) * itemsPerPage;
    return filteredPlanets.slice(start, start + itemsPerPage);
  }, [filteredPlanets, currentPage]);

  const visibleGridPlanets = useMemo(() => {
    return filteredPlanets ? filteredPlanets.slice(0, visibleItems) : [];
  }, [filteredPlanets, visibleItems]);

  const loadMore = () => {
    setVisibleItems((prev) => prev + 24);
  };

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

      <div className="mx-10">
        <div className="flex w-[10%] gap-4 ml-auto mb-12">
          <button
            onClick={() => setDisplyType(types.TABLE)}
            disabled={displyType === types.TABLE}
            className={`${
              displyType === types.TABLE ? "px-4 rounded-md bg-gray-800" : ""
            }`}
          >
            <Table />
          </button>{" "}
          <button
            onClick={() => setDisplyType(types.CARD)}
            disabled={displyType === types.CARD}
            className={`${
              displyType === types.CARD ? "px-4 rounded-md bg-gray-800" : ""
            }`}
          >
            <LayoutGrid />
          </button>
        </div>
        <div className="flex flex-col md:flex-row gap-4 justify-between items-end px-4">
          <div className="relative w-[80%] sm:w-[70%] md:w-[40%] lg:w-[30%]">
            <input
              type="text"
              placeholder="Search exoplanets by Kepler name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full p-2 pr-10 rounded-md bg-gray-800 outline-slate-900"
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-1 bg-slate-900 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm"
              >
                ✕
              </button>
            )}
          </div>
          <div className="flex flex-wrap gap-4 rounded-lg">
            {/* Radius Filter */}
            <div className="flex flex-col">
              <label>Radius (Earth Radii)</label>
              <Range
                step={10}
                min={0}
                max={300}
                values={radiusRange || [0,300]}
                onChange={(vals) => setRadiusRange(vals)}
                renderTrack={({ props, children }) => (
                  <div {...props} className="h-2 bg-gray-300 rounded-lg my-1">
                    {children}
                  </div>
                )}
                renderThumb={({ props }) => (
                  <div
                    {...props}
                    className="w-3 h-3 bg-blue-500 rounded-full"
                  />
                )}
              />
              {radiusRange && (
                <span>
                  {radiusRange[0]} - {radiusRange[1]}R⊕
                </span>
              )}
            </div>

            {/* Temperature Filter */}
            <div className="flex flex-col">
              <label>Temperature (°C)</label>
              <Range
                step={50}
                min={0}
                max={3000}
                values={temperatureRange || [0, 3000]}
                onChange={(vals) => setTemperatureRange(vals)}
                renderTrack={({ props, children }) => (
                  <div {...props} className="h-2 bg-gray-300 rounded-lg my-1">
                    {children}
                  </div>
                )}
                renderThumb={({ props }) => (
                  <div
                    {...props}
                    className="w-3 h-3 bg-blue-500 rounded-full"
                  />
                )}
              />
              {temperatureRange && (
                <span>
                  {temperatureRange[0]} - {temperatureRange[1]}°C
                </span>
              )}
            </div>

            {/* Insolation Flux Filter */}
            <div className="flex flex-col">
              <label>Insolation Flux</label>
              <Range
                step={100}
                min={0}
                max={5000}
                values={insolationFluxRange || [0, 5000]}
                onChange={(vals) => setInsolationFluxRange(vals)}
                renderTrack={({ props, children }) => (
                  <div {...props} className="h-2 bg-gray-300 rounded-lg my-1">
                    {children}
                  </div>
                )}
                renderThumb={({ props }) => (
                  <div
                    {...props}
                    className="w-3 h-3 bg-blue-500 rounded-full"
                  />
                )}
              />
              {insolationFluxRange && (
                <span>
                  {insolationFluxRange[0]} - {insolationFluxRange[1]}W/m²
                </span>
              )}
            </div>

            {/* Disposition Dropdown */}
            <select
              value={disposition || ""}
              onChange={(e) => setDisposition(e.target.value)}
              className="border rounded-md bg-slate-900"
            >
              <option value="">All</option>
              <option value={KoiDisposition.confirmed}>Confirmed</option>
              <option value={KoiDisposition.candidate}>Candidate</option>
              <option value={KoiDisposition.false_positive}>
                False Positive
              </option>
            </select>
          </div>
        </div>

        {displyType === types.TABLE &&
        paginatedPlanets &&
        visibleGridPlanets ? (
          <>
            <ExoplanetTable filteredPlanets={paginatedPlanets} />
            {/* Pagination Controls */}
            <div className="flex justify-center space-x-6 mb-20">
              <button
                className="p-2 bg-gray-800 text-white rounded"
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
              >
                Prev
              </button>

              <button
                className="p-2 bg-gray-800 text-white rounded"
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                disabled={currentPage === totalPages}
              >
                Next
              </button>
            </div>
          </>
        ) : (
          <ExoplanetGrid
            filteredPlanets={visibleGridPlanets}
            loadMore={loadMore}
          />
        )}
        <ScrollToTop />
      </div>
    </>
  );
}
