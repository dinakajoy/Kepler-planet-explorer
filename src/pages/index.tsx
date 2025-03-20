import { useQuery } from "@tanstack/react-query";
import {
  Legend,
  Bar,
  BarChart,
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  ZAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  PieChart,
  Cell,
  Pie,
} from "recharts";
import Header from "@/components/Header";
import {
  EarthLikeCustomTooltip,
  EarthLikeSunlightCustomTooltip,
} from "@/components/CustomTooltip";
import { fetchPlanetsData } from "../utils/helpers";
import PageLoader from "@/components/PageLoader";
import ScrollToTop from "@/components/ScroolToTopBtn";

const IndexPage = () => {
  const { data, error, isLoading } = useQuery({
    queryKey: ["planetsData"],
    queryFn: () => fetchPlanetsData("/api/planets-charts"),
    staleTime: Infinity, // Data will never be considered stale
  });
  if (isLoading) return <PageLoader />;
  if (error)
    return (
      <p className="flex items-center justify-center h-screen">
        Error: {error.message}
      </p>
    );

  const {
    planets,
    earthLikePlanets,
    recievesSunlightLikeEarth,
    planetsByDisposition,
    habitablePlanets,
  } = data;

  const nonHabitablePlanets = planets.length - habitablePlanets.length;
  const pieData = [
    { name: "Habitable", value: habitablePlanets.length, color: "#4CAF50" },
    { name: "Non-Habitable", value: nonHabitablePlanets, color: "#F44336" },
  ];

  return (
    <>
      <Header />
      <div className="flex flex-col md:flex-row justify-between gap-12 my-24 mx-6">
        <div className="w-full">
          <h2 className="border border-gray-600 max-w-[300px] rounded-xl font-bold text-xl my-8 p-2">
            Planets by Disposition
          </h2>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={planetsByDisposition}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="planets" fill="#82ca9d" />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="w-full">
          <h2 className="border border-gray-600 max-w-[300px] rounded-xl font-bold text-xl my-8 p-2">
            Earth-like Planets
          </h2>
          <ResponsiveContainer width="100%" height={400}>
            <ScatterChart>
              <CartesianGrid />
              <XAxis
                type="number"
                dataKey="koi_prad"
                name="Planetary Radius (Earth Radii)"
              />
              <YAxis
                type="number"
                dataKey="koi_teq"
                name="Equilibrium Temperature (K)"
              />
              <Tooltip
                content={
                  <EarthLikeCustomTooltip active payload={earthLikePlanets} />
                }
                cursor={{ strokeDasharray: "3 3" }}
              />
              <Scatter
                name="Exoplanets"
                data={earthLikePlanets}
                fill="#8884d8"
              />
            </ScatterChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="flex flex-col md:flex-row justify-between gap-16 my-24 mx-6">
        <div className="w-full">
          <h2 className="border border-gray-600 max-w-[300px] rounded-xl font-bold text-xl my-8 p-2">
            Earth-Like Sunlight Planets
          </h2>
          <ResponsiveContainer width="100%" height={400}>
            <ScatterChart>
              <CartesianGrid />
              <XAxis
                type="number"
                dataKey="koi_prad"
                name="Planetary Radius (Earth Radii)"
              />
              <YAxis
                type="number"
                dataKey="koi_insol"
                name="Insolation Flux (Earth Flux)"
              />
              <ZAxis
                type="number"
                dataKey="koi_prad"
                range={[50, 400]}
                name="Bubble Size (Planet Size)"
              />
              <Tooltip
                content={
                  <EarthLikeSunlightCustomTooltip
                    active
                    payload={recievesSunlightLikeEarth}
                  />
                }
                cursor={{ strokeDasharray: "3 3" }}
              />
              <Scatter
                name="Exoplanets"
                data={recievesSunlightLikeEarth}
                fill="#82ca9d"
              />
            </ScatterChart>
          </ResponsiveContainer>
        </div>
        <div className="w-full">
          <h2 className="border border-gray-600 max-w-[400px] rounded-xl font-bold text-xl my-8 p-2">
            Habitable Vs Non-Habitable Planets
          </h2>
          <ResponsiveContainer width="100%" height={400}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                outerRadius={180}
                dataKey="value"
                label
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="my-24 mx-6">
        <h2 className="border border-gray-600 max-w-[300px] rounded-xl font-bold text-xl my-8 p-2">
          Planet Size Distribution
        </h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={planets}>
            <XAxis dataKey="kepler_name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="koi_prad" fill="#4F46E5" />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <ScrollToTop />
    </>
  );
};

export default IndexPage;
